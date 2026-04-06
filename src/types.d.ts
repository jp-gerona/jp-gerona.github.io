export type Url = `http://${string}` | `https://${string}`;

export type SiteNavItem
  = {
    kind?: "text";
    label: string;
    href: string;
    title?: string;
    external?: boolean;
    rel?: string;
  }
  | {
    kind: "icon";
    label: string;
    href: string;
    icon: string;
    iconClass?: string;
    title?: string;
    external?: boolean;
    rel?: string;
  };

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
