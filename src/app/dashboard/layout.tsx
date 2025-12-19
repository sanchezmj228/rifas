import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Admin Header */}
            <header className="border-b border-white/10 bg-surface/50 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard" className="text-xl font-bold font-display text-gold">
                            Admin Dashboard
                        </Link>
                    </div>
                    <div>
                        <Link href="/" className="text-sm text-foreground/60 hover:text-white transition-colors">
                            Ver Sitio
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
