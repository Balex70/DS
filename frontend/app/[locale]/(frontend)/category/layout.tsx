export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto flex gap-6 px-4 py-6">
            {children}
        </div>
    );
}
