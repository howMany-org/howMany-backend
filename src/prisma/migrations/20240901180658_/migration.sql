/*
  Warnings:

  - A unique constraint covering the columns `[app_id]` on the table `game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[steam_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_app_id_key" ON "game"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_steam_id_key" ON "user"("steam_id");
