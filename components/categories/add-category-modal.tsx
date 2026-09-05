"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/category/queries";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const createCategoryMutation = useCreateCategory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    createCategoryMutation.mutate(
      { name },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground max-w-sm border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Camping" />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={createCategoryMutation.isPending}
          >
            {createCategoryMutation.isPending ? "Saving..." : "Save Category"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
