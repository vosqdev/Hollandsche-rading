export type CategoryType =
  | 'idee'
  | 'groen'
  | 'wonen'
  | 'verkeer'
  | 'water'
  | 'natuur'
  | 'energie'
  | 'behouden'
  | 'aandachtspunt';

export interface MapIdea {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  lat: number;
  lng: number;
  authorName?: string;
  authorEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  votesCount: number;
  createdAt: string;
}

export interface PriorityItem {
  id: string;
  label: string;
  description?: string;
}

export interface TargetGroupItem {
  id: string;
  label: string;
  description?: string;
}

export interface ParticipationResponse {
  id: string;
  participantId: string;
  type: 'priorities' | 'target_groups' | 'wat_moet_blijven' | 'contact_vraag' | 'variant_preference' | 'woonwens';
  selectedKeys?: string[];
  customText?: string;
  location?: { lat: number; lng: number };
  createdAt: string;
  woonwensData?: {
    naam?: string;
    email?: string;
    doelgroep: string;
    woningtype: string;
    prijsklasse: string;
    toelichting?: string;
    isWoningzoekend: boolean;
  };
}

export interface AgendaEvent {
  id: string;
  title: string;
  type: 'inloopavond' | 'dorpsgesprek' | 'werksessie' | 'wandeling' | 'presentatie' | 'digitaal_platform' | 'gebiedsatelier';
  date: string;
  time: string;
  location: string;
  description: string;
  spotsTotal: number;
  spotsBooked: number;
  badgeLabel?: string;
  statusLabel?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  type?: string;
  date: string;
  fileSize: string;
  fileType: string;
  description: string;
  externalUrl?: string;
  sourceLabel?: string;
  relevanceForParticipation?: string;
}

export type ProjectDocument = DocumentItem;

export interface LogbookEntry {
  id: string;
  date: string;
  title: string;
  summary: string;
  content: string;
  tag: string;
}

export interface ThemeStat {
  theme: string;
  mentions: number;
  sentiment: 'positief' | 'constructief' | 'aandacht';
  keyPhrases: string[];
}

export interface ProjectSettings {
  currentPhase: number; // 1 to 7
  phaseName: string;
  title: string;
  participationOpen: boolean;
  participationActive?: boolean;
  activeAnnouncement?: string;
}

export interface Participant {
  id: string;
  sessionToken: string;
  email?: string;
  createdAt: string;
  votedIdeaIds: string[];
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  isResident: boolean;
  keepUpdatedOnEvents: boolean;
  createdAt: string;
}
