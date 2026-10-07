import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Trees, Home, Droplets, Compass } from 'lucide-react';

interface InteractiveLandscapeModelProps {
  sliderLandscapeLiving: number; // 0 = 100% landschap, 100 = 100% wonen (controls 8 to 14 homes)
  sliderScale: number; // 0 = losse schuurwoningen, 100 = samenhangende dorpswand
  sliderTypology: number; // 0 = collectief hof met boomgaard, 100 = individuele tuinen met hagen
  sliderGreenBuilding: number; // 0 = forse wadi & houtwal, 100 = compacte waterloop
}

interface HoverInfo {
  title: string;
  category: string;
  description: string;
  x: number;
  y: number;
}

// 2.5D House definition
interface HouseDef {
  id: string;
  name: string;
  type: 'schuurwoning' | 'hofwoning' | 'langgevel' | 'hoekwoning' | 'kleine-schuur';
  x: number;
  y: number;
  w: number; // width along x
  d: number; // depth along y
  height: number;
  roofOrientation: 'horizontal' | 'vertical' | 'asymmetric';
  facadeColor?: string;
  roofColor?: string;
  hasPorch?: boolean;
  minHomes: number; // minimum house count (8-14) at which this house is active
  collectiveOnly?: boolean; // active when collective slider is higher
  individualOnly?: boolean; // active when individual slider is higher
}

// Tree definition
interface TreeDef {
  id: string;
  name: string;
  type: 'solitair' | 'fruitboom' | 'houtwal' | 'wilg' | 'hofboom';
  x: number;
  y: number;
  r: number;
  foliageColor: string;
  shadowScale?: number;
}

// Private Garden / Hedge definition
interface HedgeDef {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'haag' | 'pergola' | 'tuinhek';
}

/* ==========================================================================
   ZONE DEFINITIONS & PRE-CALCULATED SPATIAL COORDINATES
   Canvas viewBox: 0 0 960 620
   Scale: ONE representative courtyard occupying ~75% of visual area.
   Zone A: Building footprints (strictly preserved around courtyard)
   Zone B: Central courtyard (informal lawn, gathering terrace, solitary tree, orchard)
   Zone C: Private gardens & patios (adjacent to houses)
   Zone D: Tree belts / Houtwal (north and west perimeter)
   Zone E: Organic curved Wadi / water retention (south and southeast boundary)
   Zone F: Entrance lane, collective parking pocket (northwest) & walking paths
   Zone G: Open landscape transition (south and east polder views)
   ========================================================================== */

// All pre-designed house footprints with strict clearance from water, paths and trees
const MASTER_HOUSES: HouseDef[] = [
  // --- North-West Cluster (Entrance transition) ---
  {
    id: 'h1',
    name: 'Noordwestelijke Schuurwoning',
    type: 'schuurwoning',
    x: 270,
    y: 155,
    w: 68,
    d: 38,
    height: 32,
    roofOrientation: 'horizontal',
    facadeColor: '#EDE4D6',
    minHomes: 8,
  },
  {
    id: 'h2',
    name: 'Noordelijke Hofwoning',
    type: 'hofwoning',
    x: 375,
    y: 145,
    w: 64,
    d: 36,
    height: 28,
    roofOrientation: 'horizontal',
    facadeColor: '#E2D8C7',
    minHomes: 8,
  },
  {
    id: 'h3',
    name: 'Kopwoning Noordoost',
    type: 'hoekwoning',
    x: 480,
    y: 150,
    w: 58,
    d: 40,
    height: 30,
    roofOrientation: 'horizontal',
    facadeColor: '#EDE4D6',
    minHomes: 8,
  },

  // --- East Courtyard Wing (Facing west towards central lawn) ---
  {
    id: 'h4',
    name: 'Oostelijke Langgevelwoning',
    type: 'langgevel',
    x: 575,
    y: 235,
    w: 42,
    d: 72,
    height: 32,
    roofOrientation: 'vertical',
    facadeColor: '#DDD2BF',
    minHomes: 8,
  },
  {
    id: 'h5',
    name: 'Oostelijke Schuurwoning',
    type: 'schuurwoning',
    x: 580,
    y: 335,
    w: 40,
    d: 66,
    height: 30,
    roofOrientation: 'vertical',
    facadeColor: '#EAE1D3',
    minHomes: 8,
  },

  // --- South Wing (Facing north towards courtyard, overlooking wadi at rear) ---
  {
    id: 'h6',
    name: 'Zuidoostelijke Wadilogeerwoning',
    type: 'schuurwoning',
    x: 470,
    y: 435,
    w: 66,
    d: 40,
    height: 28,
    roofOrientation: 'horizontal',
    facadeColor: '#E6DDD0',
    minHomes: 8,
  },
  {
    id: 'h7',
    name: 'Zuidelijke Hofwoning aan de Weide',
    type: 'hofwoning',
    x: 360,
    y: 440,
    w: 70,
    d: 38,
    height: 30,
    roofOrientation: 'horizontal',
    facadeColor: '#EDE4D6',
    minHomes: 8,
  },

  // --- West Wing (Facing east towards courtyard) ---
  {
    id: 'h8',
    name: 'Westelijke Erfwoning',
    type: 'schuurwoning',
    x: 235,
    y: 285,
    w: 42,
    d: 70,
    height: 32,
    roofOrientation: 'vertical',
    facadeColor: '#E4DACB',
    minHomes: 8,
  },

  // --- Intermediate Homes (Activated for 9-14 homes based on slider) ---
  {
    id: 'h9',
    name: 'Noordvleugel Schuurwoning',
    type: 'hofwoning',
    x: 550,
    y: 155,
    w: 52,
    d: 36,
    height: 27,
    roofOrientation: 'horizontal',
    facadeColor: '#E5DCCF',
    minHomes: 9,
  },
  {
    id: 'h10',
    name: 'Zuidwestelijke Hofwoning',
    type: 'hofwoning',
    x: 255,
    y: 425,
    w: 62,
    d: 38,
    height: 28,
    roofOrientation: 'horizontal',
    facadeColor: '#EBE2D5',
    minHomes: 10,
  },
  {
    id: 'h11',
    name: 'Westelijke Tussenwoning',
    type: 'hofwoning',
    x: 235,
    y: 215,
    w: 40,
    d: 52,
    height: 28,
    roofOrientation: 'vertical',
    facadeColor: '#DFD5C4',
    minHomes: 11,
  },
  {
    id: 'h12',
    name: 'Oostelijke Kopwoning aan de Wadi',
    type: 'schuurwoning',
    x: 565,
    y: 425,
    w: 58,
    d: 38,
    height: 29,
    roofOrientation: 'horizontal',
    facadeColor: '#EAE1D3',
    minHomes: 12,
  },
  {
    id: 'h13',
    name: 'Geschakelde Erfwoning Noord',
    type: 'hofwoning',
    x: 320,
    y: 148,
    w: 48,
    d: 34,
    height: 26,
    roofOrientation: 'horizontal',
    facadeColor: '#E6DCCE',
    minHomes: 13,
  },
  {
    id: 'h14',
    name: 'Zuidvleugel Kapschuurwoning',
    type: 'kleine-schuur',
    x: 440,
    y: 442,
    w: 52,
    d: 34,
    height: 25,
    roofOrientation: 'horizontal',
    facadeColor: '#D8CEBD',
    minHomes: 14,
  },
];

