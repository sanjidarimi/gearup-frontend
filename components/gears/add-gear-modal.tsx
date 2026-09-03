"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateGear } from "@/hooks/provider/queries";

export function AddGearModal() {
  const [open, setOpen] = useState(false);
  const createGearMutation = useCreateGear();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createGearMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Add New Gear
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card text-card-foreground max-w-md border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Rental Gear
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Gear Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g. Hiking Backpack"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                required
                placeholder="e.g. Hiking"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerDay">Price / Day ($)</Label>
              <Input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                required
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" required min="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category ID</Label>
              <Input id="categoryId" name="categoryId" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Gear Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground"
            disabled={createGearMutation.isPending}
          >
            {createGearMutation.isPending ? "Saving..." : "Save Gear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
