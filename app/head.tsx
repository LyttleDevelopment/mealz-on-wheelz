import {siteConfig} from '../site.config';

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

export default function Head() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
      />
    </>
  );
}
