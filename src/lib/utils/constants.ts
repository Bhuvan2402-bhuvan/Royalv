/**
 * Royal V Properties Domain Constants
 * Established 2006 | Headquartered in Guntur, Andhra Pradesh
 */

export const BRAND_CONFIG = {
  name: "Royal V Properties",
  tagline: "Trusted Property Services Since 2006",
  establishedYear: 2006,
  headquarters: {
    city: "Guntur",
    state: "Andhra Pradesh",
    country: "India",
    address: "SVN Colony, Guntur, Andhra Pradesh – 522006, India",
    phone: "+91 98858 39645",
    primaryPhone: "+91 98858 39645",
    secondaryPhones: ["+91 97000 71279", "+91 94917 96224"],
    rawPhones: {
      primary: "9885839645",
      secondary1: "9700071279",
      secondary2: "9491796224",
    },
    email: "royalvproperties@gmail.com",
  },
  leadership: {
    founderAndChairman: {
      name: "V.V.S.R.Krishna Prasad",
      title: "Founder & Chairman",
      role: "Founder and Chairman",
      photo: "/images/leadership/vvsr-krishna-prasad.jpg",
      experience: "18+ Years Real Estate Leadership",
      quote: "Our mission since 2006 has remained constant: to connect every family and investor in Andhra Pradesh with verified, high-value real estate through honesty, transparency, and deep regional expertise.",
    },
  },
  primaryRegions: [
    {
      id: "guntur",
      name: "Guntur",
      tagline: "Leading Commercial & Residential Hub",
      featuredAreas: ["SVN Colony", "Lakshmipuram", "Ring Road", "Brodipet", "Arundelpet", "Pattabhipuram", "Koretipadu", "Syamala Nagar", "Vidya Nagar"],
    },
    {
      id: "vijayawada",
      name: "Vijayawada",
      tagline: "Commercial Capital of Andhra Pradesh",
      featuredAreas: ["Benz Circle", "MG Road", "Kanuru", "Poranki", "Tadigadapa", "Gollapudi", "Gunadala", "Bhavanipuram"],
    },
    {
      id: "ap-capital-region",
      name: "Andhra Pradesh Capital Region (CRDA)",
      tagline: "High-Growth Investment Corridor",
      featuredAreas: ["Mangalagiri", "Tadepalli", "Amaravati Core Area", "Navuluru", "Kunchanapalli", "NH-16 Corridor"],
    },
  ],
  navLinks: [
    { label: "Properties", href: "/properties" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ],
  serviceCategories: [
    {
      title: "Property Discovery & Purchase",
      description: "Carefully vetted luxury villas, apartments, commercial lands, and investment plots across Guntur, Vijayawada, and Amaravati region.",
    },
    {
      title: "Sell Your Property",
      description: "Direct listing assistance and genuine buyer connection with transparent valuation and verified documentation.",
    },
    {
      title: "Commercial & Investment Advisory",
      description: "Strategic commercial land acquisition and high-growth capital region property guidance backed by 18+ years of local expertise.",
    },
  ],
} as const;
