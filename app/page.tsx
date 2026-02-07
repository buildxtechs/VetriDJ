import { Header } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { ServicesSection } from '@/components/landing/services-section';
import { ProcessSection } from '@/components/landing/process-section';
import { GallerySection } from '@/components/landing/gallery-section';
import { AboutSection } from '@/components/landing/about-section';
import { ContactSection } from '@/components/landing/contact-section';
import { Footer } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <GallerySection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
