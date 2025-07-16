/*
  Warnings:

  - The `x` column on the `mapElements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `y` column on the `mapElements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `width` on the `Map` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `height` on the `Map` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Map" DROP COLUMN "width",
ADD COLUMN     "width" INTEGER NOT NULL,
DROP COLUMN "height",
ADD COLUMN     "height" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "mapElements" DROP COLUMN "x",
ADD COLUMN     "x" INTEGER,
DROP COLUMN "y",
ADD COLUMN     "y" INTEGER;
