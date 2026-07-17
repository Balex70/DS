import { MaincategoriesSection } from "@/components/frontend/category/maincategories-section";
import { HeroCarousel } from "@/components/frontend/hero-carousel";

export default function HomePage() {
    return (
        <div className="space-y-6">
            <HeroCarousel />
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
