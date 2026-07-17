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
      no: "Ja. Vi har fornyet over to millioner kvadratmeter tak, med dedikerte team, dokumenterte metoder og opptil 10 års produkt- og utførelsesgaranti (avhengig av behandling og takets tilstand).",
      en: "Yes. We have renewed over two million square metres of roofing, with dedicated teams, proven methods and up to 10 years’ product and workmanship warranty (depending on treatment and roof condition).",
    },
  },
] as const;

export const projects = [
  {
    id: "takvask-oslo",
    title: {
      no: "Takvask og impregnering – enebolig i Oslo",
      en: "Roof wash and impregnation – detached house in Oslo",
    },
    stages: [
      {
        label: "before" as const,
        image: "/references/takvask-oslo/before-1.webp",
        caption: {
          no: "Mosegrodd takstein før vask",
          en: "Moss-covered tiles before washing",
        },
      },
      {
        label: "before" as const,
        image: "/references/takvask-oslo/before-2.webp",
        caption: {
          no: "Skitten takflate med kraftig mosevekst",
          en: "Dirty roof surface with heavy moss growth",
        },
      },
      {
        label: "after" as const,
        image: "/references/takvask-oslo/after-1.webp",
        caption: {
          no: "Enebolig etter takvask – Oslo",
          en: "Detached house after roof wash – Oslo",
        },
      },
      {
        label: "after" as const,
        image: "/references/takvask-oslo/after-2.webp",
        caption: {
          no: "Ren takstein klar for impregnering",
          en: "Clean tiles ready for impregnation",
        },
      },
    ],
  },
  {
    id: "takmaling-viken",
    title: {
      no: "Takmaling – 240 m² tak i Viken",
      en: "Roof painting – 240 m² roof in Viken",
    },
    stages: [
      {
        label: "before" as const,
        image: "/references/takmaling-viken/before-1.webp",
        caption: {
          no: "Falmet betongtakstein før maling",
          en: "Faded concrete tiles before painting",
        },
      },
      {
        label: "before" as const,
        image: "/references/takmaling-viken/before-2.webp",
        caption: {
          no: "Slitt takflate rundt pipe og beslag",
          en: "Worn roof surface around chimney and flashings",
        },
      },
      {
        label: "during" as const,
        image: "/references/takmaling-viken/during-1.webp",
        caption: {
          no: "Maling underveis – tydelig før/etter-kontrast",
          en: "Painting in progress – clear before/after contrast",
        },
      },
      {
        label: "after" as const,
        image: "/references/takmaling-viken/after-1.webp",
        caption: {
          no: "Ferdig sort tak – 240 m² enebolig",
          en: "Finished black roof – 240 m² detached house",
        },
      },
      {
        label: "after" as const,
        image: "/references/takmaling-viken/after-2.webp",
        caption: {
          no: "Jeven, beskyttet overflate etter maling",
          en: "Even, protected surface after painting",
        },
      },
    ],
  },
  {
    id: "borettslag",
    title: {
      no: "Takfornying av borettslag – 18 boliger",
      en: "Housing association roof renewal – 18 homes",
    },
    stages: [
      {
        label: "before" as const,
        image: "/references/borettslag/before-1.webp",
        caption: {
          no: "Mosegrodde tak før fornying",
          en: "Mossy roofs before renewal",
        },
      },
      {
        label: "after" as const,
        image: "/references/borettslag/after-1.webp",
        caption: {
          no: "Fornyede tak over 18 boliger",
          en: "Renewed roofs across 18 homes",
        },
      },
      {
        label: "after" as const,
        image: "/references/borettslag/after-2.webp",
        caption: {
          no: "Luftfoto av ferdig borettslag",
          en: "Aerial view of completed housing association",
        },
      },
      {
        label: "after" as const,
        image: "/references/borettslag/after-3.webp",
        caption: {
          no: "Store takflater med jevn finish",
          en: "Large roof areas with an even finish",
        },
      },
      {
        label: "during" as const,
        image: "/references/borettslag/during-1.webp",
        caption: {
          no: "Kontroll av takflate under arbeidet",
          en: "Roof surface check during the work",
        },
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
