import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import StatsBar from "../components/home/StatsBar";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="bg-[#050816] text-white min-h-screen">

      <Navbar />

      <Hero />

      <StatsBar />

      <Features />

      <HowItWorks />

      <CTA />

      <Footer />

    </div>
  );
}