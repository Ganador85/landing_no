import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "titleNo",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "titleNo", type: "text", required: true },
    { name: "titleEn", type: "text", required: true },
    { name: "order", type: "number", defaultValue: 0 },
    {
      name: "stages",
      type: "array",
      fields: [
        {
          name: "label",
          type: "select",
          required: true,
          options: [
            { label: "Before", value: "before" },
            { label: "During", value: "during" },
            { label: "After", value: "after" },
          ],
        },
        { name: "captionNo", type: "text", required: true },
        { name: "captionEn", type: "text", required: true },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
  ],
};
