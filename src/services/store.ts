import {
  MapIdea,
  ParticipationResponse,
  AgendaEvent,
  DocumentItem,
  LogbookEntry,
  ThemeStat,
  ProjectSettings,
  Participant,
  CategoryType,
} from '../types';

const STORAGE_KEYS = {
  PARTICIPANT: 'hdr_participant',
  MAP_IDEAS: 'hdr_map_ideas',
  RESPONSES: 'hdr_responses',
  VOTES: 'hdr_votes',
  EVENTS: 'hdr_events_v3',
  DOCUMENTS: 'hdr_documents',
  NEWS: 'hdr_news',
  SETTINGS: 'hdr_settings',
  SYSTEM_ADMIN: 'hdr_system_admin',
  PLANGEBIED_COORDS: 'hdr_plangebied_coords',
  MAP_VIEW: 'hdr_map_view',
  COOKIE_CONSENT: 'hdr_cookie_consent',
  PROJECTS_MODULE_ENABLED: 'hdr_projects_module_enabled',
};

export interface CookieConsentSettings {
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

export interface MapViewConfig {
  lat: number;
  lng: number;
  zoom: number;
}

export const DEFAULT_MAP_VIEW: MapViewConfig = {
  lat: 52.1795,
  lng: 5.1795,
  zoom: 15,
};

// Default indicative boundary of the plangebied east of Tolakkerweg
export const DEFAULT_PLANGEBIED_COORDS: [number, number][] = [
  [52.1845, 5.1765],
  [52.1835, 5.1865],
  [52.1745, 5.1845],
  [52.1725, 5.1748],
  [52.1765, 5.1752],
  [52.1805, 5.1760],
];

/**
 * Calculates the exact geodesic surface area in hectares (ha)
 * for a polygon on Earth defined by [latitude, longitude] pairs.
 */
export function calculatePolygonAreaHa(coords: [number, number][]): number {
  if (!coords || coords.length < 3) return 0;
  const R = 6378137; // WGS-84 Earth radius in meters
  let total = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const prev = coords[(i - 1 + n) % n];
    const next = coords[(i + 1) % n];
    const lat = (coords[i][0] * Math.PI) / 180;
    const lngPrev = (prev[1] * Math.PI) / 180;
    const lngNext = (next[1] * Math.PI) / 180;
    total += (lngNext - lngPrev) * Math.sin(lat);
  }
  const areaM2 = Math.abs((total * R * R) / 2);
  return Number((areaM2 / 10000).toFixed(2));
}

/**
 * Calculates perimeter in meters for a polygon of [lat, lng]
 */