// Pre-calculated Trees strictly outside house footprints, water, and primary pathways
const MASTER_TREES: TreeDef[] = [
  // --- Zone B: Courtyard Solitary & Orchard Trees ---
  { id: 't_cent', name: 'Monumentale Hoflinde (Centrale ontmoetingsboom)', type: 'solitair', x: 410, y: 280, r: 24, foliageColor: '#4A6F4A', shadowScale: 1.3 },
  { id: 't_orch1', name: 'Hoogstamboomgaard appel/peer', type: 'fruitboom', x: 340, y: 250, r: 14, foliageColor: '#5C845A' },
  { id: 't_orch2', name: 'Hoogstamboomgaard appel/peer', type: 'fruitboom', x: 380, y: 235, r: 13, foliageColor: '#547A52' },
  { id: 't_orch3', name: 'Hoogstamboomgaard walnoot', type: 'fruitboom', x: 340, y: 310, r: 15, foliageColor: '#5F885D' },
  { id: 't_orch4', name: 'Hoogstamboomgaard pruim', type: 'fruitboom', x: 380, y: 340, r: 14, foliageColor: '#527750' },
  { id: 't_orch5', name: 'Hoogstamboomgaard kers', type: 'fruitboom', x: 440, y: 335, r: 13, foliageColor: '#5B8259' },
  { id: 't_hof1', name: 'Zomereik binnentuin', type: 'hofboom', x: 485, y: 250, r: 16, foliageColor: '#486C46' },
  { id: 't_hof2', name: 'Veldbeuk aan wandelpad', type: 'hofboom', x: 480, y: 315, r: 15, foliageColor: '#446642' },

  // --- Zone D: North and West Houtwal (Windbreak & ecological belt) ---
  { id: 't_hw1', name: 'Houtwal Zomereik', type: 'houtwal', x: 190, y: 130, r: 18, foliageColor: '#3C5C3A' },
  { id: 't_hw2', name: 'Houtwal Ruwe Berk', type: 'houtwal', x: 230, y: 110, r: 16, foliageColor: '#4C6E4A' },
  { id: 't_hw3', name: 'Houtwal Lijsterbes & Els', type: 'houtwal', x: 310, y: 95, r: 17, foliageColor: '#3E5E3C' },
  { id: 't_hw4', name: 'Houtwal Zwarte Els', type: 'houtwal', x: 400, y: 90, r: 19, foliageColor: '#365434' },
  { id: 't_hw5', name: 'Houtwal Haagbeuk', type: 'houtwal', x: 490, y: 92, r: 18, foliageColor: '#426440' },
  { id: 't_hw6', name: 'Houtwal Zomereik oosthoek', type: 'houtwal', x: 580, y: 98, r: 20, foliageColor: '#3A5A38' },
  { id: 't_hw7', name: 'Houtwal Zoete kers', type: 'houtwal', x: 650, y: 125, r: 17, foliageColor: '#466844' },

  // --- West perimeter trees ---
  { id: 't_w1', name: 'Erfrand berk', type: 'houtwal', x: 175, y: 210, r: 17, foliageColor: '#41623F' },
  { id: 't_w2', name: 'Erfrand veldesdoorn', type: 'houtwal', x: 170, y: 290, r: 18, foliageColor: '#3D5D3B' },
  { id: 't_w3', name: 'Erfrand hazelaar & els', type: 'houtwal', x: 175, y: 375, r: 17, foliageColor: '#456743' },
  { id: 't_w4', name: 'Erfrand eik zuidwest', type: 'houtwal', x: 185, y: 460, r: 20, foliageColor: '#385836' },

  // --- Zone E / G: Riparian trees along outer bank of the natural wadi ---
  { id: 't_wilg1', name: 'Knotwilg langs de wadi', type: 'wilg', x: 670, y: 260, r: 16, foliageColor: '#567A5E' },
  { id: 't_wilg2', name: 'Schietwilg aan waterloop', type: 'wilg', x: 685, y: 350, r: 18, foliageColor: '#4E7256' },
  { id: 't_wilg3', name: 'Knotwilg wadoever', type: 'wilg', x: 660, y: 440, r: 16, foliageColor: '#53775B' },
  { id: 't_wilg4', name: 'Zwarte Els waterbuffer', type: 'wilg', x: 600, y: 525, r: 19, foliageColor: '#42644A' },
  { id: 't_wilg5', name: 'Grauwe wilg zuidrand', type: 'wilg', x: 500, y: 540, r: 17, foliageColor: '#4D7155' },
  { id: 't_wilg6', name: 'Knotwilg aan landschapsdijk', type: 'wilg', x: 370, y: 545, r: 15, foliageColor: '#52765A' },
  { id: 't_wilg7', name: 'Knotwilg zuidwest', type: 'wilg', x: 260, y: 535, r: 16, foliageColor: '#4A6E52' },
];

