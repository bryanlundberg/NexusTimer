import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(function ({
      addVariant,
    }: {
      addVariant: any;
    }) {
      addVariant("light", `:is(.light &)`);
      addVariant("dark", `:is(.dark &)`);
      addVariant("graygray", `:is(.graygray &)`);
      addVariant("cyanviolet", `:is(.cyanviolet &)`);
      addVariant("amberpink", `:is(.amberpink &)`);
      addVariant("redblue", `:is(.redblue &)`);
      addVariant("pinkneutral", `:is(.pinkneutral &)`);
      addVariant("greenamber", `:is(.greenamber &)`);
    }),
  ],
};
export default config;
