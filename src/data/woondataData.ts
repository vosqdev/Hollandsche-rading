/**
 * Actuele woningmarkt- en demografiedata voor Gemeente De Bilt & Dorpsrand Hollandsche Rading
 * Bronnen: CBS StatLine (83765NED, 84400NED, 85408NED), BAG (Basisregistratie Adressen en Gebouwen) & VNG / Woondeal Regio Utrecht U10.
 */

export interface KpiSummary {
  woningvoorraad: number;
  nettoToevoegingJaar: number;
  koopPercentage: number;
  corporatiePercentage: number;
  particulierPercentage: number;
  plancapaciteitTotaal: number;
  opgave2030: number;
  hardeCapaciteit: number;
  zachteCapaciteit: number;
  dekkingsgraad: number;
  inwoners: number;
  inwonersSinds2015: number;
  huishoudensgrootte: number;
}

export interface BouwproductieJaar {
  jaar: number;
  opgeleverd: number;
  vergund: number;
  inAanbouw: number;
  sloop: number;
  netto: number;
  dataType: 'CBS STATLINE' | 'GEMEENTELIJKE MONITORING' | 'PROGNOSE';
}

export interface WoningtypeStat {
  type: string;
  percentage: number;
  aantal: number;
}

export interface BouwjaarStat {
  periode: string;
  label: string;
  aantal: number;
  percentage: number;
}

export interface GboOppervlakteStat {
  range: string;
  label: string;
  aantal: number;
  percentage: number;
  omschrijving: string;
}

export interface KernVoorraadStat {
  kern: string;
  aantal: number;
  percentage: number;
  omschrijving: string;
}

export interface PlancapaciteitKern {
  kern: string;
  hardeCapaciteit: number;
  zachteCapaciteit: number;
  totaalPlannen: number;
  opgave2030: number;
  dekkingsgraad: number;
  status: 'Voldoende' | 'In verkenning' | 'Krap';
}

export interface DemografiePunt {
  jaar: number;
  inwoners: number;
  huishoudens: number;
  senioren: number;
  personenPerHuishouden: number;
}

export interface WoningbouwProject {
  id: string;
  naam: string;
  locatie: string;
  kern: 'Hollandsche Rading' | 'Bilthoven' | 'De Bilt' | 'Maartensdijk' | 'Groenekan / Westbroek';
  coords: [number, number];
  aantalWoningen: number;
  capaciteitType: 'Harde plancapaciteit' | 'Zachte plancapaciteit' | 'Participatieverkenning';
  status: 'In aanbouw' | 'Verkoop gestart' | 'In voorbereiding' | 'In verkenning';
  ontwikkelaar?: string;
  omschrijving: string;
  doelgroepen: string[];
}

export interface BenchmarkStat {
  indicator: string;
  deBilt: string | number;
  regioUtrecht: string | number;
  nederland: string | number;
  toelichting: string;
  bron: string;
}

// 1. KPI Samenvatting
export const WOONDATA_KPI: KpiSummary = {
  woningvoorraad: 19645,
  nettoToevoegingJaar: 412,
  koopPercentage: 64.8,
  corporatiePercentage: 22.6,
  particulierPercentage: 12.6,
  plancapaciteitTotaal: 2025,
  opgave2030: 1730,
  hardeCapaciteit: 1135,
  zachteCapaciteit: 890,
  dekkingsgraad: 117,
  inwoners: 43860,
  inwonersSinds2015: 1420,
  huishoudensgrootte: 2.21,
};

// 2. Bouwproductie & Bouwvergunningen (2020 - 2026)
export const BOUWPRODUCTIE_DATA: BouwproductieJaar[] = [
  { jaar: 2020, opgeleverd: 210, vergund: 245, inAanbouw: 180, sloop: -12, netto: 198, dataType: 'CBS STATLINE' },
  { jaar: 2021, opgeleverd: 265, vergund: 310, inAanbouw: 235, sloop: -16, netto: 249, dataType: 'CBS STATLINE' },
  { jaar: 2022, opgeleverd: 290, vergund: 385, inAanbouw: 285, sloop: -20, netto: 270, dataType: 'CBS STATLINE' },
  { jaar: 2023, opgeleverd: 315, vergund: 340, inAanbouw: 330, sloop: -14, netto: 301, dataType: 'CBS STATLINE' },
  { jaar: 2024, opgeleverd: 360, vergund: 430, inAanbouw: 410, sloop: -18, netto: 342, dataType: 'CBS STATLINE' },
  { jaar: 2025, opgeleverd: 410, vergund: 480, inAanbouw: 460, sloop: -15, netto: 395, dataType: 'GEMEENTELIJKE MONITORING' },
  { jaar: 2026, opgeleverd: 450, vergund: 520, inAanbouw: 505, sloop: -15, netto: 435, dataType: 'PROGNOSE' },
];

