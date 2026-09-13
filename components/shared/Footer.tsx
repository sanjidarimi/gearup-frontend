import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

const footerNavigation: FooterSection[] = [
  {
    title: "Catalog",
    links: [
      { label: "All gear", href: "/gear" },
      { label: "Camping & Hiking", href: "/gear?category=Camping%20%26%20Hiking" },
      { label: "Cycling", href: "/gear?category=Cycling" },
      { label: "Water Sports", href: "/gear?category=Water%20Sports" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "How rental works", href: "/#how-it-works" },
      { label: "Become a provider", href: "/auth/register?role=PROVIDER" },
      { label: "My dashboard", href: "/dashboard" },
      { label: "Sign in", href: "/auth/login" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "/#contact" },
      { label: "Secure payments", href: "/#how-it-works" },
      { label: "Email support", href: "mailto:info@gearup.com" },
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
    <footer className="mt-16 border-t border-border bg-background pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Premium gear for every adventure</span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              GearUp connects outdoor lovers with local rental shops. Book the
              gear you need for a weekend, pay securely, and hand it back when
              you are done.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Verified providers and Stripe-secured payments</span>
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
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 select-none overflow-hidden border-t border-border/60 pt-10">
          <p
            aria-hidden="true"
            className="bg-linear-to-b from-primary/40 to-primary/5 bg-clip-text text-center text-[13vw] font-extrabold leading-none tracking-tighter text-transparent sm:text-[14vw]"
          >
            GEAR UP
          </p>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GearUp. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
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
