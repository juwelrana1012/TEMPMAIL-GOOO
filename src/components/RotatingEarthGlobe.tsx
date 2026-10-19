import React, { useEffect, useRef, useState } from 'react';

// Simplified continent landmasses (latitude, longitude in degrees)
const CONTINENTS: [number, number][][] = [
  // North America
  [
    [72, -165], [71, -130], [70, -85], [58, -60], [48, -53], [44, -66],
    [30, -81], [25, -80], [18, -95], [15, -92], [9, -79], [15, -96],
    [23, -107], [32, -117], [38, -123], [48, -125], [58, -140], [65, -168], [72, -165]
  ],
  // South America
  [
    [12, -73], [10, -62], [0, -50], [-5, -35], [-12, -37], [-23, -42],
    [-34, -53], [-48, -65], [-55, -68], [-52, -74], [-38, -73], [-18, -71],
    [-5, -81], [5, -77], [12, -73]
  ],
  // Europe
  [
    [71, 28], [68, 48], [60, 30], [54, 19], [45, 30], [40, 26],
    [36, -5], [43, -9], [48, -5], [53, 5], [58, 6], [62, 5], [71, 28]
  ],
  // Africa
  [
    [37, 10], [32, 32], [27, 34], [12, 44], [11, 51], [-5, 39],
    [-26, 33], [-34, 18], [-34, 25], [-16, 12], [4, 9], [6, 1],
    [5, -4], [15, -17], [21, -17], [33, -9], [36, 0], [37, 10]
  ],
  // Asia
  [
    [77, 105], [73, 140], [70, 178], [60, 165], [52, 142], [40, 130],
    [32, 122], [22, 114], [10, 106], [1, 104], [13, 100], [22, 89],
    [10, 78], [24, 68], [25, 57], [13, 48], [22, 38], [35, 36],
    [41, 29], [43, 40], [50, 52], [58, 60], [67, 75], [73, 80], [77, 105]
  ],
  // Australia
  [
    [-11, 142], [-17, 146], [-25, 153], [-37, 150], [-39, 144], [-35, 137],
    [-35, 118], [-31, 115], [-22, 114], [-15, 124], [-12, 133], [-11, 142]
  ],
  // Greenland
  [
    [82, -40], [83, -28], [76, -20], [65, -40], [60, -45], [70, -53], [78, -68], [82, -40]
  ],
  // UK
  [
    [58, -4], [56, -2], [51, 1], [50, -5], [54, -4], [58, -4]
  ],
  // Japan
  [
    [44, 145], [38, 141], [33, 131], [35, 136], [42, 141], [44, 145]
  ],
  // Antarctica (polar ice rim)
  [
    [-66, -160], [-66, -100], [-66, -40], [-66, 20], [-66, 80], [-66, 140], [-66, 180]
  ]
];

// Major global connectivity nodes (golden/amber radar dots)
const GLOBAL_NODES: [number, number][] = [
  [40.71, -74.00], // New York
  [51.50, -0.12],  // London
  [35.67, 139.65], // Tokyo
  [23.81, 90.41],  // Dhaka
  [-33.86, 151.20],// Sydney
  [-22.90, -43.17],// Rio de Janeiro
  [1.35, 103.81],  // Singapore
  [25.20, 55.27],  // Dubai
  [37.77, -122.41] // San Francisco
];

// Premium luxury jewel gold and crystal cyan styling for floating globe text
const BANNER_TEXT = "TEMPMAIL.GO";
const LETTER_COLORS = [
  { char: 'T', color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.75)' }, // Sky Blue
  { char: 'E', color: '#67E8F9', glow: 'rgba(103, 232, 249, 0.75)' }, // Cyan
  { char: 'M', color: '#7DD3FC', glow: 'rgba(125, 211, 252, 0.75)' }, // Light Sky
  { char: 'P', color: '#93C5FD', glow: 'rgba(147, 197, 253, 0.75)' }, // Soft Blue
  { char: 'M', color: '#C084FC', glow: 'rgba(192, 132, 252, 0.75)' }, // Purple
  { char: 'A', color: '#E879F9', glow: 'rgba(232, 121, 249, 0.75)' }, // Pink Orchid
  { char: 'I', color: '#F472B6', glow: 'rgba(244, 114, 182, 0.75)' }, // Rose
  { char: 'L', color: '#FCD34D', glow: 'rgba(252, 211, 77, 0.75)' },  // Gold
  { char: '.', color: '#38BDF8', glow: 'rgba(56, 189, 248, 0.8)' },  // Cyan dot
  { char: 'G', color: '#FDE047', glow: 'rgba(253, 224, 71, 0.8)' },  // Gold
  { char: 'O', color: '#FACC15', glow: 'rgba(250, 204, 21, 0.8)' },  // Amber Gold
];

