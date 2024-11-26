/** UI 컴포넌트 */
import { AsidePage } from "@/features/aside/aside-page"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="page">
            <AsidePage />
            <main className="page__main">{children}</main>
        </div>
    );
}
