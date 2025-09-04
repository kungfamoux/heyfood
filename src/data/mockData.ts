import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  deliveryTime: string;
  isOpen: boolean;
  discount?: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "rice", name: "Rice", icon: "🍚" },
  { id: "chicken", name: "Chicken", icon: "🍗" },
  { id: "shawarma", name: "Shawarma", icon: "🌯" },
  { id: "juice", name: "Juice", icon: "🧃" },
  { id: "goat-meat", name: "Goat Meat", icon: "🥩" },
  { id: "fastfood", name: "Fastfood", icon: "🍔" },
  { id: "amala", name: "Amala", icon: "🍲" },
  { id: "soup-bowl", name: "Soup Bowl", icon: "🍜" },
  { id: "turkey", name: "Turkey", icon: "🦃" },
  { id: "grills", name: "Grills", icon: "🔥" },
  { id: "grocery", name: "Grocery", icon: "🛒" },
  { id: "doughnuts", name: "Doughnuts", icon: "🍩" },
  { id: "smothies", name: "Smoothies", icon: "🥤" },
  { id: "vegetable", name: "Vegetable", icon: "🥬" },
  { id: "ice-cream", name: "Ice Cream", icon: "🍦" },
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Ile Iyan bodija",
    image: restaurant1,
    rating: 4.3,
    reviewCount: 226,
    cuisine: ["Goat meat", "Soup bowl"],
    deliveryTime: "25-35 min",
    isOpen: true,
    tags: ["goat-meat", "soup-bowl", "amala"]
  },
  {
    id: "2", 
    name: "Jollof Square AgbowoUI",
    image: restaurant2,
    rating: 4.5,
    reviewCount: 151,
    cuisine: ["Rice", "Chicken", "Turkey"],
    deliveryTime: "30-40 min",
    isOpen: true,
    discount: "10% off order",
    tags: ["rice", "chicken", "turkey"]
  },
  {
    id: "3",
    name: "Musanga's Restaurant",
    image: restaurant3,
    rating: 3.8,
    reviewCount: 463,
    cuisine: ["Pounded Yam"],
    deliveryTime: "Opens at 08:00 AM",
    isOpen: false,
    tags: ["amala", "soup-bowl"]
  },
  {
    id: "4",
    name: "Omar's Shawarma",
    image: restaurant1,
    rating: 4.4,
    reviewCount: 89,
    cuisine: ["Chicken", "Shawarma"],
    deliveryTime: "15-25 min",
    isOpen: true,
    tags: ["chicken", "shawarma", "fastfood"]
  },
  {
    id: "5",
    name: "Sweet Treats",
    image: restaurant2,
    rating: 4.7,
    reviewCount: 321,
    cuisine: ["Doughnuts", "Ice Cream"],
    deliveryTime: "20-30 min",
    isOpen: true,
    tags: ["doughnuts", "ice-cream"]
  },
  {
    id: "6",
    name: "Green Garden",
    image: restaurant3,
    rating: 4.2,
    reviewCount: 178,
    cuisine: ["Vegetable", "Smoothies"],
    deliveryTime: "25-35 min",
    isOpen: true,
    tags: ["vegetable", "smothies", "juice"]
  },
  {
    id: "7",
    name: "Grill Master",
    image: restaurant1,
    rating: 4.6,
    reviewCount: 267,
    cuisine: ["Grills", "Turkey"],
    deliveryTime: "30-45 min",
    isOpen: true,
    tags: ["grills", "turkey", "goat-meat"]
  },
  {
    id: "8",
    name: "Rice Palace",
    image: restaurant2,
    rating: 4.1,
    reviewCount: 194,
    cuisine: ["Rice", "Chicken"],
    deliveryTime: "20-30 min",
    isOpen: true,
    tags: ["rice", "chicken"]
  }
];