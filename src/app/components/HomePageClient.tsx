"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { CarouselPlayers } from "./Carousel";
import { Jugador } from "@/types";
import { FadeIn } from "@/app/components/motion";

interface HomePageClientProps {
  jugadores: Jugador[];
}

export function HomePageClient({ jugadores }: HomePageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax transformaciones para el hero
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const profesionales = jugadores.filter((j) => j.categoria === "profesional");
  const juveniles = jugadores
    .filter((j) => j.categoria === "juvenil")
    .sort((a, b) => b.nombre.localeCompare(a.nombre));

  return (
    <>
      <main
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen text-white fondo bg-cover bg-center overflow-hidden"
      >
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="flex flex-col items-center justify-center gap-7 z-10 px-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-serif font-extralight text-center tracking-tight"
          >
            Somos R.A Sport
          </motion.h1>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            href="#profesionales"
            className="px-5 py-2 border flex gap-1 items-center transition-all duration-300 active:scale-95 active:opacity-80 hover:scale-105 hover:bg-white/10"
          >
            <span>Nuestros Jugadores</span>
            <ChevronDown size={30} aria-hidden="true" />
          </motion.a>
        </motion.div>
      </main>

      <section className="flex flex-col items-center justify-center gap-4 py-8 my-20 max-w-7xl mx-auto px-4">
        {/* Sección Profesionales */}
        <FadeIn direction="up" distance={30}>
          <div id="profesionales" className="flex items-center gap-6" aria-labelledby="titulo-profesionales">
            <Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" />
            <h2 id="titulo-profesionales" className="text-3xl md:text-4xl font-semibold hover:text-blue-400 transition-colors">
              <Link href="/profesionales">Profesionales</Link>
            </h2>
            <Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" />
          </div>
        </FadeIn>

        <span className="flex items-center gap-1 font-bold text-muted-foreground animate-bounce md:hidden -mb-8">
          <MdOutlineKeyboardDoubleArrowLeft /> Desliza <MdOutlineKeyboardDoubleArrowRight />
        </span>

        <FadeIn delay={0.2} className="w-full">
          <CarouselPlayers players={profesionales} />
        </FadeIn>

        <hr className="m-10 w-full border-slate-800" />

        {/* Sección Juveniles */}
        <FadeIn direction="up" distance={30}>
          <div id="juveniles" className="flex items-center gap-6" aria-labelledby="titulo-juveniles">
            <Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" />
            <h2 id="titulo-juveniles" className="text-3xl md:text-4xl font-semibold hover:text-blue-400 transition-colors">
              <Link href="/juveniles">Juveniles</Link>
            </h2>
            <Image src="/azul.png" alt="" width={40} height={40} aria-hidden="true" />
          </div>
        </FadeIn>

        <span className="flex items-center gap-1 font-bold text-muted-foreground animate-bounce md:hidden -mb-8">
          <MdOutlineKeyboardDoubleArrowLeft /> Desliza <MdOutlineKeyboardDoubleArrowRight />
        </span>

        <FadeIn delay={0.2} className="w-full">
          <CarouselPlayers players={juveniles} />
        </FadeIn>
      </section>
    </>
  );
}

