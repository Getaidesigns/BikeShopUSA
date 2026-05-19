// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Services
  const services = [
    { name: "Repair", slug: "repair" },
    { name: "Tune-Up", slug: "tune-up" },
    { name: "Bike Fitting", slug: "bike-fitting" },
    { name: "Rentals", slug: "rentals" },
    { name: "Custom Builds", slug: "custom-builds" },
    { name: "Parts & Accessories", slug: "parts-accessories" },
    { name: "Wheel Building", slug: "wheel-building" },
    { name: "Electric Bike Service", slug: "electric-bike-service" },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    });
  }

  // Seed Bike Types
  const bikeTypes = [
    { name: "Road", slug: "road" },
    { name: "Mountain", slug: "mountain" },
    { name: "Gravel", slug: "gravel" },
    { name: "E-Bike", slug: "e-bike" },
    { name: "BMX", slug: "bmx" },
    { name: "Hybrid", slug: "hybrid" },
    { name: "Cruiser", slug: "cruiser" },
    { name: "Kids", slug: "kids" },
  ];

  for (const bt of bikeTypes) {
    await prisma.bikeType.upsert({
      where: { slug: bt.slug },
      update: {},
      create: bt,
    });
  }

  // Seed Brands
  const brands = [
    { name: "Trek", slug: "trek" },
    { name: "Specialized", slug: "specialized" },
    { name: "Giant", slug: "giant" },
    { name: "Cannondale", slug: "cannondale" },
    { name: "Santa Cruz", slug: "santa-cruz" },
    { name: "Shimano", slug: "shimano" },
    { name: "SRAM", slug: "sram" },
    { name: "Scott", slug: "scott" },
    { name: "Cervelo", slug: "cervelo" },
    { name: "Surly", slug: "surly" },
    { name: "Salsa", slug: "salsa" },
    { name: "Yeti", slug: "yeti" },
    { name: "Orbea", slug: "orbea" },
    { name: "Bianchi", slug: "bianchi" },
    { name: "Kona", slug: "kona" },
  ];

  for (const b of brands) {
    await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  // Seed Accessories
  const accessories = [
    { name: "Helmets", slug: "helmets" },
    { name: "Lights", slug: "lights" },
    { name: "Locks", slug: "locks" },
    { name: "Clothing & Apparel", slug: "clothing-apparel" },
    { name: "Nutrition & Hydration", slug: "nutrition-hydration" },
    { name: "Bags & Racks", slug: "bags-racks" },
    { name: "Trainers & Rollers", slug: "trainers-rollers" },
  ];

  for (const a of accessories) {
    await prisma.accessoryType.upsert({
      where: { slug: a.slug },
      update: {},
      create: a,
    });
  }

  // Helper to connect relations
  const getService = async (slug: string) =>
    prisma.service.findUniqueOrThrow({ where: { slug } });
  const getBikeType = async (slug: string) =>
    prisma.bikeType.findUniqueOrThrow({ where: { slug } });
  const getBrand = async (slug: string) =>
    prisma.brand.findUniqueOrThrow({ where: { slug } });

  // Seed 10 Shops
  const shopsData = [
    {
      slug: "pedal-power-austin",
      name: "Pedal Power Austin",
      description:
        "Austin's premier full-service bicycle shop since 2003. We specialize in road, mountain, and gravel bikes with expert fitting services and same-day repairs. Our certified technicians have decades of combined experience keeping Austin cyclists on the road and trail.",
      phone: "(512) 555-0101",
      email: "info@pedalpoweraustin.com",
      website: "https://pedalpoweraustin.com",
      rating: 4.8,
      reviewCount: 234,
      isVerified: true,
      isFeatured: true,
      street: "2301 S Lamar Blvd",
      city: "Austin",
      state: "TX",
      zip: "78704",
      latitude: 30.2499,
      longitude: -97.7722,
      servicesSlugs: ["repair", "tune-up", "bike-fitting", "custom-builds", "parts-accessories"],
      bikeTypeSlugs: ["road", "mountain", "gravel", "hybrid"],
      brandSlugs: ["trek", "specialized", "shimano", "sram"],
    },
    {
      slug: "golden-gate-cycles-sf",
      name: "Golden Gate Cycles",
      description:
        "San Francisco's neighborhood bike shop located in the heart of the Mission District. We carry a wide selection of commuter, road, and e-bikes. Whether you're tackling the hills or cruising to work, we've got you covered.",
      phone: "(415) 555-0202",
      email: "hello@goldengateycles.com",
      website: "https://goldengatecycles.com",
      rating: 4.6,
      reviewCount: 189,
      isVerified: true,
      isFeatured: true,
      street: "3415 18th St",
      city: "San Francisco",
      state: "CA",
      zip: "94110",
      latitude: 37.7618,
      longitude: -122.4185,
      servicesSlugs: ["repair", "tune-up", "electric-bike-service", "rentals", "parts-accessories"],
      bikeTypeSlugs: ["road", "e-bike", "hybrid", "cruiser"],
      brandSlugs: ["giant", "cannondale", "specialized"],
    },
    {
      slug: "rocky-mountain-bikes-denver",
      name: "Rocky Mountain Bike Works",
      description:
        "Denver's go-to shop for serious mountain bikers. Located near the best trails in Colorado, we stock the finest trail, enduro, and downhill bikes. Our staff are all avid riders who know the local terrain inside and out.",
      phone: "(720) 555-0303",
      email: "shred@rockymtnbikeworks.com",
      website: "https://rockymtnbikeworks.com",
      rating: 4.9,
      reviewCount: 312,
      isVerified: true,
      isFeatured: true,
      street: "1500 Blake St",
      city: "Denver",
      state: "CO",
      zip: "80202",
      latitude: 39.7531,
      longitude: -104.9956,
      servicesSlugs: ["repair", "tune-up", "custom-builds", "wheel-building", "parts-accessories"],
      bikeTypeSlugs: ["mountain", "gravel", "e-bike"],
      brandSlugs: ["santa-cruz", "yeti", "trek", "shimano", "sram"],
    },
    {
      slug: "brooklyn-spoke-nyc",
      name: "Brooklyn Spoke",
      description:
        "Brooklyn's beloved indie bike shop. We're passionate about cycling culture and community. From fixies to cargo bikes, we build, repair, and sell bikes that fit your life. Drop-in repairs welcome.",
      phone: "(718) 555-0404",
      email: "ride@brooklynspoke.com",
      website: "https://brooklynspoke.com",
      rating: 4.7,
      reviewCount: 156,
      isVerified: false,
      isFeatured: true,
      street: "456 Atlantic Ave",
      city: "Brooklyn",
      state: "NY",
      zip: "11217",
      latitude: 40.6841,
      longitude: -73.9839,
      servicesSlugs: ["repair", "tune-up", "custom-builds", "parts-accessories"],
      bikeTypeSlugs: ["road", "hybrid", "cruiser", "bmx"],
      brandSlugs: ["surly", "kona", "bianchi", "shimano"],
    },
    {
      slug: "windy-city-cycles-chicago",
      name: "Windy City Cycles",
      description:
        "Chicago's largest independent bike retailer with over 500 bikes in stock. We serve cyclists of all levels, from beginners to seasoned racers. Our service department handles everything from flat tire fixes to full custom builds.",
      phone: "(312) 555-0505",
      email: "info@windycitycycles.com",
      website: "https://windycitycycles.com",
      rating: 4.5,
      reviewCount: 278,
      isVerified: true,
      isFeatured: false,
      street: "900 N Michigan Ave",
      city: "Chicago",
      state: "IL",
      zip: "60611",
      latitude: 41.8974,
      longitude: -87.6246,
      servicesSlugs: ["repair", "tune-up", "bike-fitting", "rentals", "wheel-building", "parts-accessories"],
      bikeTypeSlugs: ["road", "mountain", "hybrid", "e-bike", "kids"],
      brandSlugs: ["trek", "giant", "cannondale", "cervelo", "shimano"],
    },
    {
      slug: "seattle-two-wheels-wa",
      name: "Seattle Two Wheels",
      description:
        "Your Pacific Northwest cycling headquarters. We specialize in bikes built for rain, gravel, and everything in between. Expert staff, quality brands, and a community-focused approach to cycling.",
      phone: "(206) 555-0606",
      email: "roll@seattletwowheels.com",
      website: "https://seattletwowheels.com",
      rating: 4.6,
      reviewCount: 203,
      isVerified: true,
      isFeatured: false,
      street: "1200 Pike St",
      city: "Seattle",
      state: "WA",
      zip: "98101",
      latitude: 47.6139,
      longitude: -122.3341,
      servicesSlugs: ["repair", "tune-up", "bike-fitting", "electric-bike-service", "parts-accessories"],
      bikeTypeSlugs: ["gravel", "mountain", "road", "e-bike", "hybrid"],
      brandSlugs: ["salsa", "surly", "orbea", "shimano", "sram"],
    },
    {
      slug: "miami-beach-cycles-fl",
      name: "Miami Beach Cycles",
      description:
        "Sun, surf, and two wheels. Miami Beach Cycles is your source for beach cruisers, e-bikes, and rental bikes along the strip. Open 7 days a week with convenient hourly and daily rentals.",
      phone: "(305) 555-0707",
      email: "cruise@miamibeachcycles.com",
      website: "https://miamibeachcycles.com",
      rating: 4.3,
      reviewCount: 445,
      isVerified: true,
      isFeatured: false,
      street: "1685 Collins Ave",
      city: "Miami Beach",
      state: "FL",
      zip: "33139",
      latitude: 25.7907,
      longitude: -80.1300,
      servicesSlugs: ["repair", "rentals", "electric-bike-service", "parts-accessories"],
      bikeTypeSlugs: ["cruiser", "e-bike", "hybrid", "kids"],
      brandSlugs: ["giant", "trek", "shimano"],
    },
    {
      slug: "velo-craft-portland",
      name: "VeloCraft Portland",
      description:
        "Portland's boutique bike shop for discerning cyclists. We curate a carefully selected range of high-end road, gravel, and touring bikes. Our master fitters and builders are here to create your perfect ride.",
      phone: "(503) 555-0808",
      email: "craft@velocraftpdx.com",
      website: "https://velocraftpdx.com",
      rating: 4.9,
      reviewCount: 127,
      isVerified: true,
      isFeatured: false,
      street: "3225 SE Division St",
      city: "Portland",
      state: "OR",
      zip: "97202",
      latitude: 45.5042,
      longitude: -122.6326,
      servicesSlugs: ["repair", "bike-fitting", "custom-builds", "wheel-building", "parts-accessories"],
      bikeTypeSlugs: ["road", "gravel", "mountain"],
      brandSlugs: ["cervelo", "orbea", "bianchi", "santa-cruz", "shimano", "sram"],
    },
    {
      slug: "hub-city-bikes-nashville",
      name: "Hub City Bikes",
      description:
        "Nashville's fastest-growing bike shop serving the booming cycling community. We offer a full range of bikes, accessories, and services. Group rides every Saturday morning, all levels welcome!",
      phone: "(615) 555-0909",
      email: "ride@hubcitybikes.com",
      website: "https://hubcitybikes.com",
      rating: 4.7,
      reviewCount: 98,
      isVerified: false,
      isFeatured: false,
      street: "518 Houston St",
      city: "Nashville",
      state: "TN",
      zip: "37203",
      latitude: 36.1555,
      longitude: -86.7829,
      servicesSlugs: ["repair", "tune-up", "bike-fitting", "parts-accessories"],
      bikeTypeSlugs: ["road", "gravel", "hybrid", "mountain", "e-bike"],
      brandSlugs: ["specialized", "trek", "giant", "cannondale"],
    },
    {
      slug: "desert-trails-bikes-phoenix",
      name: "Desert Trails Bike Co.",
      description:
        "Built for the desert. Desert Trails specializes in mountain bikes designed for the rugged Arizona terrain. From technical singletrack to epic gravel routes, we equip you for the best riding in the Southwest.",
      phone: "(602) 555-1010",
      email: "shred@deserttrailsbikes.com",
      website: "https://deserttrailsbikes.com",
      rating: 4.8,
      reviewCount: 176,
      isVerified: true,
      isFeatured: false,
      street: "4802 E Indian School Rd",
      city: "Phoenix",
      state: "AZ",
      zip: "85018",
      latitude: 33.4942,
      longitude: -111.9947,
      servicesSlugs: ["repair", "tune-up", "custom-builds", "wheel-building", "electric-bike-service"],
      bikeTypeSlugs: ["mountain", "gravel", "e-bike", "road"],
      brandSlugs: ["yeti", "santa-cruz", "kona", "shimano", "sram"],
    },
  ];

  for (const shopData of shopsData) {
    const { servicesSlugs, bikeTypeSlugs, brandSlugs, ...shop } = shopData;

    const serviceRecords = await Promise.all(servicesSlugs.map(getService));
    const bikeTypeRecords = await Promise.all(bikeTypeSlugs.map(getBikeType));
    const brandRecords = await Promise.all(brandSlugs.map(getBrand));

    await prisma.shop.upsert({
      where: { slug: shop.slug },
      update: {},
      create: {
        ...shop,
        services: {
          create: serviceRecords.map((s) => ({ serviceId: s.id })),
        },
        bikeTypes: {
          create: bikeTypeRecords.map((bt) => ({ bikeTypeId: bt.id })),
        },
        brands: {
          create: brandRecords.map((b) => ({ brandId: b.id })),
        },
      },
    });

    console.log(`  ✓ ${shop.name}`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
