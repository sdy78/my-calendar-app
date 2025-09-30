// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config &{
  daisyui: {
    themes?: string[];
    darkTheme?: string;
  }
} = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}", // Assurez-vous que votre dossier 'ui' est inclus
  ],
  theme: {
    extend: {
      // ... vos thèmes personnalisés ici si nécessaire
    },
  },
  plugins: [require("daisyui")],
  // Configuration DaisyUI
  daisyui: {
    themes: ["light", "dark"], // Ou les thèmes spécifiques que vous utilisez
    darkTheme: "dark", // Thème par défaut pour le mode sombre
  },
};
export default config;
