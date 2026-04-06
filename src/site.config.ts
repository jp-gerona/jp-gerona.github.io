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
      { label: "Projects", href: "/projects/" },
      { label: "Credentials", href: "/credentials/" },
      { label: "Practicum", href: "/practicum/" },
      {
        kind: "icon",
        label: "Curriculum Vitae",
        title: "Curriculum Vitae",
        href: "https://drive.proton.me/urls/D2MYMMHANM#Lcgv3SA5hZeD",
        icon: "i-la-file-alt",
        external: true,
      },
      {
        kind: "icon",
        label: "Github",
        title: "Github",
        href: "https://github.com/jp-gerona",
        icon: "i-uil-github-alt",
        external: true,
        rel: "me",
      },
      {
        kind: "icon",
        label: "LinkedIn",
        title: "LinkedIn",
        href: "https://www.linkedin.com/in/jp-gerona/",
        icon: "i-la-linkedin-in",
        external: true,
        rel: "me",
      },
      {
        kind: "icon",
        label: "RSS",
        title: "RSS",
        href: "/rss.xml",
        icon: "i-la-rss-square",
        iconClass: "h-6! w-6!",
      },
    ],
  },
};
