import Image from "next/image";

// COMPONENT IMPORTS
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <main className="flex flex-col gap-20 p-6">
      <Nav />
      <Hero />
      <Features />
    </main>
  );
}
