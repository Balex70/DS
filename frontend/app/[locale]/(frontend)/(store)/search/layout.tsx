import { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto flex gap-6 pb-12">
            {children}
        </div>
    );
}
