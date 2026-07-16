import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "categoryNo", type: "text", required: true },
    { name: "categoryEn", type: "text", required: true },
    { name: "descriptionNo", type: "textarea", required: true },
    { name: "descriptionEn", type: "textarea", required: true },
    {
      name: "badgesNo",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      name: "badgesEn",
      type: "array",
      fields: [{ name: "label", type: "text", required: true }],
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
