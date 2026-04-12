import { Container, Heading, Text } from '@lyttle-development/ui';
import { gallery } from '../data/constants';
import { SectionHeading } from './SectionHeading';
import styles from '../page.module.scss';

export function GallerySection() {
  return (
    <section id="galerij" className={styles.section}>
      <Container>
        <SectionHeading
          eyebrow="Galerij"
          title="Een sfeer die meteen herkenbaar is"
          description="Zachte contrasten, warme accenten en een duidelijke hiërarchie — vertaald naar een webervaring die ook mobiel sterk blijft."
        />

        <div className={styles.galleryGrid}>
          {gallery.map((item, index) => (
            <article
              key={item.title}
              className={styles.galleryTile}
              data-tone={index % 2 === 0 ? 'light' : 'dark'}
            >
              <div className={styles.galleryTileInner}>
                <Text as="p" size="xs" weight="semibold" className={styles.galleryLabel}>
                  0{index + 1}
                </Text>
                <Heading as="h3" size="3xl" className={styles.galleryTitle}>
                  {item.title}
                </Heading>
                <Text as="p" size="md" tone={index % 2 === 0 ? 'secondary' : 'inverse'}>
                  {item.note}
                </Text>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

