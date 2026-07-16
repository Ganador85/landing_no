export const siteConfig = {
  name: "Takfornying",
  domain: "takfornying.no",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "+47 944 54 000",
  phoneHref: "tel:+4794454000",
  email: "post@takfornying.no",
  address: {
    street: "Nesbruveien 75",
    postal: "1394",
    city: "Nesbru",
    country: "NO",
  },
  orgNr: "931 799 495",
  parentOrg: "Fornyingsgruppen AS",
  locales: ["no", "en"] as const,
  defaultLocale: "no" as const,
  calculator: {
    minSqm: 50,
    maxSqm: 500,
    defaultSqm: 150,
    newRoofPerSqm: 2490,
    renewalPerSqm: 350,
  },
  trust: {
    sqmRenewed: "2.000.000+",
    warrantyYears: 10,
    happyCustomers: "500+",
    rating: "4.9/5",
  },
};

export type Locale = (typeof siteConfig.locales)[number];
