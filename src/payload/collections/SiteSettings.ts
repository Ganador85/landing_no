import type { GlobalConfig } from "payload";
import { pageCopyTabs } from "../fields/page-copy-fields";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    description:
      "Edit website contact info, images, prices, and all page texts (NO/EN). Upload photos in Media first, then select them under Images.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contact",
          fields: [
            { name: "brandName", type: "text", defaultValue: "Takfornying" },
            { name: "phone", type: "text", defaultValue: "+47 944 54 000" },
            { name: "email", type: "email", defaultValue: "post@takfornying.no" },
            { name: "street", type: "text", defaultValue: "Nesbruveien 75" },
            { name: "postal", type: "text", defaultValue: "1394" },
            { name: "city", type: "text", defaultValue: "Nesbru" },
            { name: "orgNr", type: "text", defaultValue: "931 799 495" },
            { name: "parentOrg", type: "text", defaultValue: "Fornyingsgruppen AS" },
          ],
        },
        {
          label: "Images",
          description: "Upload in Media, then select here. URL fields are fallback only.",
          fields: [
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Hero image",
            },
            {
              name: "aboutImage",
              type: "upload",
              relationTo: "media",
              label: "About image",
            },
            {
              name: "newRoofImage",
              type: "upload",
              relationTo: "media",
              label: "New roof image",
            },
            {
              name: "heroImageUrl",
              type: "text",
              label: "Hero image URL (fallback)",
            },
            {
              name: "aboutImageUrl",
              type: "text",
              label: "About image URL (fallback)",
            },
            {
              name: "newRoofImageUrl",
              type: "text",
              label: "New roof image URL (fallback)",
            },
          ],
        },
        {
          label: "Calculator & trust",
          fields: [
            {
              name: "calculator",
              type: "group",
              fields: [
                { name: "newRoofPerSqm", type: "number", defaultValue: 2490 },
                { name: "renewalPerSqm", type: "number", defaultValue: 350 },
                { name: "minSqm", type: "number", defaultValue: 50 },
                { name: "maxSqm", type: "number", defaultValue: 500 },
                { name: "defaultSqm", type: "number", defaultValue: 150 },
              ],
            },
            {
              name: "trust",
              type: "group",
              fields: [
                { name: "sqmRenewed", type: "text", defaultValue: "2.000.000+" },
                { name: "warrantyYears", type: "number", defaultValue: 10 },
                { name: "happyCustomers", type: "text", defaultValue: "500+" },
                { name: "rating", type: "text", defaultValue: "4.9/5" },
              ],
            },
          ],
        },
        ...pageCopyTabs,
      ],
    },
  ],
};
