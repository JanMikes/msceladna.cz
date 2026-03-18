import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-surface pt-16 lg:pt-20 min-h-screen flex items-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-teal-tint opacity-60" />
      <div className="absolute bottom-1/4 -right-16 w-48 h-48 rounded-full bg-lime-tint opacity-60" />

      <div className="container mx-auto px-4 lg:px-8 py-16 text-center relative">
        <p className="text-[8rem] lg:text-[12rem] font-black text-primary/[0.06] leading-none select-none">404</p>
        <div className="-mt-16 lg:-mt-24">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
            Stránka nenalezena
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Omlouváme se, ale požadovaná stránka nebyla nalezena. Mohla být přesunuta nebo smazána.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[var(--radius-button)] hover:bg-primary-dark hover:shadow-lg transition-all"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}
