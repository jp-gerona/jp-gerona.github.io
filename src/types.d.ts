export type Url = `http://${string}` | `https://${string}`;

export interface Site {
  site: Url;
  title: string;
  description: string;
  author: string;
  lang: string;
  ogLocale: string;
  imageDomains: string[];
}
