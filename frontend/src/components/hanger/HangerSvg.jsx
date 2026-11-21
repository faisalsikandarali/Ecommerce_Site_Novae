import React from 'react';

export const HangerSvg = ({ className = "w-full", variant = "wood" }) => {
  const isWood = variant === "wood";
  
  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 320 85"
        className="w-full h-auto drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic hook gradient */}
          <linearGradient id="metalHookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#997b19" />
            <stop offset="100%" stopColor="#4a3b0a" />
          </linearGradient>

          {/* Luxury Wood shoulder gradient */}
          <linearGradient id="woodShoulderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5cbb3" />
            <stop offset="30%" stopColor="#b8895b" />
            <stop offset="75%" stopColor="#87582b" />
            <stop offset="100%" stopColor="#573618" />
          </linearGradient>

          {/* Minimalist Matte Black option */}
          <linearGradient id="blackMatteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="60%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>

        {/* Hanger Hook that loops over the rail */}
        <path
          d="M 160 42 C 160 30, 160 20, 155 12 C 151 5, 142 3, 137 7 C 131 12, 133 22, 137 25"
          stroke="url(#metalHookGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Swivel Brass Collar */}
        <ellipse cx="160" cy="42" rx="4.5" ry="3" fill="#d4af37" />

        {/* Contoured Coat Hanger Shoulders */}
        <path
          d="M 160 43 
             C 140 46, 70 57, 10 70 
             C 5 71, 2 76, 5 80 
             C 8 83, 15 82, 22 79 
             L 160 52 
             L 298 79 
             C 305 82, 312 83, 315 80 
             C 318 76, 315 71, 310 70 
             C 250 57, 180 46, 160 43 Z"
          fill={isWood ? "url(#woodShoulderGrad)" : "url(#blackMatteGrad)"}
          stroke="#422813"
          strokeWidth="0.8"
        />

        {/* Subdued Brand Embossing on Hanger Neck */}
        <text
          x="160"
          y="49"
          fontSize="4.5"
          fontWeight="700"
          letterSpacing="1.5"
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.45)"
          fontFamily="sans-serif"
        >
          NOVAÉ
        </text>
      </svg>
    </div>
  );
};
