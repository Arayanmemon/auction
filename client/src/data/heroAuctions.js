import toyotaImage from "../assets/hero/toyota2020.jpg";
import macbookImage from "../assets/hero/macbookpro2021.jpg";
import banner from "../assets/hero/banner.png";

export const heroAuctions = [
  {
    id: 1,
    title: "2020 Toyota Corolla",
    description: "Low mileage, excellent condition — bid now and win!",
    images: [toyotaImage],
    currentBid: 5000,
    totalBids: 8,
    watchersCount: 14,
    estimateRange: "$4,800 - $5,200",
    category: "Cars", // NEW
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    title: "MacBook Pro 2021",
    description: "Powerful M1 Pro chip for professionals and creators.",
    images: [macbookImage],
    currentBid: 1200,
    totalBids: 12,
    watchersCount: 21,
    estimateRange: "$1,500 - $1,700",
    category: "Computers", // NEW
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "Luxury Watch",
    description: "Luxury watch with Swiss movement, perfect for collectors.",
    images: [banner],
    currentBid: 250,
    totalBids: 4,
    watchersCount: 7,
    estimateRange: "$300 - $400",
    category: "Collectibles", // NEW
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
];
