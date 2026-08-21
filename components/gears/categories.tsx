"use client";
import Link from "next/link";
import { useCategory } from "@/features/category/queries";
import { Category } from "@/types/category";

export function Categories() {
  const { data, isLoading } = useCategory();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-6 w-24 rounded-bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const categoryItem = (data as { data: Category[] }).data;

  const categories = categoryItem
    ? Array.from(new Set(categoryItem.map((cat) => cat.name)))
    : [];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <Link
        href="/gear"
        className="w-full py-2 text-sm font-medium rounded-xl bg-primary px-4 text-primary-foreground"
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/gear?category=${category}`}
          className="w-full py-1.5 text-xs font-medium rounded-xl border border-border hover:text-primary"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
