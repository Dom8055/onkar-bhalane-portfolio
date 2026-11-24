import React, { useEffect } from 'react';
import type { Profile, WebsiteSettings } from '../types/portfolio';

interface SEOHeadProps {
  profile?: Profile;
  settings?: WebsiteSettings;
  pageTitle?: string;
  pageDescription?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ profile, settings, pageTitle, pageDescription }) => {
  useEffect(() => {
    const title = pageTitle || settings?.site_title || 'Onkar Bhalane — Flutter Developer | Mobile Application Engineer';
    const description =
      pageDescription ||
      settings?.seo_description ||
      profile?.summary ||
      'Portfolio of Onkar Bhalane — Flutter Developer & Mobile Application Engineer.';

    document.title = title;

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    if (settings?.seo_keywords) {
      setMeta('meta[name="keywords"]', 'content', settings.seo_keywords);
    }
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    if (settings?.og_image) {
      setMeta('meta[property="og:image"]', 'content', settings.og_image);
    }

    // Structured data JSON-LD for Person
    const scriptId = 'ob-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile?.name || 'Onkar Bhalane',
      jobTitle: profile?.title || 'Flutter Developer',
      email: profile?.email || 'obhalane@gmail.com',
      telephone: profile?.phone || '+91 72496 03542',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nagpur',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      sameAs: [profile?.social_links?.linkedin, profile?.social_links?.github].filter(Boolean),
    });
  }, [profile, settings, pageTitle, pageDescription]);

  return null;
};