// 3. Typologieën (CBS StatLine 83765NED & BAG)
export const WONINGTYPEN_DATA: WoningtypeStat[] = [
  { type: 'Rij- en tussenwoningen', percentage: 35, aantal: 6875 },
  { type: 'Vrijstaand & Geschakeld', percentage: 25, aantal: 4910 },
  { type: 'Twee-onder-een-kap', percentage: 23, aantal: 4520 },
  { type: 'Appartementen / Meergezins', percentage: 13, aantal: 2550 },
  { type: 'Patios / Hofjes / Overig', percentage: 4, aantal: 790 },
];

// 4. Bouwjaarperiodes (BAG)
export const BOUWJAAR_DATA: BouwjaarStat[] = [
  { periode: 'Voor 1945', label: 'Historisch lint & spoorzone', aantal: 1620, percentage: 8 },
  { periode: '1945 – 1970', label: 'Naoorlogse dorpsuitbreiding', aantal: 5850, percentage: 30 },
  { periode: '1971 – 1990', label: 'Woonerven & dorpsgroei', aantal: 5210, percentage: 26 },
  { periode: '1991 – 2015', label: 'Modernere inbreidingen', aantal: 4120, percentage: 21 },
  { periode: '2016 – Heden', label: 'Recente transformaties & uitleg', aantal: 2845, percentage: 15 },
];

// 5. Gebruiksoppervlakte m² GBO (BAG)
export const GBO_OPPERVLAKTE_DATA: GboOppervlakteStat[] = [
  { range: '< 75 m²', label: 'Klein / Starter / Studio', aantal: 1840, percentage: 9, omschrijving: 'Levensloopgeschikte compacte woningen en startersappartementen' },
  { range: '75 – 100 m²', label: 'Midden / Starter / Hofwoning', aantal: 4050, percentage: 21, omschrijving: 'Middelgrote appartementen en compacte eengezinswoningen' },
  { range: '100 – 150 m²', label: 'Eengezinswoning / Tussenwoning', aantal: 9430, percentage: 48, omschrijving: 'Dominante tranche in gemeente De Bilt' },
  { range: '150 – 200 m²', label: 'Ruim / 2-kapper / Hoek', aantal: 2765, percentage: 14, omschrijving: 'Ruime gezinswoningen op groene kavels' },
  { range: '> 200 m²', label: 'Groot / Vrijstaand / Villa', aantal: 1560, percentage: 8, omschrijving: 'Villa- en bosrijk woonmilieu (o.a. Hollandsche Rading en Bilthoven Noord)' },
];

// 6. Verdeling woningvoorraad per kern
export const KERN_VOORRAAD_DATA: KernVoorraadStat[] = [
  { kern: 'Bilthoven', aantal: 10420, percentage: 53.0, omschrijving: 'Grootste kern met mix van villawijken, naoorlogs en stationszone' },
  { kern: 'De Bilt', aantal: 5680, percentage: 28.9, omschrijving: 'Historische kern, centrumvoorzieningen en gemengde woonwijken' },
  { kern: 'Maartensdijk', aantal: 1890, percentage: 9.6, omschrijving: 'Dorpse lintstructuur en uitbreidingswijken' },
  { kern: 'Hollandsche Rading', aantal: 840, percentage: 4.3, omschrijving: 'Bosrijk stationsdorp, overwegend vrijstaand en 2-kappers' },
  { kern: 'Buitengebied, Groenekan & Westbroek', aantal: 815, percentage: 4.2, omschrijving: 'Agrarisch en landschappelijk open gebied' },
];

