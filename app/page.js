"use client"

import Image from "next/image";
import Testimonials from "@/components/Testimonials";
import { useRouter } from "next/navigation";




// COMPONENT IMPORTS
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col gap-20 ">
      <div className=" p-6 ">
      <Nav />
      <Hero />
      </div>
      
      <section id="features">
        <Features />
      </section>
      <section id="pricing">
        <Pricing />
      </section>

     
        <Testimonials />
      <section id="contact">
        <Footer />
      </section>
    </main>
  );
}

