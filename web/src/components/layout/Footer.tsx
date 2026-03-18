import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import type { Footer as FooterType, Organization } from '@/lib/types';

interface FooterProps {
  footer: FooterType | null;
  organization: Organization | null;
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
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Organization Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-white">MŠ Čeladná</span>
            </Link>
            {footer?.text && (
              <p className="text-white/60 text-sm mb-4 leading-relaxed">
                {footer.text}
              </p>
            )}
            {organization && (
              <div className="text-white/50 text-xs space-y-0.5">
                {organization.ico && <p>IČ: {organization.ico}</p>}
                {organization.dataBox && <p>Datová schránka: {organization.dataBox}</p>}
              </div>
            )}
          </div>

          {/* Dynamic Link Sections */}
          {linkSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-accent">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const props = link.external
                    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
                    : {};
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 group text-sm"
                        {...props}
                      >
                        <span>{link.text}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
              <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-accent">
                Kontakt
              </h4>
              <ul className="space-y-4">
                {contactItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-white/60 text-sm">{item.text}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
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
                      className="hover:text-white transition-colors"
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
    </footer>
  );
}
