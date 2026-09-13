"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/category/queries";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createCategory = useCreateCategory();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      setError("Category names need at least 2 characters.");
      return;
    }

    setError(null);
    createCategory.mutate(
      { name: trimmed },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setError(null);
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="h-10 px-4">
          <Plus />
          Add category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">New category</DialogTitle>
            <DialogDescription className="text-sm">
              Providers pick from these when listing gear. Names must be unique.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="category-name" className="text-sm">
              Category name
            </Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Camping & Hiking"
              aria-invalid={Boolean(error)}
              className="h-10 text-sm"
              autoFocus
            />
            {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="lg" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={createCategory.isPending}>
              {createCategory.isPending && <Loader2 className="animate-spin" />}
              Save category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
