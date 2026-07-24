import type { SatoriOptions } from "satori";
import type { html } from "satori-html";

import { Buffer } from "node:buffer";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import process from "node:process";

import { decode } from "html-entities";
import satori from "satori";
import sharp from "sharp";
import { ogImageMarkup } from "./og-template/markup";

interface OgImageOptions {
  authorOrBrand: string;
  fallbackTitle: string;
}

const CrimsonPro = readFileSync(join(process.cwd(), "plugins/og-template/CrimsonPro-Regular.ttf"));
const IBMPlexMono = readFileSync(join(process.cwd(), "plugins/og-template/IBMPlexMono-Regular.ttf"));

const satoriOptions: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Crimson Pro",
      weight: 400,
      style: "normal",
      data: CrimsonPro,
    },
    {
      name: "IBM Plex Mono",
      weight: 400,
      style: "normal",
      data: IBMPlexMono,
    },
  ],
};

export function checkFileExistsInDir(path: string, filename: string): boolean {
  const fullPath = join(process.cwd(), path, filename);
  return existsSync(fullPath);
}

function unescapeHTML(node: ReturnType<typeof html>) {
  const children = node?.props?.children;

  if (!children) {
    return;
  }

  if (Array.isArray(children)) {
    for (const n of children) {
      if (typeof n === "object" && n) {
        unescapeHTML(n as ReturnType<typeof html>);
      }
    }
    return;
  }

  if (typeof children === "object") {
    unescapeHTML(children as ReturnType<typeof html>);
    return;
  }

  if (typeof children === "string") {
    node.props.children = decode(children);
  }
}

async function generateOgImage(
  authorOrBrand: string,
  title: string,
  output: string,
): Promise<void> {
  await mkdir(dirname(output), { recursive: true });

  const node = ogImageMarkup(authorOrBrand, title);
  unescapeHTML(node);

  const svg = await satori(node, satoriOptions);
  const pngBuffer = await sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9,
      quality: 100,
    })
    .toBuffer();

  writeFileSync(output, pngBuffer);
}

interface AstroFrontmatter {
  title?: string;
  draft?: boolean;
  redirect?: string;
  ogImage?: string | boolean;
}

interface RemarkLikeFile {
  basename?: string;
  extname?: string;
  dirname?: string;
  path?: string;
  data?: {
    astro?: {
      frontmatter?: AstroFrontmatter;
    };
  };
}

function remarkGenerateOgImage(options: Partial<OgImageOptions> = {}) {
  const {
    authorOrBrand = "My Site",
    fallbackTitle = "A personal website",
  } = options;

  return async (_tree: unknown, file: RemarkLikeFile) => {
    if (!checkFileExistsInDir("public/og-images", "og-image.png")) {
      await generateOgImage(
        authorOrBrand,
        fallbackTitle,
        "public/og-images/og-image.png",
      );
    }

    const filename = file.basename;
    if (!filename || !(filename.endsWith(".md") || filename.endsWith(".mdx"))) {
      return;
    }

    const frontmatter = file.data?.astro?.frontmatter;

    if (!frontmatter || frontmatter.draft || frontmatter.redirect) {
      return;
    }

    const title = frontmatter.title?.trim();
    if (!title) {
      return;
    }

    if (frontmatter.ogImage === false) {
      return;
    }

    const extension = file.extname || extname(filename);
    const dirPath = file.dirname || "";
    let nameWithoutExt = basename(filename, extension);

    if (nameWithoutExt === "index" && dirPath) {
      nameWithoutExt = basename(dirPath);
    }

    if (checkFileExistsInDir("public/og-images", `${nameWithoutExt}.png`)) {
      return;
    }

    if (typeof frontmatter.ogImage === "string") {
      const assignedFile = basename(frontmatter.ogImage);
      if (checkFileExistsInDir("public/og-images", assignedFile)) {
        return;
      }
      console.warn(`[og-image] Missing assigned image '${frontmatter.ogImage}' in '${file.path}'.`);
      return;
    }

    await generateOgImage(
      authorOrBrand,
      title,
      `public/og-images/${nameWithoutExt}.png`,
    );
  };
}

export default remarkGenerateOgImage;