export const InteractiveLandscapeModel: React.FC<InteractiveLandscapeModelProps> = ({
  sliderLandscapeLiving,
  sliderScale,
  sliderTypology,
  sliderGreenBuilding,
}) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  // Normalized factors (0 to 1)
  const fLiving = sliderLandscapeLiving / 100; // 0 = 8 homes, 1 = 14 homes
  const fScale = sliderScale / 100; // 0 = loose barns, 1 = cohesive village enclosure
  const fTypology = sliderTypology / 100; // 0 = collective orchard/court, 1 = individual private yards/hedges
  const fGreen = (100 - sliderGreenBuilding) / 100; // 1 = maximum green buffer & wadi, 0 = compact

  // Exact house count strictly mapped from 8 to 14 homes
  const targetHouseCount = Math.min(14, Math.max(8, Math.round(8 + fLiving * 6)));

  // Active houses strictly from pre-designed non-colliding catalog
  const activeHouses = useMemo(() => {
    return MASTER_HOUSES.filter((h) => h.minHomes <= targetHouseCount);
  }, [targetHouseCount]);

  // Dynamic tree filter with strict collision detection against active houses
  const activeTrees = useMemo(() => {
    // Tree density scales with green slider and inverse of living
    const maxTreesAllowed = Math.round(14 + fGreen * 14);

    return MASTER_TREES.filter((tree, idx) => {
      // 1. Collision detection: check distance to every active house footprint
      const collidesWithHouse = activeHouses.some((house) => {
        const margin = 14; // SVG clearance margin
        const minX = house.x - margin;
        const maxX = house.x + house.w + margin;
        const minY = house.y - margin;
        const maxY = house.y + house.d + margin;
        return (
          tree.x >= minX &&
          tree.x <= maxX &&
          tree.y >= minY &&
          tree.y <= maxY
        );
      });

      if (collidesWithHouse) return false;

      // 2. Collective orchard density: if individual slider is high, fewer orchard trees
      if (tree.type === 'fruitboom' && fTypology > 0.65 && idx % 2 === 1) {
        return false;
      }

      // Limit overall count smoothly
      return idx < maxTreesAllowed;
    });
  }, [activeHouses, fGreen, fTypology]);

  // Wadi natural curvature & depth dynamic points based on green slider
  // Gently curving around the south and southeast of the courtyard (Zone E)
  const wadiWidth = 32 + fGreen * 22; // 32px to 54px natural width
  const wadiPathData = useMemo(() => {
    // Controlled smooth cubic bezier arc from east down along south
    const startX = 665;
    const startY = 175;
    const cp1X = 710 + fGreen * 15;
    const cp1Y = 320;
    const cp2X = 660 + fGreen * 20;
    const cp2Y = 490;
    const endX = 230;
    const endY = 530;

    return {
      center: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
      // Thick ribbon polygon for natural reed and water bank
      bankOuter: `M ${startX + 18} ${startY - 10} C ${cp1X + 35} ${cp1Y}, ${cp2X + 30} ${cp2Y + 20}, ${endX - 10} ${endY + 25} L ${endX} ${endY - 15} C ${cp2X - 25} ${cp2Y - 20}, ${cp1X - 25} ${cp1Y - 15}, ${startX - 15} ${startY} Z`,
    };
  }, [fGreen]);

  return (
    <div className="relative w-full h-full select-none">
      {/* 2.5D Isometric Architectural Maquette SVG Canvas */}
      <svg
        viewBox="0 0 960 620"
        className="w-full h-full overflow-hidden"
        style={{ filter: 'drop-shadow(0 16px 36px rgba(0,0,0,0.45))' }}
      >
        <defs>
          {/* Architectural drop-shadow filters */}
          <filter id="maquette-building-shadow" x="-30%" y="-30%" width="170%" height="170%">
            <feDropShadow dx="5" dy="8" stdDeviation="3.5" floodColor="#0E1410" floodOpacity="0.45" />
          </filter>
          <filter id="maquette-tree-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="4" dy="7" stdDeviation="3" floodColor="#111712" floodOpacity="0.32" />
          </filter>
          <filter id="soft-hedge-shadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.5" floodColor="#151D16" floodOpacity="0.25" />
          </filter>

          {/* Gradients: Ground, Grasslands & Meadow */}
          <linearGradient id="polder-meadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#829C7E" />
            <stop offset="60%" stopColor="#758F71" />
            <stop offset="100%" stopColor="#698265" />
          </linearGradient>

          <linearGradient id="courtyard-lawn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#92AD8E" />
            <stop offset="100%" stopColor="#829F7E" />
          </linearGradient>

          <linearGradient id="private-lawn" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9AB596" />
            <stop offset="100%" stopColor="#87A383" />
          </linearGradient>

          {/* Natural organic wadi water gradient */}
          <linearGradient id="wadi-water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#557580" />
            <stop offset="50%" stopColor="#4A6973" />
            <stop offset="100%" stopColor="#3E5C66" />
          </linearGradient>

          {/* Reed & Wetland Bank Gradient */}
          <linearGradient id="wadi-reed-bank" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7E9675" />
            <stop offset="50%" stopColor="#6D8565" />
            <stop offset="100%" stopColor="#5B7254" />
          </linearGradient>

          {/* Roof Materials: Pitched Gables with Sunny and Shaded Slopes */}
          {/* Anthracite / Dark Slate Roof */}
          <linearGradient id="roof-slate-sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4D534F" />
            <stop offset="100%" stopColor="#3C413E" />
          </linearGradient>
          <linearGradient id="roof-slate-shade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D322F" />
            <stop offset="100%" stopColor="#202422" />
          </linearGradient>

          {/* Warm Ceramic / Corten Roof */}
          <linearGradient id="roof-ceramic-sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#73584B" />
            <stop offset="100%" stopColor="#5E463B" />
          </linearGradient>
          <linearGradient id="roof-ceramic-shade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A362C" />
            <stop offset="100%" stopColor="#35261F" />
          </linearGradient>

          {/* Tree Canopy Radial Depth */}
          <radialGradient id="tree-canopy-sun" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#689166" />
            <stop offset="60%" stopColor="#4B7049" />
            <stop offset="100%" stopColor="#365434" />
          </radialGradient>
          <radialGradient id="tree-orchard-sun" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#7BA078" />
            <stop offset="70%" stopColor="#5B8058" />
            <stop offset="100%" stopColor="#446342" />
          </radialGradient>
          <radialGradient id="tree-willow-sun" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#759C7F" />
            <stop offset="65%" stopColor="#577D61" />
            <stop offset="100%" stopColor="#3C5F45" />
          </radialGradient>

          {/* Grass mown stripe pattern */}
          <pattern id="mown-stripes" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="16" y2="16" stroke="#FFFFFF" strokeWidth="1" opacity="0.04" />
          </pattern>

          {/* Timber decking pattern for courtyard terraces */}
          <pattern id="timber-deck" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="6" y2="0" stroke="#8C7965" strokeWidth="0.8" opacity="0.4" />
          </pattern>
        </defs>

        {/* ================================================================
            1. BASE PRESENTATION PLINTH (Physical Museum Maquette Mount)
            ================================================================ */}
        {/* Soft cast plinth shadow */}
        <rect x="20" y="20" width="920" height="580" rx="14" fill="#090D0A" opacity="0.55" />
        {/* Beveled timber frame */}
        <rect x="15" y="15" width="930" height="590" rx="12" fill="#DFD7CA" stroke="#BCB3A4" strokeWidth="2" />
        {/* Museum mounting cardboard surface */}
        <rect x="18" y="18" width="924" height="584" rx="10" fill="#EAE5DC" />

        {/* ================================================================
            2. OPEN LANDSCAPE (ZONE G) - The Polder Fabric
            ================================================================ */}
        <g id="zone-g-landscape">
          {/* Main surrounding meadow with soft agrarian striation */}
          <rect x="24" y="24" width="912" height="572" rx="8" fill="url(#polder-meadow)" />
          <rect x="24" y="24" width="912" height="572" rx="8" fill="url(#mown-stripes)" />

          {/* Traditional Dutch ditch along far east and far north */}
          <line x1="24" y1="65" x2="936" y2="65" stroke="#526F79" strokeWidth="2.5" opacity="0.6" />
          <line x1="880" y1="24" x2="880" y2="596" stroke="#526F79" strokeWidth="2.5" opacity="0.6" />

          {/* Subtle label indicating open polder view */}
          <text
            x="850"
            y="565"
            textAnchor="end"
            fontSize="10"
            fontFamily="monospace"
            fill="#4A6547"
            letterSpacing="1.5"
            opacity="0.85"
          >
            OPEN POLDERLANDSCHAP →
          </text>
        </g>

        {/* ================================================================
            3. HOUTWAL / BUFFER STRUCTUUR (ZONE D - Noord & West)
            ================================================================ */}
        <g id="zone-d-houtwal-embankment">
          {/* Earth berm / houtwal ground mound behind north houses */}
          <path
            d="M 160 135 Q 380 75 660 85 Q 670 120 650 145 Q 380 120 160 135 Z"
            fill="#5E7859"
            opacity="0.5"
          />
          {/* West perimeter hedge strip */}
          <path
            d="M 155 130 L 155 490 L 195 480 L 195 130 Z"
            fill="#5E7859"
            opacity="0.4"
          />
        </g>

        {/* ================================================================
            4. NATUURLIJKE WADI & WETLAND RAND (ZONE E - Zuid & Zuidoost)
               Elongated organic curved retention swale with natural banks
            ================================================================ */}
        <g
          id="zone-e-natural-wadi"
          className="cursor-pointer"
          onMouseEnter={() =>
            setHoverInfo({
              title: 'Natuurlijke Kwel-Wadi & Sloot',
              category: 'Water & Landschap',
              description: 'Langgerekte natuurlijke waterloop met flauwe oevers, rietkragen en retentiecapaciteit bij piekbuien.',
              x: 640,
              y: 380,
            })
          }
          onMouseLeave={() => setHoverInfo(null)}
        >
          {/* Reeds and ecological bank buffer (Zone E Outer) */}
          <path
            d={wadiPathData.bankOuter}
            fill="url(#wadi-reed-bank)"
            opacity="0.88"
          />

          {/* Central flowing water surface (Smooth Bezier ribbon) */}
          <path
            d={wadiPathData.center}
            fill="none"
            stroke="url(#wadi-water-gradient)"
            strokeWidth={wadiWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
          />

          {/* Deep water centerline with shimmer highlights */}
          <path
            d={wadiPathData.center}
            fill="none"
            stroke="#678E9C"
            strokeWidth={wadiWidth * 0.35}
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Reeds, water lilies & wetland vegetations along wadi edges */}
          {[
            { cx: 660, cy: 220, r: 4 },
            { cx: 685, cy: 280, r: 5 },
            { cx: 700, cy: 340, r: 4.5 },
            { cx: 680, cy: 410, r: 5 },
            { cx: 630, cy: 470, r: 4.5 },
            { cx: 560, cy: 510, r: 5 },
            { cx: 460, cy: 535, r: 4 },
            { cx: 330, cy: 540, r: 4.5 },
          ].map((reed, idx) => (
            <circle
              key={`reed-${idx}`}
              cx={reed.cx}
              cy={reed.cy}
              r={reed.r}
              fill="#4E7047"
              opacity="0.75"
            />
          ))}

          {/* Wooden footbridge / vlonder crossing the wadi to open landscape */}
          <g id="wooden-footbridge" className="cursor-pointer">
            <rect
              x="628"
              y="442"
              width="36"
              height="14"
              rx="2"
              transform="rotate(35 646 449)"
              fill="#A18D74"
              stroke="#6B5945"
              strokeWidth="1"
              style={{ filter: 'drop-shadow(2px 3px 3px rgba(0,0,0,0.3))' }}
            />
            {/* Planks */}
            <line x1="634" y1="440" x2="639" y2="452" stroke="#5E4E3C" strokeWidth="0.8" />
            <line x1="642" y1="444" x2="647" y2="456" stroke="#5E4E3C" strokeWidth="0.8" />
            <line x1="650" y1="448" x2="655" y2="460" stroke="#5E4E3C" strokeWidth="0.8" />
          </g>
        </g>

        {/* ================================================================
            5. ONTSLUITING, PARKEREN & WANDELPADEN (ZONE F)
               One rural entrance lane → collective parking pocket → footpaths
            ================================================================ */}
        <g id="zone-f-access-and-paths">
          {/* Entrance lane from northwest (Halfverharding / klinkers) */}
          <path
            d="M 24 165 C 100 165, 140 170, 185 175 C 210 178, 225 185, 245 205"
            fill="none"
            stroke="#D0C4B2"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M 24 165 C 100 165, 140 170, 185 175 C 210 178, 225 185, 245 205"
            fill="none"
            stroke="#B5A795"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Collective Parking Pocket (Parkeerkoffer aan de entreerand - 4-6 muted cars) */}
          <g
            id="collective-parking-pocket"
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoverInfo({
                title: 'Collectieve Parkeerkoffer',
                category: 'Infrastructuur',
                description: 'Geclusterd parkeren aan de entree van het erf (max. 4-6 auto’s). Het binnenterrein blijft autovrij en groen.',
                x: 185,
                y: 195,
              })
            }
            onMouseLeave={() => setHoverInfo(null)}
          >
            {/* Gravel surface for parking bays */}
            <rect
              x="165"
              y="160"
              width="50"
              height="40"
              rx="4"
              fill="#C2B5A2"
              stroke="#A89B88"
              strokeWidth="1.5"
            />
            {/* Low beech hedge screening the parking cars */}
            <rect x="160" y="156" width="58" height="4" rx="2" fill="#3D5A3B" />
            <rect x="160" y="198" width="58" height="4" rx="2" fill="#3D5A3B" />

            {/* Stylized Muted Vehicles (Scale indicators, non-dominant) */}
            {[
              { x: 172, y: 165, color: '#59605C' },
              { x: 184, y: 165, color: '#4A504C' },
              { x: 196, y: 165, color: '#686F6B' },
              { x: 178, y: 182, color: '#525754' },
              { x: 190, y: 182, color: '#3E4240' },
            ].map((car, idx) => (
              <g key={`car-${idx}`} style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))' }}>
                {/* Car body */}
                <rect x={car.x} y={car.y} width="9" height="15" rx="2" fill={car.color} />
                {/* Windshield */}
                <rect x={car.x + 1} y={car.y + 3} width="7" height="4" rx="0.8" fill="#282D2A" opacity="0.75" />
              </g>
            ))}
          </g>

          {/* Informal oyster-shell / gravel walking paths within the courtyard */}
          {/* Main courtyard loop path */}
          <path
            d="M 245 205 C 290 220, 380 200, 470 215 C 530 225, 550 280, 545 360 C 540 410, 480 430, 400 425 C 320 420, 270 380, 270 300 C 270 240, 245 210, 245 205"
            fill="none"
            stroke="#DFD5C4"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.92"
          />
          <path
            d="M 245 205 C 290 220, 380 200, 470 215 C 530 225, 550 280, 545 360 C 540 410, 480 430, 400 425 C 320 420, 270 380, 270 300 C 270 240, 245 210, 245 205"
            fill="none"
            stroke="#C9BEAC"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Meandering walking trail towards the wadi footbridge and polder */}
          <path
            d="M 545 360 C 585 390, 615 420, 638 444 C 655 460, 710 495, 780 520"
            fill="none"
            stroke="#DFD5C4"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* ================================================================
            6. GEMEENSCHAPPELIJK HOF (ZONE B) - Het Groene Hart
               Centraal informeel gras, solitaire boom, boomgaard & ontmoetingsplek
            ================================================================ */}
        <g id="zone-b-central-courtyard">
          {/* Central green courtyard footprint */}
          <path
            d="M 285 205 C 360 190, 460 195, 535 215 C 560 270, 560 350, 530 405 C 470 425, 360 430, 290 405 C 270 340, 265 260, 285 205 Z"
            fill="url(#courtyard-lawn)"
            opacity="0.95"
            style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))' }}
          />

          {/* Communal circular timber seating bench around the central tree */}
          <g
            id="communal-bench-terrace"
            className="cursor-pointer"
            onMouseEnter={() =>
              setHoverInfo({
                title: 'Collectieve Ontmoetingsplek',
                category: 'Gedeelde Ruimte',
                description: 'Cirkelvormige houten erfbank onder de monumentale linde; een informele verblijfsplek voor buurtgesprekken.',
                x: 410,
                y: 280,
              })
            }
            onMouseLeave={() => setHoverInfo(null)}
          >
            {/* Gravel plaza under tree */}
            <circle cx="410" cy="280" r="32" fill="#D7CCBA" opacity="0.8" />
            {/* Timber ring bench */}
            <circle
              cx="410"
              cy="280"
              r="22"
              fill="none"
              stroke="#876F56"
              strokeWidth="4"
              strokeDasharray="14 3"
              style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.3))' }}
            />
          </g>

          {/* Communal Orchard Boundary (Subtle meadow delineation) */}
          <path
            d="M 320 225 Q 360 215 410 220 Q 420 350 360 360 Q 315 340 320 225 Z"
            fill="none"
            stroke="#70916B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </g>

        {/* ================================================================
            7. PRIVATE TUINEN, HAGEN & TERRASSEN (ZONE C)
               Scales with sliderTypology: at high typology, defined private hedges
            ================================================================ */}
        <g id="zone-c-private-gardens">
          {activeHouses.map((house) => {
            // Calculate a private terrace/garden patch behind or beside the house
            const gardenWidth = house.w + 14;
            const gardenDepth = 18 + fTypology * 16; // Expands with individual slider

            // Orientation of private garden
            const isNorth = house.y < 200;
            const isSouth = house.y > 400;
            const isEast = house.x > 500;
            const isWest = house.x < 280;

            let gx = house.x - 7;
            let gy = house.y;
            let gw = gardenWidth;
            let gd = gardenDepth;

            if (isNorth) {
              gy = house.y - gardenDepth;
            } else if (isSouth) {
              gy = house.y + house.d;
            } else if (isEast) {
              gx = house.x + house.w;
              gw = gardenDepth;
              gd = house.d;
            } else if (isWest) {
              gx = house.x - gardenDepth;
              gw = gardenDepth;
              gd = house.d;
            }

            return (
              <g key={`garden-${house.id}`}>
                {/* Garden lawn / patio */}
                <rect
                  x={gx}
                  y={gy}
                  width={gw}
                  height={gd}
                  rx="3"
                  fill="url(#private-lawn)"
                  opacity={0.7 + fTypology * 0.25}
                />
                {/* Wooden terrace decking attached to house */}
                <rect
                  x={house.x}
                  y={isSouth ? house.y + house.d : isNorth ? house.y - 8 : house.y + 4}
                  width={isEast || isWest ? 8 : house.w}
                  height={isEast || isWest ? house.d - 8 : 8}
                  fill="#BAAA94"
                  opacity="0.85"
                />

                {/* Beech hedge enclosure (Dominant when individual slider is higher) */}
                {fTypology > 0.35 && (
                  <rect
                    x={gx}
                    y={gy}
                    width={gw}
                    height={gd}
                    rx="3"
                    fill="none"
                    stroke="#3C5C3A"
                    strokeWidth={2 + fTypology * 2}
                    opacity="0.8"
                    style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))' }}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ================================================================
            8. WONINGEN (ZONE A) - 2.5D Architectonische Volumes
               Zadeldaken, langskappen, schuren met duidelijke slagschaduw.
               Geen VINEX-uitstraling; landelijke hedendaagse vormtaal.
            ================================================================ */}
        <g id="zone-a-houses">
          {activeHouses.map((house) => {
            const isHorizontal = house.roofOrientation === 'horizontal';
            const shadowDx = 14;
            const shadowDy = 16;
            const roofPitchH = 14; // Height of the gable ridge in 2.5D

            // Roof color variation (some zinc/anthracite, some warm ceramic tiles)
            const isCeramic = house.id === 'h1' || house.id === 'h6' || house.id === 'h10';
            const roofSun = isCeramic ? 'url(#roof-ceramic-sun)' : 'url(#roof-slate-sun)';
            const roofShade = isCeramic ? 'url(#roof-ceramic-shade)' : 'url(#roof-slate-shade)';

            return (
              <g
                key={house.id}
                className="cursor-pointer group"
                style={{ filter: 'url(#maquette-building-shadow)' }}
                onMouseEnter={() =>
                  setHoverInfo({
                    title: house.name,
                    category: 'Architectonisch Volume',
                    description:
                      house.type === 'schuurwoning'
                        ? 'Landelijke schuurwoning met houten langsgevel en hoge zadeldaknok; passend in de historische erfstructuur.'
                        : house.type === 'hofwoning'
                        ? 'Georiënteerd op het gedeelde groene hof met een compacte, kwalitatieve footprint en zonnige leefruimte.'
                        : 'Hedendaags ensemblevolume met natuurlijke materialen, afgestemd op de overgang naar het open landschap.',
                    x: house.x + house.w / 2,
                    y: house.y + house.d / 2,
                  })
                }
                onMouseLeave={() => setHoverInfo(null)}
              >
                {/* --- 1. Cast Shadow on Ground (Northeast orientation) --- */}
                <polygon
                  points={`
                    ${house.x},${house.y + house.d}
                    ${house.x + house.w},${house.y + house.d}
                    ${house.x + house.w + shadowDx},${house.y + house.d + shadowDy}
                    ${house.x + shadowDx},${house.y + shadowDy}
                  `}
                  fill="#0D130E"
                  opacity="0.38"
                />

                {/* --- 2. Facade Walls (Warm timber / clay plaster base) --- */}
                <rect
                  x={house.x}
                  y={house.y}
                  width={house.w}
                  height={house.d}
                  fill={house.facadeColor || '#E8DFD1'}
                  stroke="#7A6F62"
                  strokeWidth="0.8"
                />

                {/* --- 3. Pitched Gable Roof (2.5D Zadeldak) --- */}
                {isHorizontal ? (
                  // Horizontal ridge along X axis
                  <g id={`roof-${house.id}`}>
                    {/* Sunny North Roof Slope */}
                    <polygon
                      points={`
                        ${house.x},${house.y}
                        ${house.x + house.w},${house.y}
                        ${house.x + house.w},${house.y + house.d / 2}
                        ${house.x},${house.y + house.d / 2}
                      `}
                      fill={roofSun}
                      stroke="#2F3532"
                      strokeWidth="0.6"
                    />
                    {/* Shaded South Roof Slope */}
                    <polygon
                      points={`
                        ${house.x},${house.y + house.d / 2}
                        ${house.x + house.w},${house.y + house.d / 2}
                        ${house.x + house.w},${house.y + house.d}
                        ${house.x},${house.y + house.d}
                      `}
                      fill={roofShade}
                      stroke="#1A1E1C"
                      strokeWidth="0.6"
                    />
                    {/* Crisp Roof Ridge Line */}
                    <line
                      x1={house.x}
                      y1={house.y + house.d / 2}
                      x2={house.x + house.w}
                      y2={house.y + house.d / 2}
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      opacity="0.45"
                    />
                    {/* Gable Ends (Gezette topgevels) */}
                    <polygon
                      points={`
                        ${house.x},${house.y}
                        ${house.x - 3},${house.y + house.d / 2}
                        ${house.x},${house.y + house.d}
                      `}
                      fill="#B5A896"
                      opacity="0.9"
                    />
                    <polygon
                      points={`
                        ${house.x + house.w},${house.y}
                        ${house.x + house.w + 3},${house.y + house.d / 2}
                        ${house.x + house.w},${house.y + house.d}
                      `}
                      fill="#8A7D6C"
                      opacity="0.9"
                    />
                  </g>
                ) : (
                  // Vertical ridge along Y axis
                  <g id={`roof-${house.id}`}>
                    {/* Sunny West Roof Slope */}
                    <polygon
                      points={`
                        ${house.x},${house.y}
                        ${house.x + house.w / 2},${house.y}
                        ${house.x + house.w / 2},${house.y + house.d}
                        ${house.x},${house.y + house.d}
                      `}
                      fill={roofSun}
                      stroke="#2F3532"
                      strokeWidth="0.6"
                    />
                    {/* Shaded East Roof Slope */}
                    <polygon
                      points={`
                        ${house.x + house.w / 2},${house.y}
                        ${house.x + house.w},${house.y}
                        ${house.x + house.w},${house.y + house.d}
                        ${house.x + house.w / 2},${house.y + house.d}
                      `}
                      fill={roofShade}
                      stroke="#1A1E1C"
                      strokeWidth="0.6"
                    />
                    {/* Crisp Roof Ridge Line */}
                    <line
                      x1={house.x + house.w / 2}
                      y1={house.y}
                      x2={house.x + house.w / 2}
                      y2={house.y + house.d}
                      stroke="#FFFFFF"
                      strokeWidth="1.2"
                      opacity="0.45"
                    />
                    {/* Gable Ends */}
                    <polygon
                      points={`
                        ${house.x},${house.y}
                        ${house.x + house.w / 2},${house.y - 3}
                        ${house.x + house.w},${house.y}
                      `}
                      fill="#B5A896"
                      opacity="0.9"
                    />
                    <polygon
                      points={`
                        ${house.x},${house.y + house.d}
                        ${house.x + house.w / 2},${house.y + house.d + 3}
                        ${house.x + house.w},${house.y + house.d}
                      `}
                      fill="#8A7D6C"
                      opacity="0.9"
                    />
                  </g>
                )}

                {/* Subtle Skylight / Solar Integration on South-facing Slope */}
                <rect
                  x={house.x + house.w * 0.3}
                  y={isHorizontal ? house.y + house.d * 0.58 : house.y + house.d * 0.3}
                  width={isHorizontal ? house.w * 0.4 : house.w * 0.35}
                  height={isHorizontal ? 5 : 8}
                  fill="#1C272B"
                  stroke="#475C63"
                  strokeWidth="0.6"
                  opacity="0.75"
                />

                {/* Building Number or Label Indicator */}
                <circle
                  cx={house.x + 8}
                  cy={house.y + 8}
                  r="5"
                  fill="#3D5A45"
                  stroke="#FBF9F5"
                  strokeWidth="1"
                />
                <text
                  x={house.x + 8}
                  y={house.y + 10.5}
                  textAnchor="middle"
                  fontSize="7"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  fill="#FFFFFF"
                >
                  {house.id.replace('h', '')}
                </text>
              </g>
            );
          })}
        </g>

        {/* ================================================================
            9. BOMEN & BOOMGAARD (ZONE B, D & G)
               Strictly guaranteed non-colliding with houses and water
            ================================================================ */}
        <g id="trees-and-orchards">
          {activeTrees.map((tree) => {
            const shadowDx = 6;
            const shadowDy = 9;

            // Canopy gradient choice
            const canopyFill =
              tree.type === 'solitair'
                ? 'url(#tree-canopy-sun)'
                : tree.type === 'fruitboom'
                ? 'url(#tree-orchard-sun)'
                : tree.type === 'wilg'
                ? 'url(#tree-willow-sun)'
                : 'url(#tree-canopy-sun)';

            return (
              <g
                key={tree.id}
                className="cursor-pointer group"
                style={{ filter: 'url(#maquette-tree-shadow)' }}
                onMouseEnter={() =>
                  setHoverInfo({
                    title: tree.name,
                    category: 'Landschapselement',
                    description:
                      tree.type === 'solitair'
                        ? 'De centrale hofboom; een markant herkenningspunt met royale schaduwwerking voor het plein.'
                        : tree.type === 'fruitboom'
                        ? 'Gezamenlijke boomgaard met streekeigen hoogstam fruitbomen (o.a. Notarisappel en Betuwse kers).'
                        : tree.type === 'wilg'
                        ? 'Knotwilgen en elzen langs de waterlijn; versterken de polderecologie en wateropname.'
                        : 'Robuuste houtwal met inlandse eiken, berken en vogelkers als windsingel en vogelroute.',
                    x: tree.x,
                    y: tree.y,
                  })
                }
                onMouseLeave={() => setHoverInfo(null)}
              >
                {/* 1. Cast Shadow of Tree on Ground */}
                <ellipse
                  cx={tree.x + shadowDx}
                  cy={tree.y + shadowDy}
                  rx={tree.r * 1.15}
                  ry={tree.r * 0.8}
                  fill="#0D140F"
                  opacity="0.32"
                />

                {/* 2. Trunk Footprint */}
                <circle cx={tree.x} cy={tree.y} r={tree.r * 0.18} fill="#3E3023" />

                {/* 3. Base Crown */}
                <circle
                  cx={tree.x}
                  cy={tree.y}
                  r={tree.r}
                  fill={canopyFill}
                  stroke="#273C25"
                  strokeWidth="0.8"
                />

                {/* 4. Layered Highlights for 2.5D depth */}
                <circle
                  cx={tree.x - tree.r * 0.22}
                  cy={tree.y - tree.r * 0.25}
                  r={tree.r * 0.65}
                  fill="#FFFFFF"
                  opacity="0.16"
                />
                <circle
                  cx={tree.x - tree.r * 0.3}
                  cy={tree.y - tree.r * 0.35}
                  r={tree.r * 0.35}
                  fill="#FFFFFF"
                  opacity="0.22"
                />

                {/* Individual fruit specks on orchard trees */}
                {tree.type === 'fruitboom' && (
                  <g opacity="0.65">
                    <circle cx={tree.x - 3} cy={tree.y - 2} r="1.5" fill="#D9534F" />
                    <circle cx={tree.x + 4} cy={tree.y + 1} r="1.5" fill="#D9534F" />
                    <circle cx={tree.x - 1} cy={tree.y + 4} r="1.5" fill="#F0AD4E" />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* ================================================================
            10. MAQUETTE INSET: ARCHITECTURAL COMPASS & METRIC SCALE
            ================================================================ */}
        <g id="maquette-scale-ruler" transform="translate(45, 545)">
          {/* North Arrow */}
          <g transform="translate(0, 0)">
            <circle cx="16" cy="16" r="14" fill="#1C241E" stroke="#38493B" strokeWidth="1" />
            <polygon points="16,6 20,16 16,14 12,16" fill="#85A38C" />
            <polygon points="16,26 20,16 16,14 12,16" fill="#3D4D3F" />
            <text x="16" y="4" textAnchor="middle" fontSize="8" fontFamily="sans-serif" fontWeight="bold" fill="#EDE5D8">
              N
            </text>
          </g>

          {/* Metric Scale Bar */}
          <g transform="translate(42, 6)">
            <rect x="0" y="8" width="80" height="4" fill="#EAE5DC" stroke="#8A7E6E" strokeWidth="0.8" />
            <rect x="0" y="8" width="40" height="4" fill="#3D5A45" />
            <text x="0" y="4" fontSize="8" fontFamily="monospace" fill="#5A5245">0</text>
            <text x="40" y="4" fontSize="8" fontFamily="monospace" fill="#5A5245">25m</text>
            <text x="80" y="4" fontSize="8" fontFamily="monospace" fill="#5A5245">50m</text>
            <text x="0" y="22" fontSize="9" fontFamily="monospace" fill="#756A5B">
              SCHAAL 1 : 500 (ERFENSEMBLE)
            </text>
          </g>
        </g>

        {/* Small Inset Corner Badge: Spatial Zones */}
        <g id="zone-legend-badge" transform="translate(730, 35)">
          <rect
            x="0"
            y="0"
            width="190"
            height="55"
            rx="6"
            fill="#151A16"
            opacity="0.85"
            stroke="#2B362D"
            strokeWidth="1"
          />
          <text x="10" y="16" fontSize="9" fontFamily="monospace" fill="#85A38C" fontWeight="bold">
            RUIMTELIJKE OPZET WOONHOF
          </text>
          <text x="10" y="32" fontSize="9" fontFamily="sans-serif" fill="#D5CDC0">
            • {activeHouses.length} conceptuele woningen rond het hof
          </text>
          <text x="10" y="46" fontSize="9" fontFamily="sans-serif" fill="#D5CDC0">
            • Geen auto's in de centrale boomgaard
          </text>
        </g>
      </svg>

      {/* Floating Hover Information Card (Architectural Tooltip) */}
      <AnimatePresence>
        {hoverInfo && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 pointer-events-none p-3.5 rounded-xl bg-[#141915]/95 backdrop-blur-md border border-[#344436] text-[#FBF9F5] shadow-2xl max-w-xs"
            style={{
              left: `${Math.min(78, Math.max(12, (hoverInfo.x / 960) * 100))}%`,
              top: `${Math.min(75, Math.max(10, (hoverInfo.y / 620) * 100))}%`,
              transform: 'translate(-50%, -115%)',
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono-subtle font-bold tracking-wider text-[#85A38C]">
                {hoverInfo.category}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-[#FBF9F5] mb-1">
              {hoverInfo.title}
            </h4>
            <p className="text-xs text-[#CFC6B8] leading-relaxed font-light">
              {hoverInfo.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
