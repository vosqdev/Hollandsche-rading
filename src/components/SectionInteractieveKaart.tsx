import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Plus,
  Send,
  CheckCircle2,
  Lock,
  ThumbsUp,
  X,
  Filter,
  Info,
  Map as MapIcon,
  Satellite,
  ZoomIn,
  ZoomOut,
  Compass,
  Shield,
  Crosshair,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
  Eye,
  Layers,
  Building2,
  Search,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { store, calculatePolygonAreaHa, MapViewConfig, DEFAULT_MAP_VIEW } from '../services/store';
import { MapIdea, CategoryType } from '../types';
import { WONINGBOUW_PROJECTEN, WoningbouwProject } from '../data/woondataData';

type BaseMapType = 'osm' | 'satellite';

export const PROJECT_STATUS_BADGES: Record<
  string,
  { bg: string; text: string; border: string; dot: string; glow: string }
> = {
  'In aanbouw': {
    bg: '#E8F4EC',
    text: '#2C6E3D',
    border: '#00BA7C',
    dot: '#00BA7C',
    glow: 'rgba(0, 186, 124, 0.45)',
  },
  'Verkoop gestart': {
    bg: '#EBF3FB',
    text: '#1967B2',
    border: '#0084D1',
    dot: '#0084D1',
    glow: 'rgba(0, 132, 209, 0.45)',
  },
  'In voorbereiding': {
    bg: '#F3E8FF',
    text: '#7C3AED',
    border: '#8B5CF6',
    dot: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.45)',
  },
  'In verkenning': {
    bg: '#FEF4E8',
    text: '#B85D00',
    border: '#D88935',
    dot: '#D88935',
    glow: 'rgba(216, 137, 53, 0.45)',
  },
};

const CATEGORIES: { id: CategoryType; label: string; icon: string; color: string; bg: string }[] = [
  { id: 'idee', label: 'Idee', icon: '💡', color: '#D97706', bg: '#FEF3C7' },
  { id: 'groen', label: 'Groen', icon: '🌳', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'wonen', label: 'Wonen', icon: '🏠', color: '#2563EB', bg: '#DBEAFE' },
  { id: 'verkeer', label: 'Verkeer', icon: '🚲', color: '#9333EA', bg: '#F3E8FF' },
  { id: 'water', label: 'Water', icon: '💧', color: '#0284C7', bg: '#E0F2FE' },
  { id: 'natuur', label: 'Natuur', icon: '🌿', color: '#059669', bg: '#D1FAE5' },
  { id: 'energie', label: 'Energie', icon: '⚡', color: '#EA580C', bg: '#FFEDD5' },
  { id: 'behouden', label: 'Dit moeten we behouden', icon: '❤️', color: '#E11D48', bg: '#FFE4E6' },
  { id: 'aandachtspunt', label: 'Aandachtspunt', icon: '⚠', color: '#DC2626', bg: '#FEE2E2' },
];

interface IdeaCluster {
  id: string;
  isCluster: boolean;
  ideas: MapIdea[];
  centerLat: number;
  centerLng: number;
}

/**
 * Clusters ideas within a pixel radius on the current Leaflet map view
 */
function computeClusters(map: L.Map, currentIdeas: MapIdea[], radiusPx = 48): IdeaCluster[] {
  const clusters: IdeaCluster[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < currentIdeas.length; i++) {
    const idea = currentIdeas[i];
    if (visited.has(idea.id)) continue;

    const pt = map.latLngToContainerPoint([idea.lat, idea.lng]);
    const members: MapIdea[] = [idea];
    visited.add(idea.id);

    for (let j = i + 1; j < currentIdeas.length; j++) {
      const other = currentIdeas[j];
      if (visited.has(other.id)) continue;

      const otherPt = map.latLngToContainerPoint([other.lat, other.lng]);
      const dx = pt.x - otherPt.x;
      const dy = pt.y - otherPt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radiusPx) {
        members.push(other);
        visited.add(other.id);
      }
    }

    const sumLat = members.reduce((acc, m) => acc + m.lat, 0);
    const sumLng = members.reduce((acc, m) => acc + m.lng, 0);

    clusters.push({
      id: members.length === 1 ? idea.id : `cluster-${members.map((m) => m.id).join('-')}`,
      isCluster: members.length > 1,
      ideas: members,
      centerLat: sumLat / members.length,
      centerLng: sumLng / members.length,
    });
  }

  return clusters;
}

