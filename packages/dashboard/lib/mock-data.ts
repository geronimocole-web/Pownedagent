import type { FeedItem, Insteek } from '@powned/database'

// ─── Demo nieuwsitems met pre-ingevulde DNA scores ───────────────────────────

export const MOCK_ITEMS: FeedItem[] = [
  {
    id: 'demo-1',
    title: 'Student krijgt studiefinanciering gekort omdat bijbaantje 1 uur te veel was',
    url: 'https://nos.nl/artikel/demo-1',
    source: 'NOS',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 1 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 1 * 3_600_000).toISOString(),
    brutaal: 9.0,
    spraakmakend: 9.0,
    absurd: 8.5,
    lokaal: 7.0,
    total_score: 8.65,
    reden: 'DUO bestrafte een student die 1 uur meer werkte dan het maximum door een dienstruil. Hij verloor €4.200. Precies het soort kafkaiaans overheidsoptreden waar PowNed groot in is.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Gemeente verbiedt bamboeheg na 30 jaar — buurman moet 4 meter afkappen',
    url: 'https://bd.nl/artikel/demo-2',
    source: 'Brabants Dagblad',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    brutaal: 7.5,
    spraakmakend: 8.0,
    absurd: 9.0,
    lokaal: 8.5,
    total_score: 8.13,
    reden: 'Schoolvoorbeeld van absurde bureaucratie: gemeente slaapt 30 jaar en treedt ineens op na burenklacht. De bamboe-heg als symbool van overheidswillekeur heeft viraal potentieel.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Zorgverzekeraar vergoedt tandartsbezoek niet meer voor 23-jarigen',
    url: 'https://rtl.nl/artikel/demo-3',
    source: 'RTL Nieuws',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 5 * 3_600_000).toISOString(),
    brutaal: 8.5,
    spraakmakend: 9.0,
    absurd: 7.0,
    lokaal: 6.5,
    total_score: 8.0,
    reden: 'Direct in de portemonnee van de PowNed-doelgroep: jongvolwassenen die net geen student meer zijn. Gezondheidszorg + financiële druk + overheidsfalen — dit leeft op sociale media.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    title: 'Woningcorporatie houdt loterij voor sociale huurwoning: 847 inschrijvingen voor 1 appartement',
    url: 'https://reddit.com/r/netherlands/demo-4',
    source: 'Reddit r/Netherlands',
    platform: 'reddit',
    published_at: new Date(Date.now() - 6 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 6 * 3_600_000).toISOString(),
    brutaal: 8.0,
    spraakmakend: 8.5,
    absurd: 7.5,
    lokaal: 7.0,
    total_score: 7.9,
    reden: 'De woningcrisis in één getal: 847 mensen voor 1 appartement. Perfect deelbaar cijfer dat de schaalgrootte van het probleem tastbaar maakt voor een jong publiek.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    title: 'Belastingdienst stuurt brief aan overledene: \'U heeft recht op kinderopvangtoeslag\'',
    url: 'https://telegraaf.nl/artikel/demo-5',
    source: 'De Telegraaf',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 8 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 8 * 3_600_000).toISOString(),
    brutaal: 6.0,
    spraakmakend: 8.5,
    absurd: 10.0,
    lokaal: 7.0,
    total_score: 7.85,
    reden: 'Absurditeit ten top: de staat die communiceert met de dood. Virale clip: "DigiD voor in de hemel." Iedereen die ooit moeite had met de Belastingdienst herkent dit.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    title: 'Amsterdam verbiedt barbecue op balkon — boete €140 per keer',
    url: 'https://at5.nl/artikel/demo-6',
    source: 'AT5',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 10 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 10 * 3_600_000).toISOString(),
    brutaal: 7.0,
    spraakmakend: 7.5,
    absurd: 7.0,
    lokaal: 9.0,
    total_score: 7.6,
    reden: 'Klassiek Amsterdam vs. burger verhaal. Lokaal sterk, nationaal herkenbaar voor iedereen in een appartement. Zomers thema dat goed werkt met straatinterviews.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-7',
    title: 'NS-trein vertrekt 8 minuten te vroeg — reiziger moet 1 uur wachten op volgende',
    url: 'https://reddit.com/r/thenetherlands/demo-7',
    source: 'Reddit r/thenetherlands',
    platform: 'reddit',
    published_at: new Date(Date.now() - 14 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 14 * 3_600_000).toISOString(),
    brutaal: 6.5,
    spraakmakend: 7.0,
    absurd: 8.0,
    lokaal: 6.0,
    total_score: 6.9,
    reden: 'Iedereen heeft dit meegemaakt. De absurditeit van een te vroeg vertrekkende trein als symbool voor NS-falen spreekt breed aan, al is het geen urgent verhaal.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-8',
    title: 'Gymleraar geeft 3 voor de lijst omdat leerling niet kan hula-hoepen',
    url: 'https://nu.nl/artikel/demo-8',
    source: 'NU.nl',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 18 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 18 * 3_600_000).toISOString(),
    brutaal: 6.0,
    spraakmakend: 7.0,
    absurd: 9.0,
    lokaal: 5.5,
    total_score: 6.8,
    reden: 'Licht absurd onderwijsverhaal. Herkenbaar voor iedereen — wie kon er nou hula-hoepen? Goed als feelgood-item aan het einde van een uitzending.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-9',
    title: 'Minister biedt excuses aan voor beleid dat hij zelf twee weken geleden verdedigde',
    url: 'https://nos.nl/artikel/demo-9',
    source: 'NOS',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 22 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 22 * 3_600_000).toISOString(),
    brutaal: 8.0,
    spraakmakend: 7.0,
    absurd: 7.5,
    lokaal: 4.0,
    total_score: 6.9,
    reden: 'Politiek theater in optima forma. Bruikbaar als snel commentaarstuk — redacteur in beeld met de twee uitspraken naast elkaar. Confronterend en herkenbaar.',
    scored_at: new Date().toISOString(),
  },
  {
    id: 'demo-10',
    title: 'Coffeeshop weigert toeristen na druk van buurt — eigenaar: \'Ik verlies 70% omzet\'',
    url: 'https://parool.nl/artikel/demo-10',
    source: 'Het Parool',
    platform: 'nieuws',
    published_at: new Date(Date.now() - 26 * 3_600_000).toISOString(),
    created_at: new Date(Date.now() - 26 * 3_600_000).toISOString(),
    brutaal: 7.0,
    spraakmakend: 6.5,
    absurd: 6.0,
    lokaal: 8.0,
    total_score: 6.9,
    reden: 'Amsterdam-beleid dat nationaal raakt aan toerisme, ondernemersvrijheid en woonbaarheid. Drie invalshoeken makkelijk te spelen. Minder urgent, wel solide item.',
    scored_at: new Date().toISOString(),
  },
]

