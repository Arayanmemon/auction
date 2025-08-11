export const auctions = [
  {
    id: 1,
    title: "2020 Toyota Corolla",
    images: [
      "https://via.placeholder.com/600x400?text=Toyota+Front",
      "https://via.placeholder.com/600x400?text=Toyota+Side",
      "https://via.placeholder.com/600x400?text=Toyota+Interior",
    ],
    currentBid: 5000,
    endTime: "2025-08-01T15:00:00",
    description: "Well-maintained sedan with low mileage and excellent fuel efficiency.",
    bidHistory: [
      { user: "John D.", amount: 4800, time: "2025-07-28 14:30" },
      { user: "Sarah L.", amount: 4500, time: "2025-07-27 11:15" },
    ],
  },
  // ... more auctions
];
