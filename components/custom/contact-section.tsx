"use client";

import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

export function ContactSection() {
  return (
    <section className="w-full bg-background pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 overflow-hidden shadow-md">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
            <div className="max-w-xl space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                CONTACTS
              </h2>
              <p className="text-primary-foreground/90 text-sm sm:text-base font-medium leading-relaxed">
                Have any questions or special requests?
                <br />
                Feel free to reach out to our dedicated team.
              </p>
            </div>

            <div className="bg-background text-primary rounded-2xl p-6 lg:p-8 max-w-md w-full shadow-lg border border-border/10">
              <p className="font-bold text-xs sm:text-sm uppercase tracking-wider text-center leading-snug">
                CONTACT US TODAY AND LET US MAKE YOUR ADVENTURE MORE UNIQUE.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
            <div className="bg-background rounded-2xl p-6 text-primary space-y-4 shadow-sm border border-border/10">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                ADDRESS
              </span>
              <p className="font-bold text-base sm:text-lg leading-snug">
                Mirpur ,Dhaka
                <br />
                Bangladesh
              </p>
            </div>

            <div className="bg-background rounded-2xl p-6 text-primary space-y-4 shadow-sm border border-border/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-1">
                  PHONE
                </span>
                <a
                  href="tel:+390212345678"
                  className="font-bold text-base sm:text-lg hover:underline block"
                >
                  +39 02 12345678
                </a>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-60 block mb-1">
                  EMAIL
                </span>
                <a
                  href="mailto:info@gearup.com"
                  className="font-bold text-base sm:text-lg hover:underline block truncate"
                >
                  info@gearup.com
                </a>
              </div>
            </div>

            <div className="bg-background rounded-2xl p-5 text-primary space-y-4 shadow-sm border border-border/10 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                OUR SOCIALS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="w-20 h-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-10 h-10 fill-current" />
                </a>
                <a
                  href="#"
                  className="w-20 h-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Facebook"
                >
                  <FaLinkedin className="w-10 h-10 fill-current" />
                </a>{" "}
                <a
                  href="#"
                  className="w-20 h-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Facebook"
                >
                  <FaWhatsapp className="w-10 h-10 fill-current" />
                </a>
                <a
                  href="#"
                  className="w-20 h-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-10 h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
