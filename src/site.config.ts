import type { Site } from "./types";

const author = "Julian Peter Gerona";
const email = "jp-gerona@protonmail.com";
const user = "jp-gerona";

export const siteConfig: Site = {
  site: "https://jp-gerona.github.io",
  title: author,
  description: `${author}'s Portfolio`,
  author,
  email,
  user,
  lang: "en",
  ogLocale: "en_PH",
  imageDomains: ["jp-gerona.github.io"],
  navigation: {
    main: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Certificates", href: "/certificates" },
      { label: "Practicum", href: "/practicum" },
    ],
  },
  footer: {
    quote: "To plant a garden, is to believe in the future.",
    copyright: "Content licensed under CC BY-NC-SA 4.0",
    sections: [
      {
        label: "Info",
        items: [
          {
            label: "Curriculum Vitae",
            href: "/cv",
            title: `Curriculum Vitae @ ${author}`,
          },
          {
            label: "RSS Feed",
            href: "/rss.xml",
            title: "RSS Feed",
          },
          {
            label: "Sitemap",
            href: "/sitemap-index.xml",
            title: "Sitemap",
          },
        ],
      },
      {
        label: "Contact",
        items: [
          {
            label: "Protonmail",
            href: `mailto:${email}`,
            title: `Email @ ${email}`,
            external: true,
          },
          {
            label: "Github",
            href: `https://github.com/${user}`,
            title: `Github @ ${user}`,
            external: true,
          },
          {
            label: "LinkedIn",
            href: "https://www.linkedin.com/in/jp-gerona/",
            title: `LinkedIn @ ${author}`,
            external: true,
          },
        ],
      },
    ],
  },
};
