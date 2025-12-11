/*
  Warnings:

  - You are about to drop the `MessageRead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageRead" DROP CONSTRAINT "MessageRead_userId_fkey";

-- DropTable
DROP TABLE "MessageRead";

-- CreateTable
CREATE TABLE "TelegramConversation" (
    "chatId" TEXT NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "formData" JSONB DEFAULT '{}',
    "manualMode" BOOLEAN NOT NULL DEFAULT false,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramConversation_pkey" PRIMARY KEY ("chatId")
);
