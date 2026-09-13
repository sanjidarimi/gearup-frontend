import type { LucideIcon } from "lucide-react";
import Image from "next/image";

interface AuthShowcaseProps {
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: { icon: LucideIcon; title: string; description: string }[];
}

export function AuthShowcase({
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  highlights,
}: AuthShowcaseProps) {
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/20" />

      <span className="relative z-10 w-fit rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
        {eyebrow}
      </span>

      <div className="relative z-10 max-w-lg space-y-8 text-white">
        <div className="space-y-3">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-base text-white/80">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {highlights.map(({ icon: Icon, title: itemTitle, description: text }) => (
            <div
              key={itemTitle}
              className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
            >
              <Icon className="mb-2 h-5 w-5 text-emerald-300" />
              <p className="text-sm font-bold">{itemTitle}</p>
              <p className="mt-0.5 text-xs text-white/70">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} GearUp · Rent sports & outdoor gear
          instantly
        </p>
      </div>
    </div>
  );
}
