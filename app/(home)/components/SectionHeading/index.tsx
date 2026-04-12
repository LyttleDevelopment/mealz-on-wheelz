import { Heading, Text } from "@lyttle-development/ui";
import styles from "./index.module.scss";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className={styles.sectionHeading}>
      {eyebrow && (
        <Text as="p" size="xs" weight="semibold" className={styles.eyebrow}>
          {eyebrow}
        </Text>
      )}
      {title && (
        <Heading as="h2" size="4xl" className={styles.sectionTitle}>
          {title}
        </Heading>
      )}
      {description && (
        <Text
          as="p"
          size="sm"
          tone="muted"
          className={styles.sectionDescription}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
