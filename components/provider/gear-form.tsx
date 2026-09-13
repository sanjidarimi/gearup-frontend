"use client";

import { GearImage } from "@/components/gears/gear-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/category/queries";
import { useCreateGear, useUpdateGear } from "@/hooks/provider/queries";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  MAX_IMAGE_SIZE,
  gearFormSchema,
  type GearFormValues,
} from "@/lib/validations/gear";
import type { Gear, GearPayload } from "@/types/gear";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImagePlus,
  Link2,
  Loader2,
  Save,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

interface GearFormProps {
  mode: "create" | "edit";
  gear?: Gear;
}

type ImageMode = "url" | "upload";

export function GearForm({ mode, gear }: GearFormProps) {
  const router = useRouter();
  const { data: categories = [], isLoading: loadingCategories } =
    useCategories();
  const createGear = useCreateGear();
  const updateGear = useUpdateGear(gear?.id ?? "");
  const isSaving = createGear.isPending || updateGear.isPending;

  const [imageMode, setImageMode] = useState<ImageMode>("url");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: gear?.name ?? "",
      brand: gear?.brand ?? "",
      categoryId: gear?.categoryId ?? "",
      description: gear?.description ?? "",
      pricePerDay: gear?.pricePerDay ?? undefined,
      stock: gear?.stock ?? 1,
      isAvailable: gear?.isAvailable ?? true,
      imageUrl: gear?.imageUrl ?? "",
    },
  });

  const [imageUrl, pricePerDay, stock, isAvailable, name] = useWatch({
    control,
    name: ["imageUrl", "pricePerDay", "stock", "isAvailable", "name"],
  });

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    event.target.value = "";
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setFileError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    if (selected.size > MAX_IMAGE_SIZE) {
      setFileError("Images must be smaller than 5 MB.");
      return;
    }

    setFileError(null);
    setFile(selected);
    setFilePreview(URL.createObjectURL(selected));
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const onSubmit = handleSubmit((values) => {
    const payload: GearPayload = {
      name: values.name,
      brand: values.brand,
      categoryId: values.categoryId,
      description: values.description,
      pricePerDay: values.pricePerDay,
      stock: values.stock,
      // A listing with nothing in stock can't be booked anyway.
      isAvailable: values.stock > 0 ? values.isAvailable : false,
      ...(imageMode === "url" && values.imageUrl
        ? { imageUrl: values.imageUrl }
        : {}),
    };
    const input = { payload, file: imageMode === "upload" ? file : null };
    const onSuccess = () => router.push("/dashboard/provider/gear");

    if (mode === "create") createGear.mutate(input, { onSuccess });
    else updateGear.mutate(input, { onSuccess });
  });

  const canSave = mode === "create" || isDirty || Boolean(file);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/dashboard/provider/gear"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to inventory
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {mode === "create" ? "Add new gear" : `Edit ${gear?.name}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "create"
              ? "Fill in the details renters need to book with confidence."
              : "Update pricing, stock or photos. Changes go live immediately."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild type="button" variant="outline" size="lg" className="h-10 px-4">
            <Link href="/dashboard/provider/gear">Cancel</Link>
          </Button>
          <Button type="submit" size="lg" className="h-10 px-4" disabled={isSaving || !canSave}>
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
            {mode === "create" ? "Publish gear" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <div>
              <h2 className="font-semibold text-foreground">Basic information</h2>
              <p className="text-sm text-muted-foreground">
                What is it, who makes it and what should renters know?
              </p>
            </div>

            <Field label="Gear name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
                className="h-10 text-sm"
                aria-invalid={Boolean(errors.name)}
                {...register("name")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Brand" htmlFor="brand" error={errors.brand?.message}>
                <Input
                  id="brand"
                  placeholder="e.g. MSR"
                  className="h-10 text-sm"
                  aria-invalid={Boolean(errors.brand)}
                  {...register("brand")}
                />
              </Field>

              <Field label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loadingCategories}
                    >
                      <SelectTrigger
                        id="categoryId"
                        className="h-10! w-full text-sm"
                        aria-invalid={Boolean(errors.categoryId)}
                      >
                        <SelectValue
                          placeholder={loadingCategories ? "Loading…" : "Choose a category"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <Field
              label="Description"
              htmlFor="description"
              error={errors.description?.message}
              hint="Mention size, condition, what's included and any usage tips."
            >
              <Textarea
                id="description"
                rows={6}
                placeholder="Lightweight freestanding tent that sleeps two. Includes rainfly, footprint and stakes…"
                className="min-h-36 text-sm"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
            </Field>
          </section>

          <section className="space-y-5 rounded-2xl border border-border bg-card p-6">
            <div>
              <h2 className="font-semibold text-foreground">Pricing & stock</h2>
              <p className="text-sm text-muted-foreground">
                Renters pay the daily rate × number of days × quantity.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Price per day (USD)" htmlFor="pricePerDay" error={errors.pricePerDay?.message}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="pricePerDay"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min={0}
                    placeholder="25"
                    className="h-10 pl-7 text-sm"
                    aria-invalid={Boolean(errors.pricePerDay)}
                    {...register("pricePerDay", { valueAsNumber: true })}
                  />
                </div>
              </Field>

              <Field label="Units in stock" htmlFor="stock" error={errors.stock?.message}>
                <Input
                  id="stock"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  className="h-10 text-sm"
                  aria-invalid={Boolean(errors.stock)}
                  {...register("stock", { valueAsNumber: true })}
                />
              </Field>
            </div>

            <Controller
              control={control}
              name="isAvailable"
              render={({ field }) => (
                <label
                  htmlFor="isAvailable"
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      Available for booking
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {stock === 0
                        ? "Add stock to make this listing bookable."
                        : "Turn off to pause bookings without deleting the listing."}
                    </span>
                  </span>
                  <Switch
                    id="isAvailable"
                    checked={field.value && stock !== 0}
                    disabled={stock === 0}
                    onCheckedChange={field.onChange}
                  />
                </label>
              )}
            />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <h2 className="font-semibold text-foreground">Photo</h2>
              <p className="text-sm text-muted-foreground">
                Paste an image URL or upload a photo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted/40 p-1">
              {[
                { value: "url" as const, label: "Image URL", icon: Link2 },
                { value: "upload" as const, label: "Upload", icon: UploadCloud },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setImageMode(value)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-colors",
                    imageMode === value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-dashed border-border bg-muted">
              {imageMode === "upload" && filePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={filePreview}
                  alt="Selected upload preview"
                  className="h-full w-full object-cover"
                />
              ) : imageMode === "url" && imageUrl && !errors.imageUrl ? (
                <GearImage src={imageUrl} alt={name || "Gear preview"} sizes="400px" className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ImagePlus className="size-8" />
                  <span className="text-xs">Preview appears here</span>
                </div>
              )}
              {imageMode === "upload" && file && (
                <button
                  type="button"
                  onClick={clearFile}
                  aria-label="Remove selected image"
                  className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {imageMode === "url" ? (
              <Field label="Image URL" htmlFor="imageUrl" error={errors.imageUrl?.message}>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/…"
                  className="h-10 text-sm"
                  aria-invalid={Boolean(errors.imageUrl)}
                  {...register("imageUrl")}
                />
              </Field>
            ) : (
              <div className="space-y-2">
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-border px-4 py-3 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                >
                  <UploadCloud className="size-5 text-primary" />
                  {file ? file.name : "Choose an image"}
                  <span className="text-xs font-normal text-muted-foreground">
                    JPG, PNG or WebP · max 5 MB
                  </span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                {fileError && (
                  <p className="text-xs font-medium text-destructive">{fileError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Uploads are stored on the server&apos;s Cloudinary account.
                </p>
              </div>
            )}
          </section>

          <section className="space-y-3 rounded-2xl border border-border bg-muted/30 p-6 text-sm">
            <h2 className="font-semibold text-foreground">Listing preview</h2>
            <dl className="space-y-2">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Daily rate</dt>
                <dd className="font-medium text-foreground">
                  {Number.isFinite(pricePerDay) ? formatCurrency(pricePerDay) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Weekend (2 days)</dt>
                <dd className="font-medium text-foreground">
                  {Number.isFinite(pricePerDay) ? formatCurrency(pricePerDay * 2) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium text-foreground">
                  {stock > 0 && isAvailable ? "Bookable" : "Paused"}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-sm">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
