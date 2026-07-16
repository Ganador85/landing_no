/**
 * Seed CMS tables directly via Postgres (avoids Payload CLI env loader issues).
 * Idempotent: only inserts when a collection has 0 rows.
 *
 * Usage: node --env-file=.env scripts/seed-cms-sql.mjs
 */
import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const noMessages = JSON.parse(readFileSync(join(root, "src/i18n/messages/no.json"), "utf8"));
const enMessages = JSON.parse(readFileSync(join(root, "src/i18n/messages/en.json"), "utf8"));

const url = process.env.DATABASE_URL?.replace(/[&?]channel_binding=require/g, "");
if (!url?.startsWith("postgres")) {
  console.error("DATABASE_URL must be postgres");
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: url,
  max: 1,
  connectionTimeoutMillis: 20000,
  ssl: { rejectUnauthorized: false },
});

const siteImages = {
  hero: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=2000&q=80",
  newRoof:
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=1400&q=80",
  about:
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80",
};

const serviceKeys = [
  "inspection",
  "tiles",
  "wash",
  "impregnation",
  "paint",
  "maintenance",
  "warranty",
  "newRoof",
  "softwash",
];

const iconByKey = {
  warranty: "shield",
  wash: "droplets",
  softwash: "droplets",
  paint: "paint",
  newRoof: "home",
  impregnation: "sparkles",
  tiles: "wrench",
  maintenance: "wrench",
  inspection: "check",
};

const products = [
  {
    name: "NowoCoat Roof Coating",
    categoryNo: "Takmaling",
    categoryEn: "Roof coating",
    descriptionNo:
      "Profesjonell, vannbasert hybridmaling med tre bindemidler for overlegen heft til betongtakstein og fibersement. Lysekte, diffusjonsåpen, værstabil og elastisk – med Svanemerke.",
    descriptionEn:
      "Professional water-based hybrid coating with three binders for superior adhesion to concrete tiles and fibre cement. Lightfast, vapour-open, weather-stable and elastic – Swan-labelled.",
    badgesNo: ["Svanemerket", "UV-stabil", "Elastisk", "Diffusjonsåpen"],
    badgesEn: ["Swan ecolabel", "UV-stable", "Elastic", "Vapour-open"],
  },
  {
    name: "SurfaPore C",
    categoryNo: "Impregnering – diffusjonsåpen",
    categoryEn: "Impregnation – vapour-open",
    descriptionNo:
      "Vannbasert nanoimpregnering uten farlige tilsetninger. Skaper en usynlig, vannavvisende barriere uten film – underlaget puster fritt mens fukt og smuss holdes ute.",
    descriptionEn:
      "Water-based nano impregnation without harmful additives. Creates an invisible water-repellent barrier without a film – the substrate breathes while moisture and dirt stay out.",
    badgesNo: ["Nanoteknologi", "Diffusjonsåpen", "Usynlig beskyttelse", "Miljøvennlig"],
    badgesEn: ["Nanotechnology", "Vapour-open", "Invisible protection", "Eco-friendly"],
  },
  {
    name: "NowoDry WB",
    categoryNo: "Impregnering – vannavvisende",
    categoryEn: "Impregnation – water-repellent",
    descriptionNo:
      "Kraftig vannbasert impregnering for langvarig beskyttelse mot fukt. Ideell for takstein, heller og murverk der maksimal vannavvisning og frostbeskyttelse trengs.",
    descriptionEn:
      "Strong water-based impregnation for lasting moisture protection. Ideal for tiles, paving and masonry where maximum water repellence and frost protection are needed.",
    badgesNo: ["Sterk vannavvisning", "Frostbeskyttelse", "Langvarig", "Enkel påføring"],
    badgesEn: ["Strong water repellence", "Frost protection", "Long-lasting", "Easy to apply"],
  },
  {
    name: "NowoClean",
    categoryNo: "Rengjøring",
    categoryEn: "Cleaning",
    descriptionNo:
      "Effektivt rengjøringsmiddel for skånsom vask av papp-, skifer- og shingeltak. Fjerner smuss og alger uten å skade overflaten – og gir godt underlag for videre behandling.",
    descriptionEn:
      "Effective cleaner for gentle washing of felt, slate and shingle roofs. Removes dirt and algae without damaging the surface – and prepares for further treatment.",
    badgesNo: ["Skånsom vask", "Fjerner alger", "For alle taktyper", "Biologisk nedbrytbar"],
    badgesEn: ["Gentle wash", "Removes algae", "All roof types", "Biodegradable"],
  },
];

