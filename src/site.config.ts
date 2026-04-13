import type { Site } from "./types";

export const siteConfig: Site = {
  site: "https://jp-gerona.github.io",
  title: "Julian Peter Gerona",
  description: "Julian Peter Gerona's Portfolio",
  author: "Julian Peter Gerona",
  lang: "en",
  ogLocale: "en_PH",
  imageDomains: ["jp-gerona.github.io"],
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Certificates", href: "/certificates" },
      { label: "RSS", href: "/rss.xml" },
      { label: "Practicum", href: "/practicum", className: "rounded-sm bg-accent" },
    ],
  },
};