// ─── Pre-gegenereerde insteek voor het top-item ───────────────────────────────

export const MOCK_INSTEEKVELLEN: Record<string, Insteek> = {
  'demo-1': {
    opening: 'Eén uur. Dat is het verschil tussen een normale student en iemand die €4.200 kwijtraakt. De overheid telt mee — tot op de minuut.',
    invalshoeken: [
      {
        titel: 'De student die netjes zijn roosters ruilde',
        beschrijving: 'Hij werkte niet te veel — hij deed een dienstruil met een collega. Maar DUO telt alleen het eindgetal. Resultaat: studiefinanciering korten met terugwerkende kracht. Is dit handhaving of blinde regeltoepassing?',
      },
      {
        titel: 'DUO als kafkamachine: de regels boven de mens',
        beschrijving: 'DUO biedt geen ruimte voor context, bezwaar duurt maanden en intussen loopt de terugbetaling op. Studentenvakbonden zeggen dat dit structureel gebeurt — dit is geen uitzondering.',
      },
      {
        titel: 'Wat kost bijverdienen als student echt?',
        beschrijving: 'De bijverdiengrens bestaat al jaren, maar de handhaving is verscherpt. Studenten weten vaak niet hoeveel ze mogen verdienen. Universiteiten waarschuwen nauwelijks. Wie is verantwoordelijk voor deze kenniskloof?',
      },
    ],
    vragen: [
      { vraag: 'Wist jij op het moment van de dienstruil dat je over de grens ging?', type: 'confronterend' },
      { vraag: 'Wat deed jij met dat geld — had je het al uitgegeven?', type: 'publiek' },
      { vraag: 'Hoe lang duurde het voordat DUO reageerde op jouw bezwaar?', type: 'context' },
      { vraag: 'Is DUO op de hoogte van deze gang van zaken en wat doen ze eraan?', type: 'confronterend' },
      { vraag: 'Hoeveel studenten krijgen jaarlijks zo\'n naheffing?', type: 'context' },
    ],
    sprekers: [
      { naam: 'De student', rol: 'Getroffene', waarom: 'Persoonlijk verhaal geeft het gezicht aan een systeem-probleem. Kijker identificeert zich direct.' },
      { naam: 'Woordvoerder DUO', rol: 'Overheidsinstantie', waarom: 'Moet uitleggen waarom context geen rol speelt in de beoordeling. Confronterende vraagstelling.' },
      { naam: 'LSVb-woordvoerder', rol: 'Landelijke Studentenvakbond', waarom: 'Bevestigt dat dit patroon breed voorkomt en geeft politieke lading aan het verhaal.' },
    ],
    shots: [
      'Student aan bureau met stapel papieren van DUO — close-up op bedrag',
      'Salarisstrook met rode cirkel om het aantal uren',
      'DUO-kantoor exterieur, voice-over over het systeem',
      'Studenten op straat: "Wist jij hoeveel je mocht bijverdienen?"',
      'Rekenmachine met de bijverdiengrens uitgerekend — split screen met boetebedrag',
    ],
    formaat: {
      type: 'reportage',
      lengte: '2-3 minuten',
      toon: 'verontwaardigde buurman — dit kán toch niet',
      social_cut: '30 sec: student kijkt in camera, zegt het bedrag. Cut naar DUO-brief. Tekst over beeld: "Voor 1 uur werk." Eindshot: hij slaat de envelop dicht.',
    },
    urgentie: {
      niveau: 'hoog',
      toelichting: 'Studenten zijn nu bezig met bijverdienen voor de zomer. Dit verhaal raakt ze direct. Publiceren vóór het weekend voor maximaal bereik op sociale media.',
    },
  },

  'demo-2': {
    opening: 'Dertig jaar stond de heg er. Niemand die er iets van zei. Tot de buurman klaagde — en de gemeente ineens de wet had uitgevonden.',
    invalshoeken: [
      {
        titel: 'De bewoner: 30 jaar gedoogd, nu bestraft',
        beschrijving: 'De eigenaar heeft zijn heg nooit verstopt. De gemeente wist het, deed niets. Totdat één buurman een klacht indiende. Is dit rechtvaardig handhaven of opportunistisch optreden op bestelling?',
      },
      {
        titel: 'Buurman als trigger: goed recht of burenruzie als wapen?',
        beschrijving: 'Zonder de klacht was er niets gebeurd. Mogen burgers de gemeente gebruiken als verlengstuk van een burenruzie? En wat zegt dit over de gelijke behandeling van inwoners?',
      },
      {
        titel: 'Rechtsverwerking: had de gemeente dit juridisch nog wel mogen doen?',
        beschrijving: 'Als een overheid jarenlang niet handhaaft, kan ze dat recht verspelen. Bestuursrechtjurist legt uit of de eigenaar eigenlijk had kunnen winnen bij de rechter — en of hij dat nog kan.',
      },
    ],
    vragen: [
      { vraag: 'Waarom heeft de gemeente dertig jaar niets gedaan?', type: 'confronterend' },
      { vraag: 'Voelt u zich verraden door de overheid die dit jarenlang accepteerde?', type: 'confronterend' },
      { vraag: 'Wat is rechtsverwerking en is dat hier van toepassing?', type: 'context' },
      { vraag: 'Vindt u het normaal om je buren aan te geven bij de gemeente?', type: 'publiek' },
    ],
    sprekers: [
      { naam: 'Bewoner bamboeheg', rol: 'Getroffene', waarom: 'Menselijk gezicht van overheidsoptreden — hij veranderde niets, de gemeente wel.' },
      { naam: 'Bestuursrechtjurist', rol: 'Specialist handhaving', waarom: 'Toetst of de gemeente dit juridisch nog mocht na 30 jaar stilzitten.' },
      { naam: 'Omwonenden Roosendaal', rol: 'Publiek', waarom: 'Straatgevoel: staan mensen achter "regels zijn regels" of achter de bamboe-eigenaar?' },
    ],
    shots: [
      'Close-up van bamboeheg — van onderaf omhoog, groot en groen',
      'Bewoner naast heg met meetlint: "Dit moet dus weg"',
      'Gemeentehuis Roosendaal exterieur',
      'Handhavingsbrief — camera zoomt in op de datum',
      'Buurtstraat: reacties van voorbijgangers',
    ],
    formaat: {
      type: 'reportage',
      lengte: '2-3 minuten',
      toon: 'verontwaardigde buurman — wij snappen er ook niets van',
      social_cut: '30 sec: bewoner staat voor heg, leest brief voor, kijkt in camera. Tekst: "30 jaar. Nul probleem. Tot de buurman belde."',
    },
    urgentie: {
      niveau: 'middel',
      toelichting: 'Geen breaking news, maar een tijdloos PowNed-thema. Werkt het hele jaar — plant het in als er een rustigere nieuwsdag is.',
    },
  },
}

// ─── Helper: filter + sorteer mock items ─────────────────────────────────────

export function filterMockItems(opts: {
  platform?: string
  minScore?: number
  limit?: number
  offset?: number
}): FeedItem[] {
  const { platform = 'alles', minScore = 0, limit = 50, offset = 0 } = opts

  return MOCK_ITEMS
    .filter(item => platform === 'alles' || item.platform === platform)
    .filter(item => (item.total_score ?? 0) >= minScore)
    .sort((a, b) => (b.total_score ?? 0) - (a.total_score ?? 0))
    .slice(offset, offset + limit)
}

export const IS_DEMO_MODE = !process.env.SUPABASE_URL
