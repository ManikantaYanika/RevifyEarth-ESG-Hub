import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { company, contacts } from '@/data/company';
import { media } from '@/data/media';
import { services } from '@/data/services';
import { ActionButton, SectionLabel } from '@/components/site/Primitives';
import { PageHero } from '@/components/site/PageHero';
import { Reveal } from '@/components/site/Reveal';

const enquirySchema = z.object({
  name: z.string().min(2, 'Please tell us your name.'),
  email: z.string().email('Enter a valid work email address.'),
  organisation: z.string().min(2, 'Please add your organisation.'),
  interest: z.string().min(1, 'Choose what you are exploring.'),
  message: z.string().min(20, 'A sentence or two about the brief helps us respond usefully.'),
});

type Enquiry = z.infer<typeof enquirySchema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-[#142b32]">{label}</span>
      {children}
      {error && (
        <span role="alert" className="mt-2 block text-xs font-semibold text-[#7a2718]">
          {error}
        </span>
      )}
    </label>
  );
}

const inputClass =
  'focus-ring mt-3 w-full rounded-sm border-b border-[#142b32]/40 bg-transparent px-0 py-3 outline-none placeholder:text-[#142b32]/45';

export function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Enquiry>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', organisation: '', interest: '', message: '' },
  });

  /**
   * There is no enquiry backend on this site yet, so rather than faking a success
   * state the validated enquiry is handed to the visitor's mail client, pre-filled
   * and addressed. It is a real, working contact path with no server involved.
   */
  const onSubmit = (values: Enquiry) => {
    const subject = `Enquiry — ${values.interest} — ${values.organisation}`;
    const body = [
      `Name: ${values.name}`,
      `Organisation: ${values.organisation}`,
      `Work email: ${values.email}`,
      `Exploring: ${values.interest}`,
      '',
      values.message,
    ].join('\n');
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Start here"
        title={
          <>
            Your story
            <br />
            <em>deserves</em>
            <br />a system.
          </>
        }
        intro="Engagements are scoped to the brief. Tell us what you are working on and where the story needs to go."
        image={media.heroBirds}
        dark
      />

      {/* Contact cards */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:py-16 md:px-10 md:py-24">
        <SectionLabel>Direct lines</SectionLabel>
        <div className="grid gap-px border border-[#b8c9bd] bg-[#b8c9bd] md:grid-cols-2 lg:grid-cols-4">
          <Reveal className="bg-[#f2f0e8] p-7">
            <Mail className="h-5 w-5 text-[#24626b]" aria-hidden="true" />
            <p className="eyebrow mt-5 text-[#24626b]">General enquiries</p>
            <a
              href={`mailto:${company.email}`}
              className="focus-ring mt-3 flex min-h-11 items-center break-all rounded-sm text-lg font-bold hover:underline"
            >
              {company.email}
            </a>
          </Reveal>

          {contacts.map((contact, index) => (
            <Reveal key={contact.name} order={index + 1} className="bg-[#f2f0e8] p-7">
              <Phone className="h-5 w-5 text-[#24626b]" aria-hidden="true" />
              <p className="eyebrow mt-5 text-[#24626b]">{contact.role}</p>
              <p className="mt-3 text-lg font-bold">{contact.name}</p>
              {/* min-h-11: a phone number is the most likely thing to be tapped on
                  this page, and a 20px line box is well under any touch guidance. */}
              <a
                href={`tel:${contact.phone}`}
                className="focus-ring mt-1 inline-flex min-h-11 items-center rounded-sm text-sm hover:underline"
              >
                {contact.phone}
              </a>
            </Reveal>
          ))}

          <Reveal order={3} className="bg-[#f2f0e8] p-7">
            <MapPin className="h-5 w-5 text-[#24626b]" aria-hidden="true" />
            <p className="eyebrow mt-5 text-[#24626b]">Office</p>
            <p className="mt-3 text-sm leading-6 text-[#3d5a5f]">
              Registered office address pending publication.
            </p>
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm hover:underline"
            >
              revifyearth.com <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="bg-[#a8c95a] px-5 py-14 sm:py-16 text-[#142b32] md:px-10 md:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionLabel>The conversation</SectionLabel>
            <h2 className="font-display text-5xl leading-[.95] md:text-7xl">
              Start with
              <br />
              <em>the brief.</em>
            </h2>
            <p className="mt-8 max-w-sm text-sm leading-7 text-[#142b32]/80">
              The most useful first message tells us where you are in the reporting cycle, which frameworks you report
              against, and what you want the year to achieve beyond the document.
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col justify-center border-t border-[#142b32]/30 pt-6">
              <Check className="h-9 w-9" />
              <h3 className="font-display mt-6 text-5xl leading-none">
                Message
                <br />
                <em>ready to send.</em>
              </h3>
              <p className="mt-5 max-w-sm text-sm leading-7">
                Your enquiry has been handed to your email client, pre-addressed to {company.email}. If nothing opened,
                write to us directly at that address.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ActionButton onClick={() => setSent(false)} variant="dark">
                  Write another message
                </ActionButton>
                <ActionButton href={`mailto:${company.email}`} variant="outline">
                  Email directly
                </ActionButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 border-t border-[#142b32]/30 pt-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register('name')} className={inputClass} placeholder="Your name" autoComplete="name" />
                </Field>
                <Field label="Organisation" error={errors.organisation?.message}>
                  <input
                    {...register('organisation')}
                    className={inputClass}
                    placeholder="Your organisation"
                    autoComplete="organization"
                  />
                </Field>
              </div>

              <Field label="Work email" error={errors.email?.message}>
                <input
                  {...register('email')}
                  type="email"
                  className={inputClass}
                  placeholder="you@organisation.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="What are you exploring?" error={errors.interest?.message}>
                <select {...register('interest')} className={inputClass} defaultValue="">
                  <option value="" disabled>
                    Select a starting point
                  </option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.shortTitle}>
                      {service.shortTitle}
                    </option>
                  ))}
                  <option value="Something else">Something else</option>
                </select>
              </Field>

              <Field label="Tell us about the brief" error={errors.message?.message}>
                <textarea
                  {...register('message')}
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder="A report, a wider communication system, a new direction..."
                />
              </Field>

              <ActionButton
                type="submit"
                variant="dark"
                className="mt-2"
                icon={<Send className="h-3.5 w-3.5" />}
                testId="button-submit-enquiry"
              >
                {isSubmitting ? 'Preparing…' : 'Send enquiry'}
              </ActionButton>
              <p className="text-xs leading-6 text-[#142b32]/70">
                Opens in your email client, pre-addressed to {company.email}.
              </p>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <p className="font-display max-w-3xl text-4xl leading-tight text-[#24626b] md:text-6xl">
          The best work starts with a useful question.
        </p>
      </section>
    </>
  );
}
