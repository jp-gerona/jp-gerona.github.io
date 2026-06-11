import { execSync } from "node:child_process";
import { statSync } from "node:fs";

const CV_PATHS = ["public/docs/cv.pdf", "src/content/cv/cv.md"];

/**
 * Last time the CV content (PDF or markdown entry) actually changed.
 *
 * Build-time only (Node). Prefers the git commit date of the PDF, which is
 * stable across CI checkouts. Falls back to filesystem mtime for local dev or
 * when git history is unavailable.
 *
 * NOTE: the deploy workflow must checkout with `fetch-depth: 0`, otherwise the
 * shallow clone has no commit history for the file and git log returns empty.
 */
export function getCvUpdatedDate(): Date {
  try {
    const iso = execSync(
      `git log -1 --format=%cI -- ${CV_PATHS.join(" ")}`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();

    if (iso) {
      return new Date(iso);
    }
  }
  catch {
    /* git unavailable or not a repo — fall through */
  }

  return new Date(Math.max(...CV_PATHS.map(p => statSync(p).mtime.getTime())));
}
