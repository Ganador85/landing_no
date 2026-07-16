export type LocalizedString = { no: string; en: string };

export const products = [
  {
    id: "nowocoat",
    name: "NowoCoat Roof Coating",
    category: { no: "Takmaling", en: "Roof coating" },
    description: {
      no: "Profesjonell, vannbasert hybridmaling med tre bindemidler for overlegen heft til betongtakstein og fibersement. Lysekte, diffusjonsåpen, værstabil og elastisk – med Svanemerke.",
      en: "Professional water-based hybrid coating with three binders for superior adhesion to concrete tiles and fibre cement. Lightfast, vapour-open, weather-stable and elastic – Swan-labelled.",
    },
    badges: {
      no: ["Svanemerket", "UV-stabil", "Elastisk", "Diffusjonsåpen"],
      en: ["Swan ecolabel", "UV-stable", "Elastic", "Vapour-open"],
    },
  },
  {
    id: "surfapore",
    name: "SurfaPore C",
    category: {
      no: "Impregnering – diffusjonsåpen",
      en: "Impregnation – vapour-open",
    },
    description: {
      no: "Vannbasert nanoimpregnering uten farlige tilsetninger. Skaper en usynlig, vannavvisende barriere uten film – underlaget puster fritt mens fukt og smuss holdes ute.",
      en: "Water-based nano impregnation without harmful additives. Creates an invisible water-repellent barrier without a film – the substrate breathes while moisture and dirt stay out.",
    },
    badges: {
      no: ["Nanoteknologi", "Diffusjonsåpen", "Usynlig beskyttelse", "Miljøvennlig"],
      en: ["Nanotechnology", "Vapour-open", "Invisible protection", "Eco-friendly"],
    },
  },
  {
    id: "nowodry",
    name: "NowoDry WB",
    category: {
      no: "Impregnering – vannavvisende",
      en: "Impregnation – water-repellent",
    },
    description: {
      no: "Kraftig vannbasert impregnering for langvarig beskyttelse mot fukt. Ideell for takstein, heller og murverk der maksimal vannavvisning og frostbeskyttelse trengs.",
      en: "Strong water-based impregnation for lasting moisture protection. Ideal for tiles, paving and masonry where maximum water repellence and frost protection are needed.",
    },
    badges: {
      no: ["Sterk vannavvisning", "Frostbeskyttelse", "Langvarig", "Enkel påføring"],
      en: ["Strong water repellence", "Frost protection", "Long-lasting", "Easy to apply"],
    },
  },
  {
    id: "nowoclean",
    name: "NowoClean",
    category: { no: "Rengjøring", en: "Cleaning" },
    description: {
      no: "Effektivt rengjøringsmiddel for skånsom vask av papp-, skifer- og shingeltak. Fjerner smuss og alger uten å skade overflaten – og gir godt underlag for videre behandling.",
      en: "Effective cleaner for gentle washing of felt, slate and shingle roofs. Removes dirt and algae without damaging the surface – and prepares for further treatment.",
    },
    badges: {
      no: ["Skånsom vask", "Fjerner alger", "For alle taktyper", "Biologisk nedbrytbar"],
      en: ["Gentle wash", "Removes algae", "All roof types", "Biodegradable"],
    },
  },
] as const;

