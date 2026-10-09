import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Salad,
  Soup,
  Carrot,
  Wheat,
  ChefHat,
  Leaf,
  Sparkles,
  Pizza,
  Coffee,
} from 'lucide-react';
import culinaryFoodBg from '../../assets/images/culinary_food_bg_1791538569666.jpg';

interface EarthyAnimatedBackgroundProps {
  className?: string;
  variant?: 'hero' | 'subtle' | 'section';
  interactive?: boolean;
  children?: React.ReactNode;
}

interface ClickPing {
  id: number;
  x: number;
  y: number;
  iconIndex: number;
}

export const EarthyAnimatedBackground: React.FC<EarthyAnimatedBackgroundProps> = ({
  className = '',
  variant = 'hero',
  interactive = true,
  children,
}) => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [clickPings, setClickPings] = useState<ClickPing[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newPing: ClickPing = {
      id: Date.now(),
      x,
      y,
      iconIndex: Math.floor(Math.random() * 5),
    };
    setClickPings((prev) => [...prev.slice(-5), newPing]);
  };

  // Watermark culinary floating icons for rich food app depth
  const ambientFoodIcons = [
    { Icon: Wheat, top: '22%', left: '4%', size: 'w-7 h-7', color: 'text-amber-400/35', anim: 'animate-float-gentle' },
    { Icon: ChefHat, top: '16%', right: '28%', size: 'w-8 h-8', color: 'text-purple-400/30', anim: 'animate-float-reverse' },
    { Icon: Carrot, top: '55%', left: '2%', size: 'w-7 h-7', color: 'text-orange-400/35', anim: 'animate-float-sway' },
    { Icon: Leaf, top: '75%', left: '24%', size: 'w-6 h-6', color: 'text-emerald-400/35', anim: 'animate-float-gentle' },
    { Icon: Pizza, top: '38%', right: '4%', size: 'w-8 h-8', color: 'text-rose-400/30', anim: 'animate-float-reverse' },
    { Icon: Coffee, top: '82%', right: '26%', size: 'w-6 h-6', color: 'text-amber-600/25', anim: 'animate-float-sway' },
    { Icon: UtensilsCrossed, top: '6%', left: '42%', size: 'w-7 h-7', color: 'text-indigo-400/30', anim: 'animate-float-gentle' },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {/* 
        Appetizing Food Background Layer:
        Combines fresh food photography backdrop, organic warm culinary glow,
        interactive mouse-reactive spotlight, and floating food watermarks.
      */}
      <div
        className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* 1. Base clean warm culinary canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9] via-[#FAF5FF]/60 to-[#F0FDF4]/50" />

        {/* 2. Appetizing Culinary Food Photographic Underlay with Soft Vignette */}
        <div
          className="absolute inset-0 opacity-[0.22] mix-blend-multiply bg-center bg-cover transition-opacity duration-700 pointer-events-none"
          style={{
            backgroundImage: `url(${culinaryFoodBg})`,
            filter: 'contrast(1.08) saturate(1.15)',
            maskImage:
              'radial-gradient(ellipse 95% 85% at 50% 45%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 95% 85% at 50% 45%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 65%, transparent 100%)',
          }}
        />

        {/* 3. Soft Warm Culinary Color Blooms (Honey Butter, Mint Sage, Peach Nectar, Strawberry Rose) */}
        {/* Honey Butter Glow - Top Left */}
        <div
          className="absolute -top-[10%] -left-[8%] w-[58vw] h-[58vw] max-w-[760px] max-h-[760px] rounded-full filter blur-[95px] animate-drift-1 opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 240, 138, 0.45) 0%, rgba(254, 249, 195, 0.25) 45%, transparent 75%)',
          }}
        />

        {/* Fresh Mint & Herb Green Glow - Top Right */}
        <div
          className="absolute top-[5%] -right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full filter blur-[90px] animate-drift-2 opacity-50"
          style={{
            background:
              'radial-gradient(circle, rgba(167, 243, 208, 0.45) 0%, rgba(209, 250, 229, 0.2) 45%, transparent 75%)',
          }}
        />

        {/* Warm Peach & Terracotta Glow - Center */}
        <div
          className="absolute top-[35%] left-[25%] w-[48vw] h-[48vw] max-w-[620px] max-h-[620px] rounded-full filter blur-[100px] animate-drift-4 opacity-45"
          style={{
            background:
              'radial-gradient(circle, rgba(254, 215, 170, 0.4) 0%, rgba(255, 237, 213, 0.18) 45%, transparent 75%)',
          }}
        />

        {/* Soft Lavender & Rose Glow - Bottom Left */}
        <div
          className="absolute -bottom-[12%] left-[5%] w-[52vw] h-[52vw] max-w-[680px] max-h-[680px] rounded-full filter blur-[95px] animate-drift-3 opacity-45"
          style={{
            background:
              'radial-gradient(circle, rgba(221, 214, 254, 0.4) 0%, rgba(254, 205, 211, 0.22) 45%, transparent 75%)',
          }}
        />

        {/* 4. Ambient Floating Watermark Culinary Icons */}
        {ambientFoodIcons.map((item, idx) => {
          const { Icon, size, color, anim, ...stylePos } = item;
          return (
            <div
              key={idx}
              style={stylePos}
              className={`absolute ${size} ${color} ${anim} pointer-events-none hidden sm:block transition-all`}
            >
              <Icon className="w-full h-full" />
            </div>
          );
        })}

        {/* 5. Subtle Repeating Culinary Motif Tile Pattern */}
        {variant !== 'subtle' && (
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350F' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M8 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm24 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM20 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm16 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 38a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm36-16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '36px 36px',
            }}
          />
        )}

        {/* 6. Interactive Cursor Warm Food Aura Spotlight */}
        {interactive && mousePos && (
          <div
            className="absolute rounded-full pointer-events-none transition-transform duration-75 ease-out"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              width: '420px',
              height: '420px',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(254, 215, 170, 0.45) 0%, rgba(187, 247, 208, 0.25) 35%, rgba(221, 214, 254, 0.15) 55%, transparent 75%)',
              filter: 'blur(32px)',
            }}
          />
        )}

        {/* 7. Interactive Click Ripples with Food Sparkles */}
        {clickPings.map((ping) => (
          <div
            key={ping.id}
            style={{
              left: `${ping.x}px`,
              top: `${ping.y}px`,
            }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <div className="w-16 h-16 rounded-full border-2 border-amber-400/80 bg-amber-100/30 animate-ping" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Content wrapper with relative z-10 for crisp readability */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
