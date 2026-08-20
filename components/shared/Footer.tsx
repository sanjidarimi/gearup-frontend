// components/layout/footer.tsx
"use client";

import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerNavigation: FooterSection[] = [
  {
    title: "Catalog",
    links: [
      { label: "Cycling Gear", href: "/gear?category=Cycling" },
      { label: "Camping & Trekking", href: "/gear?category=Camping" },
      { label: "Water Sports", href: "/gear?category=Water" },
      { label: "Winter Expeditions", href: "/gear?category=Winter" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "How Rental Works", href: "/how-it-works" },
      { label: "Damage Protection", href: "/protection" },
      { label: "Enterprise Fleet", href: "/enterprise" },
      { label: "Pricing Model", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FaGithub, href: "https://github.com", label: "GitHub" },
  { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Premium gear for ultimate exploration</span>
            </div>

            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              Equipping athletes and explorers with professional-grade gear on
              demand. Rent instantly, return flexibly.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>All rentals 100% verified & insured</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerNavigation.map((section) => (
              <div key={section.title} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {section.title}
                </p>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <span>{link.label}</span>
                        {link.isExternal && (
                          <ArrowUpRight className="ml-0.5 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-border/60 pt-10 select-none overflow-hidden">
          <h2 className="text-center font-extrabold tracking-tighter text-[13vw] sm:text-[14vw] leading-none  text-primary animate-pulse transition-colors duration-500">
            GEAR UP
          </h2>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SportRent Inc. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