export const faqItems = [
  {
    id: "cost",
    question: {
      no: "Hva koster takrenovering?",
      en: "What does roof renovation cost?",
    },
    answer: {
      no: "Prisen avhenger av størrelse, takstein og tilstand. En komplett takfornying (vask, impregnering og maling) ligger typisk mellom 600 og 1200 kr per m². Du får alltid fast pris etter gratis befaring.",
      en: "Price depends on size, tile type and condition. A complete renewal (wash, impregnation and paint) typically sits between NOK 600 and 1,200 per m². You always get a fixed price after a free inspection.",
    },
  },
  {
    id: "impregnate",
    question: {
      no: "Hvordan impregneres tak?",
      en: "How is a roof impregnated?",
    },
    answer: {
      no: "Impregnering gjøres etter grundig takvask. Vi bruker NowoCoat og Surfatech som trekker inn i steinen, beskytter mot fukt og hemmer ny mosevekst i mange år.",
      en: "Impregnation follows a thorough wash. We use NowoCoat and Surfatech that penetrate the tiles, protect against moisture and slow new moss growth for years.",
    },
  },
  {
    id: "moss",
    question: {
      no: "Hvilket firma fjerner mose på tak?",
      en: "Who removes moss from roofs?",
    },
    answer: {
      no: "Vi er et profesjonelt firma som fjerner mose på tak over Sør- og Midt-Norge. Vi bruker både høytrykksvask og skånsom softwash, avhengig av takets tilstand.",
      en: "We are a professional company removing moss from roofs across Southern and Central Norway. We use both high-pressure washing and gentle softwash, depending on roof condition.",
    },
  },
  {
    id: "difference",
    question: {
      no: "Hva er forskjellen på takfornyelse og takfornying?",
      en: "What is the difference between roof renewal terms?",
    },
    answer: {
      no: "Takfornyelse og takfornying beskriver samme tjeneste: vask, impregnering og maling av eksisterende tak – nytt liv uten full omlegging.",
      en: "Both terms describe the same service: washing, impregnating and painting an existing roof – new life without a full replacement.",
    },
  },
  {
    id: "experience",
    question: {
      no: "Har dere erfaring med takfornying?",
      en: "Do you have experience with roof renewal?",
    },
    answer: {
      no: "Ja. Vi har fornyet over to millioner kvadratmeter tak, med dedikerte team, dokumenterte metoder og 10 års garanti på fargetap og tett tak.",
      en: "Yes. We have renewed over two million square metres of roofing, with dedicated teams, proven methods and a 10-year warranty on colour retention and weathertightness.",
    },
  },
] as const;

