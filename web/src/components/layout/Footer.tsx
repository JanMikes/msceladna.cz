import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import type { Footer as FooterType, Organization } from '@/lib/types';

interface FooterProps {
  footer: FooterType | null;
  organization: Organization | null;
}

function FooterWave() {
  return (
    <svg
      className="footer-wave"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        fill="#275D56"
      />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.8 2.8C16 4.6 13.2 6 12 6c-2.5 0-5-2-5-2s1 5 5 7c0 0-4 1-7 5 0 0 2.5 2 6 2 4 0 7-3 8-6 .7-2.2.8-4.5 0-6.5L17.8 2.8z"
        fill="currentColor"
      />
      <path
        d="M12 13c0 4-2 7-2 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Footer({ footer, organization }: FooterProps) {
  const contactItems = [
    footer?.address ? { icon: MapPin, text: footer.address } : null,
    footer?.mail ? { icon: Mail, text: footer.mail, href: `mailto:${footer.mail}` } : null,
    footer?.phone ? { icon: Phone, text: footer.phone, href: `tel:${footer.phone.replace(/\s/g, '')}` } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  const linkSections = footer?.linkSections ?? [];
  const bottomLinks = footer?.bottomLinks ?? [];

  return (
    <footer>
      {/* Wave transition */}
      <FooterWave />

      {/* Main footer */}
      <div className="bg-primary text-white relative overflow-hidden">
        {/* Decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Decorative circle */}
        <div className="absolute -right-32 -top-32 w-64 h-64 rounded-full bg-white/[0.03]" />
        <div className="absolute -left-16 bottom-20 w-40 h-40 rounded-full bg-accent/[0.06]" />

        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Organization Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
                <LeafIcon className="w-7 h-7 text-accent transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-xl font-extrabold text-white tracking-tight">MŠ Čeladná</span>
              </Link>
              {footer?.text && (
                <p className="text-white/60 text-sm mb-5 leading-relaxed max-w-xs">
                  {footer.text}
                </p>
              )}
              {organization && (
                <div className="text-white/40 text-xs space-y-1">
                  {organization.ico && <p>IČ: {organization.ico}</p>}
                  {organization.dataBox && <p>Datová schránka: {organization.dataBox}</p>}
                </div>
              )}
            </div>

            {/* Dynamic Link Sections */}
            {linkSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-sm mb-1 text-white">
                  {section.title}
                </h4>
                <div className="w-8 h-0.5 bg-accent mb-5 rounded-full" />
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => {
                    const props = link.external
                      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                      : {};
                    return (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-accent transition-colors inline-flex items-center gap-2 group text-sm"
                          {...props}
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                          <span>{link.text}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            {/* Contact */}
            {contactItems.length > 0 && (
              <div>
                <h4 className="font-bold text-sm mb-1 text-white">
                  Kontakt
                </h4>
                <div className="w-8 h-0.5 bg-accent mb-5 rounded-full" />
                <ul className="space-y-4">
                  {contactItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-accent" />
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white/60 hover:text-white transition-colors text-sm mt-1"
                        >
                          {item.text}
                        </a>
                      ) : (
                        <span className="text-white/60 text-sm mt-1">{item.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 relative">
          <div className="container mx-auto px-4 lg:px-8 py-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
              <p>&copy; {new Date().getFullYear()} {organization?.name || 'MŠ Čeladná'}. Všechna práva vyhrazena.</p>
              {bottomLinks.length > 0 && (
                <div className="flex items-center gap-6">
                  {bottomLinks.map((link, index) => {
                    const props = link.external
                      ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                      : {};
                    return (
                      <Link
                        key={index}
                        href={link.href}
                        className="hover:text-white/70 transition-colors"
                        {...props}
                      >
                        {link.text}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
