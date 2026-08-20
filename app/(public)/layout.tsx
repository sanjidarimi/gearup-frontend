import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/shared/Footer";
import React from "react";

export default function publicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children};
      <Footer />
    </>
  );
}