const faqItems = [
  {
    questionNo: "Hva koster takrenovering?",
    questionEn: "What does roof renovation cost?",
    answerNo:
      "Prisen avhenger av størrelse, takstein og tilstand. En komplett takfornying (vask, impregnering og maling) ligger typisk mellom 600 og 1200 kr per m². Du får alltid fast pris etter gratis befaring.",
    answerEn:
      "Price depends on size, tile type and condition. A complete renewal (wash, impregnation and paint) typically sits between NOK 600 and 1,200 per m². You always get a fixed price after a free inspection.",
  },
  {
    questionNo: "Hvordan impregneres tak?",
    questionEn: "How is a roof impregnated?",
    answerNo:
      "Etter grundig vask påføres impregnering som trekker inn i steinen. Den beskytter mot fukt og mose uten å tette damp – taket kan fortsatt puste.",
    answerEn:
      "After a thorough wash we apply impregnation that soaks into the tiles. It protects against moisture and moss without sealing vapour – the roof can still breathe.",
  },
  {
    questionNo: "Hvor lang tid tar takfornying?",
    questionEn: "How long does roof renewal take?",
    answerNo:
      "De fleste boligtak blir ferdige på 1–3 dager, avhengig av vær og størrelse. Store borettslag planlegges over flere etapper.",
    answerEn:
      "Most homes are finished in 1–3 days, depending on weather and size. Larger housing associations are planned in stages.",
  },
  {
    questionNo: "Hva er forskjellen på takfornyelse og takfornying?",
    questionEn: "What is the difference between roof renewal terms?",
    answerNo:
      "Takfornyelse og takfornying beskriver samme tjeneste: vask, impregnering og maling av eksisterende tak – nytt liv uten full omlegging.",
    answerEn:
      "Both terms describe the same service: washing, impregnating and painting an existing roof – new life without a full replacement.",
  },
  {
    questionNo: "Har dere erfaring med takfornying?",
    questionEn: "Do you have experience with roof renewal?",
    answerNo:
      "Ja. Vi har fornyet over to millioner kvadratmeter tak, med dedikerte team, dokumenterte metoder og 10 års garanti på fargetap og tett tak.",
    answerEn:
      "Yes. We have renewed over two million square metres of roofing, with dedicated teams, proven methods and a 10-year warranty on colour retention and weathertightness.",
  },
];

const projects = [
  {
    titleNo: "Prosjekt – Stabekk",
    titleEn: "Project – Stabekk",
    stages: [
      {
        label: "before",
        imageUrl:
          "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=900&q=80",
        captionNo: "Slitt og mosegrodd takstein",
        captionEn: "Worn and moss-covered tiles",
      },
      {
        label: "during",
        imageUrl:
          "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=900&q=80",
        captionNo: "Taket er vasket og impregnert",
        captionEn: "Washed and impregnated",
      },
      {
        label: "after",
        imageUrl:
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
        captionNo: "Vasket, impregnert og malt – som nytt",
        captionEn: "Washed, impregnated and painted – like new",
      },
    ],
  },
  {
    titleNo: "Prosjekt – Borettslag",
    titleEn: "Project – Housing association",
    stages: [
      {
        label: "during",
        imageUrl:
          "https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=900&q=80",
        captionNo: "Under arbeid",
        captionEn: "In progress",
      },
      {
        label: "during",
        imageUrl:
          "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=900&q=80",
        captionNo: "Under arbeid",
        captionEn: "In progress",
      },
      {
        label: "after",
        imageUrl:
          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
        captionNo: "Ferdig fornyet",
        captionEn: "Fully renewed",
      },
    ],
  },
  {
    titleNo: "Prosjekt – Enebolig",
    titleEn: "Project – Detached house",
    stages: [
      {
        label: "before",
        imageUrl:
          "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=900&q=80",
        captionNo: "Slitt tak med mose",
        captionEn: "Worn roof with moss",
      },
      {
        label: "after",
        imageUrl:
          "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=900&q=80",
        captionNo: "Vasket, impregnert og malt",
        captionEn: "Washed, impregnated and painted",
      },
    ],
  },
  {
    titleNo: "Prosjekt – Master Apartments, Bergen",
    titleEn: "Project – Master Apartments, Bergen",
    stages: [
      {
        label: "during",
        imageUrl:
          "https://images.unsplash.com/photo-1605146768851-eda79da39897?auto=format&fit=crop&w=900&q=80",
        captionNo: "Taket klargjøres for maling",
        captionEn: "Roof prepared for painting",
      },
      {
        label: "after",
        imageUrl:
          "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=900&q=80",
        captionNo: "Ferdig malt og fornyet",
        captionEn: "Painted and renewed",
      },
    ],
  },
  {
    titleNo: "Prosjekt – Enebolig",
    titleEn: "Project – Detached house",
    stages: [
      {
        label: "during",
        imageUrl:
          "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=900&q=80",
        captionNo: "Taket klargjøres for maling",
        captionEn: "Roof prepared for painting",
      },
      {
        label: "after",
        imageUrl:
          "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80",
        captionNo: "Ferdig malt og fornyet",
        captionEn: "Painted and renewed",
      },
    ],
  },
];

