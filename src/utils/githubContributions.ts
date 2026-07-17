export interface ContributionDay {
  date: string;
  level: number;
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

    for (const tag of html.match(/<td[^>]*ContributionCalendar-day[^>]*>/g) ?? []) {
      const date = tag.match(/data-date="([^"]+)"/)?.[1];
      const level = tag.match(/data-level="(\d)"/)?.[1];

      if (date && level) {
        days.push({ date, level: Number(level) });
      }
    }

    if (days.length === 0) {
      return null;
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    const total = [...html.matchAll(/>([\d,]+) contributions? on /g)].reduce(
      (sum, match) => sum + Number(match[1].replaceAll(",", "")),
      0,
    );

    return { days, total };
  }
  catch {
    return null;
  }
}
