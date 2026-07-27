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
