import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import Providers from '@/providers/providers';

export const metadata: Metadata = {
  title: 'Projet Cryptographie — Groupe 1 GL',
  description:
    'Application pédagogique sur la génération de clés RSA, la signature numérique et la vérification cryptographique. Développée par le Groupe 1 GL.',
  keywords: [
    'cryptographie',
    'RSA',
    'signature numérique',
    'vérification',
    'Groupe 1 GL',
    'projet scolaire',
  ],
  authors: [{ name: 'Groupe 1 GL — Projet Universitaire' }],
  robots: 'index, follow',
};

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={spaceGrotesk.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
