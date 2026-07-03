import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Visit from "@/components/Visit";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A2E1A]">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Gallery />
        <Reviews />
        <Process />
        <Stats />
        <Visit />
        <ContactForm />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default LandingPage;
