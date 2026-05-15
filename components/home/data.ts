export const restaurant = {
  name: "Hot Wok",
  phoneDisplay: "(580) 355-7888",
  phoneHref: "tel:+15803557888",
  address: "1303 SW Lee Blvd, Lawton, OK",
  directionsHref:
    "https://www.google.com/maps/search/?api=1&query=1303+SW+Lee+Blvd+Lawton+OK",
} as const;

export const popularDishes = [
  {
    name: "General Tso's Chicken",
    description:
      "Crisp chicken tossed in a sweet-spicy glaze with a satisfying kick and glossy finish.",
    price: "House favorite",
    image: "/general-tsos-chicken.png",
  },
  {
    name: "Orange Chicken",
    description:
      "Bright citrus notes, crunchy edges, and a sticky orange sauce made for takeout cravings.",
    price: "Popular pick",
    image: "/orange-chicken.png",
  },
  {
    name: "Sesame Chicken",
    description:
      "Golden chicken coated in a savory-sweet sauce and finished with toasted sesame flavor.",
    price: "Customer classic",
    image: "/sesame-chicken.png",
  },
  {
    name: "Lo Mein",
    description:
      "Tender noodles stir-fried with vegetables and rich wok flavor for an easy comfort order.",
    price: "Great for lunch",
    image: "/lo-mein.png",
  },
  {
    name: "Fried Rice",
    description:
      "Fluffy rice, savory seasoning, and that unmistakable wok-fried aroma that rounds out any meal.",
    price: "Perfect side or entree",
    image: "/fried-rice.png",
  },
  {
    name: "Crab Rangoon",
    description:
      "Crispy wontons with creamy filling, ideal for sharing or adding a crunchy starter to dinner.",
    price: "Best appetizer add-on",
    image: "/crab-rangoon.png",
  },
] as const;

export const menuCategories = [
  {
    title: "Appetizers",
    description:
      "Start with crowd-pleasers like rangoon, egg rolls, and crispy bites made for the table.",
    tag: "Shareable starters",
    image: "/banner-appetizers.png",
  },
  {
    title: "Soups",
    description:
      "Comforting soups that bring warmth, depth, and a lighter option for lunch or dinner.",
    tag: "Warm and savory",
    image: "/banner-soups.png",
  },
  {
    title: "Chicken",
    description:
      "From sweet heat to sesame glaze, this section is packed with familiar takeout favorites.",
    tag: "Top sellers",
    image: "/banner-chicken.png",
  },
  {
    title: "Beef",
    description:
      "Rich, hearty wok dishes with bold sauces and satisfying portions for bigger appetites.",
    tag: "Bold flavor",
    image: "/banner-beef.png",
  },
  {
    title: "Shrimp",
    description:
      "Lighter seafood options with crisp vegetables and glossy sauces that still feel indulgent.",
    tag: "Fresh seafood dishes",
    image: "/banner-shrimp.png",
  },
  {
    title: "Fried Rice",
    description:
      "Classic fried rice options that work as a meal on their own or the perfect side order.",
    tag: "A takeout essential",
    image: "/banner-fried-rice.png",
  },
  {
    title: "Lo Mein",
    description:
      "Savory noodle dishes with satisfying texture and rich wok flavor in every bite.",
    tag: "Comfort noodles",
    image: "/banner-lo-mein.png",
  },
] as const;

export const spotlights = [
  {
    title: "Crispy Egg Rolls",
    description:
      "Golden, crunchy, and easy to add to any order when you want a little extra on the side.",
    image: "/egg-rolls.png",
  },
  {
    title: "Wonton Soup",
    description:
      "A soothing classic with delicate wontons in a clean, savory broth that balances richer dishes.",
    image: "/wonton-soup.png",
  },
] as const;

export const hours = [
  "Monday: 11:00 AM - 9:00 PM",
  "Tuesday: 11:00 AM - 9:00 PM",
  "Wednesday: 11:00 AM - 9:00 PM",
  "Thursday: 11:00 AM - 9:00 PM",
  "Friday: 11:00 AM - 9:30 PM",
  "Saturday: 11:30 AM - 9:30 PM",
  "Sunday: 12:00 PM - 8:30 PM",
] as const;

export const pickupDetails = [
  "Fast phone-in ordering for lunch, dinner, and family meals.",
  "Pickup orders are packed for easy grab-and-go service.",
  "Local delivery availability may vary by distance and time of day.",
] as const;
