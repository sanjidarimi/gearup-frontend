import { API_BASE_URL } from "@/lib/config";
import type { Category } from "@/types/category";
import type { Gear } from "@/types/gear";
import { cache } from "react";

// Server-side fetchers for public data. These run in Server Components,
// so they talk to the backend directly.

// Stock changes with every booking, so always read it fresh. cache() keeps
// generateMetadata and the page from fetching the same item twice.
export const fetchGearById = cache(async (id: string): Promise<Gear | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/gear/${encodeURIComponent(id)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const result = await response.json();
    return result?.data ?? null;
  } catch {
    return null;
  }
});

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    return Array.isArray(result?.data) ? result.data : [];
  } catch {
    return [];
  }
}
