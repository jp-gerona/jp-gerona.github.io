export type Url = `http://${string}` | `https://${string}`;

export interface SiteNavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SiteNavigation {
  main: SiteNavItem[];
}

export interface Site {
  site: Url;
  title: string;
  description: string;
  author: string;
  lang: string;
  ogLocale: string;
  imageDomains: string[];
  navigation: SiteNavigation;
}
