export interface Skill {
  name: string;
  blurb: string;
  logo: string;
}

export interface SkillGroup {
  label: string;
  items: Skill[];
}

function logo(file: string): string {
  return `/assets/logos/${file}.svg`;
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    items: [
      { name: "TypeScript", blurb: "Typed JavaScript", logo: logo("typescript") },
      { name: "Python", blurb: "General-purpose language", logo: logo("python") },
      { name: "PHP", blurb: "Server-side web language", logo: logo("php") },
      { name: "Kotlin", blurb: "Modern Android language", logo: logo("kotlin") },
      { name: "Rust", blurb: "Systems programming language", logo: logo("rust") },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", blurb: "UI component library", logo: logo("react") },
      { name: "Next.js", blurb: "React framework", logo: logo("nextjs") },
      { name: "Astro", blurb: "Content site framework", logo: logo("astro") },
      { name: "Tailwind CSS", blurb: "Utility-first CSS", logo: logo("tailwindcss") },
      { name: "UnoCSS", blurb: "Atomic CSS engine", logo: logo("unocss") },
      { name: "shadcn/ui", blurb: "React component kit", logo: logo("shadcn-ui") },
    ],
  },
  {
    label: "Backend & data",
    items: [
      { name: "Django", blurb: "Python web framework", logo: logo("django") },
      { name: "CodeIgniter 4", blurb: "PHP web framework", logo: logo("codeigniter") },
      { name: "PostgreSQL", blurb: "Relational database", logo: logo("postgresql") },
      { name: "MySQL", blurb: "Relational database", logo: logo("mysql") },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", blurb: "Version control", logo: logo("git") },
      { name: "GitHub", blurb: "Code hosting and CI", logo: logo("github") },
      { name: "Figma", blurb: "Interface design tool", logo: logo("figma") },
      { name: "MapLibre GL", blurb: "Map rendering library", logo: logo("maplibre") },
    ],
  },
];