export const SectionInteractieveKaart: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const osmTileLayerRef = useRef<L.TileLayer | null>(null);
  const satTileLayerRef = useRef<L.TileLayer | null>(null);
  const plangebiedPolygonRef = useRef<L.Polygon | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const projectMarkersLayerRef = useRef<L.LayerGroup | null>(null);
  const projectMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const tempMarkerRef = useRef<L.Marker | null>(null);

  const [baseMap, setBaseMap] = useState<BaseMapType>('osm');
  const [ideas, setIdeas] = useState<MapIdea[]>(store.getApprovedIdeas());
  const [allIdeas, setAllIdeas] = useState<MapIdea[]>(store.getMapIdeas());
  const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(store.isSystemAdmin());
  const [showPendingIdeas, setShowPendingIdeas] = useState<boolean>(true);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Woningbouwprojecten Module (Afbeelding 2) State
  const [projectsModuleEnabled, setProjectsModuleEnabled] = useState<boolean>(
    store.isProjectsModuleEnabled()
  );
  const [showIdeasLayer, setShowIdeasLayer] = useState<boolean>(true);
  const [showProjectsLayer, setShowProjectsLayer] = useState<boolean>(true);
  const [selectedProjectKern, setSelectedProjectKern] = useState<string>('Alle kernen');
  const [selectedProjectStatus, setSelectedProjectStatus] = useState<string>('Alle statussen');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<WoningbouwProject | null>(null);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string>('');

  const [plangebiedCoords, setPlangebiedCoords] = useState<[number, number][]>(store.getPlangebiedCoords());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [placedCoord, setPlacedCoord] = useState<{ lat: number; lng: number } | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<CategoryType>('idee');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentAreaHa = calculatePolygonAreaHa(plangebiedCoords);
  const pendingIdeas = allIdeas.filter((i) => i.status === 'pending');

  // Helper to filter projects based on Kern, Status and Search
  const getFilteredProjects = () => {
    return WONINGBOUW_PROJECTEN.filter((prj) => {
      const matchKern =
        selectedProjectKern === 'Alle kernen' ||
        prj.kern.toLowerCase() === selectedProjectKern.toLowerCase();
      const matchStatus =
        selectedProjectStatus === 'Alle statussen' ||
        prj.status.toLowerCase() === selectedProjectStatus.toLowerCase();
      const matchSearch =
        !projectSearchQuery.trim() ||
        prj.naam.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
        prj.locatie.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
        prj.ontwikkelaar.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
        prj.omschrijving.toLowerCase().includes(projectSearchQuery.toLowerCase());
      return matchKern && matchStatus && matchSearch;
    });
  };

  // Helper to get currently visible ideas based on filter & admin moderation state
  const getVisibleIdeas = () => {
    const source = isSystemAdmin && showPendingIdeas ? allIdeas : ideas;
    if (selectedCategoryFilter === 'all') return source;
    return source.filter((i) => i.category === selectedCategoryFilter);
  };

  // Fresh refs to prevent stale closure bugs in Leaflet map events & store subscriptions
  const showProjectsLayerRef = useRef(showProjectsLayer);
  showProjectsLayerRef.current = showProjectsLayer;

  const showIdeasLayerRef = useRef(showIdeasLayer);
  showIdeasLayerRef.current = showIdeasLayer;

  const getFilteredProjectsRef = useRef(getFilteredProjects);
  getFilteredProjectsRef.current = getFilteredProjects;

  const getVisibleIdeasRef = useRef(getVisibleIdeas);
  getVisibleIdeasRef.current = getVisibleIdeas;

  const renderMarkers = (targetMap?: L.Map) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map) return;

    if (!markersLayerRef.current || !map.hasLayer(markersLayerRef.current)) {
      markersLayerRef.current = L.layerGroup().addTo(map);
    }
    markersLayerRef.current.clearLayers();

    if (!showIdeasLayerRef.current) {
      return;
    }

    const targetIdeas = getVisibleIdeasRef.current();
    const clusters = computeClusters(map, targetIdeas, 48);

    clusters.forEach((cluster) => {
      if (!cluster.isCluster) {
        // --- 1. SINGLE IDEA MARKER ---
        const idea = cluster.ideas[0];
        const isPending = idea.status === 'pending';
        const catConfig = CATEGORIES.find((c) => c.id === idea.category) || CATEGORIES[0];

        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              background-color: ${catConfig.color};
              color: #ffffff;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 15px;
              border: ${isPending ? '2.5px dashed #F59E0B' : '2.5px solid #FBF9F5'};
              box-shadow: ${isPending ? '0 0 12px rgba(245, 158, 11, 0.8)' : '0 4px 8px rgba(0,0,0,0.35)'};
              cursor: pointer;
              position: relative;
            ">
              ${catConfig.icon}
              ${
                isPending
                  ? `
                <span style="
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  background: #F59E0B;
                  color: #1A1D1A;
                  font-size: 9px;
                  font-weight: 800;
                  width: 15px;
                  height: 15px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: 1.5px solid #1A1D1A;
                ">⏳</span>
              `
                  : ''
              }
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([idea.lat, idea.lng], { icon: customIcon });

        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 270px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 15px;">${catConfig.icon}</span>
                <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #85A38C; letter-spacing: 0.05em;">
                  ${catConfig.label}
                </span>
              </div>
              ${
                isPending
                  ? `
                <span style="font-size: 9px; font-weight: 700; background: #854D0E; color: #FEF3C7; padding: 2px 6px; border-radius: 4px;">
                  Wacht op goedkeuring
                </span>
              `
                  : `
                <span style="font-size: 9px; font-weight: 700; background: #14532D; color: #DCFCE7; padding: 2px 6px; border-radius: 4px;">
                  Goedgekeurd
                </span>
              `
              }
            </div>
            <h4 style="font-weight: 700; font-size: 14px; color: #FBF9F5; line-height: 1.3; margin-bottom: 6px;">
              ${idea.title}
            </h4>
            <p style="font-size: 12px; color: #D5CDC0; line-height: 1.4; margin-bottom: 8px;">
              ${idea.description}
            </p>
            <div style="font-size: 10px; color: #8C7B6B; border-top: 1px solid #333; padding-top: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span>Door: ${idea.authorName || 'Inwoner'}</span>
              <span>❤️ ${idea.votesCount} steunbetuigingen</span>
            </div>
            ${
              isPending
                ? `
              <div style="margin-top: 10px; border-top: 1px dashed #444; padding-top: 8px;">
                <button 
                  onclick="window.__approveMapIdea('${idea.id}')"
                  style="width: 100%; background: #16A34A; color: #ffffff; border: none; border-radius: 8px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
                >
                  ✓ Nu goedkeuren en publiceren
                </button>
              </div>
            `
                : ''
            }
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);
      } else {
        // --- 2. CLUSTERED BUNDLE MARKER ---
        const count = cluster.ideas.length;
        const hasPending = cluster.ideas.some((i) => i.status === 'pending');

        const clusterIcon = L.divIcon({
          className: 'custom-cluster-marker',
          html: `
            <div style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: #1A1D1A;
              border: 3px solid ${hasPending ? '#F59E0B' : '#4ADE80'};
              color: #FBF9F5;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 0 4px ${hasPending ? 'rgba(245, 158, 11, 0.25)' : 'rgba(74, 222, 128, 0.25)'};
              user-select: none;
              cursor: pointer;
            ">
              <span style="font-size: 14px; font-weight: 800; line-height: 1; font-family: 'Space Grotesk', monospace;">${count}</span>
              <span style="font-size: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; color: #85A38C; margin-top: 1px;">ideeën</span>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker([cluster.centerLat, cluster.centerLng], { icon: clusterIcon });

        // On click: zoom in smoothly to fit cluster bounds!
        marker.on('click', (ev) => {
          L.DomEvent.stopPropagation(ev);
          const bounds = L.latLngBounds(cluster.ideas.map((i) => [i.lat, i.lng]));
          const curZoom = map.getZoom();
          if (curZoom < 18 && bounds.getNorthEast().distanceTo(bounds.getSouthWest()) > 1) {
            map.fitBounds(bounds, { padding: [60, 60], maxZoom: 18 });
          } else {
            map.setView([cluster.centerLat, cluster.centerLng], Math.min(18, curZoom + 2));
          }
        });

        marker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 280px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 6px;">
              <span style="font-size: 12px; font-weight: 700; color: #4ADE80; text-transform: uppercase; letter-spacing: 0.05em;">
                📍 ${count} Ideeën gebundeld
              </span>
              <span style="font-size: 10px; color: #8C7B6B;">Klik om in te zoomen</span>
            </div>
            <div style="max-height: 170px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; padding-right: 2px;">
              ${cluster.ideas
                .map((m) => {
                  const c = CATEGORIES.find((cat) => cat.id === m.category) || CATEGORIES[0];
                  return `
                    <div style="background: #242824; border: 1px solid #3A403A; border-radius: 6px; padding: 6px 8px;">
                      <div style="font-size: 10px; color: #85A38C; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 4px;">
                        <span>${c.icon}</span>
                        <span>${c.label}</span>
                        ${m.status === 'pending' ? '<span style="color: #F59E0B; margin-left: auto;">(⏳ ter keuring)</span>' : ''}
                      </div>
                      <div style="font-size: 12px; font-weight: 600; color: #FBF9F5; margin-top: 2px;">${m.title}</div>
                    </div>
                  `;
                })
                .join('')}
            </div>
            <button 
              onclick='window.__zoomIntoCluster(${cluster.centerLat}, ${cluster.centerLng})'
              style="width: 100%; margin-top: 8px; background: #3D5A45; color: white; border: none; border-radius: 8px; padding: 7px 12px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
            >
              🔍 Inzoomen om ideeën los te tonen
            </button>
          </div>
        `);

        markersLayerRef.current?.addLayer(marker);
      }
    });
  };

  // --- RENDERING WONINGBOUWPROJECTEN OP DE KAART (AFBEELDING 2) ---
  const renderProjectMarkers = (targetMap?: L.Map) => {
    const map = targetMap || mapInstanceRef.current;
    if (!map) return;

    if (!projectMarkersLayerRef.current || !map.hasLayer(projectMarkersLayerRef.current)) {
      projectMarkersLayerRef.current = L.layerGroup().addTo(map);
    }
    projectMarkersLayerRef.current.clearLayers();
    projectMarkersMapRef.current.clear();

    if (!showProjectsLayerRef.current) {
      return;
    }

    const filtered = getFilteredProjectsRef.current();

    filtered.forEach((prj) => {
      const statusInfo =
        PROJECT_STATUS_BADGES[prj.status] || PROJECT_STATUS_BADGES['In verkenning'];

      const projectIcon = L.divIcon({
        className: 'custom-project-marker',
        html: `
          <div class="project-marker-inner" style="
            background-color: #141714;
            color: #ffffff;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2.5px solid ${statusInfo.border};
            box-shadow: 0 4px 14px rgba(0,0,0,0.7), 0 0 12px ${statusInfo.glow};
            cursor: pointer;
            position: relative;
          ">
            <span style="
              font-size: 21px;
              line-height: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
              user-select: none;
            " role="img" aria-label="Woningbouwproject">🏠</span>
            <span style="
              position: absolute;
              bottom: -4px;
              right: -4px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: ${statusInfo.dot};
              border: 2px solid #141714;
              box-shadow: 0 1px 3px rgba(0,0,0,0.6);
            "></span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -19],
      });

      const marker = L.marker([prj.coords[0], prj.coords[1]], {
        icon: projectIcon,
        zIndexOffset: 600,
      });

      marker.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 290px; padding: 4px; color: #FBF9F5;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 14px;">🏠</span>
              <span style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #85A38C; letter-spacing: 0.05em;">
                ${prj.kern}
              </span>
            </div>
            <span style="font-size: 10px; font-weight: 700; background: ${statusInfo.border}; color: #ffffff; padding: 2px 7px; border-radius: 9999px;">
              ${prj.status}
            </span>
          </div>
          <h4 style="font-weight: 700; font-size: 14px; color: #FBF9F5; line-height: 1.3; margin: 0 0 4px 0;">
            ${prj.naam}
          </h4>
          <div style="font-size: 11px; color: #A8A29E; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
            <span>📍</span>
            <span>${prj.locatie}</span>
          </div>
          <p style="font-size: 12px; color: #D5CDC0; line-height: 1.4; margin-bottom: 8px;">
            ${prj.omschrijving}
          </p>
          <div style="background: #202420; border: 1px solid #333; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
            <div>
              <span style="color: #8C7B6B; display: block; font-size: 10px;">Capaciteit:</span>
              <strong style="color: #4ADE80;">${prj.aantalWoningen} woningen</strong>
            </div>
            <div>
              <span style="color: #8C7B6B; display: block; font-size: 10px;">Type:</span>
              <span style="color: #E2DDD5; font-size: 11px;">${prj.capaciteitType}</span>
            </div>
          </div>
          <div style="font-size: 10px; color: #8C7B6B; margin-bottom: 6px;">
            Ontwikkelaar: <span style="color: #D5CDC0;">${prj.ontwikkelaar}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
            ${prj.doelgroepen
              .map(
                (d) =>
                  `<span style="font-size: 9px; background: #1A1D1A; border: 1px solid #3A403A; color: #85A38C; padding: 2px 6px; border-radius: 4px;">${d}</span>`
              )
              .join('')}
          </div>
          <button 
            onclick="window.__zoomToProject('${prj.id}')"
            style="width: 100%; background: #3D5A45; color: #ffffff; border: none; border-radius: 8px; padding: 6px 10px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
          >
            🔍 Zoom in op dit project
          </button>
        </div>
      `);

      marker.on('click', () => {
        setSelectedProject(prj);
      });

      projectMarkersMapRef.current.set(prj.id, marker);
      projectMarkersLayerRef.current?.addLayer(marker);
    });
  };

  const handleSelectProjectCard = (prj: WoningbouwProject) => {
    setSelectedProject(prj);
    if (!showProjectsLayer) {
      setShowProjectsLayer(true);
      showProjectsLayerRef.current = true;
    }
    if (mapInstanceRef.current) {
      renderProjectMarkers(mapInstanceRef.current);
      mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      mapInstanceRef.current.flyTo(prj.coords, 16, { duration: 1.2 });
      setTimeout(() => {
        const marker = projectMarkersMapRef.current.get(prj.id);
        if (marker) {
          marker.openPopup();
        }
      }, 700);
    }
  };

  const handleCenterHollandscheRading = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([52.1795, 5.1795], 15, { duration: 1 });
    }
  };

  const handleCenterAllProjects = () => {
    if (!mapInstanceRef.current) return;
    const filtered = getFilteredProjects();
    if (filtered.length > 0) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.coords[0], p.coords[1]]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  };

  // Attach global window handlers for popup interactive buttons
  useEffect(() => {
    (window as any).__approveMapIdea = (ideaId: string) => {
      store.moderateIdea(ideaId, 'approved');
      setNotificationMsg('Het idee is goedgekeurd en direct zichtbaar op de kaart!');
      setTimeout(() => setNotificationMsg(null), 4500);
    };

    (window as any).__zoomIntoCluster = (lat: number, lng: number) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], Math.min(18, mapInstanceRef.current.getZoom() + 2));
      }
    };

    (window as any).__zoomToProject = (prjId: string) => {
      const prj = WONINGBOUW_PROJECTEN.find((p) => p.id === prjId);
      if (prj && mapInstanceRef.current) {
        setSelectedProject(prj);
        mapInstanceRef.current.flyTo(prj.coords, 17, { duration: 1.2 });
      }
    };

    return () => {
      delete (window as any).__approveMapIdea;
      delete (window as any).__zoomIntoCluster;
      delete (window as any).__zoomToProject;
    };
  }, []);

  // Map initialization
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialView: MapViewConfig = store.getMapView();

    const map = L.map(mapContainerRef.current, {
      center: [initialView.lat, initialView.lng],
      zoom: initialView.zoom,
      scrollWheelZoom: false,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // 1. OpenStreetMap Layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom: 19,
    });
    osmTileLayerRef.current = osmLayer;

    // 2. Satellite Tile Layer
    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
        maxZoom: 19,
      }
    );
    satTileLayerRef.current = satLayer;

    // Start with OSM
    osmLayer.addTo(map);

    // Project boundary overlay loaded dynamically from store
    const initialPolygonCoords = store.getPlangebiedCoords();
    const polygon = L.polygon(initialPolygonCoords, {
      color: '#2D5A3D',
      weight: 2.5,
      dashArray: '5, 5',
      fillColor: '#3D5A45',
      fillOpacity: 0.18,
    }).addTo(map);
    plangebiedPolygonRef.current = polygon;

    // Map click handler to place pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      setPlacedCoord({ lat: e.latlng.lat, lng: e.latlng.lng });
      setIsPlacingPin(false);

      if (tempMarkerRef.current) {
        map.removeLayer(tempMarkerRef.current);
      }

      const tempIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="
            background-color: #1A1D1A;
            color: #FBF9F5;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            border: 3px solid #E11D48;
            box-shadow: 0 0 15px rgba(225, 29, 72, 0.6);
          ">
            📍
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      tempMarkerRef.current = L.marker([e.latlng.lat, e.latlng.lng], { icon: tempIcon }).addTo(map);
    });

    // Re-evaluate idea clusters on zoom or pan so bundles expand on zoom-in!
    map.on('zoomend moveend', () => {
      if (mapInstanceRef.current) {
        renderMarkers(mapInstanceRef.current);
      }
    });

    renderMarkers(map);
    renderProjectMarkers(map);

    const unsub = store.subscribe(() => {
      const approved = store.getApprovedIdeas();
      const all = store.getMapIdeas();
      const adminActive = store.isSystemAdmin();
      const projEnabled = store.isProjectsModuleEnabled();
      setIdeas(approved);
      setAllIdeas(all);
      setIsSystemAdmin(adminActive);
      setProjectsModuleEnabled(projEnabled);

      const updatedCoords = store.getPlangebiedCoords();
      setPlangebiedCoords(updatedCoords);
      if (plangebiedPolygonRef.current) {
        plangebiedPolygonRef.current.setLatLngs(updatedCoords);
      }
      if (mapInstanceRef.current) {
        renderMarkers(mapInstanceRef.current);
        renderProjectMarkers(mapInstanceRef.current);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      projectMarkersLayerRef.current = null;
      unsub();
    };
  }, []);

  // Update idea markers when filters or visibility toggles change
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderMarkers(mapInstanceRef.current);
    }
  }, [selectedCategoryFilter, ideas, allIdeas, showPendingIdeas, isSystemAdmin, showIdeasLayer]);

  // Update project markers when project filters or module visibility change
  useEffect(() => {
    if (mapInstanceRef.current) {
      renderProjectMarkers(mapInstanceRef.current);
    }
  }, [
    projectsModuleEnabled,
    showProjectsLayer,
    selectedProjectKern,
    selectedProjectStatus,
    projectSearchQuery,
  ]);

  // Handle basemap switching (OpenStreetMap <-> Satelliet)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseMap === 'osm') {
      if (satTileLayerRef.current && map.hasLayer(satTileLayerRef.current)) {
        map.removeLayer(satTileLayerRef.current);
      }
      if (osmTileLayerRef.current && !map.hasLayer(osmTileLayerRef.current)) {
        osmTileLayerRef.current.addTo(map);
      }
      if (plangebiedPolygonRef.current) {
        plangebiedPolygonRef.current.setStyle({
          color: '#2D5A3D',
          weight: 2.5,
          dashArray: '5, 5',
          fillColor: '#3D5A45',
          fillOpacity: 0.2,
        });
      }
    } else {
      if (osmTileLayerRef.current && map.hasLayer(osmTileLayerRef.current)) {
        map.removeLayer(osmTileLayerRef.current);
      }
      if (satTileLayerRef.current && !map.hasLayer(satTileLayerRef.current)) {
        satTileLayerRef.current.addTo(map);
      }
      if (plangebiedPolygonRef.current) {
        plangebiedPolygonRef.current.setStyle({
          color: '#4ADE80',
          weight: 3,
          dashArray: '5, 5',
          fillColor: '#22C55E',
          fillOpacity: 0.25,
        });
      }
    }
  }, [baseMap]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  // Center on Plangebied
  const handleCenterPlangebied = () => {
    if (mapInstanceRef.current && plangebiedPolygonRef.current) {
      mapInstanceRef.current.fitBounds(plangebiedPolygonRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 16,
      });
    } else if (mapInstanceRef.current) {
      const def = store.getMapView();
      mapInstanceRef.current.setView([def.lat, def.lng], def.zoom);
    }
  };

  // Administrator Action: Center map on all ideas
  const handleCenterAllIdeas = () => {
    if (!mapInstanceRef.current) return;
    const targetIdeas = getVisibleIdeas();
    if (targetIdeas.length > 0) {
      const bounds = L.latLngBounds(targetIdeas.map((i) => [i.lat, i.lng]));
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 16,
      });
      setNotificationMsg(`Kaart gecentreerd op alle ${targetIdeas.length} zichtbare ideeën.`);
      setTimeout(() => setNotificationMsg(null), 3500);
    } else {
      handleCenterPlangebied();
    }
  };

  // Administrator Action: Save current map view as default centralization for all users
  const handleSaveDefaultCentralization = () => {
    if (!mapInstanceRef.current) return;
    const center = mapInstanceRef.current.getCenter();
    const zoom = mapInstanceRef.current.getZoom();
    store.setMapView(center.lat, center.lng, zoom);
    setNotificationMsg(
      `Standaard kaartcentrering opgeslagen! (Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}, Zoom: ${zoom})`
    );
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Administrator Action: Reset default centralization
  const handleResetCentralization = () => {
    store.resetMapView();
    const def = store.getMapView();
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([def.lat, def.lng], def.zoom);
    }
    setNotificationMsg('Standaard kaartcentrering hersteld naar fabrieksinstelling.');
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Administrator Action: Approve all pending ideas in one click
  const handleApproveAllPending = () => {
    const count = store.approveAllPendingIdeas();
    if (count > 0) {
      setNotificationMsg(`${count} ideeën succesvol goedgekeurd en gepubliceerd op de kaart!`);
    } else {
      setNotificationMsg('Er waren geen ideeën in afwachting van goedkeuring.');
    }
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  const handleStartPlacing = () => {
    setIsPlacingPin(true);
    setPlacedCoord(null);
    if (tempMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(tempMarkerRef.current);
      tempMarkerRef.current = null;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placedCoord || !formTitle || !formDescription) return;

    setIsSubmitting(true);
    const newIdea = store.addMapIdea({
      category: formCategory,
      title: formTitle,
      description: formDescription,
      lat: placedCoord.lat,
      lng: placedCoord.lng,
      authorName: formName || 'Inwoner Hollandsche Rading',
      authorEmail: formEmail || undefined,
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);

    if (newIdea.status === 'approved') {
      setNotificationMsg('Jouw idee is als beheerder direct goedgekeurd en zichtbaar op de kaart!');
      setTimeout(() => setNotificationMsg(null), 4500);
    }

    // Reset after 3.5s
    setTimeout(() => {
      setSubmitSuccess(false);
      setPlacedCoord(null);
      setFormTitle('');
      setFormDescription('');
      setFormName('');
      setFormEmail('');
      if (tempMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(tempMarkerRef.current);
        tempMarkerRef.current = null;
      }
    }, 3500);
  };

  const displayIdeasCount = getVisibleIdeas().length;
  const filteredProjects = getFilteredProjects();

  return (
    <section id="interactieve-kaart" className="py-24 md:py-36 bg-[#1A1D1A] text-[#FBF9F5] border-b border-[#2C302C]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] font-mono-subtle text-[#8C7B6B] block mb-3">
              04 / Interactieve Gebiedskaart
            </span>
            <h2
              className="font-light tracking-tight text-[#FBF9F5] leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)' }}
            >
              ZET JE IDEE
              <br />
              <span className="font-editorial italic text-[#85A38C]">
                OP DE KAART.
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#D5CDC0] font-light mt-4">
              Wijs een exacte plek aan in het verkenningsgebied. Deel een idee, een waarschuwing of juist wat hier absoluut behouden moet blijven. Dicht bij elkaar gelegen ideeën worden gebundeld en vouwen uit bij inzoomen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleStartPlacing}
              className={`px-6 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-lg ${
                isPlacingPin
                  ? 'bg-[#E11D48] text-white ring-4 ring-[#E11D48]/30 animate-pulse'
                  : 'bg-[#FBF9F5] text-[#1A1D1A] hover:bg-[#E8E2D5]'
              }`}
              id="start-place-pin-btn"
            >
              <MapPin className="w-4 h-4" />
              <span>{isPlacingPin ? 'Klik nu op de kaart...' : 'Plaats een idee op de kaart'}</span>
            </button>

            {/* Quick beheerder indicator & module switcher */}
            <button
              type="button"
              onClick={() => {
                if (!isSystemAdmin) {
                  setShowAdminLoginModal(true);
                } else {
                  const next = store.toggleProjectsModule();
                  setNotificationMsg(
                    next
                      ? '✓ Woningbouwprojecten module INGESCHAKELD voor bezoekers!'
                      : 'Woningbouwprojecten module UITGESCHAKELD voor bezoekers.'
                  );
                  setTimeout(() => setNotificationMsg(null), 3500);
                }
              }}
              className={`px-4 py-3.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 shadow-sm ${
                isSystemAdmin
                  ? 'bg-[#202720] border-[#3A4D3B] text-[#85A38C] hover:border-[#4ADE80]'
                  : 'bg-[#242824] border-[#3A403A] text-[#8C7B6B] hover:text-[#D5CDC0] hover:border-[#555]'
              }`}
              title={
                isSystemAdmin
                  ? 'Systeembeheerder actief: klik om projectenmodule direct te wisselen'
                  : 'Beheerder aanmelden om modules aan te zetten'
              }
            >
              <Shield className={`w-4 h-4 ${isSystemAdmin ? 'text-[#4ADE80]' : 'text-[#8C7B6B]'}`} />
              <span>
                {isSystemAdmin
                  ? `Beheerder • Projecten ${projectsModuleEnabled ? 'Aan' : 'Uit'}`
                  : 'Beheerder Toegang'}
              </span>
            </button>
          </div>
        </div>

        {/* BEHEERDER TOOLBAR & CENTRALISATIE CONTROLS */}
        {isSystemAdmin && (
          <div className="mb-6 p-4 rounded-2xl bg-[#202720] border border-[#3A4D3B] text-xs text-[#D5CDC0] shadow-xl space-y-4 animate-fadeIn">
            {/* Row 1: Kaartcentrering & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#2D5A3D] text-[#85A38C]">
                  <Shield className="w-4 h-4 text-[#4ADE80]" />
                </span>
                <div>
                  <span className="font-bold text-white block">Systeembeheer: Kaartweergave & Centrering</span>
                  <span className="text-[11px] text-[#8C7B6B]">
                    Stel de officiële kaartcentrering in voor alle bezoekers of keur ingediende ideeën direct goed.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCenterAllIdeas}
                  className="px-3 py-1.5 rounded-lg bg-[#293329] hover:bg-[#344234] text-[#E8E2D5] border border-[#3A4D3B] transition-colors flex items-center gap-1.5 font-medium"
                  title="Centreer kaart op alle geregistreerde ideeën"
                >
                  <Crosshair className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Centreer op ideeën</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDefaultCentralization}
                  className="px-3 py-1.5 rounded-lg bg-[#2D5A3D] hover:bg-[#244730] text-white border border-[#4ADE80]/30 transition-colors flex items-center gap-1.5 font-semibold shadow-xs"
                  title="Huidig centrum en zoomniveau opslaan als standaard voor bezoekers"
                >
                  <Save className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Centrering opslaan</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCentralization}
                  className="px-2.5 py-1.5 rounded-lg bg-[#242824] hover:bg-[#2d332d] text-[#8C7B6B] hover:text-[#D5CDC0] border border-[#3A403A] transition-colors flex items-center gap-1"
                  title="Herstel naar fabrieksinstelling"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Herstel</span>
                </button>
              </div>
            </div>

            {/* Row 2: Moderation quick banner */}
            <div className="pt-2 border-t border-[#2F3B2F] flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#D5CDC0]">
                  <input
                    type="checkbox"
                    checked={showPendingIdeas}
                    onChange={(e) => setShowPendingIdeas(e.target.checked)}
                    className="rounded bg-[#1A1D1A] border-[#3A403A] text-[#3D5A45] focus:ring-0"
                  />
                  <span>Toon ook wachtend op moderatie ({pendingIdeas.length})</span>
                </label>
                <span className="text-[#8C7B6B]">•</span>
                <span className="text-[#85A38C]">
                  {ideas.length} openbaar goedgekeurd
                </span>
              </div>

              {pendingIdeas.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[#F59E0B] font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{pendingIdeas.length} idee(ën) wachten op goedkeuring</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleApproveAllPending}
                    className="px-2.5 py-1 rounded-md bg-[#F59E0B] hover:bg-[#D97706] text-[#1A1D1A] font-bold text-[10px] transition-colors"
                  >
                    ✓ Alles nu goedkeuren
                  </button>
                </div>
              )}
            </div>

            {/* Row 3: BEHEERDER TOGGLE VOOR WONINGBOUWPROJECTEN MODULE (AFBEELDING 2) */}
            <div className="pt-3 border-t border-[#2F3B2F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#171E17] -mx-4 -mb-4 p-4 rounded-b-2xl">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-[#2D5A3D]/40 text-[#4ADE80] border border-[#4ADE80]/30 shrink-0">
                  <Building2 className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">
                      Module Woningbouwprojecten (Afbeelding 2)
                    </span>
                    {projectsModuleEnabled ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#166534] text-[#DCFCE7] border border-[#22C55E]/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                        INGESCHAKELD VOOR PUBLIEK
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#333] text-[#A8A29E] border border-[#444]">
                        UITGESCHAKELD (VERBORGEN)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#8C7B6B] mt-0.5 max-w-xl">
                    Als beheerder bepaal je of de officiële woningbouwprojecten (kaartlaag 2, plancapaciteit De Bilt & Hollandsche Rading) zichtbaar zijn op de interactieve kaart.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const next = store.toggleProjectsModule();
                    setNotificationMsg(
                      next
                        ? '✓ Module Woningbouwprojecten is nu INGESCHAKELD en direct zichtbaar voor bezoekers!'
                        : 'Module Woningbouwprojecten is nu UITGESCHAKELD voor reguliere bezoekers.'
                    );
                    setTimeout(() => setNotificationMsg(null), 4500);
                  }}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 shadow-md ${
                    projectsModuleEnabled
                      ? 'bg-[#E11D48] hover:bg-[#BE123C] text-white'
                      : 'bg-[#22C55E] hover:bg-[#16A34A] text-[#111411]'
                  }`}
                >
                  {projectsModuleEnabled ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Module Uitschakelen</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>Module Nu Aanzetten</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KAARTLAGEN KEUZEBALK */}
        <div className="mb-4 p-3 rounded-2xl bg-[#202720] border border-[#303D31] flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[#8C7B6B] font-mono-subtle flex items-center gap-1.5 mr-1 text-xs">
              <Layers className="w-4 h-4 text-[#4ADE80]" /> Kaartlagen:
            </span>

            <button
              type="button"
              onClick={() => {
                const next = !showIdeasLayer;
                setShowIdeasLayer(next);
                showIdeasLayerRef.current = next;
                if (mapInstanceRef.current) {
                  renderMarkers(mapInstanceRef.current);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showIdeasLayer
                  ? 'bg-[#2E4733] text-[#DCFCE7] shadow-xs border border-[#4ADE80]/40'
                  : 'bg-[#1A1D1A] text-[#8C7B6B] border border-[#333] hover:text-[#D5CDC0]'
              }`}
            >
              <span>💡</span>
              <span>Ideeën van inwoners ({displayIdeasCount})</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  showIdeasLayer ? 'bg-[#1A2E20] text-[#4ADE80]' : 'bg-[#2A2E2A] text-[#8C7B6B]'
                }`}
              >
                {showIdeasLayer ? 'Aan' : 'Uit'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !showProjectsLayer;
                setShowProjectsLayer(next);
                showProjectsLayerRef.current = next;
                if (mapInstanceRef.current) {
                  renderProjectMarkers(mapInstanceRef.current);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                showProjectsLayer
                  ? 'bg-[#1E3A5F] text-[#BAE6FD] shadow-xs border border-[#38BDF8]/40'
                  : 'bg-[#1A1D1A] text-[#8C7B6B] border border-[#333] hover:text-[#D5CDC0]'
              }`}
            >
              <span>🏠</span>
              <span>Woningbouwprojecten ({filteredProjects.length})</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  showProjectsLayer ? 'bg-[#132842] text-[#38BDF8]' : 'bg-[#2A2E2A] text-[#8C7B6B]'
                }`}
              >
                {showProjectsLayer ? 'Aan' : 'Uit'}
              </span>
            </button>
          </div>

          {showProjectsLayer && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCenterHollandscheRading}
                className="px-3 py-1.5 rounded-lg bg-[#242824] hover:bg-[#2C332C] text-xs text-[#A3D9AE] border border-[#3A403A] transition-colors flex items-center gap-1.5"
              >
                <span>📍</span>
                <span>Focus Hollandsche Rading</span>
              </button>
              <button
                type="button"
                onClick={handleCenterAllProjects}
                className="px-3 py-1.5 rounded-lg bg-[#242824] hover:bg-[#2C332C] text-xs text-[#85A38C] border border-[#3A403A] transition-colors flex items-center gap-1.5"
              >
                <span>🗺️</span>
                <span>Alle projecten De Bilt ({WONINGBOUW_PROJECTEN.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter bar voor ideeën */}
        {showIdeasLayer && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 text-xs font-medium no-scrollbar">
            <span className="text-[#8C7B6B] flex items-center gap-1 shrink-0 font-mono-subtle">
              <Filter className="w-3.5 h-3.5" /> Filter Ideeën:
          </span>
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-[#FBF9F5] text-[#1A1D1A]'
                : 'bg-[#2A2E2A] text-[#D5CDC0] hover:bg-[#333]'
            }`}
          >
            Alle ({displayIdeasCount})
          </button>
          {CATEGORIES.map((cat) => {
            const activePool = isSystemAdmin && showPendingIdeas ? allIdeas : ideas;
            const count = activePool.filter((i) => i.category === cat.id).length;
            const active = selectedCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full shrink-0 transition-colors flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#3D5A45] text-white font-semibold'
                    : 'bg-[#242824] text-[#D5CDC0] hover:bg-[#2F352F]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="text-[10px] text-[#8C7B6B]">({count})</span>
              </button>
            );
          })}
        </div>
      )}

        {/* Notice bar when pin placement active */}
        {isPlacingPin && (
          <div className="mb-4 p-3 bg-[#E11D48]/20 border border-[#E11D48]/40 rounded-xl text-xs sm:text-sm text-[#FBF9F5] flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E11D48] animate-bounce" />
              <span>
                <strong>Instructie:</strong> Klik op een gewenste locatie binnen of rond het verkenningsgebied ten oosten van de Tolakkerweg.
              </span>
            </div>
            <button
              onClick={() => setIsPlacingPin(false)}
              className="p-1 hover:bg-[#E11D48]/30 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map canvas */}
          <div className={`transition-all duration-300 ${placedCoord ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <div className="relative rounded-2xl overflow-hidden border border-[#3A403A] bg-[#242824] shadow-2xl">
              <div
                ref={mapContainerRef}
                className="w-full h-[520px] md:h-[600px] z-0"
                id="leaflet-participation-map"
              />

              {/* Toast Notification Banner on Map */}
              {notificationMsg && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1F2C21]/95 backdrop-blur-md border border-[#3D5A45] text-[#D5F5DC] px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
                  <span className="font-medium">{notificationMsg}</span>
                </div>
              )}

              {/* Top Left: Basemap Switcher */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div className="bg-[#1A1D1A]/90 backdrop-blur-md p-1.5 rounded-xl text-xs text-[#FBF9F5] shadow-lg flex items-center gap-1 border border-[#2D332E]">
                  <button
                    type="button"
                    onClick={() => setBaseMap('osm')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      baseMap === 'osm'
                        ? 'bg-[#3D5A45] text-white shadow-xs'
                        : 'text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A]'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>OpenStreetMap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBaseMap('satellite')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      baseMap === 'satellite'
                        ? 'bg-[#3D5A45] text-white shadow-xs'
                        : 'text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A]'
                    }`}
                  >
                    <Satellite className="w-3.5 h-3.5" />
                    <span>Satelliet</span>
                  </button>
                </div>
              </div>

              {/* Top Right: Zoom, Centralize & Fit Controls */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-[#1A1D1A]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#2D332E] shadow-md">
                <button
                  type="button"
                  onClick={() => handleZoom(1)}
                  className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors"
                  title="Inzoomen (vouwt gebundelde ideeën uit)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleZoom(-1)}
                  className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors"
                  title="Uitzoomen (bundelt nabijgelegen ideeën)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCenterAllIdeas}
                  className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors border-t border-[#333]"
                  title="Centreren op alle ideeën"
                >
                  <Crosshair className="w-4 h-4 text-[#85A38C]" />
                </button>
                <button
                  type="button"
                  onClick={handleCenterPlangebied}
                  className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors"
                  title="Standaard centrering / Plangebied"
                >
                  <Compass className="w-4 h-4" />
                </button>
              </div>

              {/* Map Status Legenda Overlay (Afbeelding 2) */}
              {showProjectsLayer && (
                <div className="absolute bottom-12 left-3 z-10 bg-[#161916]/95 backdrop-blur-md p-3 rounded-xl border border-[#333] shadow-xl text-xs space-y-1.5 animate-fadeIn max-w-[210px]">
                  <div className="font-bold text-[#FBF9F5] text-[10px] uppercase tracking-wider font-mono-subtle mb-1.5 flex items-center justify-between border-b border-[#333] pb-1">
                    <span className="flex items-center gap-1.5 text-[#38BDF8]">
                      <span>🏠</span>
                      <span>Projecten (Huisje)</span>
                    </span>
                    <span className="text-[#85A38C] text-[9px]">({filteredProjects.length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00BA7C] shrink-0" />
                    <span className="text-[#D5CDC0]">In aanbouw</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0084D1] shrink-0" />
                    <span className="text-[#D5CDC0]">Verkoop gestart</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                    <span className="text-[#D5CDC0]">In voorbereiding</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D88935] shrink-0" />
                    <span className="text-[#D5CDC0]">In verkenning</span>
                  </div>
                </div>
              )}

              {/* Bottom Info Bar */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto z-10 bg-[#1A1D1A]/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] text-[#D5CDC0] border border-[#333] flex items-center gap-2.5 shadow-md flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shrink-0" />
                <span>
                  Plangebied Tolakkerweg-Oost: <strong>{currentAreaHa} hectare</strong> • {displayIdeasCount} ideeën
                  {showProjectsLayer && (
                    <span className="text-[#85A38C]"> • {filteredProjects.length} woningbouwprojecten</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Modal Form (Opens when point placed) */}
          {placedCoord && (
            <div className="lg:col-span-5 bg-[#242824] border border-[#3A403A] rounded-2xl p-6 sm:p-8 shadow-2xl animate-fadeIn relative">
              <button
                onClick={() => setPlacedCoord(null)}
                className="absolute top-4 right-4 p-1 text-[#8C7B6B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {!submitSuccess ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-subtle text-[#85A38C]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Geselecteerde coördinaat: {placedCoord.lat.toFixed(4)}, {placedCoord.lng.toFixed(4)}</span>
                  </div>

                  <h3 className="text-xl font-light text-[#FBF9F5]">
                    Deel jouw idee of signaal
                  </h3>

                  {/* Category Picker */}
                  <div>
                    <label className="block text-xs font-mono-subtle text-[#D5CDC0] uppercase mb-1.5">
                      Kies een categorie *
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => setFormCategory(cat.id)}
                          className={`p-2 rounded-lg text-left text-xs transition-all flex flex-col items-start gap-1 border ${
                            formCategory === cat.id
                              ? 'bg-[#3D5A45] border-[#85A38C] text-white shadow-xs'
                              : 'bg-[#1A1D1A] border-[#333] text-[#D5CDC0] hover:border-[#555]'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="font-medium truncate w-full">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-xs font-mono-subtle text-[#D5CDC0] uppercase mb-1">
                      Korte titel *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Bijv. Veilige fietsoversteek bij N417"
                      maxLength={120}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1D1A] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                    />
                  </div>

                  {/* Text / Description */}
                  <div>
                    <label className="block text-xs font-mono-subtle text-[#D5CDC0] uppercase mb-1">
                      Wat wil je ons meegeven? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Beschrijf jouw suggestie, wens of zorg voor deze specifieke plek..."
                      maxLength={1000}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1D1A] border border-[#3A403A] text-sm text-[#FBF9F5] focus:outline-none focus:border-[#85A38C]"
                    />
                  </div>

                  {/* Optional Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-mono-subtle text-[#8C7B6B] uppercase mb-1">
                        Naam (optioneel)
                      </label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Bijv. Buurtbewoner"
                        className="w-full px-3 py-2 rounded-lg bg-[#1A1D1A] border border-[#3A403A] text-xs text-[#FBF9F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono-subtle text-[#8C7B6B] uppercase mb-1">
                        E-mailadres (optioneel)
                      </label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="Voor terugkoppeling"
                        className="w-full px-3 py-2 rounded-lg bg-[#1A1D1A] border border-[#3A403A] text-xs text-[#FBF9F5]"
                      />
                    </div>
                  </div>

                  {/* Privacy & Moderation Notice */}
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#1A1D1A] text-[11px] text-[#8C7B6B] border border-[#333]">
                    <Lock className="w-3.5 h-3.5 text-[#85A38C] shrink-0 mt-0.5" />
                    <span>
                      <strong>Privacy & moderatie:</strong> Jouw naam en e-mail worden nooit openbaar weergegeven. Bijdragen worden na een korte controle goedgekeurd en direct zichtbaar op de kaart.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formTitle || !formDescription}
                    className="w-full py-3 rounded-xl bg-[#3D5A45] hover:bg-[#2F4535] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Verstuur mijn bijdrage</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#85A38C] mx-auto" />
                  <h4 className="text-xl font-light text-[#FBF9F5]">
                    Inzending ontvangen!
                  </h4>
                  <p className="text-xs text-[#D5CDC0] leading-relaxed max-w-sm mx-auto">
                    Hartelijk dank. Je idee is geregistreerd. Na goedkeuring door de beheerder is het direct te zien op de interactieve dorpskaart!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            INTEGRATIE AFBEELDING 2: WONINGBOUWPROJECTEN MODULE MET FILTERS & CARDS
        ========================================================================= */}
        {showProjectsLayer && (
          <div className="mt-14 pt-10 border-t border-[#2C332C] space-y-6 animate-fadeIn">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono-subtle text-[#4ADE80] mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>Kaartmodule 02 • Officiële Woningbouwprojecten</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-[#FBF9F5] tracking-tight">
                  Woningbouwprojecten Gemeente De Bilt & Dorpsrand
                </h3>
                <p className="text-xs sm:text-sm text-[#D5CDC0] font-light mt-1 max-w-3xl">
                  Actuele plancapaciteit en woningbouwlocaties in de gemeente (Afbeelding 2). Klik op een project om direct naar de locatie op de interactieve kaart hierboven te vliegen en de details te bekijken.
                </p>
              </div>

              <div className="text-xs text-[#8C7B6B] font-mono-subtle bg-[#242824] px-3.5 py-2 rounded-xl border border-[#3A403A] shrink-0 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                <span>{filteredProjects.length} van {WONINGBOUW_PROJECTEN.length} projecten getoond</span>
              </div>
            </div>

            {/* Filters Bar (Afbeelding 2) */}
            <div className="bg-[#242824] rounded-2xl p-4 border border-[#3A403A] shadow-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Kern Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span className="text-xs font-semibold text-[#D5CDC0]">Kern:</span>
                  <select
                    value={selectedProjectKern}
                    onChange={(e) => setSelectedProjectKern(e.target.value)}
                    className="text-xs bg-[#1A1D1A] border border-[#3A403A] rounded-lg px-2.5 py-1.5 font-medium text-[#FBF9F5] focus:outline-none focus:border-[#4ADE80]"
                  >
                    <option value="Alle kernen">Alle kernen ({WONINGBOUW_PROJECTEN.length})</option>
                    <option value="Hollandsche Rading">Hollandsche Rading (3)</option>
                    <option value="Bilthoven">Bilthoven (3)</option>
                    <option value="De Bilt">De Bilt (1)</option>
                    <option value="Maartensdijk">Maartensdijk (1)</option>
                    <option value="Groenekan / Westbroek">Groenekan / Westbroek (1)</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#D5CDC0]">Status:</span>
                  <select
                    value={selectedProjectStatus}
                    onChange={(e) => setSelectedProjectStatus(e.target.value)}
                    className="text-xs bg-[#1A1D1A] border border-[#3A403A] rounded-lg px-2.5 py-1.5 font-medium text-[#FBF9F5] focus:outline-none focus:border-[#4ADE80]"
                  >
                    <option value="Alle statussen">Alle statussen</option>
                    <option value="In aanbouw">In aanbouw</option>
                    <option value="Verkoop gestart">Verkoop gestart</option>
                    <option value="In voorbereiding">In voorbereiding</option>
                    <option value="In verkenning">In verkenning</option>
                  </select>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-[#8C7B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Zoek project of ontwikkelaar..."
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#1A1D1A] border border-[#3A403A] rounded-lg text-[#FBF9F5] placeholder-[#8C7B6B] focus:outline-none focus:border-[#4ADE80]"
                />
              </div>
            </div>

            {/* Project Cards Grid (Afbeelding 2) */}
            {filteredProjects.length === 0 ? (
              <div className="bg-[#242824] rounded-2xl p-8 text-center text-xs text-[#8C7B6B] border border-[#3A403A]">
                Geen woningbouwprojecten gevonden die aan de filters voldoen.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((prj) => {
                  const isSelected = selectedProject?.id === prj.id;
                  const statusInfo =
                    PROJECT_STATUS_BADGES[prj.status] || PROJECT_STATUS_BADGES['In verkenning'];

                  return (
                    <div
                      key={prj.id}
                      onClick={() => handleSelectProjectCard(prj)}
                      className={`bg-[#242824] rounded-2xl p-5 border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#4ADE80] ring-2 ring-[#4ADE80]/30 bg-[#2A332B]'
                          : 'border-[#3A403A] hover:border-[#4E7555] hover:bg-[#282E28]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono-subtle text-[#85A38C] uppercase font-bold tracking-wide flex items-center gap-1.5">
                            <span>🏠</span>
                            <span>{prj.kern}</span>
                          </span>
                          <span
                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: statusInfo.bg,
                              color: statusInfo.text,
                            }}
                          >
                            {prj.status}
                          </span>
                        </div>

                        <h4 className="text-base font-semibold text-[#FBF9F5] mb-1 leading-snug">
                          {prj.naam}
                        </h4>

                        <div className="flex items-center gap-1.5 text-xs text-[#8C7B6B] mb-2.5">
                          <MapPin className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                          <span>{prj.locatie}</span>
                        </div>

                        <p className="text-xs text-[#D5CDC0] line-clamp-3 mb-4 leading-relaxed font-light">
                          {prj.omschrijving}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-[#333]">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[#8C7B6B]">Aantal: </span>
                            <strong className="text-[#4ADE80]">{prj.aantalWoningen} woningen</strong>
                          </div>
                          <span className="text-[11px] text-[#A3D9AE] font-mono-subtle">
                            {prj.capaciteitType}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#8C7B6B] truncate">
                          Ontwikkelaar: <span className="text-[#D5CDC0]">{prj.ontwikkelaar}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prj.doelgroepen.map((d, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#1A1D1A] text-[#85A38C] px-2 py-0.5 rounded-md border border-[#3A403A]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectProjectCard(prj);
                          }}
                          className="w-full mt-2 py-2 rounded-xl bg-[#2D4532] hover:bg-[#38593E] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#4ADE80]/30 shadow-xs"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#4ADE80]" />
                          <span>Toon op interactieve kaart</span>
                          <ExternalLink className="w-3 h-3 text-[#A3D9AE] ml-1" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MODAL VOOR BEHEERDER INLOGGEN (WANNEER NOG NIET INGELOGD) */}
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#1C201C] border border-[#3A4D3B] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C382C] pb-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Shield className="w-5 h-5 text-[#4ADE80]" />
                  <span>Systeembeheer: Module Toegang</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="p-1 text-[#8C7B6B] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#D5CDC0]">
                Als beheerder kun je de module Woningbouwprojecten aanzetten of uitschakelen voor alle bezoekers.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const ok = store.loginSystemAdmin(adminPinInput);
                  if (ok) {
                    setShowAdminLoginModal(false);
                    setAdminPinInput('');
                    setAdminPinError('');
                    setNotificationMsg('Systeembeheerder geactiveerd. Je kunt de module nu beheren.');
                    setTimeout(() => setNotificationMsg(null), 4000);
                  } else {
                    setAdminPinError('Onjuiste toegangscode. Gebruik bijv. 2026.');
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-mono-subtle text-[#8C7B6B] uppercase mb-1">
                    Toegangscode (pincode 2026)
                  </label>
                  <input
                    type="password"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="Voer pincode in (bijv. 2026)"
                    className="w-full px-3 py-2 rounded-xl bg-[#141814] border border-[#3A403A] text-xs text-white focus:outline-none focus:border-[#4ADE80]"
                  />
                  {adminPinError && (
                    <p className="text-[11px] text-[#E11D48] mt-1">{adminPinError}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#2D5A3D] hover:bg-[#386E4A] text-white text-xs font-semibold transition-colors"
                  >
                    Aanmelden
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      store.loginSystemAdmin('2026');
                      setShowAdminLoginModal(false);
                      setNotificationMsg('Systeembeheerder direct geactiveerd.');
                      setTimeout(() => setNotificationMsg(null), 4000);
                    }}
                    className="px-3 py-2 rounded-xl bg-[#242824] hover:bg-[#2C332C] text-[#85A38C] text-xs font-semibold border border-[#3A403A] transition-colors"
                  >
                    1-Klik Toegang
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
