import { HeroCarousel } from "@/components/frontend/main/hero-carousel";
import { CategoriesSection } from "@/components/frontend/main/categories-section";

export default function HomePage() {
    return (
        <div className="space-y-6 mb-12">
            <HeroCarousel />
            <CategoriesSection />
        </div>
    );
}
