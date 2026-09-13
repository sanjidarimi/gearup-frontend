import { Button } from "@/components/ui/button";
import { ArrowLeft, CircleSlash, HelpCircle, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment cancelled",
};

export default function PaymentCancelPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-black/5 sm:p-10">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-500/10">
          <CircleSlash className="size-10 text-amber-500" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Payment cancelled
        </h1>
        <p className="mt-2 text-muted-foreground">
          No worries, you haven&apos;t been charged. Your booking is still
          confirmed and you can complete payment whenever you&apos;re ready.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-left text-sm text-muted-foreground">
          <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" />
          If the payment page closed by accident, open the order from your
          rentals and press Pay Now again.
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-11 px-5">
            <Link href="/dashboard/customer/orders">
              <ShoppingBag />
              Back to my rentals
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-5">
            <Link href="/gear">
              <ArrowLeft />
              Keep browsing
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
