export interface ContributionDay {
  date: string;
  level: number;
  count: number;
}

export interface ContributionCalendar {
  days: ContributionDay[];
  total: number;
}

export async function fetchContributions(
  user: string,
  from: string,
  to: string,
): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(
      `https://github.com/users/${user}/contributions?from=${from}&to=${to}`,
    );

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const days: ContributionDay[] = [];
    const counts = new Map(
      [...html.matchAll(/<tool-tip\b[^>]+\bfor="([^"]+)"[^>]*>([\d,]+|No) contributions? on [^<]*<\/tool-tip>/g)]
        .map(match => [match[1], match[2] === "No" ? 0 : Number(match[2].replaceAll(",", ""))]),
    );

    for (const tag of html.match(/<td[^>]*ContributionCalendar-day[^>]*>/g) ?? []) {
      const date = tag.match(/data-date="([^"]+)"/)?.[1];
      const level = tag.match(/data-level="(\d)"/)?.[1];
      const id = tag.match(/\bid="([^"]+)"/)?.[1];
      const count = id ? counts.get(id) : undefined;

      if (date && level) {
        if (count === undefined) {
          return null;
        }

        days.push({ date, level: Number(level), count });
      }
    }

    if (days.length === 0) {
      return null;
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    const total = days.reduce((sum, day) => sum + day.count, 0);

    return { days, total };
  }
  catch {
    return null;
  }
}
