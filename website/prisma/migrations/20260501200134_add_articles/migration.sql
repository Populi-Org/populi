-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "section" TEXT,
    "published_at" TIMESTAMP(3),
    "authors" TEXT,
    "lead" TEXT,
    "has_picture" BOOLEAN NOT NULL DEFAULT false,
    "article_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "articles_deputy_id_idx" ON "articles"("deputy_id");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "articles_deputy_id_url_key" ON "articles"("deputy_id", "url");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
