import RaffleCard from '@/components/RaffleCard';
import { getRaffles } from '@/services/raffleService';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const raffles = await getRaffles();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-crimson/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-emerald/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-surface/50 backdrop-blur-sm border border-gold/30 rounded-full px-4 py-2 mb-6 animate-pulse-glow">
              <span className="text-2xl">✨</span>
              <span className="text-gold text-sm font-medium">¡Nuevas Rifas Cada Semana!</span>
            </div>

            {/* Headline */}
            <h1 className="text-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Tu Número de la </span>
              <span className="text-neon-gold">Suerte</span>
              <br />
              <span className="text-foreground">Te Espera</span>
            </h1>

            {/* Subheadline */}
            <p className="text-foreground/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Participa en nuestras rifas exclusivas y gana productos premium.
              <span className="text-emerald font-semibold"> iPhone, PlayStation, MacBook</span> y mucho más.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#rifas"
                className="btn-casino text-lg px-8 py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 group"
              >
                <span>Ver Rifas Activas</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#como-funciona"
                className="border border-gold/50 text-gold hover:bg-gold/10 text-lg px-8 py-4 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2"
              >
                <span>¿Cómo Funciona?</span>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold mb-1">1,234+</div>
                <div className="text-foreground/50 text-sm">Ganadores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald mb-1">$2.5M</div>
                <div className="text-foreground/50 text-sm">En Premios</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-crimson mb-1">100%</div>
                <div className="text-foreground/50 text-sm">Confiable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Raffles Section */}
      <section id="rifas" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Rifas </span>
              <span className="text-neon-gold">Activas</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              Elige tu número de la suerte y participa para ganar increíbles premios
            </p>
          </div>

          {/* Raffles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle.id} raffle={raffle} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 md:py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">¿Cómo </span>
              <span className="text-neon-emerald">Funciona</span>
              <span className="text-foreground">?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-surface rounded-2xl p-8 border border-border hover:border-gold transition-all text-center group">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6 text-3xl group-hover:animate-pulse-glow">
                1️⃣
              </div>
              <h3 className="text-display text-xl font-bold text-gold mb-3">Elige tu Rifa</h3>
              <p className="text-foreground/60">
                Explora nuestra selección de premios exclusivos y elige la rifa que más te guste.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface rounded-2xl p-8 border border-border hover:border-emerald transition-all text-center group">
              <div className="w-16 h-16 rounded-full bg-emerald flex items-center justify-center mx-auto mb-6 text-3xl group-hover:animate-pulse">
                2️⃣
              </div>
              <h3 className="text-display text-xl font-bold text-emerald mb-3">Selecciona tu Número</h3>
              <p className="text-foreground/60">
                Escoge un número del 000 al 999. Los números disponibles están marcados en verde.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface rounded-2xl p-8 border border-border hover:border-crimson transition-all text-center group">
              <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center mx-auto mb-6 text-3xl group-hover:animate-pulse">
                3️⃣
              </div>
              <h3 className="text-display text-xl font-bold text-crimson mb-3">¡Gana!</h3>
              <p className="text-foreground/60">
                Espera el sorteo en vivo. Si tu número es el ganador, ¡te contactamos de inmediato!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
