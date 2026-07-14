import { MaincategoriesSection } from "@/components/frontend/category/maincategories-section";

export default function HomePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Categories
                </h1>

                <p className="text-muted-foreground">
                    Browse our product categories
                </p>
            </div>

            <div>
                <MaincategoriesSection />
            </div>
        </div>
    );
}
