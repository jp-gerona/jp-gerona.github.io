import type { ImageMetadata } from "astro";
import advancedPython from "@/assets/certificates/advanced-python-reconnaissance.jpg";
import workImmersion from "@/assets/certificates/best-in-work-immersion-stem.jpg";
import ccna from "@/assets/certificates/ccna-introduction-to-networks.jpg";
import comptiaTechPlus from "@/assets/certificates/comptia-tech-plus.jpg";
import cybersocMembership from "@/assets/certificates/cybersocph-membership.jpg";
import ethicalHacker from "@/assets/certificates/ethical-hacker.jpg";
import fullStackWebDev from "@/assets/certificates/full-stack-web-development.jpg";

export interface Certificate {
  image: ImageMetadata;
  title: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
}

export const certificates: Certificate[] = [
  {
    image: advancedPython,
    title: "Advanced Python - Reconnaissance",
    issuer: "Infosec",
    date: "July 2026",
    verifyUrl: "https://coursera.org/verify/FL00W9MV5BOM",
  },
  {
    image: fullStackWebDev,
    title: "Full Stack Web Development",
    issuer: "Amazon",
    date: "July 2026",
    verifyUrl: "https://coursera.org/verify/LSAYE1UFUTZY",
  },
  {
    image: cybersocMembership,
    title: "Certificate of Membership",
    issuer: "CyberSocPH",
    date: "June 2026",
  },
  {
    image: comptiaTechPlus,
    title: "CompTIA Tech+",
    issuer: "CompTIA",
    date: "December 2025",
  },
  {
    image: ccna,
    title: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    date: "September 2025",
  },
  {
    image: ethicalHacker,
    title: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    date: "March 2025",
  },
  {
    image: workImmersion,
    title: "Best in Work Immersion - STEM",
    issuer: "Creotec Philippines",
    date: "April 2021",
  },
];
