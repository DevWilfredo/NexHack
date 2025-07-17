import Hero from "@components/Hero";
import BenefitsSection from "@components/BenefitsComponent";
import TechGridSection from "@components/TechGrid";
import Testimonials from "@components/Testimonials";
import BentoGridSection from "@components/BentoGridSection";

const Home = () => {
  return (
    <>
      <Hero />
      <BenefitsSection />
      <TechGridSection />
      <BentoGridSection/>
      <Testimonials/>
    </>
  );
};

export default Home;
