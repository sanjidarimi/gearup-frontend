"use client";
import React, { useState } from "react";
import {
  Search,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Clock,
  Zap,
  Headphones,
  DollarSign,
  Users,
  Wallet,
  Sliders,
  LucideIcon,
} from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Browse & Search",
    description:
      "Explore premium gear by category or search specific items near you.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Dates",
    description:
      "Pick your exact start and end dates with real-time availability.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Secure Checkout",
    description:
      "Reserve your items instantly with encrypted payment processing.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Instant Approval",
    description: "Local providers verify and confirm your booking request.",
    icon: CheckCircle2,
  },
  {
    number: "05",
    title: "Local Pickup",
    description:
      "Grab your gear directly from the provider or arranged drop-off.",
    icon: MapPin,
  },
  {
    number: "06",
    title: "Return & Refund",
    description:
      "Hand back the equipment and automatically release deposit holds.",
    icon: RotateCcw,
  },
];

const RENTER_BENEFITS = [
  {
    title: "Insured Equipment",
    desc: "Every rental includes comprehensive damage protection.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Terms",
    desc: "Rent hourly, daily, or weekly with zero lock-in contracts.",
    icon: Clock,
  },
  {
    title: "Instant Pickups",
    desc: "Skip shipping wait times with verified local gear owners.",
    icon: Zap,
  },
  {
    title: "24/7 Support",
    desc: "Dedicated support team available whenever you are outdoors.",
    icon: Headphones,
  },
];

const PROVIDER_BENEFITS = [
  {
    title: "Zero Listing Fees",
    desc: "Keep 100% of your asking price with zero hidden upfront costs.",
    icon: DollarSign,
  },
  {
    title: "Hyper-Local Reach",
    desc: "Connect directly with active outdoor enthusiasts in your area.",
    icon: Users,
  },
  {
    title: "Automated Payouts",
    desc: "Direct deposit payments sent straight to your bank weekly.",
    icon: Wallet,
  },
  {
    title: "Total Fleet Control",
    desc: "Manage custom pricing, seasonal rules, and black-out dates.",
    icon: Sliders,
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<"renter" | "provider">("renter");

  return (
    <section className="relative overflow-hidden bg-background py-24 text-foreground">
      {/* Background Subtle Wave Accents */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Seamless Equipment Sharing
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How GearUp Works
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Whether you are gearing up for an expedition or monetizing idle
            equipment, our peer-to-peer platform keeps it effortless.
          </p>
        </div>

        {/* --- SECTION 1: WAVY ROADMAP TIMELINE --- */}
        <div className="relative mt-16">
          {/* Curved Wave Line for Large Displays */}
          <div className="hidden lg:block absolute top-[4.5rem] left-[8%] right-[8%] h-24 pointer-events-none">
            <svg
              className="w-full h-full text-border"
              viewBox="0 0 1000 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 20 Q 100 80 200 20 T 400 20 T 600 20 T 800 20 T 1000 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`group relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1.5 ${
                    idx % 2 === 1 ? "lg:translate-y-6" : ""
                  }`}
                >
                  {/* Step Card Wrapper */}
                  <div className="relative flex h-full w-full flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
                    {/* Number Badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-muted-foreground/60">
                      {step.number}
                    </span>

                    {/* Node Icon */}
                    <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mb-1.5 text-sm font-semibold leading-tight text-card-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- SECTION 2: VALUE PROPOSITION TABS --- */}
        <div className="mt-28 space-y-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h3 className="text-xl font-bold tracking-tight">
              Built for Everyone in the Outdoors
            </h3>

            {/* Segmented Control */}
            <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1">
              <button
                onClick={() => setActiveTab("renter")}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "renter"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Renters
              </button>
              <button
                onClick={() => setActiveTab("provider")}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeTab === "provider"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Providers
              </button>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(activeTab === "renter" ? RENTER_BENEFITS : PROVIDER_BENEFITS).map(
              (item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:bg-accent/30"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-card-foreground">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
