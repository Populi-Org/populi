-- CreateTable
CREATE TABLE "legislative_initiatives" (
    "id" SERIAL NOT NULL,
    "ini_id" INTEGER NOT NULL,
    "ini_nr" TEXT,
    "ini_titulo" TEXT NOT NULL,
    "ini_desc_tipo" TEXT,
    "ini_tipo" TEXT,
    "ini_leg" TEXT,
    "ini_epigrafe" TEXT,
    "ini_obs" TEXT,
    "ini_link_texto" TEXT,
    "data_inicio_leg" TIMESTAMP(3),
    "data_fim_leg" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "legislative_initiatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiative_authors" (
    "id" SERIAL NOT NULL,
    "initiative_id" INTEGER NOT NULL,
    "author_type" TEXT NOT NULL,
    "author_name" TEXT,
    "author_sigla" TEXT,

    CONSTRAINT "initiative_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiative_events" (
    "id" SERIAL NOT NULL,
    "initiative_id" INTEGER NOT NULL,
    "evt_id" TEXT,
    "codigo_fase" TEXT,
    "fase" TEXT,
    "data_fase" TIMESTAMP(3),
    "comissao" TEXT,
    "oev_id" TEXT,
    "obs_fase" TEXT,

    CONSTRAINT "initiative_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "initiative_votes" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "vote_id" TEXT,
    "data" TIMESTAMP(3),
    "resultado" TEXT,
    "detalhe" TEXT,
    "descricao" TEXT,
    "reuniao" TEXT,
    "tipo_reuniao" TEXT,
    "unanime" TEXT,

    CONSTRAINT "initiative_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legislative_initiatives_ini_id_key" ON "legislative_initiatives"("ini_id");

-- CreateIndex
CREATE INDEX "legislative_initiatives_ini_desc_tipo_idx" ON "legislative_initiatives"("ini_desc_tipo");

-- CreateIndex
CREATE INDEX "legislative_initiatives_ini_tipo_idx" ON "legislative_initiatives"("ini_tipo");

-- AddForeignKey
ALTER TABLE "initiative_authors" ADD CONSTRAINT "initiative_authors_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "legislative_initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiative_events" ADD CONSTRAINT "initiative_events_initiative_id_fkey" FOREIGN KEY ("initiative_id") REFERENCES "legislative_initiatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "initiative_votes" ADD CONSTRAINT "initiative_votes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "initiative_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