// 7. Plancapaciteit per kern (Woonvisie t/m 2030)
export const PLANCAPACITEIT_KERNEN: PlancapaciteitKern[] = [
  { kern: 'Bilthoven & De Leijen', hardeCapaciteit: 620, zachteCapaciteit: 380, totaalPlannen: 1000, opgave2030: 850, dekkingsgraad: 118, status: 'Voldoende' },
  { kern: 'De Bilt & Hessenweg', hardeCapaciteit: 310, zachteCapaciteit: 220, totaalPlannen: 530, opgave2030: 480, dekkingsgraad: 110, status: 'Voldoende' },
  { kern: 'Maartensdijk', hardeCapaciteit: 120, zachteCapaciteit: 90, totaalPlannen: 210, opgave2030: 180, dekkingsgraad: 117, status: 'Voldoende' },
  { kern: 'Hollandsche Rading (Dorpsrand)', hardeCapaciteit: 45, zachteCapaciteit: 165, totaalPlannen: 210, opgave2030: 150, dekkingsgraad: 140, status: 'In verkenning' },
  { kern: 'Westbroek & Groenekan', hardeCapaciteit: 40, zachteCapaciteit: 35, totaalPlannen: 75, opgave2030: 70, dekkingsgraad: 107, status: 'Voldoende' },
];

// 8. Demografie & Huishoudensgroei (2015 – 2050)
export const DEMOGRAFIE_DATA: DemografiePunt[] = [
  { jaar: 2015, inwoners: 42100, huishoudens: 18200, senioren: 8900, personenPerHuishouden: 2.31 },
  { jaar: 2018, inwoners: 42600, huishoudens: 18700, senioren: 9400, personenPerHuishouden: 2.28 },
  { jaar: 2021, inwoners: 43100, huishoudens: 19300, senioren: 9950, personenPerHuishouden: 2.25 },
  { jaar: 2024, inwoners: 43700, huishoudens: 19950, senioren: 10500, personenPerHuishouden: 2.22 },
  { jaar: 2026, inwoners: 44250, huishoudens: 20400, senioren: 10900, personenPerHuishouden: 2.20 },
  { jaar: 2030, inwoners: 45300, huishoudens: 21200, senioren: 11600, personenPerHuishouden: 2.16 },
  { jaar: 2040, inwoners: 47100, huishoudens: 22600, senioren: 12500, personenPerHuishouden: 2.12 },
  { jaar: 2050, inwoners: 48500, huishoudens: 23800, senioren: 13200, personenPerHuishouden: 2.08 },
];

