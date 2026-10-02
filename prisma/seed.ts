import { PrismaClient, UserRole, UserStatus, PropertyWorkflowStatus, PropertyType, ListingCategory, FacingDirection, FurnishingStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Royal V Properties database seed...");

  // Hash passwords for each role
  const superAdminHash = await bcrypt.hash("SuperAdmin@2026!", 12);
  const adminHash = await bcrypt.hash("Admin@2026!", 12);
  const managerHash = await bcrypt.hash("PropertyManager@2026!", 12);
  const fieldAgentHash = await bcrypt.hash("FieldAgent@2026!", 12);
  const customerHash = await bcrypt.hash("Customer@2026!", 12);

  // 1. Upsert Super Admin (Executive Admin)
  const superAdmin = await prisma.user.upsert({
    where: { email: "royalvproperties@gmail.com" },
    update: {
      name: "Royal V",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      phone: "+91 98858 39645",
      passwordHash: superAdminHash,
    },
    create: {
      name: "Royal V",
      email: "royalvproperties@gmail.com",
      phone: "+91 98858 39645",
      passwordHash: superAdminHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Super Admin configured: ${superAdmin.name} (${superAdmin.email})`);

  // 2. Upsert Operations Admin (Office Admin)
  const operationsAdmin = await prisma.user.upsert({
    where: { email: "admin@royalvproperties.com" },
    update: {
      name: "Operations Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      phone: "+91 98858 39645",
      passwordHash: adminHash,
    },
    create: {
      name: "Operations Admin",
      email: "admin@royalvproperties.com",
      phone: "+91 98858 39645",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Operations Admin configured: ${operationsAdmin.name} (${operationsAdmin.email})`);

  // 3. Upsert Property Manager Staff (Varun Teja)
  const propertyManager = await prisma.user.upsert({
    where: { email: "varun@royalvproperties.com" },
    update: {
      name: "Varun Teja",
      role: UserRole.PROPERTY_MANAGER,
      status: UserStatus.ACTIVE,
      phone: "+91 97000 71279",
      passwordHash: managerHash,
    },
    create: {
      name: "Varun Teja",
      email: "varun@royalvproperties.com",
      phone: "+91 97000 71279",
      passwordHash: managerHash,
      role: UserRole.PROPERTY_MANAGER,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  // Also alias manager@royalvproperties.com
  await prisma.user.upsert({
    where: { email: "manager@royalvproperties.com" },
    update: {
      name: "Varun Teja",
      role: UserRole.PROPERTY_MANAGER,
      status: UserStatus.ACTIVE,
      phone: "+91 97000 71279",
      passwordHash: managerHash,
    },
    create: {
      name: "Varun Teja",
      email: "manager@royalvproperties.com",
      phone: "+91 97000 71279",
      passwordHash: managerHash,
      role: UserRole.PROPERTY_MANAGER,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Property Manager configured: ${propertyManager.name} (${propertyManager.email} & manager@royalvproperties.com)`);

  // 4. Upsert Field Agent (Bhuvana Mohan)
  const fieldAgent = await prisma.user.upsert({
    where: { email: "bhuvana@royalvproperties.com" },
    update: {
      name: "Bhuvana Mohan",
      role: UserRole.FIELD_AGENT,
      status: UserStatus.ACTIVE,
      phone: "+91 94917 96224",
      passwordHash: fieldAgentHash,
    },
    create: {
      name: "Bhuvana Mohan",
      email: "bhuvana@royalvproperties.com",
      phone: "+91 94917 96224",
      passwordHash: fieldAgentHash,
      role: UserRole.FIELD_AGENT,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  // Also alias agent@royalvproperties.com
  await prisma.user.upsert({
    where: { email: "agent@royalvproperties.com" },
    update: {
      name: "Bhuvana Mohan",
      role: UserRole.FIELD_AGENT,
      status: UserStatus.ACTIVE,
      phone: "+91 94917 96224",
      passwordHash: fieldAgentHash,
    },
    create: {
      name: "Bhuvana Mohan",
      email: "agent@royalvproperties.com",
      phone: "+91 94917 96224",
      passwordHash: fieldAgentHash,
      role: UserRole.FIELD_AGENT,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Field Agent configured: ${fieldAgent.name} (${fieldAgent.email} & agent@royalvproperties.com)`);

  // 5. Upsert Test Customer Account (Verified Buyer / Seller)
  const customer = await prisma.user.upsert({
    where: { email: "customer@royalvproperties.com" },
    update: {
      name: "Verified Buyer / Seller",
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      phone: "+91 94917 96224",
      passwordHash: customerHash,
    },
    create: {
      name: "Verified Buyer / Seller",
      email: "customer@royalvproperties.com",
      phone: "+91 94917 96224",
      passwordHash: customerHash,
      role: UserRole.CUSTOMER,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Customer Account configured: ${customer.name} (${customer.email})`);

  // 3. Create Sample Properties in Guntur and Vijayawada (Only if empty)
  const existingPropertiesCount = await prisma.property.count();
  if (existingPropertiesCount === 0) {
    console.log("Creating initial sample verified properties in Guntur & Vijayawada...");

    const property1 = await prisma.property.create({
      data: {
        title: "3 BHK Luxury Gated Community Apartment in Lakshmipuram",
        slug: "3-bhk-luxury-gated-community-apartment-lakshmipuram-guntur",
        tagline: "Prime location near Ring Road with premium club amenities",
        description: "Exquisite 3 BHK residential apartment situated in the heart of Lakshmipuram, Guntur. Features 100% Vaastu compliance, spacious modular kitchen, cross ventilation, 2 covered car parks, and access to an exclusive 15,000 sq ft clubhouse.",
        propertyType: PropertyType.APARTMENT,
        listingCategory: ListingCategory.BUY_PROPERTY,
        status: PropertyWorkflowStatus.PUBLISHED,
        isFeatured: true,
        isVerified: true,
        price: 9500000, // 95 Lakhs INR
        pricePerSqFt: 4750,
        priceOnRequest: false,
        isNegotiable: true,
        city: "Guntur",
        locality: "Lakshmipuram",
        subLocality: "Main Road, 4th Lane",
        landmark: "Near Lakshmipuram Circle & Axis Bank",
        address: "Plot 42, Sri Lakshmi Nilayam, 4th Lane Lakshmipuram, Guntur, AP",
        pincode: "522007",
        state: "Andhra Pradesh",
        country: "India",
        latitude: 16.2985,
        longitude: 80.4418,
        bedrooms: 3,
        bathrooms: 3,
        balconies: 2,
        builtUpAreaSqFt: 2000,
        carpetAreaSqFt: 1680,
        facing: FacingDirection.EAST,
        furnishing: FurnishingStatus.SEMI_FURNISHED,
        floorNumber: 4,
        totalFloors: 9,
        ageOfProperty: 1,
        reraApproved: true,
        reraNumber: "AP-RERA-P07202300189",
        amenities: [
          "24/7 Power Backup",
          "Automated High Speed Lifts",
          "Clubhouse & Swimming Pool",
          "Gymnasium",
          "Children Play Area",
          "24/7 Security & CCTV",
          "Covered Car Parking",
          "Intercom Facility"
        ],
        createdById: propertyManager.id,
        approvedById: superAdmin.id,
        publishedById: superAdmin.id,
        submittedAt: new Date(Date.now() - 7 * 86400000),
        approvedAt: new Date(Date.now() - 5 * 86400000),
        publishedAt: new Date(Date.now() - 4 * 86400000),
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
              altText: "3 BHK Living Area and Balcony in Lakshmipuram",
              orderIndex: 0,
              isFeatured: true,
            },
            {
              url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
              altText: "Master Bedroom with Wooden Flooring",
              orderIndex: 1,
              isFeatured: false,
            },
            {
              url: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
              altText: "Modern Kitchen Setup",
              orderIndex: 2,
              isFeatured: false,
            }
          ]
        }
      }
    });

    const property2 = await prisma.property.create({
      data: {
        title: "4 BHK Independent Contemporary Villa at Benz Circle",
        slug: "4-bhk-independent-contemporary-villa-benz-circle-vijayawada",
        tagline: "Exclusive custom-built private villa on 300 Sq Yards in prime Vijayawada",
        description: "Magnificent independent 4 BHK triplex villa located moments from Benz Circle, Vijayawada. Built with superior quality teak wood fittings, Italian marble flooring, solar water heating, private landscaped garden, and private terrace lounge.",
        propertyType: PropertyType.VILLA,
        listingCategory: ListingCategory.BUY_PROPERTY,
        status: PropertyWorkflowStatus.PUBLISHED,
        isFeatured: true,
        isVerified: true,
        price: 26500000, // 2.65 Crore INR
        pricePerSqFt: 7571,
        priceOnRequest: false,
        isNegotiable: false,
        city: "Vijayawada",
        locality: "Benz Circle",
        subLocality: "Revenue Colony",
        landmark: "Adjacent to DV Manor",
        address: "Villa 12, Sri Krishna Enclave, Revenue Colony, Benz Circle, Vijayawada, AP",
        pincode: "520010",
        state: "Andhra Pradesh",
        country: "India",
        latitude: 16.5062,
        longitude: 80.6480,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        builtUpAreaSqFt: 3500,
        carpetAreaSqFt: 3100,
        plotAreaSqYards: 300,
        facing: FacingDirection.NORTH_EAST,
        furnishing: FurnishingStatus.FULLY_FURNISHED,
        floorNumber: 0,
        totalFloors: 3,
        ageOfProperty: 0,
        reraApproved: true,
        reraNumber: "AP-RERA-P08202300412",
        amenities: [
          "Private Landscaped Lawn",
          "Italian Marble Flooring",
          "Solar Power System",
          "Automated Gate & Video Door Phone",
          "Home Theater Room",
          "Servant Quarters",
          "3 Car Dedicated Garage"
        ],
        createdById: propertyManager.id,
        approvedById: superAdmin.id,
        publishedById: superAdmin.id,
        submittedAt: new Date(Date.now() - 3 * 86400000),
        approvedAt: new Date(Date.now() - 2 * 86400000),
        publishedAt: new Date(Date.now() - 1 * 86400000),
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
              altText: "Front elevation of 4 BHK Villa in Benz Circle Vijayawada",
              orderIndex: 0,
              isFeatured: true,
            },
            {
              url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
              altText: "Spacious Hall with Double Height Ceiling",
              orderIndex: 1,
              isFeatured: false,
            }
          ]
        }
      }
    });

    const property3 = await prisma.property.create({
      data: {
        title: "Prime Commercial Land & Open Plot near Mangalagiri Capital Highway",
        slug: "prime-commercial-land-open-plot-mangalagiri-ap-capital-region",
        tagline: "CRDA Approved commercial development plot with 80ft main road frontage",
        description: "High-potential commercial and mixed-use plot situated strategically along the Mangalagiri - Amaravati growth corridor. 100% clear title, CRDA master plan approved, ready for immediate commercial showroom or IT office construction.",
        propertyType: PropertyType.COMMERCIAL_PLOT,
        listingCategory: ListingCategory.BUY_PROPERTY,
        status: PropertyWorkflowStatus.PUBLISHED,
        isFeatured: true,
        isVerified: true,
        price: 18000000, // 1.80 Crore INR
        priceOnRequest: false,
        isNegotiable: true,
        city: "Mangalagiri",
        locality: "AP Capital Highway Corridor",
        subLocality: "Near AIIMS Mangalagiri",
        landmark: "Opposite to NRI Hospital Junction",
        address: "Plot 8 & 9, Capital Gateway Zone, Mangalagiri, Guntur District, AP",
        pincode: "522503",
        state: "Andhra Pradesh",
        country: "India",
        latitude: 16.4385,
        longitude: 80.5642,
        plotAreaSqYards: 600,
        plotAreaCents: 12.4,
        facing: FacingDirection.EAST,
        reraApproved: true,
        reraNumber: "CRDA-LP-2023-0091",
        amenities: [
          "80 Feet Wide BT Road Frontage",
          "Underground Electricity & Drainage Line",
          "CRDA Approved Layout",
          "High Water Table Area",
          "Immediate Title Registration"
        ],
        createdById: propertyManager.id,
        approvedById: superAdmin.id,
        publishedById: superAdmin.id,
        submittedAt: new Date(Date.now() - 10 * 86400000),
        approvedAt: new Date(Date.now() - 8 * 86400000),
        publishedAt: new Date(Date.now() - 6 * 86400000),
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
              altText: "Commercial Plot facing Main Highway Corridor",
              orderIndex: 0,
              isFeatured: true,
            }
          ]
        }
      }
    });

    console.log(`✅ Sample published properties created: [${property1.title}, ${property2.title}, ${property3.title}]`);
  }

  // 4. Record Audit Log for Initial Seed
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "DATABASE_INITIALIZED_AND_SEEDED",
      entity: "System",
      details: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        message: "Initial seed completed with default super admin and sample records.",
      },
    },
  });

  console.log("🎉 Royal V Properties database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
