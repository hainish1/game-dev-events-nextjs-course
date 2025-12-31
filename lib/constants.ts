export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

// Note: Dates/times for future editions of recurring events can shift year-to-year.
// These are intentionally formatted as display strings suitable for UI.
export const events: EventItem[] = [
  {
    title: "Global Game Jam 2026",
    image: "/images/event1.png",
    slug: "global-game-jam-2026",
    location: "Worldwide (in-person + online)",
    date: "Jan 2026 (dates TBA)",
    time: "All weekend",
  },
  {
    title: "GDC 2026 (Game Developers Conference)",
    image: "/images/event2.png",
    slug: "gdc-2026",
    location: "San Francisco, CA",
    date: "Mar 2026 (dates TBA)",
    time: "All day",
  },
  {
    title: "PAX East 2026",
    image: "/images/event3.png",
    slug: "pax-east-2026",
    location: "Boston, MA",
    date: "Spring 2026 (dates TBA)",
    time: "10:00 AM",
  },
  {
    title: "Nordic Game 2026",
    image: "/images/event4.png",
    slug: "nordic-game-2026",
    location: "Malmö, Sweden",
    date: "May 2026 (dates TBA)",
    time: "All day",
  },
  {
    title: "gamescom 2026",
    image: "/images/event5.png",
    slug: "gamescom-2026",
    location: "Cologne, Germany",
    date: "Aug 2026 (dates TBA)",
    time: "09:00 AM",
  },
  {
    title: "Tokyo Game Show 2026",
    image: "/images/event6.png",
    slug: "tokyo-game-show-2026",
    location: "Chiba, Japan (Makuhari Messe)",
    date: "Sep 2026 (dates TBA)",
    time: "All day",
  },
];
