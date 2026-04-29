import type {Metadata} from 'next';
import Script from 'next/script';
import {Bebas_Neue, Inter} from 'next/font/google';
import localFont from 'next/font/local';
import type {ReactNode} from 'react';
import {TooltipProvider} from '@lyttle-development/ui';
import './globals.scss';
import {siteConfig} from '../site.config';

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

const berniertmFont = localFont({
  src: [
    {path: './fonts/berniertm/BERNIERTM-REGULAR.woff2'},
    {path: './fonts/berniertm/BERNIERTM-REGULAR.woff'},
  ],
  variable: '--font-berniertm',
  display: 'swap',
  weight: '400',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: 'nl_BE',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 900,
        alt: `${siteConfig.name} foodtruck`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'food',
  icons: {
    icon: [
      {url: '/favicon.ico'},
      {url: '/favicon.svg', type: 'image/svg+xml'},
      {url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png'},
    ],
    apple: [{url: '/apple-touch-icon.png'}],
  },
  manifest: '/site.webmanifest',
  authors: [{name: siteConfig.name, url: siteConfig.url}],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      inLanguage: 'nl-BE',
    },
    {
      '@type': 'FoodEstablishment',
      '@id': `${siteConfig.url}/#foodtruck`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
      image: `${siteConfig.url}${siteConfig.ogImage}`,
      email: siteConfig.business.email,
      telephone: siteConfig.business.phone,
      areaServed: siteConfig.business.areaServed,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteConfig.business.locality,
        addressCountry: siteConfig.business.country,
      },
      sameAs: [...siteConfig.business.sameAs],
      servesCuisine: ['Street food', 'Pasta', 'Barbecue', 'Desserts'],
      hasMenu: `${siteConfig.url}/#menu`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="nl" className={`${bodyFont.variable} ${displayFont.variable} ${berniertmFont.variable}`}>
      <body>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
        />
        <a href="#main-content" className="skip-link">
          Spring naar de inhoud
        </a>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
