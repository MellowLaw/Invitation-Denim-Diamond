import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Particles from './components/reactbits/Particles';
import ClickSpark from './components/reactbits/ClickSpark';
import OpeningPocket from './components/OpeningPocket';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import VenueSection from './components/VenueSection';
import DressCodeSection from './components/DressCodeSection';
import ProgramSection from './components/ProgramSection';
import RsvpSection from './components/RsvpSection';
import FloatingChrome from './components/FloatingChrome';
import { reunionAudio } from './utils/audioEngine';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [pocketOpen, setPocketOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.09,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (!pocketOpen) {
      lenis.stop();
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pocketOpen) return;
    lenisRef.current?.start();
    const id1 = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    const id2 = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => {
      window.clearTimeout(id1);
      window.clearTimeout(id2);
    };
  }, [pocketOpen]);

  useEffect(() => {
    return () => {
      reunionAudio.stop();
    };
  }, []);

  const handleOpenPocket = async (withMusic: boolean) => {
    setPocketOpen(true);
    if (withMusic) {
      await reunionAudio.start();
      setMusicPlaying(reunionAudio.isPlaying());
    }
  };

  const handleToggleMusic = async () => {
    const next = await reunionAudio.toggle();
    setMusicPlaying(next);
  };

  return (
    <ClickSpark sparkColor={['#ffffff', '#9ec5ff', '#d4b483']} shape="star" sparkCount={10}>
      <div className="relative min-h-screen overflow-x-clip bg-[#0c172b] text-[#f4f6fb]">
        {/* Ambient Sparkle Dust Floating Gently Over All Sections */}
        <div className="pointer-events-none fixed inset-0 z-30">
          <Particles
            particleCount={isMobile ? 28 : 54}
            shape="sparkle"
            particleColors={['#ffffff', '#d7e6ff', '#9ec5ff', '#f3d69c']}
            particleBaseSize={isMobile ? 42 : 48}
            twinkle={0.75}
            opacity={0.55}
            speed={0.07}
          />
        </div>

        {/* Act 0: Borderless Living Collage Opening Curtain */}
        {!pocketOpen && <OpeningPocket onOpened={handleOpenPocket} />}

        {/* Main Flowing Invitation Content (Each Section Has Its Own Distinct Seamless Background) */}
        <main
          aria-hidden={!pocketOpen}
          className={
            pocketOpen
              ? 'relative z-10 overflow-x-clip opacity-100 transition-opacity duration-500'
              : 'pointer-events-none fixed inset-0 z-10 overflow-hidden opacity-0'
          }
        >
          <HeroSection isMobile={isMobile} active={pocketOpen} />
          <StorySection />
          <VenueSection />
          <DressCodeSection />
          <ProgramSection active={pocketOpen} />
          <RsvpSection />
        </main>

        {/* Persistent Floating Vinyl Music Toggle & Quick Attendance Link */}
        {pocketOpen && <FloatingChrome playing={musicPlaying} onToggleMusic={handleToggleMusic} />}
      </div>
    </ClickSpark>
  );
}
