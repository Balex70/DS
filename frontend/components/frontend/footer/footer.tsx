import FooterBottomSection from "./footer-bottom-section";
import FooterMainSection from "./footer-main-section";

export function Footer() {
    return (
        <footer className="border-t bg-gray-50 dark:bg-background">
            <div
                className="
                    container
                    mx-auto
                    px-4
                    pb-10 md:pb-2
                "
            >
                <FooterMainSection />

                {/* <FooterCategoriesSection /> */}
                <FooterBottomSection />
            </div>
        </footer>
    );
}
