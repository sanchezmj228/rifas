import { getDashboardMetrics } from '@/services/raffleService';

export default async function DashboardStats() {
    const metrics = await getDashboardMetrics();

    // Format currency (assuming mostly USD/BCV usage, can be adapted)
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('es-VE', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const mainRevenue = metrics.totalRevenue['BCV']
        ? formatCurrency(metrics.totalRevenue['BCV'], 'VES').replace('VES', 'BCV') // Custom label for BCV
        : '$0'; // Default fallback


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Active Raffles */}
            <div className="bg-surface border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-gold/30 transition-all">
                <div className="flex items-center justify-between z-10 relative">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">Rifas Activas</p>
                        <p className="text-3xl font-bold text-white mt-1">{metrics.activeRaffles}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
            </div>

            {/* Pending Tickets */}
            <div className="bg-surface border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-orange-500/30 transition-all">
                <div className="flex items-center justify-between z-10 relative">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">Tickets Pendientes</p>
                        <p className={`text-3xl font-bold mt-1 ${metrics.pendingTickets > 0 ? 'text-orange-400' : 'text-white'}`}>
                            {metrics.pendingTickets}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                {metrics.pendingTickets > 0 && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full m-3 animate-ping" />
                )}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
            </div>

            {/* Today's Sales */}
            <div className="bg-surface border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-emerald/30 transition-all">
                <div className="flex items-center justify-between z-10 relative">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">Ventas de Hoy</p>
                        <p className="text-3xl font-bold text-emerald mt-1">{metrics.todaysSalesCount}</p>
                        <p className="text-xs text-foreground/40 mt-1">
                            Total: {metrics.todaysSalesAmount > 0 ? `$${metrics.todaysSalesAmount}` : '$0'}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center text-emerald group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald/5 rounded-full blur-2xl group-hover:bg-emerald/10 transition-colors" />
            </div>

            {/* Daily Revenue */}
            <div className="bg-surface border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-crimson/30 transition-all">
                <div className="flex items-center justify-between z-10 relative">
                    <div>
                        <p className="text-foreground/60 text-sm font-medium uppercase tracking-wider">Ingresos de Hoy</p>
                        <p className="text-3xl font-bold text-white mt-1">{mainRevenue}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-crimson/10 flex items-center justify-center text-crimson group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-crimson/5 rounded-full blur-2xl group-hover:bg-crimson/10 transition-colors" />
            </div>
        </div>
    );
}
