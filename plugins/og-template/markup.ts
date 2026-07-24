import { html } from "satori-html";

export function ogImageMarkup(authorOrBrand: string, title: string) {
  return html`<div
    style="
      width: 1200px;
      height: 630px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fbfbfb;
      font-family: 'Crimson Pro';
      padding: 72px;
    "
  >
    <div
      style="
        font-size: 118px;
        color: #1d1d1f;
        line-height: 1.1;
        letter-spacing: -2px;
      "
    >
      ${authorOrBrand}
    </div>

    <div
      style="
        display: flex;
        margin-top: 26px;
        font-family: 'IBM Plex Mono';
        font-size: 22px;
        color: #6e6e73;
        letter-spacing: 4px;
        text-transform: uppercase;
        max-width: 900px;
        text-align: center;
        line-height: 1.5;
      "
    >
      ${title}
    </div>
  </div>`;
}
