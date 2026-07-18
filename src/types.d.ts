export type Url = `http://${string}` | `https://${string}`;

export interface SiteNavItem {
  label: string;
  href: string;
  title?: string;
  external?: boolean;
  rel?: string;
}

export interface SiteNavigation {
  main: SiteNavItem[];
}

export interface SiteFooterSection {
  label: string;
  items: SiteNavItem[];
}

export interface SiteFooter {
  quote: string;
  copyright: string;
  sections: SiteFooterSection[];
}

export interface SiteSocial {
  label: string;
  href: Url;
  icon: string;
}

export interface Site {
  site: Url;
  title: string;
  description: string;
  author: string;
  email: string;
  user: string;
  lang: string;
  ogLocale: string;
  imageDomains: string[];
  navigation: SiteNavigation;
  socials: SiteSocial[];
  footer: SiteFooter;
}

export interface Plant {
  update: (now: number) => void;
  getLines: () => string[];
  getColors: () => string[];
}
