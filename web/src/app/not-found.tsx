import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="bg-surface pt-16 lg:pt-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <h1 className="text-6xl lg:text-8xl font-black text-primary/10 mb-4">404</h1>
        <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
          Stranka nenalezena
        </h2>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          Omlouvame se, ale pozadovana stranka nebyla nalezena. Mohla byt presunuta nebo smazana.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-primary-dark transition-colors"
        >
          Zpet na hlavni stranku
        </Link>
      </div>
    </main>
  );
}