async function count(table) {
  const res = await pool.query(`select count(*)::int as c from "${table}"`);
  return res.rows[0].c;
}

try {
  const settingsCount = await count("site_settings");
  if (settingsCount === 0) {
    await pool.query(
      `insert into site_settings (
        brand_name, phone, email, street, postal, city, org_nr, parent_org,
        hero_image_url, about_image_url, new_roof_image_url,
        calculator_new_roof_per_sqm, calculator_renewal_per_sqm,
        calculator_min_sqm, calculator_max_sqm, calculator_default_sqm,
        trust_sqm_renewed, trust_warranty_years, trust_happy_customers, trust_rating,
        created_at, updated_at
      ) values (
        'Takfornying', '+47 944 54 000', 'post@takfornying.no',
        'Nesbruveien 75', '1394', 'Nesbru', '931 799 495', 'Fornyingsgruppen AS',
        $1, $2, $3,
        2490, 350, 50, 500, 150,
        '2.000.000+', 10, '500+', '4.9/5',
        now(), now()
      )`,
      [siteImages.hero, siteImages.about, siteImages.newRoof],
    );
    console.log("✓ Site Settings created");
  } else {
    await pool.query(
      `update site_settings set
        hero_image_url = coalesce(nullif(hero_image_url, ''), $1),
        about_image_url = coalesce(nullif(about_image_url, ''), $2),
        new_roof_image_url = coalesce(nullif(new_roof_image_url, ''), $3),
        updated_at = now()
      where id = (select id from site_settings order by id limit 1)`,
      [siteImages.hero, siteImages.about, siteImages.newRoof],
    );
    console.log("✓ Site Settings image URLs updated");
  }

  if ((await count("services")) === 0) {
    for (const [order, key] of serviceKeys.entries()) {
      const noItem = noMessages.services.items[key];
      const enItem = enMessages.services.items[key];
      await pool.query(
        `insert into services
          (key, title_no, title_en, description_no, description_en, icon, featured, "order", created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8, now(), now())`,
        [
          key,
          noItem.title,
          enItem.title,
          noItem.description,
          enItem.description,
          iconByKey[key] || "check",
          Boolean(noItem.featured),
          order,
        ],
      );
    }
    console.log(`✓ Seeded ${serviceKeys.length} services`);
  } else {
    console.log("· Services already present");
  }

  if ((await count("projects")) === 0) {
    for (const [order, project] of projects.entries()) {
      const inserted = await pool.query(
        `insert into projects (title_no, title_en, "order", created_at, updated_at)
         values ($1,$2,$3, now(), now()) returning id`,
        [project.titleNo, project.titleEn, order],
      );
      const projectId = inserted.rows[0].id;
      for (const [stageOrder, stage] of project.stages.entries()) {
        await pool.query(
          `insert into projects_stages
            (_order, _parent_id, id, label, caption_no, caption_en, image_url)
           values ($1,$2, gen_random_uuid()::text, $3,$4,$5,$6)`,
          [
            stageOrder,
            projectId,
            stage.label,
            stage.captionNo,
            stage.captionEn,
            stage.imageUrl,
          ],
        );
      }
    }
    console.log(`✓ Seeded ${projects.length} projects`);
  } else {
    console.log("· Projects already present");
  }

  if ((await count("products")) === 0) {
    for (const [order, product] of products.entries()) {
      const inserted = await pool.query(
        `insert into products
          (name, category_no, category_en, description_no, description_en, "order", created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6, now(), now()) returning id`,
        [
          product.name,
          product.categoryNo,
          product.categoryEn,
          product.descriptionNo,
          product.descriptionEn,
          order,
        ],
      );
      const productId = inserted.rows[0].id;
      for (const [i, label] of product.badgesNo.entries()) {
        await pool.query(
          `insert into products_badges_no (_order, _parent_id, id, label)
           values ($1,$2, gen_random_uuid()::text, $3)`,
          [i, productId, label],
        );
      }
      for (const [i, label] of product.badgesEn.entries()) {
        await pool.query(
          `insert into products_badges_en (_order, _parent_id, id, label)
           values ($1,$2, gen_random_uuid()::text, $3)`,
          [i, productId, label],
        );
      }
    }
    console.log(`✓ Seeded ${products.length} products`);
  } else {
    console.log("· Products already present");
  }

  if ((await count("faq")) === 0) {
    for (const [order, item] of faqItems.entries()) {
      await pool.query(
        `insert into faq
          (question_no, question_en, answer_no, answer_en, "order", created_at, updated_at)
         values ($1,$2,$3,$4,$5, now(), now())`,
        [item.questionNo, item.questionEn, item.answerNo, item.answerEn, order],
      );
    }
    console.log(`✓ Seeded ${faqItems.length} FAQ items`);
  } else {
    console.log("· FAQ already present");
  }

  console.log("Done. Edit content in /admin → Site Settings, Services, Projects, Products, FAQ.");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
