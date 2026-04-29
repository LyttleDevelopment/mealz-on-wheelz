import { AboutSection } from "./components/AboutSection";
import { BookingSection } from "./components/BookingSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { FormulasSection } from "./components/FormulasSection";
import { GallerySection } from "./components/GallerySection";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import styles from "./page.module.scss";

export default function HomePage() {
  return (
    <main className={styles.page} id="main-content">
      <span id="home" aria-hidden="true" role="presentation" />
      <Header />
      <HeroSection />
      <AboutSection />
      <FormulasSection />
      <ServicesSection />
      <GallerySection />
      <BookingSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
