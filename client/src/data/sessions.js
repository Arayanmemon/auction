export const sessions = [
  {
    id: 1,
    title: "Williamston GM Wednesday 07/30/2025",
    startDate: "2025-07-29",
    endDate: "2025-07-30",
    location: "Williamston, SC",
    items: Array.from({ length: 600 }).map((_, idx) => ({
      id: idx + 1,
      title: `Item ${idx + 1}`,
      image: "https://via.placeholder.com/200x200?text=Item+" + (idx + 1),
      startingBid: Math.floor(Math.random() * 200) + 50,
    })),
  },
];
