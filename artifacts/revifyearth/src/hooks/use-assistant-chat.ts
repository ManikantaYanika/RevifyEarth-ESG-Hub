import { useCallback, useEffect, useRef, useState } from 'react';

import {
  AssistantError,
  fetchAssistantStatus,
  streamChat,
  type AssistantMessage,
  type AssistantStatus,
} from '@/lib/assistant-client';

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
            if (!truncated) return;
            setEntries((current) =>
              current.map((entry) => (entry.id === replyId ? { ...entry, incomplete: true } : entry)),
            );
          },
        },
        controller.signal,
      );
    } catch (caught) {
      if (controller.signal.aborted) {
        // Visitor pressed stop. Whatever streamed is kept and flagged, not discarded.
        setEntries((current) =>
          current.map((entry) => (entry.id === replyId ? { ...entry, incomplete: true } : entry)),
        );
      } else {
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

  /** Drops the last reply and re-runs the turn that produced it. */
  const regenerate = useCallback(() => {
    if (abortRef.current) return;

    const current = entriesRef.current;
    let end = current.length;
    while (end > 0 && current[end - 1]?.role === 'assistant') end -= 1;
    if (end === 0) return;

    const history = current.slice(0, end);
    setEntries(history);
    void run(history);
  }, [run]);

  /** Re-sends the last user turn after a failure, without duplicating it. */
  const retry = useCallback(() => {
    if (abortRef.current) return;
    const current = entriesRef.current;
    if (current.length === 0) return;
    setError(null);
    void run(current);
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
    regenerate,
    retry,
  };
}
