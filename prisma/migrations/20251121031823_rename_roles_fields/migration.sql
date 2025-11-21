/*
  Warnings:

  - You are about to drop the column `name` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nombre` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "nombre" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_nombre_key" ON "Role"("nombre");
