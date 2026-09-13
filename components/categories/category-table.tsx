"use client";

import { TableSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/category/queries";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, shortId } from "@/lib/format";
import { getCategoryVisual } from "@/lib/images";
import { ExternalLink, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CategoryTable() {
  const { data: categories = [], isLoading, isError, error, refetch } =
    useCategories();

  if (isLoading) return <TableSkeleton />;

  if (isError) {
    return <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No categories yet"
        description="Create the first category so providers can start listing gear."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="px-4">Category</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="px-4 text-right">Catalog</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={getCategoryVisual(category.name).cover}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{category.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {shortId(category.id)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(category.createdAt)}
              </TableCell>
              <TableCell className="px-4 text-right">
                <Link
                  href={`/gear?category=${encodeURIComponent(category.name)}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View gear <ExternalLink className="size-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
