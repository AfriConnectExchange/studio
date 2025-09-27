export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This layout is now a pass-through since the page itself controls the layout.
    return <>{children}</>;
}