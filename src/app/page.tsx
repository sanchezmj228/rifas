import RaffleCard from '@/components/RaffleCard';
import CountdownHero from '@/components/CountdownHero';
import FAQSection from '@/components/FAQSection';
import { getRaffles } from '@/services/raffleService';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  const raffles = await getRaffles();

  // Find the next raffle (closest future endDate)
  const now = new Date();
  const upcomingRaffles = raffles
    .filter(r => new Date(r.endDate) > now)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  const nextRaffle = upcomingRaffles[0] || null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-crimson/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/4 w-36 h-36 bg-emerald/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-gold/50 rounded-full px-5 py-2 mb-8">
                <span className="text-gold text-sm">✦</span>
                <span className="text-gold text-sm font-medium tracking-widest uppercase">Sorteos en Vivo</span>
                <span className="text-gold text-sm">✦</span>
              </div>

              {/* Headline - Elegant Serif Style */}
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-[1.1] tracking-tight">
                <span className="text-foreground italic font-medium">La Suerte Favorece</span>
                <br />
                <span className="text-gold italic font-medium">a los Audaces</span>
              </h1>

              {/* Subheadline */}
              <p className="text-foreground/60 text-lg md:text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Adéntrate en el exclusivo mundo de los sorteos premium. Elige tu número de la suerte
                y participa por premios legendarios. Cada número cuenta una historia de victoria.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <a
                  href="#rifas"
                  className="btn-casino text-base px-8 py-4 rounded-lg font-semibold inline-flex items-center justify-center gap-2 group"
                >
                  <span>Ver Sorteos Activos</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#como-funciona"
                  className="border border-white/20 text-white/80 hover:border-gold/50 hover:text-gold text-base px-8 py-4 rounded-lg font-medium transition-all inline-flex items-center justify-center gap-2"
                >
                  <span>¿Cómo Funciona?</span>
                </a>
              </div>

              {/* Stats - Boxed Style with Icons */}
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="border border-white/10 rounded-xl p-4 text-center hover:border-gold/30 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L9 9H2l6 5-2 8 6-4 6 4-2-8 6-5h-7l-3-7z" />
                    </svg>
                    <span className="text-xl md:text-2xl font-bold text-white">$250K+</span>
                  </div>
                  <div className="text-foreground/40 text-xs uppercase tracking-wider">Premios Entregados</div>
                </div>
                <div className="border border-white/10 rounded-xl p-4 text-center hover:border-gold/30 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-xl md:text-2xl font-bold text-white">15K+</span>
                  </div>
                  <div className="text-foreground/40 text-xs uppercase tracking-wider">Victorias</div>
                </div>
                <div className="border border-white/10 rounded-xl p-4 text-center hover:border-gold/30 transition-colors">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                    </svg>
                    <span className="text-xl md:text-2xl font-bold text-white">VIP</span>
                  </div>
                  <div className="text-foreground/40 text-xs uppercase tracking-wider">Experiencia</div>
                </div>
              </div>
            </div>

            {/* Right Column - Countdown with Product Image */}
            <div className="order-1 lg:order-2">
              {nextRaffle ? (
                <CountdownHero
                  nextRaffle={{
                    id: nextRaffle.id,
                    title: nextRaffle.title,
                    endDate: nextRaffle.endDate,
                    price: nextRaffle.price,
                    currency: nextRaffle.currency,
                    image: nextRaffle.image,
                  }}
                />
              ) : (
                /* Placeholder when no upcoming raffle */
                <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                  <div className="text-6xl mb-4">🎰</div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Próximamente!</h3>
                  <p className="text-foreground/60">Nuevas rifas estarán disponibles pronto.</p>
                </div>
              )}
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

      {/* Recent Winners Section */}
      <section className="py-16 md:py-24 bg-surface/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-display text-3xl md:text-5xl font-bold mb-4">
              <span className="text-foreground">Ganadores </span>
              <span className="text-neon-emerald">Recientes</span>
            </h2>
            <p className="text-foreground/60 text-lg max-w-xl mx-auto">
              ¡Ellos ya alcanzaron la gloria! Tú podrías ser nuestro próximo gran ganador 🎉
            </p>
          </div>

          {/* Winners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Winner 1 */}
            <div className="bg-surface border border-emerald/20 rounded-2xl p-6 text-center hover:border-emerald/50 transition-all group">
              <div className="w-20 h-20 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                🏆
              </div>
              <h3 className="font-bold text-white text-lg mb-1">María G.</h3>
              <p className="text-emerald font-semibold mb-2">iPhone 15 Pro Max</p>
              <p className="text-foreground/50 text-sm">Número ganador: <span className="text-gold font-mono">047</span></p>
              <p className="text-foreground/40 text-xs mt-2">Diciembre 2025</p>
            </div>

            {/* Winner 2 */}
            <div className="bg-surface border border-gold/20 rounded-2xl p-6 text-center hover:border-gold/50 transition-all group">
              <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                🎮
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Carlos R.</h3>
              <p className="text-gold font-semibold mb-2">PlayStation 5</p>
              <p className="text-foreground/50 text-sm">Número ganador: <span className="text-gold font-mono">892</span></p>
              <p className="text-foreground/40 text-xs mt-2">Noviembre 2025</p>
            </div>

            {/* Winner 3 */}
            <div className="bg-surface border border-crimson/20 rounded-2xl p-6 text-center hover:border-crimson/50 transition-all group">
              <div className="w-20 h-20 rounded-full bg-crimson/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                💻
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Ana M.</h3>
              <p className="text-crimson font-semibold mb-2">MacBook Pro 14&quot;</p>
              <p className="text-foreground/50 text-sm">Número ganador: <span className="text-gold font-mono">523</span></p>
              <p className="text-foreground/40 text-xs mt-2">Octubre 2025</p>
            </div>

            {/* Winner 4 */}
            <div className="bg-surface border border-emerald/20 rounded-2xl p-6 text-center hover:border-emerald/50 transition-all group">
              <div className="w-20 h-20 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                ⌚
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Pedro L.</h3>
              <p className="text-emerald font-semibold mb-2">Apple Watch Ultra</p>
              <p className="text-foreground/50 text-sm">Número ganador: <span className="text-gold font-mono">156</span></p>
              <p className="text-foreground/40 text-xs mt-2">Septiembre 2025</p>
            </div>
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
              <h3 className="font-headline text-2xl font-bold text-gold mb-3 italic">Selección de Lujo</h3>
              <p className="text-foreground/60">
                Explora nuestro catálogo de premios exclusivos y elige el sorteo que despierte tu ambición.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface rounded-2xl p-8 border border-border hover:border-emerald transition-all text-center group">
              <div className="w-16 h-16 rounded-full bg-emerald flex items-center justify-center mx-auto mb-6 text-3xl group-hover:animate-pulse">
                2️⃣
              </div>
              <h3 className="font-headline text-2xl font-bold text-emerald mb-3 italic">Tu Número Maestro</h3>
              <p className="text-foreground/60">
                Escoge tu combinación del 000 al 999. El destino está a un clic de distancia.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface rounded-2xl p-8 border border-border hover:border-crimson transition-all text-center group">
              <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center mx-auto mb-6 text-3xl group-hover:animate-pulse">
                3️⃣
              </div>
              <h3 className="font-headline text-2xl font-bold text-crimson mb-3 italic">Alcanza la Cima</h3>
              <p className="text-foreground/60">
                Sigue el sorteo en vivo. Si tu número es el elegido, nos encargaremos de entregarte tu premio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
