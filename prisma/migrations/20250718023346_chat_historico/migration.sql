-- CreateTable
CREATE TABLE "ChatHistorico" (
    "id" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "expediente" TEXT,
    "mensajes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatHistorico_folio_key" ON "ChatHistorico"("folio");
