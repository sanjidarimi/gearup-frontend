import { AddCategoryModal } from "@/components/categories/add-category-modal";
import { CategoryTable } from "@/components/categories/category-table";
import { PageHeader } from "@/components/shared/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Organise the catalog. Providers choose one of these for every listing."
        actions={<AddCategoryModal />}
      />
      <CategoryTable />
    </>
  );
}
