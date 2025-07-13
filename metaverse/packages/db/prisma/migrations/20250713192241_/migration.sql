/*
  Warnings:

  - Changed the type of `x` on the `Element` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `y` on the `Element` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `height` on table `Space` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "x",
ADD COLUMN     "x" INTEGER NOT NULL,
DROP COLUMN "y",
ADD COLUMN     "y" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "height" SET NOT NULL;