// 9. Projecten met Geo-coördinaten
export const WONINGBOUW_PROJECTEN: WoningbouwProject[] = [
  {
    id: 'prj-hr-1',
    naam: 'Dorpsrandverkenning Hollandsche Rading',
    locatie: 'Tolakkerweg / Spoorzone oost',
    kern: 'Hollandsche Rading',
    coords: [52.1792, 5.1805],
    aantalWoningen: 95,
    capaciteitType: 'Participatieverkenning',
    status: 'In verkenning',
    ontwikkelaar: 'Gebiedsverkenning Gemeente De Bilt & Omwonenden',
    omschrijving: 'Verkenning van een passend dorps woonmilieu met respect voor bos en natuur, met prioriteit voor senioren en starters uit het dorp.',
    doelgroepen: ['Senioren (levensloopbestendig)', 'Jongeren / Starters uit Hollandsche Rading', 'Compacte eengezinswoningen'],
  },
  {
    id: 'prj-hr-2',
    naam: 'Woonerf Tolakkerweg Noord',
    locatie: 'Tolakkerweg 180-190',
    kern: 'Hollandsche Rading',
    coords: [52.1835, 5.1760],
    aantalWoningen: 24,
    capaciteitType: 'Zachte plancapaciteit',
    status: 'In voorbereiding',
    ontwikkelaar: 'Particuliere initiatiefnemer',
    omschrijving: 'Kleinschalig groen woonerf met houtbouw en energiepositieve seniorenwoningen.',
    doelgroepen: ['Senioren', 'Doorstromers'],
  },
  {
    id: 'prj-hr-3',
    naam: 'Stationsomgeving Hollandsche Rading',
    locatie: 'Spoorlaan / Stationsplein',
    kern: 'Hollandsche Rading',
    coords: [52.1770, 5.1775],
    aantalWoningen: 35,
    capaciteitType: 'Zachte plancapaciteit',
    status: 'In voorbereiding',
    ontwikkelaar: 'Samenwerking NS Stations & Gemeente',
    omschrijving: 'Knooppuntontwikkeling met mobiliteitshub, lichte horeca en kleinschalige huurappartementen.',
    doelgroepen: ['Starters', 'Forensen (OV-georiënteerd)'],
  },
  {
    id: 'prj-blt-1',
    naam: 'Kwinkelier & Centrumgebied',
    locatie: 'Soestdijkseweg Zuid / Rembrandtlaan',
    kern: 'Bilthoven',
    coords: [52.1320, 5.2015],
    aantalWoningen: 160,
    capaciteitType: 'Harde plancapaciteit',
    status: 'In aanbouw',
    ontwikkelaar: 'Redevco / Slokker Bouwgroep',
    omschrijving: 'Herontwikkeling van winkelcentrum Kwinkelier met moderne centrumappartementen boven winkels.',
    doelgroepen: ['Senioren', 'Starters', 'Middenhuur'],
  },
  {
    id: 'prj-blt-2',
    naam: 'Larenstein Herontwikkeling',
    locatie: 'Larenstein / Universiteitsterrein',
    kern: 'Bilthoven',
    coords: [52.1245, 5.1950],
    aantalWoningen: 110,
    capaciteitType: 'Harde plancapaciteit',
    status: 'Verkoop gestart',
    ontwikkelaar: 'BPD Gebiedsontwikkeling',
    omschrijving: 'Transformatie van voormalig onderwijsterrein naar een lommerrijke, duurzame woonbuurt.',
    doelgroepen: ['Gezinnen', 'Middeninkomens', 'Levensloop'],
  },
  {
    id: 'prj-blt-3',
    naam: 'Bilthoven Noord Parkrand',
    locatie: 'Gezichtslaan / Sweelincklaan',
    kern: 'Bilthoven',
    coords: [52.1410, 5.2120],
    aantalWoningen: 45,
    capaciteitType: 'Harde plancapaciteit',
    status: 'In aanbouw',
    ontwikkelaar: 'Trebbe Wonen',
    omschrijving: 'Villa-appartementen en halfvrijstaande boswoningen in het hoge marktsegment.',
    doelgroepen: ['Doorstromers', 'Senioren'],
  },
  {
    id: 'prj-md-1',
    naam: 'Maartensdijk Dorpsrand Noordoost',
    locatie: 'Dorus Rijkersweg / Maartensdijk',
    kern: 'Maartensdijk',
    coords: [52.1610, 5.1780],
    aantalWoningen: 75,
    capaciteitType: 'Zachte plancapaciteit',
    status: 'In voorbereiding',
    ontwikkelaar: 'Woningstichting SSW & Heijmans',
    omschrijving: 'Dorps uitbreidingsplan met minimaal 40% sociale huur en betaalbare koop voor dorpsbewoners.',
    doelgroepen: ['Lokale starters', 'Senioren uit Maartensdijk', 'Jonge gezinnen'],
  },
  {
    id: 'prj-db-1',
    naam: 'Kloosterterrein & Hessenweg',
    locatie: 'Hessenweg / Dorpsstraat De Bilt',
    kern: 'De Bilt',
    coords: [52.1090, 5.1820],
    aantalWoningen: 90,
    capaciteitType: 'Harde plancapaciteit',
    status: 'Verkoop gestart',
    ontwikkelaar: 'KlokGroep Bouw',
    omschrijving: 'Inbreidingslocatie met behoud van historische kloostertuin en monumentale bomen.',
    doelgroepen: ['Starters', 'Middenhuur', 'Gezinnen'],
  },
  {
    id: 'prj-gn-1',
    naam: 'Groenekan Dorpslint',
    locatie: 'Groenekanseweg',
    kern: 'Groenekan / Westbroek',
    coords: [52.1260, 5.1530],
    aantalWoningen: 28,
    capaciteitType: 'Harde plancapaciteit',
    status: 'In aanbouw',
    ontwikkelaar: 'Lokale bouwer',
    omschrijving: 'Kleinschalige schuurwoningen passend in het agrarische landschap.',
    doelgroepen: ['Lokale doorstromers'],
  },
];

