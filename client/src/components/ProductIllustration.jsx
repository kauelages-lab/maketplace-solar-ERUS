import React from 'react';

export default function ProductIllustration({ type, className = '' }) {
  const getSvg = () => {
    switch (type) {
      case 'pile':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D97706" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#78350F" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <rect x="20" y="85" width="120" height="25" rx="4" fill="url(#soilGrad)" />
            <path d="M25 85 Q 80 82, 135 85" stroke="#B45309" strokeWidth="2" strokeDasharray="3 3"/>
            <rect x="68" y="20" width="24" height="65" rx="3" fill="url(#pileGrad)" />
            <path d="M64 85 L80 110 L96 85 Z" fill="#334155" />
            <path d="M68 35 H92 M68 50 H92 M68 65 H92" stroke="#CBD5E1" strokeWidth="2" />
            <circle cx="80" cy="27" r="4" fill="#F59E0B" />
          </svg>
        );

      case 'post':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="45" y="98" width="70" height="12" rx="3" fill="#64748B" />
            <rect x="70" y="25" width="20" height="75" fill="#475569" />
            <rect x="66" y="15" width="28" height="12" rx="2" fill="#F97316" />
            <circle cx="80" cy="21" r="3" fill="#FFFFFF" />
            <path d="M72 40 L88 40 M72 60 L88 60 M72 80 L88 80" stroke="#94A3B8" strokeWidth="2" />
            <line x1="50" y1="98" x2="70" y2="70" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="110" y1="98" x2="90" y2="70" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'torque_tube':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tubeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0369A1" />
              </linearGradient>
            </defs>
            <rect x="15" y="45" width="130" height="30" rx="6" fill="url(#tubeGrad)" />
            <ellipse cx="25" cy="60" rx="8" ry="15" fill="#075985" />
            <ellipse cx="140" cy="60" rx="8" ry="15" fill="#BAE6FD" opacity="0.8" />
            <path d="M50 45 L50 75 M80 45 L80 75 M110 45 L110 75" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
            {/* Rotation arrow */}
            <path d="M70 28 A 20 20 0 0 1 95 28" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <polygon points="98,28 92,23 92,33" fill="#F59E0B" />
          </svg>
        );

      case 'bearing':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="85" width="90" height="15" rx="4" fill="#334155" />
            <circle cx="80" cy="55" r="32" fill="#475569" stroke="#0F172A" strokeWidth="4" />
            <circle cx="80" cy="55" r="20" fill="#E2E8F0" />
            <circle cx="80" cy="55" r="10" fill="#0284C7" />
            <circle cx="80" cy="40" r="3.5" fill="#F59E0B" />
            <circle cx="95" cy="55" r="3.5" fill="#F59E0B" />
            <circle cx="80" cy="70" r="3.5" fill="#F59E0B" />
            <circle cx="65" cy="55" r="3.5" fill="#F59E0B" />
          </svg>
        );

      case 'rail':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="30" width="120" height="14" rx="2" fill="#0EA5E9" />
            <rect x="20" y="70" width="120" height="14" rx="2" fill="#0EA5E9" />
            <rect x="45" y="20" width="12" height="75" rx="2" fill="#475569" />
            <rect x="105" y="20" width="12" height="75" rx="2" fill="#475569" />
            <circle cx="51" cy="37" r="3" fill="#F59E0B" />
            <circle cx="111" cy="37" r="3" fill="#F59E0B" />
            <circle cx="51" cy="77" r="3" fill="#F59E0B" />
            <circle cx="111" cy="77" r="3" fill="#F59E0B" />
          </svg>
        );

      case 'clamp':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45 40 H115 V55 H95 V85 H65 V55 H45 Z" fill="#64748B" stroke="#334155" strokeWidth="2" />
            <rect x="73" y="20" width="14" height="22" rx="2" fill="#F59E0B" />
            <line x1="80" y1="20" x2="80" y2="40" stroke="#B45309" strokeWidth="2" />
            <line x1="75" y1="25" x2="85" y2="25" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="30" y="55" width="25" height="8" rx="1" fill="#38BDF8" opacity="0.6" />
            <rect x="105" y="55" width="25" height="8" rx="1" fill="#38BDF8" opacity="0.6" />
          </svg>
        );

      case 'joint':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="80" cy="60" r="24" fill="#334155" />
            <circle cx="80" cy="60" r="14" fill="#F97316" />
            <line x1="30" y1="60" x2="65" y2="60" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
            <line x1="95" y1="60" x2="130" y2="60" stroke="#64748B" strokeWidth="8" strokeLinecap="round" />
            <line x1="80" y1="25" x2="80" y2="45" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
            <line x1="80" y1="75" x2="80" y2="95" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />
            <circle cx="80" cy="60" r="5" fill="#FFFFFF" />
          </svg>
        );

      case 'actuator':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="cylGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect x="25" y="42" width="75" height="36" rx="6" fill="url(#cylGrad)" />
            <rect x="98" y="50" width="45" height="20" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="140" cy="60" r="6" fill="#F59E0B" />
            <circle cx="28" cy="60" r="6" fill="#F59E0B" />
            <rect x="35" y="30" width="35" height="15" rx="3" fill="#EA580C" />
            <path d="M102 55 L132 55 M102 65 L132 65" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 2" />
          </svg>
        );

      case 'motor':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="65" cy="60" r="35" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <circle cx="65" cy="60" r="20" fill="#0284C7" />
            <rect x="85" y="45" width="45" height="30" rx="4" fill="#F97316" />
            <line x1="90" y1="45" x2="90" y2="75" stroke="#EA580C" strokeWidth="2" />
            <line x1="100" y1="45" x2="100" y2="75" stroke="#EA580C" strokeWidth="2" />
            <line x1="110" y1="45" x2="110" y2="75" stroke="#EA580C" strokeWidth="2" />
            <circle cx="65" cy="60" r="6" fill="#FFFFFF" />
          </svg>
        );

      case 'screw':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="50" width="110" height="20" rx="3" fill="#CBD5E1" />
            <path d="M35 50 L45 70 M50 50 L60 70 M65 50 L75 70 M80 50 L90 70 M95 50 L105 70 M110 50 L120 70" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <rect x="15" y="45" width="14" height="30" rx="3" fill="#F97316" />
          </svg>
        );

      case 'tcu':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="20" width="90" height="80" rx="8" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
            <rect x="47" y="32" width="66" height="30" rx="4" fill="#0284C7" />
            <text x="52" y="52" fill="#E0F2FE" fontSize="9" fontFamily="monospace" fontWeight="bold">SPA 48.5°</text>
            <circle cx="55" cy="78" r="5" fill="#22C55E" />
            <circle cx="75" cy="78" r="5" fill="#F59E0B" />
            <circle cx="95" cy="78" r="5" fill="#EF4444" />
            <line x1="80" y1="100" x2="80" y2="112" stroke="#64748B" strokeWidth="4" />
          </svg>
        );

      case 'anemometer':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="80" y1="50" x2="80" y2="105" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <circle cx="80" cy="50" r="8" fill="#F97316" />
            <path d="M80 50 L45 35" stroke="#334155" strokeWidth="3" />
            <circle cx="45" cy="35" r="9" fill="#0EA5E9" />
            <path d="M80 50 L115 35" stroke="#334155" strokeWidth="3" />
            <circle cx="115" cy="35" r="9" fill="#0EA5E9" />
            <path d="M80 50 L80 18" stroke="#334155" strokeWidth="3" />
            <circle cx="80" cy="18" r="9" fill="#0EA5E9" />
            {/* wind curls */}
            <path d="M100 80 Q 115 75 125 80" stroke="#38BDF8" strokeWidth="2" fill="none" strokeDasharray="3 3"/>
            <path d="M30 75 Q 45 70 55 75" stroke="#38BDF8" strokeWidth="2" fill="none" strokeDasharray="3 3"/>
          </svg>
        );

      case 'inclinometer':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="25" width="80" height="70" rx="8" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="80" cy="55" r="22" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
            <line x1="80" y1="55" x2="95" y2="45" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
            <circle cx="80" cy="55" r="4" fill="#FFFFFF" />
            <text x="65" y="86" fill="#38BDF8" fontSize="8" fontFamily="monospace">+/- 60°</text>
          </svg>
        );

      case 'limit_switch':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="50" y="45" width="60" height="50" rx="5" fill="#334155" />
            <circle cx="80" cy="70" r="10" fill="#EF4444" />
            <rect x="74" y="20" width="12" height="25" rx="2" fill="#94A3B8" />
            <circle cx="80" cy="20" r="7" fill="#F59E0B" />
          </svg>
        );

      case 'ups':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="25" width="80" height="70" rx="6" fill="#1E293B" stroke="#22C55E" strokeWidth="2" />
            <path d="M80 38 L72 54 H82 L76 72 L90 52 H80 Z" fill="#F59E0B" />
            <rect x="52" y="80" width="56" height="6" rx="2" fill="#22C55E" />
          </svg>
        );

      case 'pv_panel':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="20" width="90" height="80" rx="4" fill="#0284C7" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="35" y1="46" x2="125" y2="46" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="35" y1="73" x2="125" y2="73" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="65" y1="20" x2="65" y2="100" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="95" y1="20" x2="95" y2="100" stroke="#FFFFFF" strokeWidth="1.5" />
            {/* Sun flare */}
            <circle cx="120" cy="25" r="12" fill="#F59E0B" opacity="0.8" />
            <circle cx="120" cy="25" r="7" fill="#FDE047" />
          </svg>
        );

      case 'inverter':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="45" y="25" width="70" height="70" rx="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            <rect x="55" y="35" width="50" height="22" rx="3" fill="#0F172A" />
            <text x="60" y="50" fill="#22C55E" fontSize="9" fontFamily="monospace">98.5% MPPT</text>
            <circle cx="62" cy="72" r="4" fill="#22C55E" />
            <circle cx="80" cy="72" r="4" fill="#0284C7" />
            <circle cx="98" cy="72" r="4" fill="#F59E0B" />
            <line x1="55" y1="84" x2="105" y2="84" stroke="#CBD5E1" strokeWidth="2" />
          </svg>
        );

      case 'string_box':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="42" y="20" width="76" height="80" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="3" />
            <rect x="52" y="32" width="22" height="35" rx="3" fill="#EF4444" />
            <rect x="84" y="32" width="24" height="35" rx="3" fill="#0284C7" />
            <path d="M63 42 L63 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <path d="M96 42 L96 56" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="85" r="4" fill="#F59E0B" />
          </svg>
        );

      case 'cables':
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="65" rx="45" ry="25" fill="none" stroke="#DC2626" strokeWidth="7" />
            <ellipse cx="80" cy="55" rx="45" ry="25" fill="none" stroke="#0F172A" strokeWidth="7" />
            <circle cx="125" cy="55" r="5" fill="#F59E0B" />
            <circle cx="35" cy="65" r="5" fill="#F59E0B" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 160 120" className="illust-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="25" width="90" height="70" rx="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="80" cy="60" r="18" fill="#F97316" />
          </svg>
        );
    }
  };

  return (
    <div className={`product-illustration-wrapper ${className}`}>
      {getSvg()}
    </div>
  );
}
