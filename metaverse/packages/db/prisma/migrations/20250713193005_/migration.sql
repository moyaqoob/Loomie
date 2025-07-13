/*
  Warnings:

  - You are about to drop the column `elementId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `spaceId` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `x` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Element` table. All the data in the column will be lost.
  - Added the required column `height` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `static` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `x` on the `spaceElements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `y` on the `spaceElements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "elementId",
DROP COLUMN "spaceId",
DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "static" BOOLEAN NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "spaceElements" DROP COLUMN "x",
ADD COLUMN     "x" INTEGER NOT NULL,
DROP COLUMN "y",
ADD COLUMN     "y" INTEGER NOT NULL;
