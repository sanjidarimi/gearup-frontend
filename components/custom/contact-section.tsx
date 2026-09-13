import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

const SOCIALS = [
  { icon: FaFacebook, label: "Facebook", href: "https://facebook.com" },
  { icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/8801700000000" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
];

export function ContactSection() {
  return (
    <section
      id="contact"
      className="w-full scroll-mt-24 bg-background px-4 pb-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-md sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />

          <div className="relative mb-12 flex flex-col items-start justify-between gap-8 lg:flex-row">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
                Get in touch
              </h2>
              <p className="text-sm font-medium leading-relaxed text-primary-foreground/90 sm:text-base">
                Questions about a booking, a damaged item or listing your
                shop? Our team usually replies within a few hours.
              </p>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-border/10 bg-background p-6 text-primary shadow-lg lg:p-8">
              <p className="text-center text-xs font-bold uppercase leading-snug tracking-wider sm:text-sm">
                Contact us today and let us make your next adventure easier.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 gap-4 pt-4 sm:gap-6 md:grid-cols-3">
            <div className="space-y-4 rounded-2xl border border-border/10 bg-background p-6 text-primary shadow-sm">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                <MapPin className="h-4 w-4" /> Address
              </span>
              <p className="text-base font-bold leading-snug sm:text-lg">
                Mirpur, Dhaka
                <br />
                Bangladesh
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-border/10 bg-background p-6 text-primary shadow-sm">
              <div>
                <span className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                  <Phone className="h-4 w-4" /> Phone
                </span>
                <a
                  href="tel:+8801700000000"
                  className="block text-base font-bold hover:underline sm:text-lg"
                >
                  +880 1700-000000
                </a>
              </div>
              <div>
                <span className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60">
                  <Mail className="h-4 w-4" /> Email
                </span>
                <a
                  href="mailto:info@gearup.com"
                  className="block truncate text-base font-bold hover:underline sm:text-lg"
                >
                  info@gearup.com
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-border/10 bg-background p-5 text-primary shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                Our socials
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex aspect-square items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Icon className="h-7 w-7" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
