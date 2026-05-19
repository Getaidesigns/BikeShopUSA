-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BikeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "BikeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessoryType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "AccessoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopService" (
    "shopId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ShopService_pkey" PRIMARY KEY ("shopId","serviceId")
);

-- CreateTable
CREATE TABLE "ShopBikeType" (
    "shopId" TEXT NOT NULL,
    "bikeTypeId" TEXT NOT NULL,

    CONSTRAINT "ShopBikeType_pkey" PRIMARY KEY ("shopId","bikeTypeId")
);

-- CreateTable
CREATE TABLE "ShopBrand" (
    "shopId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "ShopBrand_pkey" PRIMARY KEY ("shopId","brandId")
);

-- CreateTable
CREATE TABLE "ShopAccessory" (
    "shopId" TEXT NOT NULL,
    "accessoryTypeId" TEXT NOT NULL,

    CONSTRAINT "ShopAccessory_pkey" PRIMARY KEY ("shopId","accessoryTypeId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "shopId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "userId" TEXT,
    "claimantName" TEXT NOT NULL,
    "claimantEmail" TEXT NOT NULL,
    "claimantPhone" TEXT,
    "message" TEXT,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_slug_key" ON "Shop"("slug");
CREATE INDEX "Shop_city_state_idx" ON "Shop"("city", "state");
CREATE INDEX "Shop_zip_idx" ON "Shop"("zip");
CREATE INDEX "Shop_isFeatured_idx" ON "Shop"("isFeatured");
CREATE INDEX "Shop_slug_idx" ON "Shop"("slug");

CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

CREATE UNIQUE INDEX "BikeType_name_key" ON "BikeType"("name");
CREATE UNIQUE INDEX "BikeType_slug_key" ON "BikeType"("slug");

CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

CREATE UNIQUE INDEX "AccessoryType_name_key" ON "AccessoryType"("name");
CREATE UNIQUE INDEX "AccessoryType_slug_key" ON "AccessoryType"("slug");

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE UNIQUE INDEX "Favorite_sessionId_shopId_key" ON "Favorite"("sessionId", "shopId");
CREATE UNIQUE INDEX "Favorite_userId_shopId_key" ON "Favorite"("userId", "shopId");

CREATE INDEX "Claim_shopId_idx" ON "Claim"("shopId");
CREATE INDEX "Claim_status_idx" ON "Claim"("status");

-- AddForeignKey
ALTER TABLE "ShopService" ADD CONSTRAINT "ShopService_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopService" ADD CONSTRAINT "ShopService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ShopBikeType" ADD CONSTRAINT "ShopBikeType_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopBikeType" ADD CONSTRAINT "ShopBikeType_bikeTypeId_fkey" FOREIGN KEY ("bikeTypeId") REFERENCES "BikeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ShopBrand" ADD CONSTRAINT "ShopBrand_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopBrand" ADD CONSTRAINT "ShopBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ShopAccessory" ADD CONSTRAINT "ShopAccessory_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShopAccessory" ADD CONSTRAINT "ShopAccessory_accessoryTypeId_fkey" FOREIGN KEY ("accessoryTypeId") REFERENCES "AccessoryType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Claim" ADD CONSTRAINT "Claim_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
