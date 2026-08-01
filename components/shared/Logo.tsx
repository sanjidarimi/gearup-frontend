import { Dumbbell } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <>
      <Link
        href="/"
        className="group flex items-center gap-2.5 font-sans font-bold text-lg tracking-tight text-foreground transition-opacity hover:opacity-90"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
          <Dumbbell className="h-5 w-5" />
        </div>
        <span className="flex items-center gap-1 font-extrabold text-xl">
          Gear<span className="text-primary">Up</span>
        </span>
      </Link>
      
    </>
  );
}