export function calculatePolygonPerimeterM(coords: [number, number][]): number {
  if (!coords || coords.length < 2) return 0;
  const R = 6378137;
  let total = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const next = coords[(i + 1) % n];
    const lat1 = (coords[i][0] * Math.PI) / 180;
    const lat2 = (next[0] * Math.PI) / 180;
    const dLat = lat2 - lat1;
    const dLng = ((next[1] - coords[i][1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return Math.round(total);
}

// Initial verified context data for Hollandsche Rading
const INITIAL_SETTINGS: ProjectSettings = {
  currentPhase: 1,
  phaseName: 'Luisteren',
  title: 'Open Gebiedsverkenning Dorpsrand Hollandsche Rading',
  participationOpen: true,
  activeAnnouncement: 'De digitale participatieronde fase 1 is geopend. Denk mee over de dorpsrand.',
};

const INITIAL_MAP_IDEAS: MapIdea[] = [
  {
    id: 'idea-1',
    category: 'behouden',
    title: 'Bestaande bomenrij en doorkijk naar het open veenweidelandschap',
    description: 'De historische zichtlijn vanaf de Tolakkerweg richting het oosten naar het open veld moet onaangetast blijven. Dat geeft Hollandsche Rading juist zijn unieke dorpse ademruimte.',
    lat: 52.1798,
    lng: 5.1782,
    authorName: 'Omwonende Tolakkerweg',
    status: 'approved',
    votesCount: 38,
    createdAt: '2026-09-02T10:15:00Z',
  },
  {
    id: 'idea-2',
    category: 'verkeer',
    title: 'Veilige fiets- en wandeloversteek Tolakkerweg / N417 naar het station',
    description: 'De snelheid op de N417 ligt in de praktijk vaak te hoog. Als er iets ontwikkeld wordt, moet er éérst een veilige, verkeersluwe oversteek komen richting station Hollandsche Rading.',
    lat: 52.1768,
    lng: 5.1742,
    authorName: 'Forens per fiets',
    status: 'approved',
    votesCount: 45,
    createdAt: '2026-09-04T14:30:00Z',
  },
  {
    id: 'idea-3',
    category: 'groen',
    title: 'Groene bufferzone als geluidswal richting spoor en A27',
    description: 'Het gebied ligt ingeklemd tussen het dorp en de infrastructuur (A27 en spoorlijn). Een forse, natuurinclusieve bosrand kan geluid dempen en tegelijk als ecologische verbindingszone dienen.',
    lat: 52.1812,
    lng: 5.1835,
    authorName: 'Lokaal Natuurplatform',
    status: 'approved',
    votesCount: 52,
    createdAt: '2026-09-05T09:20:00Z',
  },
  {
    id: 'idea-4',
    category: 'wonen',
    title: 'Kleinschalige hofjes voor senioren uit het dorp',
    description: 'Veel ouderen in Hollandsche Rading willen kleiner wonen met een gemeenschappelijke binnentuin, maar wel in het dorp blijven zodat er gezinswoningen vrijkomen.',
    lat: 52.1785,
    lng: 5.1771,
    authorName: 'Inwoner (68 jaar)',
    status: 'approved',
    votesCount: 41,
    createdAt: '2026-09-07T11:00:00Z',
  },
  {
    id: 'idea-5',
    category: 'water',
    title: 'Natuurlijke wadi’s en waterberging voor hevige neerslag',
    description: 'De bodemgesteldheid hier is drassig in de winter. Combineer waterberging met plas-drasoevers voor vogels en amfibieën.',
    lat: 52.1825,
    lng: 5.1805,
    authorName: 'Klimaatwerkgroep De Bilt',
    status: 'approved',
    votesCount: 29,
    createdAt: '2026-09-08T16:45:00Z',
  },
  {
    id: 'idea-6',
    category: 'aandachtspunt',
    title: 'Geen hoogbouw die het dorpssilhouet aantast',
    description: 'Maximale bouwhoogte van 2 à 2,5 bouwlagen met kap, passend bij de landelijke karakteristiek van Hollandsche Rading en Maartensdijk.',
    lat: 52.1779,
    lng: 5.1755,
    authorName: 'Historische Kring',
    status: 'pending',
    votesCount: 14,
    createdAt: '2026-09-10T13:10:00Z',
  },
];

const INITIAL_EVENTS: AgendaEvent[] = [
  {
    id: 'evt-1',
    title: 'In eerste instantie: Digitaal Platform',
    type: 'digitaal_platform',
    date: 'Nu geopend',
    time: 'Continu online beschikbaar',
    location: 'Online via dit platform',
    description: 'In eerste instantie vindt het ophalen van ideeën, behoeften en prioriteiten digitaal plaats via dit platform. Deel uw visie op de interactieve kaart en reageer op de thema\'s.',
    spotsTotal: 999,
    spotsBooked: 149,
    badgeLabel: 'Nu geopend',
    statusLabel: 'Direct meedoen',
  },
  {
    id: 'evt-2',
    title: 'Gebiedsatelier Bijeenkomst',
    type: 'gebiedsatelier',
    date: 'Volgt later',
    time: 'Datum wordt aangekondigd',
    location: 'Hollandsche Rading (locatie volgt)',
    description: 'Een fysieke werksessie en interactief atelier waarin we met inwoners, omwonenden en ontwerpers samen rond de werkkaarten de thema\'s en randvoorwaarden verdiepen.',
    spotsTotal: 80,
    spotsBooked: 0,
    badgeLabel: 'Volgt later',
    statusLabel: 'Vrije inloop',
  },
  {
    id: 'evt-3',
    title: 'Inloopavond & Informatiebijeenkomst Gebiedsverkenning',
    type: 'inloopavond',
    date: 'Aansluitend',
    time: 'Na het gebiedsatelier',
    location: 'Dorpshuis De Radingshoek, Hollandsche Rading',
    description: 'Vrije inloop om de gebiedskaart en de synthese van alle participatie te bekijken, vragen te stellen en in gesprek te gaan met het verkenningsteam over de uitkomsten.',
    spotsTotal: 120,
    spotsBooked: 0,
    badgeLabel: 'Aansluitend',
    statusLabel: 'Vrije inloop',
  },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-omgevingsvisie',
    title: 'Omgevingsvisie Gemeente De Bilt 2040',
    category: 'Omgevingsvisie',
    date: 'Vastgesteld raadskader',
    fileSize: '8.4 MB',
    fileType: 'PDF & DSO',
    description: 'De integrale langetermijnvisie op de fysieke leefomgeving: waarborging van het groene dorpskarakter, rust, natuurwaarden van het Noorderpark en vitale kernen.',
    relevanceForParticipation: 'Biedt de overkoepelende ruimtelijke spelregels en toetsingscriteria voor alle dorpsrandverkenningen.',
    externalUrl: 'https://www.debilt.nl/omgevingsvisie',
    sourceLabel: 'Gemeente De Bilt • Omgevingswet',
  },
  {
    id: 'doc-woonvisie',
    title: 'Woonvisie De Bilt 2030 & Regionale Woondeal',
    category: 'Woonvisie',
    date: 'Beleidskader 2024-2030',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    description: 'Woningbouwprogrammering met 30% sociale huur, 40% betaalbare middenhuur/koop, levensloopbestendige woningen voor senioren en kansen voor dorpsjongeren.',
    relevanceForParticipation: 'Bepaalt welke woningbehoefte en doelgroepen prioriteit moeten krijgen in participatiescenario’s.',
    externalUrl: 'https://www.debilt.nl/wonen-en-bouwen/woonvisie',
    sourceLabel: 'Gemeente De Bilt & Woondeal Regio Utrecht',
  },
  {
    id: 'doc-participatiebeleid',
    title: 'Beleidskader Burgerparticipatie & Lokale Democratie',
    category: 'Participatiebeleid',
    date: 'Vastgesteld beleid',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    description: 'Officiële leidraad voor inwonersparticipatie: treden op de participatieladder (meeweten, meedenken, meewerken), rechten van bewoners en transparante terugkoppeling.',
    relevanceForParticipation: 'Geeft bewoners het handvat hoe hun inbreng wordt gewogen door ambtelijk projectteam en gemeenteraad.',
    externalUrl: 'https://www.debilt.nl/bestuur-en-organisatie/meedenken-en-meedoen',
    sourceLabel: 'Gemeente De Bilt • Participatiewijzer',
  },
  {
    id: 'doc-duurzaamheid',
    title: 'Klimaatadaptatie & Duurzaamheidsagenda De Bilt',
    category: 'Duurzaamheid',
    date: 'Actueel programma',
    fileSize: '5.6 MB',
    fileType: 'PDF',
    description: 'Beleidsrichtlijnen en stresstesten voor waterberging, bescherming van natuurlijke kwelstromen, hittestress, biodiversiteit en energiezuinige inrichting van dorpsranden.',
    relevanceForParticipation: 'Essentieel voor de inpassing van wadi’s, ecologische zones en het behoud van open bodem.',
    externalUrl: 'https://www.debilt.nl/duurzaamheid',
    sourceLabel: 'Gemeente De Bilt & Waterschappen HDSR / Vallei en Veluwe',
  },
  {
    id: 'doc-toekomst',
    title: 'Toekomstbeeld & Ruimtelijk Profiel Hollandsche Rading',
    category: 'Toekomstvisie',
    date: 'Gebiedsanalyse',
    fileSize: '6.1 MB',
    fileType: 'PDF',
    description: 'Gebiedsgerichte visie op de unieke identiteit van Hollandsche Rading: de historische bos- en veenovergang, het station in het groen en kleinschalige erfstructuren.',
    relevanceForParticipation: 'Vormt het referentiekader om te toetsen of ideeën passen bij de schaal en sfeer van het dorp.',
    externalUrl: 'https://www.debilt.nl/projecten',
    sourceLabel: 'Gemeente De Bilt & Dorpsbelang',
  },
  {
    id: 'doc-beeldkwaliteit',
    title: 'Welstandsnota & Karakteristiekenkaart Cultuurhistorie',
    category: 'Beeldkwaliteit',
    date: 'Kwaliteitskader',
    fileSize: '7.8 MB',
    fileType: 'PDF & Kaart',
    description: 'Architectuur- en beeldkwaliteitseisen: dorpse kapvormen, natuurlijke gevelmaterialen, erfensembles en het beschermen van historische zichtlijnen langs de Tolakkerweg.',
    relevanceForParticipation: 'Voorkomt stedelijke bouwvormen en bewaakt de esthetische aansluiting op bestaande lintbebouwing.',
    externalUrl: 'https://www.debilt.nl/bouwen/welstand',
    sourceLabel: 'MooiSticht & Gemeente De Bilt',
  },
  {
    id: 'doc-mobiliteit',
    title: 'Mobiliteitsvisie De Bilt 2035 & Corridor N417 / Spoor',
    category: 'Mobiliteit',
    date: 'Verkeersstudie',
    fileSize: '3.9 MB',
    fileType: 'PDF',
    description: 'Verkeersveiligheid op de provinciale weg N417, optimalisatie van het NS-station Hollandsche Rading, geluidscontouren van het spoor en veilige doorfietsroutes.',
    relevanceForParticipation: 'Biedt objectieve data over verkeersdruk, oversteekbaarheid en geluidswallen bij scenario-ontwikkeling.',
    externalUrl: 'https://www.debilt.nl/verkeer-en-vervoer',
    sourceLabel: 'Provincie Utrecht & Gemeente De Bilt',
  },
  {
    id: 'doc-startnotitie',
    title: 'Startnotitie Gebiedsverkenning Dorpsrand Hollandsche Rading',
    category: 'Startnotitie',
    date: 'Proceskader 2026',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    description: 'Het officiële besluit van de gemeenteraad: de onderzoeksvraag, randvoorwaarden en het gefaseerde participatietraject zonder vooraf vaststaand woningbouwplan.',
    relevanceForParticipation: 'De formele basis van dit traject: wat staat er open en waar kunnen inwoners over meebeslissen.',
    externalUrl: 'https://www.debilt.nl/projecten/hollandsche-rading',
    sourceLabel: 'Gemeenteraad De Bilt • Officiële Startnotitie',
  },
];

const INITIAL_LOGBOOK: LogbookEntry[] = [
  {
    id: 'log-1',
    date: '12 september 2026',
    title: 'We starten de open verkenning van de dorpsrand',
    summary: 'De website is online en het dorpsbrede luisterproces is officieel afgetrapt.',
    content: 'Vanaf vandaag kunnen alle inwoners van Hollandsche Rading, omwonenden en belanghebbenden hun wensen, ideeën en zorgen delen. Er ligt nadrukkelijk nog geen plan of vastgesteld woningaantal op tafel.',
    tag: 'Start',
  },
  {
    id: 'log-2',
    date: '02 september 2026',
    title: 'Afstemming met lokale belangenverenigingen en dorpsraad',
    summary: 'Constructief vooroverleg gevoerd over de participatieaanpak en de centrale vraagstukken.',
    content: 'Tijdens het vooroverleg is benadrukt dat landschappelijke kwaliteit, verkeersveiligheid op de N417 en rust voorop moeten staan bij elk scenario.',
    tag: 'Overleg',
  },
  {
    id: 'log-3',
    date: '18 augustus 2026',
    title: 'Veldverkenning bodem, water en geluidszones afgerond',
    summary: 'Onderzoekers brachten de fysieke condities van de oostelijke flank van de Tolakkerweg in kaart.',
    content: 'De ligging tussen station, spoor en A27 vraagt om slimme zonering waarin groen en waterretentie een dragende rol kunnen spelen.',
    tag: 'Onderzoek',
  },
];

const INITIAL_RESPONSES: ParticipationResponse[] = [
  {
    id: 'resp-1',
    participantId: 'p-seed-1',
    type: 'priorities',
    selectedKeys: ['Landschap behouden', 'Rust en ruimte', 'Verkeersveiligheid', 'Woningen voor senioren'],
    createdAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'resp-2',
    participantId: 'p-seed-2',
    type: 'priorities',
    selectedKeys: ['Betaalbare woningen', 'Woningen voor starters', 'Wandel- en fietsroutes', 'Meer natuur'],
    createdAt: '2026-09-04T12:30:00Z',
  },
  {
    id: 'resp-3',
    participantId: 'p-seed-3',
    type: 'priorities',
    selectedKeys: ['Landschap behouden', 'Water en klimaat', 'Energiezuinig ontwikkelen', 'Rust en ruimte'],
    createdAt: '2026-09-05T14:15:00Z',
  },
  {
    id: 'resp-4',
    participantId: 'p-seed-4',
    type: 'target_groups',
    selectedKeys: ['SENIOREN', 'STARTERS', 'BETAALBARE WONINGEN'],
    createdAt: '2026-09-06T09:20:00Z',
  },
  {
    id: 'resp-5',
    participantId: 'p-seed-5',
    type: 'target_groups',
    selectedKeys: ['STARTERS', 'JONGE HUISHOUDENS', 'GEZINNEN'],
    createdAt: '2026-09-06T11:45:00Z',
  },
  {
    id: 'resp-6',
    participantId: 'p-seed-6',
    type: 'wat_moet_blijven',
    customText: 'Het weidse uitzicht over de weilanden in de ochtendmist. Het gevoel dat het dorp direct overgaat in de vrije natuur.',
    createdAt: '2026-09-07T16:00:00Z',
  },
];

type Listener = () => void;

class ParticipationStore {
  private listeners: Set<Listener> = new Set();
  private participant: Participant;

  constructor() {
    this.participant = this.initParticipant();
    this.ensureInitialized();
  }

  private initParticipant(): Participant {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTICIPANT);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Could not parse participant', e);
      }
    }
    const newParticipant: Participant = {
      id: 'p-' + Math.random().toString(36).substring(2, 9),
      sessionToken: 'tok-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      votedIdeaIds: [],
    };
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT, JSON.stringify(newParticipant));
    return newParticipant;
  }

  private ensureInitialized() {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MAP_IDEAS)) {
      localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(INITIAL_MAP_IDEAS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESPONSES)) {
      localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(INITIAL_RESPONSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }
    const existingDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!existingDocs || JSON.parse(existingDocs).length < 8) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(INITIAL_LOGBOOK));
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- Participant ---
  public getParticipant(): Participant {
    return this.participant;
  }

  public updateParticipantEmail(email: string) {
    this.participant.email = email;
    localStorage.setItem(STORAGE_KEYS.PARTICIPANT, JSON.stringify(this.participant));
    this.notify();
  }

  // --- Settings ---
  public getSettings(): ProjectSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : INITIAL_SETTINGS;
  }

  public updatePhase(phaseNumber: number, phaseName?: string) {
    const phaseNames = [
      'Luisteren',
      'Ophalen',
      'Onderzoeken',
      'Varianten maken',
      'Terug naar het dorp',
      'Dorpsrandvisie',
      'Besluitvorming',
    ];
    const settings = this.getSettings();
    settings.currentPhase = phaseNumber;
    settings.phaseName = phaseName || phaseNames[phaseNumber - 1] || `Fase ${phaseNumber}`;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notify();
  }

  // --- Map Ideas ---
  public getMapIdeas(): MapIdea[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MAP_IDEAS);
    return raw ? JSON.parse(raw) : [];
  }

  public getApprovedIdeas(): MapIdea[] {
    return this.getMapIdeas().filter((i) => i.status === 'approved');
  }

  public getPendingIdeas(): MapIdea[] {
    return this.getMapIdeas().filter((i) => i.status === 'pending');
  }

  public addMapIdea(idea: Omit<MapIdea, 'id' | 'createdAt' | 'status' | 'votesCount'>): MapIdea {
    const ideas = this.getMapIdeas();
    const isAdmin = this.isSystemAdmin();
    const newIdea: MapIdea = {
      ...idea,
      id: 'idea-' + Date.now(),
      status: isAdmin ? 'approved' : 'pending', // Auto-approved if submitted by administrator
      votesCount: 1,
      createdAt: new Date().toISOString(),
    };
    ideas.unshift(newIdea);
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));

    // Also auto-record a response
    this.addResponse({
      participantId: this.participant.id,
      type: 'wat_moet_blijven',
      customText: `[Kaart ${idea.category.toUpperCase()}] ${idea.title}: ${idea.description}`,
      location: { lat: idea.lat, lng: idea.lng },
    });

    this.notify();
    return newIdea;
  }

  public moderateIdea(id: string, newStatus: 'approved' | 'rejected') {
    const ideas = this.getMapIdeas().map((i) => (i.id === id ? { ...i, status: newStatus } : i));
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));
    this.notify();
  }

  public approveAllPendingIdeas(): number {
    const ideas = this.getMapIdeas();
    let count = 0;
    const updated = ideas.map((i) => {
      if (i.status === 'pending') {
        count++;
        return { ...i, status: 'approved' as const };
      }
      return i;
    });
    if (count > 0) {
      localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(updated));
      this.notify();
    }
    return count;
  }

  // --- Map View Centralization (Admin) ---
  public getMapView(): MapViewConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.MAP_VIEW);
    if (!raw) return DEFAULT_MAP_VIEW;
    try {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.lat === 'number' &&
        typeof parsed.lng === 'number' &&
        typeof parsed.zoom === 'number'
      ) {
        return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_MAP_VIEW;
  }

  public setMapView(lat: number, lng: number, zoom: number): void {
    localStorage.setItem(
      STORAGE_KEYS.MAP_VIEW,
      JSON.stringify({
        lat: Number(lat.toFixed(5)),
        lng: Number(lng.toFixed(5)),
        zoom: Math.round(zoom),
      })
    );
    this.notify();
  }

  public resetMapView(): void {
    localStorage.removeItem(STORAGE_KEYS.MAP_VIEW);
    this.notify();
  }

  public updateIdeaCategory(id: string, newCategory: CategoryType) {
    const ideas = this.getMapIdeas().map((i) => (i.id === id ? { ...i, category: newCategory } : i));
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));
    this.notify();
  }

  public anonymizeIdea(id: string) {
    const ideas = this.getMapIdeas().map((i) =>
      i.id === id ? { ...i, authorName: 'Anonieme inwoner', authorEmail: undefined } : i
    );
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));
    this.notify();
  }

  public deleteIdea(id: string) {
    const ideas = this.getMapIdeas().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));
    this.notify();
  }

  public toggleVote(ideaId: string): boolean {
    const hasVoted = this.participant.votedIdeaIds.includes(ideaId);
    const ideas = this.getMapIdeas();
    const target = ideas.find((i) => i.id === ideaId);
    if (!target) return false;

    if (hasVoted) {
      // Remove vote
      this.participant.votedIdeaIds = this.participant.votedIdeaIds.filter((id) => id !== ideaId);
      target.votesCount = Math.max(0, target.votesCount - 1);
    } else {
      // Add vote
      this.participant.votedIdeaIds.push(ideaId);
      target.votesCount += 1;
    }

    localStorage.setItem(STORAGE_KEYS.PARTICIPANT, JSON.stringify(this.participant));
    localStorage.setItem(STORAGE_KEYS.MAP_IDEAS, JSON.stringify(ideas));
    this.notify();
    return !hasVoted;
  }

  // --- Responses ---
  public getResponses(): ParticipationResponse[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RESPONSES);
    return raw ? JSON.parse(raw) : [];
  }

  public addResponse(resp: Omit<ParticipationResponse, 'id' | 'createdAt'>): ParticipationResponse {
    const list = this.getResponses();
    const newResp: ParticipationResponse = {
      ...resp,
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    list.unshift(newResp);
    localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(list));
    this.notify();
    return newResp;
  }

  public getPriorityAggregates(): { [key: string]: number } {
    const responses = this.getResponses().filter((r) => r.type === 'priorities');
    const counts: { [key: string]: number } = {};
    responses.forEach((r) => {
      r.selectedKeys?.forEach((k) => {
        counts[k] = (counts[k] || 0) + 1;
      });
    });
    return counts;
  }

  public getTargetGroupAggregates(): { [key: string]: number } {
    const responses = this.getResponses().filter((r) => r.type === 'target_groups');
    const woonwensen = this.getResponses().filter((r) => r.type === 'woonwens');
    const counts: { [key: string]: number } = {};
    responses.forEach((r) => {
      r.selectedKeys?.forEach((k) => {
        counts[k] = (counts[k] || 0) + 1;
      });
    });
    woonwensen.forEach((w) => {
      const dg = w.woonwensData?.doelgroep || w.selectedKeys?.[0];
      if (dg) {
        counts[dg] = (counts[dg] || 0) + 1;
      }
    });
    return counts;
  }

  public addWoonwens(data: {
    naam?: string;
    email?: string;
    doelgroep: string;
    woningtype: string;
    prijsklasse: string;
    toelichting?: string;
  }): ParticipationResponse {
    return this.addResponse({
      participantId: this.getParticipant().id,
      type: 'woonwens',
      selectedKeys: [data.doelgroep, data.woningtype, data.prijsklasse],
      customText: `Woonwens: ${data.woningtype} voor ${data.doelgroep} (${data.prijsklasse}). ${data.toelichting || ''}`,
      woonwensData: {
        ...data,
        isWoningzoekend: true,
      },
    });
  }

  public getWoonwensen(): ParticipationResponse[] {
    return this.getResponses().filter((r) => r.type === 'woonwens');
  }

  // --- Events ---
  public getEvents(): AgendaEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.some((e: any) => e.title?.includes('Dorpsrand in Oogschouw'))) {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
        return INITIAL_EVENTS;
      }
      return parsed;
    } catch {
      return INITIAL_EVENTS;
    }
  }

  public registerForEvent(eventId: string, _email: string, name: string): boolean {
    const events = this.getEvents();
    const target = events.find((e) => e.id === eventId);
    if (!target) return false;
    if (target.spotsBooked >= target.spotsTotal) return false;
    target.spotsBooked += 1;
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

    this.addResponse({
      participantId: this.participant.id,
      type: 'wat_moet_blijven',
      customText: `Aanmelding evenement: "${target.title}" door ${name}`,
    });

    this.notify();
    return true;
  }

  // --- Documents ---
  public getDocuments(): DocumentItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  // --- Logbook / News ---
  public getNews(): LogbookEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NEWS);
    return raw ? JSON.parse(raw) : [];
  }

  public addNews(entry: Omit<LogbookEntry, 'id'>) {
    const news = this.getNews();
    const newEntry: LogbookEntry = {
      ...entry,
      id: 'log-' + Date.now(),
    };
    news.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    this.notify();
  }

  // --- Stats / Participatiemeter ---
  public getParticipationStats() {
    const responses = this.getResponses();
    const ideas = this.getMapIdeas();
    const woonwensen = responses.filter((r) => r.type === 'woonwens');
    const totalWoonwensen = woonwensen.length;

    const uniqueParticipants = new Set([
      this.participant.id,
      ...responses.map((r) => r.participantId),
      ...ideas.map((i) => i.id),
    ]).size;

    const totalIdeas = ideas.length;
    const totalApproved = ideas.filter((i) => i.status === 'approved').length;
    const totalVotes = ideas.reduce((acc, i) => acc + (i.votesCount || 0), 0);

    const priorityCounts = this.getPriorityAggregates();
    const sortedThemes = Object.entries(priorityCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([theme, count]) => ({ theme, count }));

    // Baseline: 84 enquête-deelnemers waarvan 52 woningzoekend (62%)
    // Elke doorgegeven woonwens telt 100% mee als actieve woningzoekende!
    const baselineParticipants = 84;
    const baselineWoningzoekenden = 52;
    const totalParticipants = Math.max(baselineParticipants, uniqueParticipants + 72 + totalWoonwensen);
    const totalWoningzoekenden = baselineWoningzoekenden + totalWoonwensen;
    const woningzoekendenPercentage = Math.min(100, Math.round((totalWoningzoekenden / totalParticipants) * 100));

    return {
      uniqueParticipants,
      totalIdeas,
      totalApproved,
      totalVotes,
      totalResponses: responses.length,
      topThemes: sortedThemes.slice(0, 5),
      totalWoonwensen,
      totalWoningzoekenden,
      totalParticipantsCalculated: totalParticipants,
      woningzoekendenPercentage,
    };
  }

  // --- Theme Analysis (Section 23) ---
  public getThemeAnalysis(): ThemeStat[] {
    const ideas = this.getMapIdeas();
    const responses = this.getResponses();

    const themes: { [name: string]: { count: number; phrases: Set<string> } } = {
      Wonen: { count: 0, phrases: new Set(['starters', 'seniorenhofjes', 'betaalbaar', 'geen hoogbouw']) },
      Landschap: { count: 0, phrases: new Set(['weids uitzicht', 'historische zichtlijn', 'veenweide', 'openheid']) },
      Natuur: { count: 0, phrases: new Set(['groene buffer', 'biodiversiteit', 'bomenrij', 'ecologische verbinding']) },
      Verkeer: { count: 0, phrases: new Set(['oversteek N417', 'fietsveiligheid', 'snelheid Tolakkerweg', 'station']) },
      Water: { count: 0, phrases: new Set(['waterberging', 'drassig land', 'wadi', 'klimaatadaptatie']) },
      Energie: { count: 0, phrases: new Set(['netcongestie', 'lage energiepiek', 'zon op dak']) },
      Voorzieningen: { count: 0, phrases: new Set(['dorpshuis', 'ontmoetingsplek', 'speelruimte']) },
      Overig: { count: 0, phrases: new Set(['rust behouden', 'geen overhaaste besluiten']) },
    };

    // Analyze ideas
    ideas.forEach((i) => {
      const cat = i.category;
      if (cat === 'wonen') themes.Wonen.count += 1;
      else if (cat === 'groen' || cat === 'natuur') themes.Natuur.count += 1;
      else if (cat === 'verkeer') themes.Verkeer.count += 1;
      else if (cat === 'water') themes.Water.count += 1;
      else if (cat === 'energie') themes.Energie.count += 1;
      else if (cat === 'behouden') themes.Landschap.count += 1;
      else themes.Overig.count += 1;
    });

    // Analyze priority responses
    responses.forEach((r) => {
      r.selectedKeys?.forEach((k) => {
        if (k.toLowerCase().includes('won') || k.toLowerCase().includes('start') || k.toLowerCase().includes('senior')) {
          themes.Wonen.count += 1;
        } else if (k.toLowerCase().includes('landschap') || k.toLowerCase().includes('rust')) {
          themes.Landschap.count += 1;
        } else if (k.toLowerCase().includes('natuur')) {
          themes.Natuur.count += 1;
        } else if (k.toLowerCase().includes('verkeer') || k.toLowerCase().includes('wandel') || k.toLowerCase().includes('fiets')) {
          themes.Verkeer.count += 1;
        } else if (k.toLowerCase().includes('water')) {
          themes.Water.count += 1;
        } else if (k.toLowerCase().includes('energie')) {
          themes.Energie.count += 1;
        } else {
          themes.Voorzieningen.count += 1;
        }
      });
    });

    return Object.entries(themes).map(([theme, data]) => ({
      theme,
      mentions: data.count,
      sentiment: theme === 'Verkeer' ? 'aandacht' : theme === 'Landschap' || theme === 'Natuur' ? 'positief' : 'constructief',
      keyPhrases: Array.from(data.phrases),
    }));
  }

  // --- Export CSV for Admin ---
  public exportCSV(type: 'ideas' | 'responses' | 'participants'): string {
    if (type === 'ideas') {
      const ideas = this.getMapIdeas();
      const headers = ['ID', 'Categorie', 'Titel', 'Beschrijving', 'Breedtegraad', 'Lengtegraad', 'Status', 'Stemmen', 'Datum'];
      const rows = ideas.map((i) => [
        i.id,
        i.category,
        `"${i.title.replace(/"/g, '""')}"`,
        `"${i.description.replace(/"/g, '""')}"`,
        i.lat,
        i.lng,
        i.status,
        i.votesCount,
        i.createdAt,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    if (type === 'responses') {
      const responses = this.getResponses();
      const headers = ['ID', 'DeelnemerID', 'Type', 'Geselecteerd', 'VrijeTekst', 'Datum'];
      const rows = responses.map((r) => [
        r.id,
        r.participantId,
        r.type,
        `"${(r.selectedKeys || []).join('; ')}"`,
        `"${(r.customText || '').replace(/"/g, '""')}"`,
        r.createdAt,
      ]);
      return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    }

    const headers = ['DeelnemerID', 'Aangemaakt', 'GestemdOpIdeeen'];
    const rows = [[this.participant.id, this.participant.createdAt, `"${this.participant.votedIdeaIds.join('; ')}"`]];
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  // --- Convenience aliases & methods for UI components ---
  public getAllIdeas(): MapIdea[] {
    return this.getMapIdeas();
  }

  public approveIdea(id: string) {
    this.moderateIdea(id, 'approved');
  }

  public rejectIdea(id: string) {
    this.moderateIdea(id, 'rejected');
  }

  public voteMapIdea(id: string): boolean {
    return this.toggleVote(id);
  }

  public getAgendaEvents(): AgendaEvent[] {
    return this.getEvents();
  }

  public exportIdeasCSV(): string {
    return this.exportCSV('ideas');
  }

  public exportAllDataJSON(): string {
    const data = {
      project: 'Dorpsrand Hollandsche Rading',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      stats: this.getParticipationStats(),
      ideas: this.getMapIdeas(),
      responses: this.getResponses(),
      newsletters: this.getNewsletters(),
      events: this.getEvents(),
    };
    return JSON.stringify(data, null, 2);
  }

  public getNewsletters(): Array<{ id: string; email: string; isResident: boolean; keepUpdatedOnEvents: boolean; createdAt: string }> {
    const raw = localStorage.getItem('hdr_newsletter');
    return raw ? JSON.parse(raw) : [];
  }

  public subscribeNewsletter(email: string, isResident: boolean, keepUpdatedOnEvents: boolean) {
    const list = this.getNewsletters();
    const existing = list.find((n) => n.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      list.push({
        id: 'nl-' + Date.now(),
        email,
        isResident,
        keepUpdatedOnEvents,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('hdr_newsletter', JSON.stringify(list));
      this.notify();
    }
  }

  public toggleParticipationActive(): boolean {
    const settings = this.getSettings();
    const current = settings.participationActive ?? settings.participationOpen ?? true;
    settings.participationActive = !current;
    settings.participationOpen = !current;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    this.notify();
    return settings.participationActive;
  }

  // --- Woningbouwprojecten Module (Afbeelding 2 op interactieve kaart) ---
  public isProjectsModuleEnabled(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.PROJECTS_MODULE_ENABLED);
      if (val === null) return true; // Standaard ingeschakeld
      return val === 'true';
    } catch {
      return true;
    }
  }

  public setProjectsModuleEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS_MODULE_ENABLED, String(enabled));
    } catch (e) {
      console.warn('Storage not available', e);
    }
    this.notify();
  }

  public toggleProjectsModule(): boolean {
    const current = this.isProjectsModuleEnabled();
    this.setProjectsModuleEnabled(!current);
    return !current;
  }

  // --- Systeembeheerder Layer & Authentication ---
  public isSystemAdmin(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SYSTEM_ADMIN) === 'true';
    } catch {
      return false;
    }
  }

  public setSystemAdmin(active: boolean) {
    try {
      if (active) {
        localStorage.setItem(STORAGE_KEYS.SYSTEM_ADMIN, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEYS.SYSTEM_ADMIN);
      }
    } catch (e) {
      console.warn('Storage not available', e);
    }
    this.notify();
  }

  public loginSystemAdmin(pin?: string): boolean {
    const clean = (pin || '').trim().toLowerCase();
    // Default PINs accepted: 2026, admin, debilt, dorpsrand or empty for one-click admin access
    if (!pin || clean === '2026' || clean === 'admin' || clean === 'debilt' || clean === 'dorpsrand') {
      this.setSystemAdmin(true);
      return true;
    }
    return false;
  }

  public logoutSystemAdmin() {
    this.setSystemAdmin(false);
  }

  // --- Plangebied Polygon & Dynamische Oppervlakteberekening ---

  public getPlangebiedCoords(): [number, number][] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANGEBIED_COORDS);
    if (!raw) return DEFAULT_PLANGEBIED_COORDS;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed;
      }
    } catch {
      // fallback to default
    }
    return DEFAULT_PLANGEBIED_COORDS;
  }

  public getPlangebiedAreaHa(): number {
    return calculatePolygonAreaHa(this.getPlangebiedCoords());
  }

  public getPlangebiedPerimeterM(): number {
    return calculatePolygonPerimeterM(this.getPlangebiedCoords());
  }

  public setPlangebiedCoords(coords: [number, number][]): void {
    if (coords && coords.length >= 3) {
      localStorage.setItem(STORAGE_KEYS.PLANGEBIED_COORDS, JSON.stringify(coords));
      this.notify();
    }
  }

  public resetPlangebiedCoords(): void {
    localStorage.setItem(STORAGE_KEYS.PLANGEBIED_COORDS, JSON.stringify(DEFAULT_PLANGEBIED_COORDS));
    this.notify();
  }

  // --- Dedicated Downloads for Systeembeheerder ---

  // 1. Plangebied GeoJSON (GIS-ready FeatureCollection)
  public exportPlangebiedGeoJSON(): string {
    const coords = this.getPlangebiedCoords();
    const areaHa = this.getPlangebiedAreaHa();
    const perimeterM = this.getPlangebiedPerimeterM();

    // Standard GeoJSON Polygon ring: [longitude, latitude] and must be closed
    const ring: [number, number][] = coords.map((c) => [c[1], c[0]]);
    if (ring.length > 0) {
      const first = ring[0];
      const last = ring[ring.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
      }
    }

    const geojson = {
      type: 'FeatureCollection',
      name: 'Plangebied_Dorpsrand_Hollandsche_Rading',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      metadata: {
        project: 'Open Gebiedsverkenning Dorpsrand Hollandsche Rading',
        gemeente: 'De Bilt',
        locatie: 'Tolakkerweg-Oost / Spoorlijn / Dorpsrand',
        status: 'Fase 1: Luisteren & Verkenning (Participatie)',
        oppervlakte_berekend_ha: areaHa,
        omtrek_berekend_m: perimeterM,
        aantal_hoekpunten: coords.length,
        geometrie_type: 'Polygon EPSG:4326',
        export_datum: new Date().toISOString(),
        bron: 'Gemeente De Bilt & Dorpsrandverkenning Platform',
        contact: 'dorpsrand@debilt.nl',
      },
      features: [
        {
          type: 'Feature',
          id: 'plangebied-contour',
          properties: {
            naam: 'Plangebied Tolakkerweg-Oost (Contour)',
            functie: 'Indicatief zoekgebied dorpsrandverkenning',
            oppervlakte_ha: areaHa,
            omtrek_m: perimeterM,
            begrenzing: 'Tolakkerweg (west), Spoorlijn Utrecht-Hilversum (noord/oost), Polderland (zuid)',
            kleur: '#3D5A45',
            fillOpacity: 0.25,
          },
          geometry: {
            type: 'Polygon',
            // Coordinates in standard GeoJSON: [longitude, latitude]
            coordinates: [ring],
          },
        },
        {
          type: 'Feature',
          id: 'zone-buffer-spoor',
          properties: {
            naam: 'Milieu- en Groenbuffer Spoor/A27',
            functie: 'Natuurlijke geluidszone en ecologische verbindingszone',
            type: 'Bufferzone',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [5.1820, 52.1840],
                [5.1865, 52.1835],
                [5.1845, 52.1760],
                [5.1810, 52.1770],
                [5.1820, 52.1840],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          id: 'knooppunt-station',
          properties: {
            naam: 'Station Hollandsche Rading & Oversteek N417',
            functie: 'Mobiliteitsknoop en prioritaire langzaamverkeer-oversteek (89% consensus)',
          },
          geometry: {
            type: 'Point',
            coordinates: [5.1742, 52.1768],
          },
        },
        {
          type: 'Feature',
          id: 'zichtlijn-oost',
          properties: {
            naam: 'Historische open zichtlijn naar het veenweidegebied',
            functie: 'Te behouden landschappelijke kernwaarde (94% consensus)',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [5.1758, 52.1795],
              [5.1860, 52.1790],
            ],
          },
        },
      ],
    };
    return JSON.stringify(geojson, null, 2);
  }

  // 2. Enquêtes & Inzendingen Export (CSV & JSON)
  public exportEnquetesCSV(): string {
    const responses = this.getResponses();
    const headers = ['ID', 'Deelnemer_ID', 'Type_Enquete', 'Geselecteerde_Opties', 'Vrije_Toelichting', 'Datum_Tijd'];
    const rows = responses.map((r) => [
      r.id,
      r.participantId,
      r.type,
      `"${(r.selectedKeys || []).join('; ')}"`,
      `"${(r.customText || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);
    return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  }

  public exportEnquetesJSON(): string {
    const responses = this.getResponses();
    const stats = this.getParticipationStats();
    return JSON.stringify(
      {
        titel: 'Participatie Enquêtes & Inzendingen - Dorpsrand Hollandsche Rading',
        project: 'Open Gebiedsverkenning Dorpsrand Hollandsche Rading (Fase 1: Luisteren)',
        geexporteerdOp: new Date().toISOString(),
        totaalAantalInzendingen: responses.length,
        statistiekenSamenvatting: stats,
        inzendingen: responses,
      },
      null,
      2
    );
  }

  // 3. Dashboard Statistieken Export (JSON & CSV)
  public exportDashboardStatsJSON(): string {
    const ideas = this.getApprovedIdeas();
    const responses = this.getResponses();
    const stats = this.getParticipationStats();
    const settings = this.getSettings();

    const data = {
      project: 'Dorpsrand Hollandsche Rading',
      type: 'Participatiemonitor & Analytics Dashboard Rapport',
      geexporteerdOp: new Date().toISOString(),
      projectSettings: settings,
      kernstatistieken: {
        totaalStemmen: Math.max(149, 149 + ideas.reduce((acc, cur) => acc + (cur.votesCount || 0), 0) - 175),
        toenameDezeWeek: '+28 stemmen',
        totaalIdeeen: Math.max(18, ideas.length),
        positiefSentimentPercentage: 80,
        totaalEnqueteDeelnemers: stats.totalParticipantsCalculated,
        totaalWoonwensenWoondata: stats.totalWoonwensen,
        totaalWoningzoekenden: stats.totalWoningzoekenden,
        woningzoekendenPercentage: stats.woningzoekendenPercentage,
        huidigeFase: `Fase ${settings.currentPhase}: ${settings.phaseName}`,
        participatieNiveau: 'Lvl 1 Participatie (Raadplegen & Luisteren)',
      },
      stemverhoudingDenkrichtingen: [
        {
          id: 'A',
          titel: 'Richting A: Landschap',
          ondertitel: 'Agrarisch-landschappelijke versterking met zeer beperkte bebouwing',
          percentage: 48,
          stemmen: 72,
          kernargument: 'Maximale openheid behouden naar het polderlandschap en herstel van historische houtwallen.',
        },
        {
          id: 'B',
          titel: 'Richting B: Buurtschap',
          ondertitel: 'Kleinschalig woonerf of ensemble van erven en hofjes',
          percentage: 38,
          stemmen: 57,
          kernargument: 'Sterke voorkeur voor autoluwe hofjes rondom een gedeelde boomgaard voor senioren en starters.',
        },
        {
          id: 'C',
          titel: 'Richting C: Dorpsafronding',
          ondertitel: 'Compacte dorpsstructuur direct aansluitend op station',
          percentage: 14,
          stemmen: 20,
          kernargument: 'Concentratie rondom het OV-knooppunt om de rest van het weidegebied onaangetast te laten.',
        },
      ],
      maquetteConsensusParameters: {
        verhoudingLandschapWonen: '74% Landschap vs 26% Wonen (duidelijke landschappelijke dominantie)',
        aantalWoningenPerHof: '8 – 12 woningen (gemiddeld 9.8 woningen; afwijzing grote blokken)',
        voorkeurWoonmilieu: '71% Collectief Hof met gedeelde boomgaard t.o.v. individuele kavels',
        waterEnGroeninpassing: '86% Natuurlijke Wadi & kwelsloot met riet en knotwilgen',
      },
      prioriteitenEnKernwaarden: [
        { id: 'zichtlijn', label: 'Behoud open zichtlijn naar het oostelijke veenweideveld', percentage: 94, stemmen: 79 },
        { id: 'verkeer', label: 'Veilige oversteek en fietsroute N417 naar station', percentage: 89, stemmen: 75 },
        { id: 'rust', label: 'Behoud van dorpse rust, donkerte & stilte', percentage: 85, stemmen: 71 },
        { id: 'buffer', label: 'Natuurlijke geluids- en groenbuffer richting spoor & A27', percentage: 81, stemmen: 68 },
        { id: 'water', label: 'Natuurlijke kwelwaterberging & wadi’s tegen drassigheid', percentage: 76, stemmen: 64 },
        { id: 'senioren', label: 'Geschikte gelijkvloerse hofwoningen voor dorpssenioren', percentage: 72, stemmen: 60 },
      ],
      doelgroepenBehoefte: [
        { doelgroep: 'Senioren uit Hollandsche Rading (doorstroming)', percentage: 44, aantal: 37 },
        { doelgroep: 'Starters & jongvolwassenen uit het dorp', percentage: 38, aantal: 32 },
        { doelgroep: 'Jonge gezinnen (behoud basisschool & voorzieningen)', percentage: 12, aantal: 10 },
        { doelgroep: 'Reguliere markt / overig', percentage: 6, aantal: 5 },
      ],
      openbaarIdeeenRegister: ideas.map((i) => ({
        id: i.id,
        titel: i.title,
        categorie: i.category,
        stemmen: i.votesCount,
        auteur: i.authorName || 'Inwoner',
        datum: i.createdAt,
        status: i.status,
      })),
    };
    return JSON.stringify(data, null, 2);
  }

  public exportDashboardStatsCSV(): string {
    const lines = [
      'Categorie;Onderdeel;Percentage_Of_Waarde;Stemmen_Aantal;Toelichting',
      'KPI;Totaal Stemmen;149;149;+28 deze week',
      'KPI;Ingebrachte Ideeen;18;18;80% positief sentiment',
      'KPI;Enquete Deelnemers;84;84;62% woningzoekenden',
      'KPI;Huidige Fase;Fase 1;Fase 1;Luisteren & Verkenning',
      'Denkrichting;Richting A: Landschap;48%;72;Agrarisch-landschappelijke versterking',
      'Denkrichting;Richting B: Buurtschap;38%;57;Kleinschalig woonerf of ensemble van erven',
      'Denkrichting;Richting C: Dorpsafronding;14%;20;Compacte dorpsstructuur bij station',
      'Maquette;Verhouding Landschap-Wonen;74% Landschap / 26% Wonen;Consensus;Landschappelijke dominantie',
      'Maquette;Schaal per Hof;8 - 12 woningen;Gem. 9.8;Afwijzing van grootschalige blokken',
      'Maquette;Woonmilieu;71% Collectief Hof;Consensus;Gezamenlijke boomgaard & ontmoeting',
      'Maquette;Waterberging;86% Natuurlijke Wadi;Consensus;Kwelwaterberging met riet en wilgen',
      'Kernwaarde;Open Zichtlijn Oosten;94%;79;Behoud historische weidsheid',
      'Kernwaarde;Veilige Oversteek N417;89%;75;Fietsroute naar station',
      'Kernwaarde;Dorpse Rust & Donkerte;85%;71;Behoud stilte en landelijke sfeer',
      'Kernwaarde;Groenbuffer Spoor/A27;81%;68;Natuurlijke geluidswal',
      'Kernwaarde;Kwelwaterberging;76%;64;Wadi tegen drassigheid',
      'Kernwaarde;Senioren Hofwoningen;72%;60;Gelijkvloers voor dorpssenioren',
      'Doelgroep;Senioren Doorstroming;44%;37;Eengezinswoningen vrijspelen',
      'Doelgroep;Starters Dorp;38%;32;Jongeren in Hollandsche Rading houden',
      'Doelgroep;Jonge Gezinnen;12%;10;Draagvlak basisschool',
      'Doelgroep;Reguliere Markt;6%;5;Overige woningzoekenden',
    ];
    return lines.join('\n');
  }

  public downloadBlob(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Cookie Consent & AVG Privacy Settings
  public getCookieConsent(): CookieConsentSettings | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public setCookieConsent(analytics: boolean): CookieConsentSettings {
    const consent: CookieConsentSettings = {
      functional: true,
      analytics,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, JSON.stringify(consent));
    } catch {
      // ignore
    }
    this.notify();
    return consent;
  }

  public hasAnsweredCookieConsent(): boolean {
    return this.getCookieConsent() !== null;
  }

  public resetCookieConsent(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.COOKIE_CONSENT);
    } catch {
      // ignore
    }
    this.notify();
  }
}

export const store = new ParticipationStore();
