-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "steamId" BIGINT NOT NULL,
    "steamName" TEXT NOT NULL,
    "steamJoinDate" TIMESTAMP(3) NOT NULL,
    "avatarHash" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_steamId_key" ON "User"("steamId");
