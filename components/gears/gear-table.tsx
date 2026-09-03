"use client";

import Image from "next/image";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProviderGears, useDeleteGear } from "@/hooks/provider/queries";

export function GearTable() {
  const { data: gears, isLoading, isError } = useProviderGears();
  const deleteMutation = useDeleteGear();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading gears...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load gear items.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price/Day</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gears && gears.length > 0 ? (
            gears.map((gear) => (
              <TableRow
                key={gear.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell>
                  <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={gear.imageUrl}
                      alt={gear.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {gear.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {gear.brand}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ${gear.pricePerDay}
                </TableCell>
                <TableCell>{gear.stock}</TableCell>
                <TableCell>
                  <Badge variant={gear.isAvailable ? "default" : "secondary"}>
                    {gear.isAvailable ? "Available" : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMutation.mutate(gear.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-24 text-center text-muted-foreground"
              >
                No gear items found. Add one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
