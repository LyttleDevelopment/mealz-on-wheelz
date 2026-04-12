import type {Metadata} from 'next';
import {Bebas_Neue, Inter} from 'next/font/google';
import type {ReactNode} from 'react';
import {TooltipProvider} from '@lyttle-development/ui';
import './globals.scss';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const displayFont = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-display',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mealz on Wheelz',
  description:
    'Mobiel foodtruck-concept voor privéfeesten, bedrijfsmomenten en festivals — stijlvol, warm en helemaal klaar om jouw event te voeden.',
  keywords: [
    'Mealz on Wheelz',
    'foodtruck',
    'event catering',
    'Gent',
    'catering',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Spring naar de inhoud
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

