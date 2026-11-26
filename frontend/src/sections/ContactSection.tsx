import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, CheckCircle2, Github, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
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

  const contactPortrait = profile.contact_image || '/assets/portraits/portrait_editorial_thoughtful_black_blazer.webp';

  return (
    <section id="contact" className="relative border-b border-hairline bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-10">
        <div className="border-b border-hairline pb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-gold">06 / Initiate Conversation</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ivory sm:text-5xl">
            Let&apos;s build something <span className="text-gradient-gold">enduring.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12">
          {/* Left Portrait & Direct Ledger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-5 border-b border-hairline pb-8">
              <img
                src={contactPortrait}
                alt={`${profile.name} — Direct Contact`}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 shrink-0 border border-gold/40 object-cover object-top"
              />
              <div>
                <p className="font-display text-xl font-bold text-ivory">{profile.name}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">{profile.title}</p>
                <p className="mt-2 text-xs text-slateMuted">{profile.availability_status}</p>
              </div>
            </div>

            <div className="divide-y divide-hairline border-b border-hairline">
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-between py-4 transition-colors hover:text-gold"
              >
                <span className="flex items-center gap-3 text-sm text-ivory group-hover:text-gold">
                  <Mail className="h-4 w-4 text-gold" />
                  {profile.email}
                </span>
                <ArrowUpRight className="h-4 w-4 text-slateMuted group-hover:text-gold" />
              </a>

              <a
                href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                className="group flex items-center justify-between py-4 transition-colors hover:text-gold"
              >
                <span className="flex items-center gap-3 text-sm text-ivory group-hover:text-gold">
                  <Phone className="h-4 w-4 text-gold" />
                  {profile.phone}
                </span>
                <ArrowUpRight className="h-4 w-4 text-slateMuted group-hover:text-gold" />
              </a>

              {profile.social_links?.linkedin && (
                <a
                  href={profile.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 transition-colors hover:text-gold"
                >
                  <span className="flex items-center gap-3 text-sm text-ivory group-hover:text-gold">
                    <Linkedin className="h-4 w-4 text-gold" />
                    LinkedIn Profile
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slateMuted group-hover:text-gold" />
                </a>
              )}

              {profile.social_links?.github && (
                <a
                  href={profile.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 transition-colors hover:text-gold"
                >
                  <span className="flex items-center gap-3 text-sm text-ivory group-hover:text-gold">
                    <Github className="h-4 w-4 text-gold" />
                    GitHub Profile
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slateMuted group-hover:text-gold" />
                </a>
              )}

              <div className="flex items-center gap-3 py-4 text-sm text-slateMuted">
                <MapPin className="h-4 w-4 text-gold" />
                {profile.location}
              </div>
            </div>
          </motion.div>

          {/* Right Editorial Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="liquid-glass-elevated rounded-[28px] p-7 sm:p-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Direct Inquiry</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-ivory">Send a Message</h3>

              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="hidden"
                aria-hidden="true"
              />

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Sharma"
                    className="mt-2 w-full border-b border-hairline bg-transparent pb-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="mt-2 w-full border-b border-hairline bg-transparent pb-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                  />
                </div>
              </div>

              <div className="mt-7">
                <label htmlFor="contact-subject" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Flutter Engineering Role / Mobile Product Build"
                  className="mt-2 w-full border-b border-hairline bg-transparent pb-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                />
              </div>

              <div className="mt-7">
                <label htmlFor="contact-message" className="block font-mono text-[10px] uppercase tracking-[0.2em] text-slateMuted">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details about your application, timeline, or opportunity..."
                  className="mt-2 w-full resize-none border-b border-hairline bg-transparent pb-3 text-sm text-ivory placeholder-slateMuted/60 outline-none transition-colors focus:border-gold"
                />
              </div>

              {success && (
                <div className="mt-6 flex items-center gap-3 border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-500">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="mt-6 flex items-center gap-3 border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-500">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-8">
                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#080B12] shadow-goldGlow transition-opacity disabled:opacity-60 sm:w-auto"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Transmitting...' : 'Send Message'}
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
