import LandingNavbar    from '@/components/landing/LandingNavbar';
import Hero            from '@/components/landing/Hero';
import Services        from '@/components/landing/Services';
import MascotSection   from '@/components/landing/MascotSection';
import ResumeTool      from '@/components/landing/ResumeTool';
import PricingSection  from '@/components/landing/PricingSection';
import FAQSection      from '@/components/landing/FAQSection';
import LandingFooter   from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFF' }}>
      <LandingNavbar />
      <main>
        <Hero />
        <Services />
        <MascotSection />
        <ResumeTool />
        <PricingSection />
        <FAQSection />
      </main>
      <LandingFooter />
    </div>
  );
}
