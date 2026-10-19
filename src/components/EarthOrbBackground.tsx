import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
  color: string;
}

interface AuroraParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export const EarthOrbBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Parallax tracking: smoothly lerps to window.scrollY
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    // Stars in deep space
    const stars: Star[] = [];
    const starCount = Math.floor(Math.min(width * height * 0.00018, 140));
    const starColors = ['#FFFFFF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#FDE047', '#A7F3D0'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.65 + 0.25,
        twinkleSpeed: Math.random() * 2.5 + 1.0,
        phase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Interactive atmospheric stardust particles on pointer
    const particles: AuroraParticle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    let lastPointerX = 0;
    let lastPointerY = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (Math.hypot(clientX - lastPointerX, clientY - lastPointerY) > 20) {
        lastPointerX = clientX;
        lastPointerY = clientY;

        if (particles.length < 35) {
          particles.push({
            x: clientX,
            y: clientY,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.4,
            radius: Math.random() * 3 + 1.5,
            alpha: 0.75,
            color: Math.random() > 0.5 ? '#38BDF8' : '#34D399',
          });
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let t = 0;

    const render = (time: number) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      t = time * 0.001;

      // Smooth scroll lerp for the orbital gliding effect
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      // 1. DEEP RICH COSMIC SPACE BACKGROUND (Darker, more saturated tone)
      // Radiant deep violet-indigo-sapphire cosmic gradient
      const spaceGrad = ctx.createLinearGradient(0, 0, width, height);
      spaceGrad.addColorStop(0, '#020309'); // Deepest Cosmic Abyss
      spaceGrad.addColorStop(0.3, '#07051C'); // Deep Midnight Violet
      spaceGrad.addColorStop(0.65, '#0B0A29'); // Deep Royal Indigo
      spaceGrad.addColorStop(1, '#061330'); // Deep Oceanic Sapphire
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. VIBRANT DEEP AURORA & NEBULA AURA GLOWS
      // Rich deep violet and electric cyan/emerald clouds that make colors pop
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Deep Purple / Violet Aura top-right
      const neb1 = ctx.createRadialGradient(
        width * 0.75 + Math.sin(t * 0.2) * 40,
        height * 0.25 - (currentScrollY * 0.06),
        40,
        width * 0.75,
        height * 0.25 - (currentScrollY * 0.06),
        width * 0.65
      );
      neb1.addColorStop(0, 'rgba(124, 58, 237, 0.28)'); // Vivid Violet
      neb1.addColorStop(0.45, 'rgba(99, 102, 241, 0.16)'); // Royal Indigo
      neb1.addColorStop(0.8, 'rgba(30, 27, 75, 0.08)');
      neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      // Deep Electric Cyan / Sapphire Aura middle-left
      const neb2 = ctx.createRadialGradient(
        width * 0.2 - Math.cos(t * 0.18) * 35,
        height * 0.6 - (currentScrollY * 0.08),
        50,
        width * 0.2,
        height * 0.6 - (currentScrollY * 0.08),
        width * 0.6
      );
      neb2.addColorStop(0, 'rgba(14, 165, 233, 0.24)'); // Vibrant Sky Blue
      neb2.addColorStop(0.5, 'rgba(16, 185, 129, 0.12)'); // Emerald Aurora
      neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // Warm Radiant Magenta / Orchid accent in deep space
      const neb3 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.15) * 60,
        height * 0.85 - (currentScrollY * 0.05),
        30,
        width * 0.5,
        height * 0.85 - (currentScrollY * 0.05),
        width * 0.5
      );
      neb3.addColorStop(0, 'rgba(168, 85, 247, 0.18)'); // Deep Orchid
      neb3.addColorStop(0.6, 'rgba(59, 130, 246, 0.08)');
      neb3.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb3;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      // 3. TWINKLING STARS IN SPACE
      stars.forEach((star) => {
        const twinkle = Math.sin(t * star.twinkleSpeed + star.phase) * 0.35 + 0.65;
        const alpha = Math.min(1, Math.max(0.1, star.baseAlpha * twinkle));

        // Parallax star shift
        const py = (star.y - currentScrollY * 0.06 + height) % height;

        ctx.save();
        ctx.beginPath();
        ctx.arc(star.x, py, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
        ctx.fill();
        ctx.restore();
      });

      // 4. PLANET EARTH HORIZON (Radiant, curved, glowing atmosphere)
      // The Earth's curvature is placed in the lower/middle section, scrolling with parallax
      // As the user scrolls, the Earth smoothly shifts, creating the feeling that the website is flying over Earth!
      const earthCenterX = width * 0.5 + Math.sin(t * 0.08) * 20;
      const scrollShift = (currentScrollY * 0.18) % (height * 0.6);
      const earthCenterY = height * 1.15 + (height * 0.1) - scrollShift;
      const earthRadius = Math.max(width, height) * 0.95;

      ctx.save();

      // A. Earth Atmosphere Outer Halo (Radiant Electric Blue & Cyan Aura)
      ctx.globalCompositeOperation = 'screen';
      const haloGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius * 0.82,
        earthCenterX,
        earthCenterY,
        earthRadius * 1.22
      );
      haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      haloGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.28)');
      haloGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.15)');
      haloGrad.addColorStop(0.9, 'rgba(16, 185, 129, 0.08)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius * 1.22, 0, Math.PI * 2);
      ctx.fill();

      // B. Earth Body (Deep Oceanic Blues, vibrant & glowing)
      ctx.globalCompositeOperation = 'source-over';
      const earthGrad = ctx.createRadialGradient(
        earthCenterX - width * 0.15,
        earthCenterY - earthRadius * 0.65,
        earthRadius * 0.1,
        earthCenterX,
        earthCenterY,
        earthRadius
      );
      earthGrad.addColorStop(0, '#00A3FF'); // Bright Sunlit Ocean
      earthGrad.addColorStop(0.25, '#0267D2'); // Azure Tropical Seas
      earthGrad.addColorStop(0.55, '#013D8B'); // Deep Ocean Trench
      earthGrad.addColorStop(0.82, '#031F58'); // Twilight Sea
      earthGrad.addColorStop(1, '#020C28'); // Dark Limb of Earth

      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // C. Continental Landmass Silhouettes (Lush Emerald & Turquoise Greenery from space)
      ctx.globalCompositeOperation = 'screen';
      const continents = [
        // Continent 1: Left Pacific / Asia Coast
        {
          x: earthCenterX - width * 0.42 + Math.sin(t * 0.05) * 12,
          y: earthCenterY - earthRadius * 0.78,
          w: width * 0.38,
          h: height * 0.32,
          color: 'rgba(16, 185, 129, 0.38)',
        },
        // Continent 2: Center Americas / Islands
        {
          x: earthCenterX - width * 0.08 + Math.cos(t * 0.04) * 15,
          y: earthCenterY - earthRadius * 0.88,
          w: width * 0.45,
          h: height * 0.36,
          color: 'rgba(52, 211, 153, 0.32)',
        },
        // Continent 3: Right Coast / Australia / Archipelago
        {
          x: earthCenterX + width * 0.28 - Math.sin(t * 0.06) * 10,
          y: earthCenterY - earthRadius * 0.75,
          w: width * 0.35,
          h: height * 0.28,
          color: 'rgba(45, 212, 191, 0.35)',
        },
      ];

      continents.forEach((cont) => {
        const contGrad = ctx.createRadialGradient(
          cont.x + cont.w * 0.5,
          cont.y + cont.h * 0.5,
          10,
          cont.x + cont.w * 0.5,
          cont.y + cont.h * 0.5,
          cont.w * 0.6
        );
        contGrad.addColorStop(0, cont.color);
        contGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.22)');
        contGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = contGrad;
        ctx.beginPath();
        ctx.ellipse(
          cont.x + cont.w * 0.5,
          cont.y + cont.h * 0.5,
          cont.w * 0.5,
          cont.h * 0.4,
          0.15,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // D. Swirling Cloud Patterns (Translucent white/cyan atmospheric storms)
      for (let i = 0; i < 3; i++) {
        const cx = earthCenterX + Math.sin(t * 0.06 + i * 2) * (width * 0.3);
        const cy = earthCenterY - earthRadius * (0.85 - i * 0.08);
        const cloudGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.28);
        cloudGrad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
        cloudGrad.addColorStop(0.4, 'rgba(224, 242, 254, 0.16)');
        cloudGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.05)');
        cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, width * 0.32, height * 0.08, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // E. Radiant Ozone Rim: The bright, thin, glowing cyan line marking the atmosphere edge
      const rimGrad = ctx.createRadialGradient(
        earthCenterX,
        earthCenterY,
        earthRadius - 12,
        earthCenterX,
        earthCenterY,
        earthRadius + 18
      );
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)'); // Pure sunlight rim
      rimGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.95)'); // Cyan ozone
      rimGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.65)'); // Deep blue air
      rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(earthCenterX, earthCenterY, earthRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 5. INTERACTIVE AURORA PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.016;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block transform-gpu"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Fluid atmospheric aura gradients matching video's glowing ambience in deeper richer tones */}
      <div className="absolute top-[8%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-violet-600/30 via-purple-700/20 to-transparent blur-[120px] pointer-events-none animate-aura-breathe" />
      <div className="absolute top-[42%] left-[-12%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-cyan-600/25 via-blue-600/18 to-transparent blur-[110px] pointer-events-none animate-aura-breathe" style={{ animationDelay: '-6s' }} />
      <div className="absolute bottom-[2%] right-[5%] w-[60vw] h-[40vw] rounded-full bg-gradient-to-t from-indigo-700/30 via-purple-900/20 to-transparent blur-[130px] pointer-events-none" />

      {/* Deep cosmic vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020309]/15 to-[#020309]/50 pointer-events-none" />
    </div>
  );
};