interface RotatingEarthGlobeProps {
  className?: string;
  size?: number;
}

export const RotatingEarthGlobe: React.FC<RotatingEarthGlobeProps> = ({
  className,
  size = 72,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rotRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const pulseRef = useRef(0);

  // Rotation pause & text typewriter animation states
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCharsCount, setVisibleCharsCount] = useState(0);
  const [showFullBanner, setShowFullBanner] = useState(false);
  const isPausedRef = useRef(false);

  // Function to trigger the pause + letter-by-letter animation
  const triggerBannerAnimation = () => {
    if (isPausedRef.current) return;
    isPausedRef.current = true;
    setIsPaused(true);
    setVisibleCharsCount(0);
    setShowFullBanner(true);

    // Typewriter: letter-by-letter reveal (90ms per letter)
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      charIndex++;
      setVisibleCharsCount(charIndex);

      if (charIndex >= BANNER_TEXT.length) {
        clearInterval(typeInterval);

        // Keep the full text visible and glowing for exactly 2 seconds (2000ms per user request)
        setTimeout(() => {
          // Fade out the banner
          setShowFullBanner(false);

          // Resume rotation after banner fades
          setTimeout(() => {
            isPausedRef.current = false;
            setIsPaused(false);
            setVisibleCharsCount(0);
          }, 350);
        }, 2000);
      }
    }, 90);
  };

  // Periodic cycle: Trigger every 20 seconds (20,000ms) continuously
  useEffect(() => {
    // Initial trigger after 2 seconds so user sees it right away
    const initialTimer = setTimeout(() => {
      triggerBannerAnimation();
    }, 2000);

    // Recurring 20-second interval continuously
    const interval = setInterval(() => {
      triggerBannerAnimation();
    }, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Retina 2x resolution
    const actualSize = size;
    const dpr = window.devicePixelRatio || 2;
    canvas.width = actualSize * dpr;
    canvas.height = actualSize * dpr;
    canvas.style.width = `${actualSize}px`;
    canvas.style.height = `${actualSize}px`;

    const cx = (actualSize * dpr) / 2;
    const cy = (actualSize * dpr) / 2;
    const R = (actualSize * dpr) / 2 - 3 * dpr;
    const tilt = 0.38; // ~22 degree natural axial tilt

    let animId: number;

    const project = (latDeg: number, lonDeg: number, currentRot: number): [number, number, boolean] => {
      const phi = (latDeg * Math.PI) / 180;
      const lambda = (lonDeg * Math.PI) / 180 + currentRot;

      const x0 = Math.cos(phi) * Math.sin(lambda);
      const y0 = -Math.sin(phi);
      const z0 = Math.cos(phi) * Math.cos(lambda);

      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      const y1 = y0 * cosT - z0 * sinT;
      const z1 = y0 * sinT + z0 * cosT;
      const x1 = x0;

      const screenX = cx + x1 * R;
      const screenY = cy + y1 * R;
      const isVisible = z1 > 0;

      return [screenX, screenY, isVisible];
    };

    const render = () => {
      // Rotation logic: completely stops when isPausedRef is true
      if (!isDraggingRef.current && !isPausedRef.current) {
        rotRef.current += isHovered ? 0.016 : 0.010;
      }
      pulseRef.current += 0.05;

      const currentRot = rotRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Atmosphere Halo (Luminous Sky Blue Glow)
      const atmosGrad = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.08);
      atmosGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      atmosGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.25)');
      atmosGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
      ctx.fillStyle = atmosGrad;
      ctx.fill();

      // Clip strictly inside the globe sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // 2. Pure Ocean Blue Water Gradient (Natural Blue - NO black)
      const oceanGrad = ctx.createRadialGradient(
        cx - R * 0.35,
        cy - R * 0.35,
        R * 0.05,
        cx,
        cy,
        R
      );
      oceanGrad.addColorStop(0, '#38BDF8'); // Sunlit azure tropical blue
      oceanGrad.addColorStop(0.35, '#0284C7'); // Vibrant celestial ocean blue
      oceanGrad.addColorStop(0.75, '#0369A1'); // Rich sapphire deep blue
      oceanGrad.addColorStop(1, '#075985');    // Natural oceanic horizon (clean blue, not black)
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Subtle Latitude & Longitude Coordinate Grids (Light Cyan)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.lineWidth = 0.7 * dpr;

      // Parallels (Latitudes)
      const latSteps = [-60, -30, 0, 30, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 8) {
          const [px, py, vis] = project(lat, lon, currentRot);
          if (vis) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      });

      // Meridians (Longitudes)
      for (let lon = 0; lon < 360; lon += 45) {
        ctx.beginPath();
        let started = false;
        for (let lat = -80; lat <= 80; lat += 8) {
          const [px, py, vis] = project(lat, lon, currentRot);
          if (vis) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // 4. Lush Green Continents (Natural Vibrant Green)
      CONTINENTS.forEach((poly) => {
        ctx.beginPath();
        let visibleCount = 0;
        let started = false;

        poly.forEach(([lat, lon]) => {
          const [px, py, vis] = project(lat, lon, currentRot);
          if (vis) {
            visibleCount++;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          }
        });

        if (visibleCount > 2) {
          ctx.closePath();
          // Vibrant forest / emerald green landmass fill
          ctx.fillStyle = '#16A34A';
          ctx.fill();
          // Crisp, sunny green coastline border
          ctx.strokeStyle = '#4ADE80';
          ctx.lineWidth = 1.1 * dpr;
          ctx.stroke();
        }
      });

      // 5. Global Connectivity Radar Blinking Dots
      const pulseSize = (Math.sin(pulseRef.current) + 1) / 2;
      GLOBAL_NODES.forEach(([lat, lon]) => {
        const [px, py, vis] = project(lat, lon, currentRot);
        if (vis) {
          ctx.beginPath();
          ctx.arc(px, py, (1.8 + pulseSize * 3) * dpr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 230, 0, ${0.85 - pulseSize * 0.7})`;
          ctx.lineWidth = 0.9 * dpr;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(px, py, 1.3 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = '#FDE047';
          ctx.fill();
        }
      });

      // 6. Natural 3D Sunlit Sphere Shading (NO Black, purely soft transparent depth)
      const shadowGrad = ctx.createRadialGradient(
        cx + R * 0.45,
        cy + R * 0.4,
        R * 0.3,
        cx,
        cy,
        R
      );
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      shadowGrad.addColorStop(0.7, 'rgba(3, 105, 161, 0.25)'); // deep blue shadow
      shadowGrad.addColorStop(1, 'rgba(12, 74, 110, 0.45)');   // soft oceanic twilight
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sunlight Specular Reflection (Top-Left)
      const sunGrad = ctx.createRadialGradient(
        cx - R * 0.4,
        cy - R * 0.4,
        0,
        cx - R * 0.4,
        cy - R * 0.4,
        R * 0.65
      );
      sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)');
      sunGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.12)');
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();

      // 7. Outer Glass Rim Ring
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 1.3 * dpr;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHovered]);

  // Pointer drag for manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    rotRef.current += deltaX * 0.02;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      className={className || "relative mx-auto flex items-center justify-center select-none touch-none"}
      title="Interactive 3D Earth - Click to preview TEMPMAIL.GO animation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={triggerBannerAnimation}
    >
      <div className="relative group cursor-grab active:cursor-grabbing">
        {/* ============================================================= */}
        {/* ANIMATED FLOATING TEXT: TEMPMAIL.GO (CENTERED ACROSS MIDDLE) */}
        {/* ============================================================= */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none z-50 whitespace-nowrap ${
            showFullBanner
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-0.5 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.4),0_6px_16px_rgba(0,0,0,0.5)]">
            {LETTER_COLORS.map((item, idx) => {
              const isCharVisible = idx < visibleCharsCount;
              return (
                <span
                  key={`char-${idx}`}
                  className="inline-block font-black text-[11px] sm:text-[12px] tracking-tight transition-all duration-150 transform"
                  style={{
                    color: item.color,
                    textShadow: isCharVisible ? `0 0 10px ${item.glow}` : 'none',
                    opacity: isCharVisible ? 1 : 0,
                    transform: isCharVisible ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(-2px)',
                  }}
                >
                  {item.char}
                </span>
              );
            })}
          </div>
        </div>

        {/* The 3D Canvas Globe (Vibrant Blue & Green Earth) */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative rounded-full shadow-md shadow-sky-900/20 block transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>
  );
};
