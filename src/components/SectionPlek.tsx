import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Map as MapIcon,
  Satellite,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Compass,
  MapPin,
  Download,
  CheckCircle2,
  Edit3,
  Check,
  RotateCcw,
  Undo2,
  X,
  Plus,
} from 'lucide-react';
import { store, calculatePolygonAreaHa, DEFAULT_PLANGEBIED_COORDS } from '../services/store';

type BaseMapType = 'osm' | 'satellite';

export const SectionPlek: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const osmTileLayerRef = useRef<L.TileLayer | null>(null);
  const satTileLayerRef = useRef<L.TileLayer | null>(null);
  const plangebiedGroupRef = useRef<L.LayerGroup | null>(null);
  const plangebiedPolygonRef = useRef<L.Polygon | null>(null);
  const vertexMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const [baseMap, setBaseMap] = useState<BaseMapType>('osm');
  const [showPlangebied, setShowPlangebied] = useState<boolean>(true);
  const [isSystemAdmin, setIsSystemAdmin] = useState<boolean>(store.isSystemAdmin());
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Plangebied Coordinates & Drawing state
  const [savedCoords, setSavedCoords] = useState<[number, number][]>(store.getPlangebiedCoords());
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [activeCoords, setActiveCoords] = useState<[number, number][]>(store.getPlangebiedCoords());

  // Ref to access current drawing mode and activeCoords in Leaflet event listeners
  const isDrawingModeRef = useRef<boolean>(isDrawingMode);
  isDrawingModeRef.current = isDrawingMode;
  const activeCoordsRef = useRef<[number, number][]>(activeCoords);
  activeCoordsRef.current = activeCoords;

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setIsSystemAdmin(store.isSystemAdmin());
      const newSaved = store.getPlangebiedCoords();
      setSavedCoords(newSaved);
      if (!isDrawingModeRef.current) {
        setActiveCoords(newSaved);
      }
    });
    return () => unsub();
  }, []);

  const handleDownloadPlangebied = () => {
    const data = store.exportPlangebiedGeoJSON();
    store.downloadBlob(
      data,
      `plangebied_hollandsche_rading_${new Date().toISOString().slice(0, 10)}.geojson`,
      'application/geo+json;charset=utf-8;'
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Center on Hollandsche Rading east of Tolakkerweg
  const centerLat = 52.1792;
  const centerLng = 5.1805;

  // Real-time calculated area in hectares
  const displayedCoords = isDrawingMode ? activeCoords : savedCoords;
  const currentAreaHa = calculatePolygonAreaHa(displayedCoords);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: false,
    });
    mapInstanceRef.current = map;

    // 1. OpenStreetMap Tile Layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
      maxZoom: 19,
    });
    osmTileLayerRef.current = osmLayer;

    // 2. Satellite Tile Layer (Esri World Imagery)
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

    // 3. Plangebied LayerGroup & Polygon
    const lgProject = L.layerGroup().addTo(map);
    plangebiedGroupRef.current = lgProject;

    const initialCoords = store.getPlangebiedCoords();
    const projectPolygon = L.polygon(initialCoords, {
      color: '#2D5A3D',
      weight: 3,
      dashArray: '6, 6',
      fillColor: '#3D5A45',
      fillOpacity: 0.25,
    });
    projectPolygon.addTo(lgProject);
    plangebiedPolygonRef.current = projectPolygon;

    // 4. LayerGroup for Vertex Markers during drawing/editing
    const vertexGroup = L.layerGroup().addTo(map);
    vertexMarkersGroupRef.current = vertexGroup;

    // Map click handler to add points when in drawing mode
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!isDrawingModeRef.current) return;
      const newPt: [number, number] = [
        Number(e.latlng.lat.toFixed(5)),
        Number(e.latlng.lng.toFixed(5)),
      ];
      setActiveCoords((prev) => [...prev, newPt]);
    };

    map.on('click', handleMapClick);
    projectPolygon.on('click', handleMapClick);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update polygon coordinates whenever displayedCoords changes
  useEffect(() => {
    if (plangebiedPolygonRef.current) {
      plangebiedPolygonRef.current.setLatLngs(displayedCoords);

      // In normal mode, bind rich popup with calculated hectares
      if (!isDrawingMode) {
        plangebiedPolygonRef.current.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <div style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #2D5A3D; margin-bottom: 2px;">
              Verkenningsgebied
            </div>
            <h4 style="font-weight: 700; color: #1A1D1A; font-size: 14px; margin: 0 0 4px 0;">
              Plangebied Tolakkerweg-Oost
            </h4>
            <p style="font-size: 12px; color: #4A4F49; line-height: 1.4; margin: 0 0 6px 0;">
              Berekende oppervlakte: <strong>${currentAreaHa} hectare</strong> (${Math.round(currentAreaHa * 10000).toLocaleString('nl-NL')} m²).
              Gelegen tussen de Tolakkerweg (N417), de spoorlijn en het open buitengebied van Hollandsche Rading.
            </p>
            <div style="font-size: 11px; color: #736B63;">
              Status: Actieve begrenzing voor participatie
            </div>
          </div>
        `);
      } else {
        plangebiedPolygonRef.current.unbindPopup();
      }
    }
  }, [displayedCoords, isDrawingMode, currentAreaHa]);

  // Handle vertex markers rendering when in drawing mode
  useEffect(() => {
    const vg = vertexMarkersGroupRef.current;
    if (!vg) return;

    vg.clearLayers();

    if (!isDrawingMode) return;

    activeCoords.forEach((coord, idx) => {
      const customIcon = L.divIcon({
        className: 'custom-vertex-marker',
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background-color: #FBF9F5;
            color: #1A1D1A;
            border: 2.5px solid #2D5A3D;
            border-radius: 50%;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.5);
            cursor: grab;
            user-select: none;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker(coord, {
        draggable: true,
        icon: customIcon,
        zIndexOffset: 1000,
      });

      // Draggable marker logic with live area updates
      marker.on('drag', (e: L.LeafletEvent) => {
        const ll = (e.target as L.Marker).getLatLng();
        const updated = [...activeCoordsRef.current];
        updated[idx] = [Number(ll.lat.toFixed(5)), Number(ll.lng.toFixed(5))];
        if (plangebiedPolygonRef.current) {
          plangebiedPolygonRef.current.setLatLngs(updated);
        }
      });

      marker.on('dragend', (e: L.LeafletEvent) => {
        const ll = (e.target as L.Marker).getLatLng();
        setActiveCoords((prev) => {
          const next = [...prev];
          next[idx] = [Number(ll.lat.toFixed(5)), Number(ll.lng.toFixed(5))];
          return next;
        });
      });

      vg.addLayer(marker);
    });
  }, [isDrawingMode, activeCoords.length]);

  // Handle basemap switching
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
          weight: 3,
          dashArray: '6, 6',
          fillColor: '#3D5A45',
          fillOpacity: 0.28,
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
          weight: 3.5,
          dashArray: '6, 6',
          fillColor: '#22C55E',
          fillOpacity: 0.32,
        });
      }
    }
  }, [baseMap]);

  // Handle Plangebied visibility toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = plangebiedGroupRef.current;
    if (!map || !lg) return;

    if (showPlangebied || isDrawingMode) {
      if (!map.hasLayer(lg)) {
        map.addLayer(lg);
      }
    } else {
      if (map.hasLayer(lg)) {
        map.removeLayer(lg);
      }
    }
  }, [showPlangebied, isDrawingMode]);

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const handleCenterPlangebied = () => {
    if (mapInstanceRef.current && plangebiedPolygonRef.current) {
      mapInstanceRef.current.fitBounds(plangebiedPolygonRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 15,
      });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([centerLat, centerLng], 14);
    }
  };

  // Drawing Actions for System Admin
  const handleStartDrawing = () => {
    const current = store.getPlangebiedCoords();
    setActiveCoords(current);
    setIsDrawingMode(true);
    setShowPlangebied(true);
  };

  const handleSaveDrawing = () => {
    if (activeCoords.length < 3) return;
    store.setPlangebiedCoords(activeCoords);
    setSavedCoords(activeCoords);
    setIsDrawingMode(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleCancelDrawing = () => {
    setActiveCoords(savedCoords);
    setIsDrawingMode(false);
  };

  const handleResetDefault = () => {
    setActiveCoords(DEFAULT_PLANGEBIED_COORDS);
  };

  const handleUndoLastPoint = () => {
    if (activeCoords.length > 3) {
      setActiveCoords((prev) => prev.slice(0, -1));
    }
  };

  return (
    <section id="de-plek" className="relative py-24 md:py-32 bg-[#FBF9F5] border-t border-[#E2DDD2]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-8">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8C7B6B] block mb-3">
              01 / Geografische Context
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-[#1A1D1A] leading-[1.02]"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
            >
              EERST DE PLEK
              <br />
              <span className="font-editorial italic text-[#3D5A45]">
                DAN HET PLAN.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4 text-base sm:text-lg text-[#4A4F49] font-light leading-relaxed">
            <p>
              Ten oosten van de Tolakkerweg / N417 ligt een gebied tussen dorp, landschap, spoor en A27.
            </p>
            <p className="mt-3 text-[#736B63] text-sm">
              Voordat wordt gesproken over bouwen willen we begrijpen wat deze plek nodig heeft en wat deze plek voor Hollandsche Rading kan betekenen.
            </p>
          </div>
        </div>

        {/* Map Container & Interactive Controls */}
        <div className="relative rounded-2xl overflow-hidden border border-[#D5CDC0] shadow-sm bg-[#E8E2D5]">
          {/* Map canvas */}
          <div
            ref={mapContainerRef}
            className="w-full h-[540px] md:h-[660px] z-0"
            id="interactive-leaflet-plek-map"
          />

          {/* Top Left: Basemap selector & Plangebied toggle */}
          <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 flex flex-wrap gap-2.5 max-w-xl">
            {/* Kaarttype Switcher (OpenStreetMap vs Satelliet) */}
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

            {/* Plangebied Weergave Toggle */}
            <div className="bg-[#1A1D1A]/90 backdrop-blur-md p-1.5 rounded-xl text-xs text-[#FBF9F5] shadow-lg flex items-center border border-[#2D332E]">
              <button
                type="button"
                onClick={() => setShowPlangebied(!showPlangebied)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  showPlangebied || isDrawingMode
                    ? 'bg-[#2A352C] text-[#85A38C] border border-[#3E5241]'
                    : 'text-[#9E9589] hover:text-white hover:bg-[#2A2E2A] border border-transparent'
                }`}
              >
                {showPlangebied || isDrawingMode ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#85A38C]" />
                    <span className="w-2 h-2 rounded-full bg-[#85A38C]" />
                    <span>Plangebied zichtbaar</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Plangebied verborgen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Systeembeheerder Tekenmodus Overlay Toolbar (Top Center/Right) */}
          {isDrawingMode && (
            <div className="absolute top-16 sm:top-4 left-4 right-4 sm:left-auto sm:right-16 z-20 bg-[#1A1D1A]/95 backdrop-blur-md border border-[#3D5A45] rounded-xl p-3.5 text-white shadow-2xl animate-fadeIn max-w-xl">
              <div className="flex items-center justify-between gap-3 border-b border-[#333] pb-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Plangebied Intekenen & Bewerken
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#243527] border border-[#3D5A45]">
                  <span className="text-[11px] text-[#A3D9AE] font-mono-subtle">
                    Berekende oppervlakte:
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    {currentAreaHa} ha
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#D5CDC0] leading-relaxed mb-3">
                Klik op de kaart om een hoekpunt toe te voegen. Sleep de genummerde cirkels om de grenzen nauwkeurig aan te passen.
                ({activeCoords.length} hoekpunten • circa {Math.round(currentAreaHa * 10000).toLocaleString('nl-NL')} m²)
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUndoLastPoint}
                    disabled={activeCoords.length <= 3}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-[#242824] border border-[#3A403A] text-[#D5CDC0] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                    title="Verwijder het laatst toegevoegde punt"
                  >
                    <Undo2 className="w-3 h-3 text-[#E11D48]" />
                    <span>Punt wissen</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-[#242824] border border-[#3A403A] text-[#D5CDC0] hover:text-white flex items-center gap-1"
                    title="Herstel naar standaard contouren"
                  >
                    <RotateCcw className="w-3 h-3 text-[#85A38C]" />
                    <span>Standaard</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelDrawing}
                    className="px-3 py-1.5 rounded-lg text-xs bg-[#2A2E2A] text-[#D5CDC0] hover:text-white hover:bg-[#333] transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Annuleren</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveDrawing}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#3D5A45] hover:bg-[#2C4030] text-white transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Check className="w-3.5 h-3.5 text-[#A3D9AE]" />
                    <span>Opslaan ({currentAreaHa} ha)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {saveSuccess && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#243527] border border-[#3D5A45] text-[#A3D9AE] px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xl animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
              <span className="font-medium">
                Nieuwe plangebiedcontour succesvol opgeslagen ({currentAreaHa} hectare)!
              </span>
            </div>
          )}

          {/* Map Navigation Controls (Top Right) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-[#1A1D1A]/90 backdrop-blur-md p-1.5 rounded-xl border border-[#2D332E] shadow-md">
            <button
              onClick={() => handleZoom(1)}
              className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors"
              title="Inzoomen"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors"
              title="Uitzoomen"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleCenterPlangebied}
              className="p-2 text-[#D5CDC0] hover:text-white hover:bg-[#2A2E2A] rounded-lg transition-colors border-t border-[#333]"
              title="Centreren op Plangebied"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Card: Clean Plangebied Info, Calculated Hectare & Admin Controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-[#FBF9F5]/95 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-[#D5CDC0] text-xs text-[#4A4F49] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span
                className={`w-4 h-4 rounded-xs border border-dashed shrink-0 ${
                  showPlangebied || isDrawingMode
                    ? 'border-[#2D5A3D] bg-[#3D5A45]/30'
                    : 'border-gray-400 bg-transparent opacity-40'
                }`}
              />
              <div>
                <span className="font-semibold text-[#1A1D1A] mr-2">Plangebied:</span>
                <span>
                  Exact <strong>{currentAreaHa} hectare</strong> ({Math.round(currentAreaHa * 10000).toLocaleString('nl-NL')} m²) ten oosten van de Tolakkerweg (N417), Hollandsche Rading
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Systeembeheerder Tekenknop */}
              {isSystemAdmin && !isDrawingMode && (
                <button
                  type="button"
                  onClick={handleStartDrawing}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono-subtle text-white bg-[#1A1D1A] hover:bg-[#2F352F] border border-[#3A403A] transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Teken of wijzig het plangebied op de kaart en bereken direct de hectares"
                >
                  <Edit3 className="w-3 h-3 text-[#A3D9AE]" />
                  <span>Plangebied intekenen ({currentAreaHa} ha)</span>
                </button>
              )}

              {/* Systeembeheerder GeoJSON Download */}
              {isSystemAdmin && (
                <button
                  type="button"
                  onClick={handleDownloadPlangebied}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono-subtle text-white bg-[#3D5A45] hover:bg-[#2C4030] transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Download actueel Plangebied als GIS-dataset (GeoJSON)"
                >
                  {downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-[#A3D9AE]" />
                      <span>Gedownload!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3 text-[#A3D9AE]" />
                      <span>Download Plangebied (GeoJSON)</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleCenterPlangebied}
                className="px-2.5 py-1 rounded-md text-[11px] font-mono-subtle text-[#2D5A3D] bg-[#EAE4D7] hover:bg-[#DDD5C5] transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                <span>Centreer op kaart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