// 10. Benchmark data
export const BENCHMARK_DATA: BenchmarkStat[] = [
  {
    indicator: 'Gemiddelde WOZ-waarde',
    deBilt: '€ 565.000',
    regioUtrecht: '€ 495.000',
    nederland: '€ 410.000',
    toelichting: 'Gemeente De Bilt ligt 38% boven het landelijk gemiddelde; grote druk op betaalbaarheid.',
    bron: 'CBS StatLine 83765NED (2024)',
  },
  {
    indicator: 'Gemiddelde transactieprijs koop',
    deBilt: '€ 598.000',
    regioUtrecht: '€ 525.000',
    nederland: '€ 438.000',
    toelichting: 'Starters kunnen zonder aanzienlijk eigen vermogen nauwelijks kopen in de eigen woonkern.',
    bron: 'Kadaster & NVM Woningmarktcijfers',
  },
  {
    indicator: 'Aandeel sociale huurwoningen',
    deBilt: '22,6%',
    regioUtrecht: '28,4%',
    nederland: '30,0%',
    toelichting: 'Onder het landelijke streefpercentage van 30%; Woondeal eist 30% sociaal in nieuwbouw.',
    bron: 'VNG / BZK Woningbouwmonitor',
  },
  {
    indicator: 'Aandeel 65-plussers (Vergrijzing)',
    deBilt: '24,2%',
    regioUtrecht: '18,6%',
    nederland: '20,4%',
    toelichting: 'Bovengemiddelde vergrijzing; acute behoefte aan levensloopbestendige woningen.',
    bron: 'CBS Bevolkingsstatistiek 85408NED',
  },
  {
    indicator: 'Gemiddelde huishoudensgrootte',
    deBilt: '2,21 pers.',
    regioUtrecht: '2,16 pers.',
    nederland: '2,12 pers.',
    toelichting: 'Verdere huishoudensverdunning betekent autonome groei van woningvraag.',
    bron: 'CBS / Primos Prognose',
  },
  {
    indicator: 'Wachttijd sociale huurwoning',
    deBilt: '9,8 jaar',
    regioUtrecht: '11,2 jaar',
    nederland: '7,4 jaar',
    toelichting: 'Actieve zoektijd bij WoningNet Regio Utrecht voor een eengezins- of seniorenwoning.',
    bron: 'WoningNet Regio Utrecht Jaarverslag',
  },
];

// Export helpers to CSV
export function exportBouwdataCsv(): string {
  const headers = ['Jaar', 'Opgeleverd (Netto)', 'Bouwvergunningen', 'In Aanbouw (Einde Jaar)', 'Sloop/Onttrekking', 'Netto Toevoeging', 'Data Type'];
  const rows = BOUWPRODUCTIE_DATA.map((r) => [
    r.jaar,
    r.opgeleverd,
    r.vergund,
    r.inAanbouw,
    r.sloop,
    r.netto,
    r.dataType,
  ]);
  return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}

export function exportVoorraaddataCsv(): string {
  const headers = ['Categorie', 'Specificatie', 'Aantal Woningen', 'Percentage', 'Bron'];
  const rows: (string | number)[][] = [];

  WONINGTYPEN_DATA.forEach((w) => {
    rows.push(['Woningtype', w.type, w.aantal, `${w.percentage}%`, 'CBS StatLine 83765NED']);
  });
  BOUWJAAR_DATA.forEach((b) => {
    rows.push(['Bouwjaarperiode', b.periode, b.aantal, `${b.percentage}%`, 'BAG']);
  });
  GBO_OPPERVLAKTE_DATA.forEach((g) => {
    rows.push(['Gebruiksoppervlakte', g.range, g.aantal, `${g.percentage}%`, 'BAG']);
  });
  KERN_VOORRAAD_DATA.forEach((k) => {
    rows.push(['Woningvoorraad Kern', k.kern, k.aantal, `${k.percentage}%`, 'Gemeente De Bilt & CBS']);
  });

  return [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
}

export function downloadCsvFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
