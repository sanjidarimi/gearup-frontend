import { CategoryTable } from "@/components/categories/category-table";
import { AddCategoryModal } from "@/components/categories/add-category-modal";

export default function CategoryPage() {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-muted-foreground">
            Manage product categories for your gear inventory.
          </p>
        </div>
        <AddCategoryModal />
      </div>

      <CategoryTable />
    </div>
  );
}
