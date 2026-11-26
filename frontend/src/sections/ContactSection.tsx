import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, Linkedin, Mail, MapPin, Phone, Send, AlertCircle } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { portfolioApi } from '../services/api';
import type { Profile } from '../types/portfolio';

export const ContactSection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (form.message.trim().length < 10) {
      setError('Please share at least a brief description (10+ characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await portfolioApi.submitContact(form);
      setSuccess(res.message);
      setForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Unable to send message right now. Please try emailing directly.';
      setError(typeof detail === 'string' ? detail : 'Validation error. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-radial-gold opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Direct Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold-light">07 · Let&apos;s Build Together</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ivory sm:text-5xl">
              Have a mobile app <span className="text-gradient-gold">idea?</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slateMuted sm:text-base">
              Whether you are hiring a Flutter engineer, launching a new Android & iOS product, or scaling an existing mobile platform, let&apos;s talk.
            </p>

            {/* Editorial Contact Portrait Card */}
            {(profile.contact_image || '/assets/portraits/portrait_editorial_thoughtful_black_blazer.webp') && (
              <div className="glass-panel mt-6 flex items-center gap-4 overflow-hidden rounded-2xl p-3">
                <img
                  src={profile.contact_image || '/assets/portraits/portrait_editorial_thoughtful_black_blazer.webp'}
                  alt={`${profile.name} — Direct Contact`}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 shrink-0 rounded-xl border border-gold/30 object-cover object-top"
                />
                <div>
                  <p className="font-display text-base font-semibold text-ivory">{profile.name}</p>
                  <p className="text-xs text-gold-light">{profile.title}</p>
                  <p className="mt-1 text-[11px] text-slateMuted">Direct response for engineering roles & mobile builds.</p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="glass-panel flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-gold/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-light">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slateMuted">Email</p>
                  <p className="text-sm font-medium text-ivory">{profile.email}</p>
                </div>
              </a>

              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="glass-panel flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-gold/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-light">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slateMuted">Phone</p>
                  <p className="text-sm font-medium text-ivory">{profile.phone}</p>
                </div>
              </a>

              {profile.social_links?.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-4 transition-colors hover:border-gold/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-light">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slateMuted">LinkedIn</p>
                      <p className="text-sm font-medium text-ivory">Connect on LinkedIn</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slateMuted" />
                </a>
              )}

              <div className="glass-panel flex items-center gap-4 rounded-2xl p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold-light">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slateMuted">Location</p>
                  <p className="text-sm font-medium text-ivory">{profile.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="glass-panel-gold rounded-3xl p-7 sm:p-10">
              <h3 className="font-display text-2xl font-bold text-ivory">Send an Inquiry</h3>
              <p className="mt-1 text-sm text-slateMuted">
                Messages are stored securely and delivered directly to Onkar&apos;s dashboard.
              </p>

              {/* Hidden Honeypot Spam Trap */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-medium uppercase tracking-wider text-slateMuted">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Sharma"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-medium uppercase tracking-wider text-slateMuted">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="contact-subject" className="block text-xs font-medium uppercase tracking-wider text-slateMuted">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Flutter Project Inquiry / Opportunity"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="contact-message" className="block text-xs font-medium uppercase tracking-wider text-slateMuted">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your mobile app, timeline, or role..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                />
              </div>

              {success && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-7">
                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-sm font-semibold text-obsidian shadow-goldGlow transition-opacity disabled:opacity-60 sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
