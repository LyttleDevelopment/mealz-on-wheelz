import { Heading, Text } from '@lyttle-development/ui';
import styles from '../page.module.scss';

type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className={styles.sectionHeading}>
      <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
        {eyebrow}
      </Text>
      <Heading as="h2" size="4xl" className={styles.sectionTitle}>
        {title}
      </Heading>
      <Text as="p" size="lg" tone="muted" className={styles.sectionDescription}>
        {description}
      </Text>
    </div>
  );
}

