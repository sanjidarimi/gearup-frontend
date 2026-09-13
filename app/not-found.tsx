import { SITE_IMAGES } from "@/lib/images";
import { Compass, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <Image
        src={SITE_IMAGES.notFound}
        alt="Snowy mountain peaks under a starry night sky"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative max-w-lg text-center text-white">
        <p className="text-8xl font-black tracking-tighter text-white/90 sm:text-9xl">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Looks like this trail doesn&apos;t exist
        </h1>
        <p className="mt-3 text-white/75">
          The page you&apos;re looking for has moved or never existed. Let&apos;s
          get you back on track.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/gear"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <Compass className="h-4 w-4" />
            Browse gear
          </Link>
        </div>
      </div>
    </main>
  );
}
