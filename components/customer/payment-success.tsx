"use client";

import { Button } from "@/components/ui/button";
import { paymentKeys, usePaymentConfirmation } from "@/hooks/payment/queries";
import { rentalKeys } from "@/hooks/rental/queries";
import { SITE_IMAGES } from "@/lib/images";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Clock, Loader2, Receipt, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = usePaymentConfirmation(sessionId);

  // The webhook updates the order in the background, so make sure the
  // dashboard refetches instead of showing the old "Confirmed" badge.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: rentalKeys.mine });
    queryClient.invalidateQueries({ queryKey: paymentKeys.mine });
  }, [queryClient]);

  const isPaid = data?.status === "paid";
  const state = isLoading
    ? {
        icon: Loader2,
        iconClass: "animate-spin text-primary",
        title: "Confirming your payment…",
        text: "Hang tight while we check with Stripe.",
      }
    : isPaid || (!sessionId && !isError)
      ? {
          icon: CheckCircle2,
          iconClass: "text-emerald-500",
          title: "Payment successful!",
          text: "Your rental is paid. The provider will get your gear ready for pickup.",
        }
      : isError
        ? {
            icon: Clock,
            iconClass: "text-amber-500",
            title: "Payment received, verification pending",
            text: "We couldn't verify the receipt right now. Your order status will update shortly.",
          }
        : {
            icon: Clock,
            iconClass: "text-amber-500",
            title: "Payment is processing",
            text: "Stripe is still finalising this payment. Check your rentals in a minute.",
          };

  const Icon = state.icon;

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/5">
        <div className="relative h-44 sm:h-56">
          <Image
            src={SITE_IMAGES.paymentSuccess}
            alt="Sunrise over a sea of clouds between mountain peaks"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent" />
        </div>

        <div className="-mt-10 space-y-6 px-6 pb-8 text-center sm:px-10">
          <span className="relative mx-auto flex size-20 items-center justify-center rounded-full border-4 border-card bg-background shadow-lg">
            <Icon className={`size-10 ${state.iconClass}`} />
          </span>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {state.title}
            </h1>
            <p className="text-muted-foreground">{state.text}</p>
          </div>

          {data?.customerEmail && (
            <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              A Stripe receipt was sent to{" "}
              <span className="font-medium text-foreground">{data.customerEmail}</span>
            </p>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/dashboard/customer/orders">
                <ShoppingBag />
                Track my rentals
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5">
              <Link href="/dashboard/customer/payments">
                <Receipt />
                Payment history
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