export const projects = [
  {
    id: "oslo-fornyes",
    title: { no: "Prosjekt – Oslo fornyes", en: "Project – Oslo renews" },
    stages: [
      {
        label: "before" as const,
        image: "/references/oslo-fornyes/before-1.webp",
        caption: { no: "Mosegrodde tak før fornying", en: "Mossy roofs before renewal" },
      },
      {
        label: "during" as const,
        image: "/references/oslo-fornyes/during-1.webp",
        caption: { no: "Takvask underveis", en: "Roof washing in progress" },
      },
      {
        label: "after" as const,
        image: "/references/oslo-fornyes/after-1.webp",
        caption: { no: "Taket fornyet – luftfoto", en: "Roof renewed – aerial view" },
      },
      {
        label: "after" as const,
        image: "/references/oslo-fornyes/after-2.webp",
        caption: { no: "Tydelig forskjell etter fornying", en: "Clear difference after renewal" },
      },
    ],
  },
  {
    id: "maling",
    title: {
      no: "Prosjekt – Før og etter maling",
      en: "Project – Before and after painting",
    },
    stages: [
      {
        label: "before" as const,
        image: "/references/maling/before-1.webp",
        caption: {
          no: "Mosegrodd takstein før maling",
          en: "Moss-covered tiles before painting",
        },
      },
      {
        label: "during" as const,
        image: "/references/maling/during-1.webp",
        caption: { no: "Taket males", en: "Roof being painted" },
      },
      {
        label: "after" as const,
        image: "/references/maling/after-1.webp",
        caption: { no: "Nymalt takstein", en: "Freshly painted tiles" },
      },
      {
        label: "after" as const,
        image: "/references/maling/compare-1.webp",
        caption: { no: "Før og etter maling", en: "Before and after painting" },
      },
    ],
  },
  {
    id: "oslo-borettslag",
    title: {
      no: "Prosjekt – Oslo borettslag",
      en: "Project – Oslo housing association",
    },
    stages: [
      {
        label: "after" as const,
        image: "/references/oslo-borettslag/after-1.webp",
        caption: {
          no: "Fullført takfornying – rekkehus",
          en: "Completed roof renewal – townhouses",
        },
      },
      {
        label: "after" as const,
        image: "/references/oslo-borettslag/after-2.webp",
        caption: {
          no: "Luftfoto av ferdig borettslag",
          en: "Aerial view of completed housing association",
        },
      },
      {
        label: "after" as const,
        image: "/references/oslo-borettslag/after-3.webp",
        caption: { no: "Store takflater fornyet", en: "Large roof areas renewed" },
      },
      {
        label: "after" as const,
        image: "/references/oslo-borettslag/after-4.webp",
        caption: {
          no: "Fornøyde kunder – Oslo borettslag",
          en: "Happy customers – Oslo housing association",
        },
      },
    ],
  },
  {
    id: "vakkert-tak",
    title: { no: "Prosjekt – Et vakkert tak", en: "Project – A beautiful roof" },
    stages: [
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-1.webp",
        caption: { no: "Slitt tak før fornying", en: "Worn roof before renewal" },
      },
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-2.webp",
        caption: { no: "Taket klargjøres for vask", en: "Roof prepared for washing" },
      },
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-3.webp",
        caption: { no: "Mosegrodd takstein", en: "Moss-covered tiles" },
      },
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-4.webp",
        caption: { no: "Skitten takflate med mose", en: "Dirty roof surface with moss" },
      },
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-5.webp",
        caption: { no: "Takstein før rengjøring", en: "Tiles before cleaning" },
      },
      {
        label: "before" as const,
        image: "/references/vakkert-tak/before-6.webp",
        caption: {
          no: "Skitten takstein før behandling",
          en: "Dirty tiles before treatment",
        },
      },
      {
        label: "during" as const,
        image: "/references/vakkert-tak/during-1.webp",
        caption: { no: "Kontroll av mønet", en: "Ridge inspection" },
      },
      {
        label: "after" as const,
        image: "/references/vakkert-tak/after-1.webp",
        caption: { no: "Rent tak etter fornying", en: "Clean roof after renewal" },
      },
      {
        label: "after" as const,
        image: "/references/vakkert-tak/after-2.webp",
        caption: { no: "Nyvasket takstein", en: "Freshly washed tiles" },
      },
    ],
  },
  {
    id: "takvask",
    title: {
      no: "Prosjekt – Takvask (enebolig)",
      en: "Project – Roof wash (detached house)",
    },
    stages: [
      {
        label: "before" as const,
        image: "/references/takvask/before-1.webp",
        caption: { no: "Mosegrodd takstein – nærbilde", en: "Moss-covered tiles – close-up" },
      },
      {
        label: "before" as const,
        image: "/references/takvask/before-2.webp",
        caption: { no: "Slitt tak før vask", en: "Worn roof before washing" },
      },
      {
        label: "before" as const,
        image: "/references/takvask/before-3.webp",
        caption: { no: "Kraftig mosevekst på taket", en: "Heavy moss growth on the roof" },
      },
      {
        label: "after" as const,
        image: "/references/takvask/after-1.webp",
        caption: { no: "Taket etter vask", en: "Roof after washing" },
      },
      {
        label: "after" as const,
        image: "/references/takvask/after-2.webp",
        caption: { no: "Ren takflate etter vask", en: "Clean roof surface after washing" },
      },
      {
        label: "after" as const,
        image: "/references/takvask/after-3.webp",
        caption: { no: "Takstein etter rengjøring", en: "Tiles after cleaning" },
      },
    ],
  },
] as const;

export const serviceKeys = [
  "inspection",
  "tiles",
  "wash",
  "impregnation",
  "paint",
  "maintenance",
  "warranty",
  "newRoof",
  "softwash",
] as const;

export type ServiceKey = (typeof serviceKeys)[number];
