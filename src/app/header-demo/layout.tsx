
export default function HeaderDemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased text-[var(--text-body)]">
            {children}
        </div>
    );
}
