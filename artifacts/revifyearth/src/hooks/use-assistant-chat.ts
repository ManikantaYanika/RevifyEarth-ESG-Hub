import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AssistantError,
  fetchAssistantStatus,
  streamChat,
  type AssistantMessage,
  type AssistantStatus,
} from '@/lib/assistant-client';
import { splitReply } from '@/lib/assistant-format';

/**
 * Conversation state for the RevifyEarth assistant.
 *
 * Holds the transcript, drives the stream, and exposes stop / regenerate / clear.
 * The server is stateless — the full transcript is sent on every turn — so this hook
 * is the single source of truth for the conversation.
 */

export interface ChatEntry {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
  /** Set when a reply stopped early: aborted by the visitor or truncated by the model. */
  readonly incomplete?: boolean;
  /** Suggested next questions, parsed out of the reply once it completes. */
  readonly followUps?: readonly string[];
}

export type ChatPhase = 'idle' | 'waiting' | 'streaming';

const STORAGE_KEY = 'revify-assistant-conversation';
/** Server accepts 20; leave headroom so the next turn is never rejected outright. */
const MAX_STORED_ENTRIES = 16;

const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function loadStored(): ChatEntry[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is ChatEntry =>
          typeof entry === 'object' &&
          entry !== null &&
          typeof (entry as ChatEntry).id === 'string' &&
          typeof (entry as ChatEntry).content === 'string' &&
          ((entry as ChatEntry).role === 'user' || (entry as ChatEntry).role === 'assistant'),
      )
      .slice(-MAX_STORED_ENTRIES);
  } catch {
    // Private-mode storage restrictions or corrupt JSON — start a fresh conversation.
    return [];
  }
}

export function useAssistantChat() {
  const [entries, setEntries] = useState<ChatEntry[]>(loadStored);
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const [error, setError] = useState<AssistantError | null>(null);
  const [status, setStatus] = useState<AssistantStatus | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  /** Kept in a ref so `regenerate` can rebuild a request without stale-closure risk. */
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  // Session-scoped: the conversation survives navigation and reload within the tab,
  // and is gone when the tab closes. Nothing a visitor types is persisted longer.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_STORED_ENTRIES)));
    } catch {
      // Storage unavailable or full — the in-memory transcript still works.
    }
  }, [entries]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAssistantStatus(controller.signal)
      .then(setStatus)
      .catch(() => {
        // Probe failure is not surfaced: the launcher stays hidden and a send would
        // report the real error anyway.
        setStatus({ available: false, maxMessageLength: 2000, maxHistoryMessages: 20 });
      });
    return () => controller.abort();
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const run = useCallback(async (history: readonly ChatEntry[]) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const replyId = newId();
    setError(null);
    setPhase('waiting');

    const payload: AssistantMessage[] = history.map(({ role, content }) => ({ role, content }));
    let started = false;

    try {
      await streamChat(
        payload,
        {
          onDelta: (text) => {
            if (!started) {
              started = true;
              setPhase('streaming');
              setEntries((current) => [...current, { id: replyId, role: 'assistant', content: text }]);
              return;
            }
            setEntries((current) =>
              current.map((entry) =>
                entry.id === replyId ? { ...entry, content: entry.content + text } : entry,
              ),
            );
          },
          onDone: ({ truncated }) => {
            // Parsed once, here, rather than on every render: `content` becomes the
            // body alone, so the follow-up marker is never replayed to the model as
            // part of the transcript on the next turn.
            setEntries((current) =>
              current.map((entry) => {
                if (entry.id !== replyId) return entry;
                const { body, followUps } = splitReply(entry.content);
                return {
                  ...entry,
                  content: body,
                  ...(followUps.length > 0 ? { followUps } : {}),
                  ...(truncated ? { incomplete: true } : {}),
                };
              }),
            );
          },
        },
        controller.signal,
      );
    } catch (caught) {
      // Whatever streamed before the failure is kept and flagged, not discarded —
      // a partial answer is still worth something to the reader. It is parsed with
      // the streaming rules so a half-arrived follow-up marker is not left visible.
      setEntries((current) =>
        current.map((entry) =>
          entry.id === replyId
            ? { ...entry, content: splitReply(entry.content, true).body, incomplete: true }
            : entry,
        ),
      );

      // A visitor-initiated stop is not an error.
      if (!controller.signal.aborted) {
        setError(
          caught instanceof AssistantError
            ? caught
            : new AssistantError('network_error', 'Connection lost. Please check your network and try again.'),
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setPhase('idle');
    }
  }, []);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || abortRef.current) return;

      const next: ChatEntry[] = [...entriesRef.current, { id: newId(), role: 'user', content }];
      setEntries(next);
      void run(next);
    },
    [run],
  );

  /**
   * Re-runs the most recent user turn, discarding any reply it produced.
   *
   * Shared by "Regenerate" and by "Try again" after a failure. Trimming trailing
   * assistant entries matters in the error case too: a stream that dies mid-reply
   * leaves a partial assistant entry behind, and re-sending a history that ends with
   * one is rejected by the server ("the final message must be from the user").
   */
  const rerunLastTurn = useCallback(() => {
    if (abortRef.current) return;

    const current = entriesRef.current;
    let end = current.length;
    while (end > 0 && current[end - 1]?.role === 'assistant') end -= 1;
    if (end === 0) return;

    const history = current.slice(0, end);
    setEntries(history);
    setError(null);
    void run(history);
  }, [run]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setEntries([]);
    setError(null);
    setPhase('idle');
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage was never writable.
    }
  }, []);

  return {
    entries,
    phase,
    error,
    status,
    busy: phase !== 'idle',
    send,
    stop,
    clear,
    regenerate: rerunLastTurn,
    retry: rerunLastTurn,
  };
}
