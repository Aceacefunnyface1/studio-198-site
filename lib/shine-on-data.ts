export const siteInfo = {
  name: "Undercover Transportation",
  shortName: "Undercover",
  description:
    "Undercover Transportation offers reliable cash rides in Lawton, Oklahoma. Call or text Matthew Rogers for work rides, local rides, and scheduled out-of-town trips. Rides start at $6.",
  title: "Undercover Transportation | Reliable Cash Rides in Lawton, OK",
  phoneDisplay: "940-500-2960",
  phoneHref: "tel:19405002960",
  smsHref: "sms:19405002960",
  addressLine1: "Lawton, Oklahoma",
  addressLine2: "Call or text Matthew Rogers",
  mapHref: "https://www.google.com/maps/search/?api=1&query=Lawton+Oklahoma",
  reviews: "Daily",
  rating: "$6+",
  hours: [
    "Daily: 6AM - 9PM",
    "Call or text for ride availability",
  ],
  policies: ["Cash Rides", "No Base Rides"],
  bookingHref: "sms:19405002960",
  keywords: [
    "Cash rides Lawton Oklahoma",
    "Work rides Lawton OK",
    "Local ride service Lawton",
    "Out of town rides Lawton OK",
  ],
} as const;

export const navLinks = [
  { href: "#top", label: "Top" },
  { href: "#services", label: "Services" },
  { href: "#pricing", label: "Pricing" },
  { href: "#coverage", label: "Coverage" },
] as const;

export const whyChooseItems = [
  "Better than waiting on an app",
  "Great for daily work rides",
  "Local Lawton driver",
  "Cash-friendly rides",
  "Call or text directly",
  "Out-of-town rides available",
] as const;

export const artists = [
  {
    name: "Matthew Rogers",
    role: "Owner / Driver",
    bio: "Local Lawton driver focused on dependable cash rides for work, errands, appointments, and scheduled out-of-town trips.",
  },
] as const;

export const faqs = [
  {
    question: "How do I book a ride?",
    answer: "Call or text Matthew directly at 940-500-2960.",
  },
  {
    question: "What do rides cost?",
    answer: "Rides start at $6 and depend on pickup, drop-off, distance, and time.",
  },
  {
    question: "What hours are available?",
    answer: "Undercover Transportation is available daily from 6AM to 9PM.",
  },
  {
    question: "Do you offer work rides?",
    answer: "Yes. Work rides and repeat riders are a core part of the service.",
  },
  {
    question: "Do you go on military bases?",
    answer: "No. Undercover Transportation does not drive on Fort Sill base or any military base.",
  },
  {
    question: "Do you do out-of-town rides?",
    answer: "Yes, out-of-town rides are available when scheduled.",
  },
] as const;

export const homepageStats = [
  { value: siteInfo.reviews, label: "Available" },
  { value: siteInfo.rating, label: "Starting Price" },
  { value: "6AM - 9PM", label: "Daily Hours" },
] as const;

export const serviceHighlights = [
  "Reliable rides for work, errands, appointments, and getting home",
  "Direct communication with Matthew by call or text",
  "Local Lawton service with scheduled out-of-town availability",
] as const;

export const bookingNotes = [
  "Call or text for a quick quote",
  "Rides start at $6",
  "No military base rides",
] as const;
