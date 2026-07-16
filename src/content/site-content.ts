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
    id: "stabekk",
    title: { no: "Prosjekt – Stabekk", en: "Project – Stabekk" },
    stages: [
      {
        label: "before" as const,
        caption: {
          no: "Slitt og mosegrodd takstein",
          en: "Worn and moss-covered tiles",
        },
      },
      {
        label: "during" as const,
        caption: {
          no: "Taket er vasket og impregnert",
          en: "Washed and impregnated",
        },
      },
      {
        label: "after" as const,
        caption: {
          no: "Vasket, impregnert og malt – som nytt",
          en: "Washed, impregnated and painted – like new",
        },
      },
    ],
  },
  {
    id: "borettslag",
    title: { no: "Prosjekt – Borettslag", en: "Project – Housing association" },
    stages: [
      {
        label: "during" as const,
        caption: { no: "Under arbeid", en: "In progress" },
      },
      {
        label: "during" as const,
        caption: { no: "Under arbeid", en: "In progress" },
      },
      {
        label: "after" as const,
        caption: { no: "Ferdig fornyet", en: "Fully renewed" },
      },
    ],
  },
  {
    id: "enebolig-1",
    title: { no: "Prosjekt – Enebolig", en: "Project – Detached house" },
    stages: [
      {
        label: "before" as const,
        caption: { no: "Slitt tak med mose", en: "Worn roof with moss" },
      },
      {
        label: "after" as const,
        caption: {
          no: "Vasket, impregnert og malt",
          en: "Washed, impregnated and painted",
        },
      },
    ],
  },
  {
    id: "bergen",
    title: {
      no: "Prosjekt – Master Apartments, Bergen",
      en: "Project – Master Apartments, Bergen",
    },
    stages: [
      {
        label: "during" as const,
        caption: {
          no: "Taket klargjøres for maling",
          en: "Roof prepared for painting",
        },
      },
      {
        label: "after" as const,
        caption: { no: "Ferdig malt og fornyet", en: "Painted and renewed" },
      },
    ],
  },
  {
    id: "enebolig-2",
    title: { no: "Prosjekt – Enebolig", en: "Project – Detached house" },
    stages: [
      {
        label: "during" as const,
        caption: {
          no: "Taket klargjøres for maling",
          en: "Roof prepared for painting",
        },
      },
      {
        label: "after" as const,
        caption: { no: "Ferdig malt og fornyet", en: "Painted and renewed" },
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
