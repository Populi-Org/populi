-- CreateTable
CREATE TABLE "deputies" (
    "id" SERIAL NOT NULL,
    "dep_id" INTEGER NOT NULL,
    "dep_cad_id" INTEGER,
    "dep_nome_parlamentar" TEXT NOT NULL,
    "dep_nome_completo" TEXT NOT NULL,
    "dep_cp_id" INTEGER,
    "dep_cp_des" TEXT,
    "dep_cargo" TEXT,
    "leg_des" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deputies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "party_history" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "gp_id" INTEGER,
    "gp_sigla" TEXT,
    "gp_dt_inicio" TIMESTAMP(3),
    "gp_dt_fim" TIMESTAMP(3),

    CONSTRAINT "party_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_history" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "sio_des" TEXT,
    "sio_dt_inicio" TIMESTAMP(3),
    "sio_dt_fim" TIMESTAMP(3),

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dados_legis_deputado" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "dpl_grpar" TEXT,
    "dpl_lg" TEXT,
    "nome" TEXT,

    CONSTRAINT "dados_legis_deputado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "act_p" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "act_as" TEXT,
    "act_dtdeb" TIMESTAMP(3),
    "act_dtent" TIMESTAMP(3),
    "act_id" TEXT,
    "act_nr" TEXT,
    "act_sel_lg" TEXT,
    "act_sel_nr" TEXT,
    "act_tp" TEXT,
    "act_tpdesc" TEXT,

    CONSTRAINT "act_p_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audicoes" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "acc_dtaud" TIMESTAMP(3),
    "act_as" TEXT,
    "act_dtdes1" TIMESTAMP(3),
    "act_dtdes2" TIMESTAMP(3),
    "act_dtent" TIMESTAMP(3),
    "act_id" TEXT,
    "act_lg" TEXT,
    "act_loc" TEXT,
    "act_nr" TEXT,
    "act_sl" TEXT,
    "act_tp" TEXT,
    "act_tpdesc" TEXT,
    "cms_ab" TEXT,
    "cms_no" TEXT,
    "nome_entidade_externa" TEXT,
    "tev_tp" TEXT,

    CONSTRAINT "audicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiencias" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "acc_dtaud" TIMESTAMP(3),
    "act_as" TEXT,
    "act_dtdes1" TIMESTAMP(3),
    "act_dtdes2" TIMESTAMP(3),
    "act_dtent" TIMESTAMP(3),
    "act_id" TEXT,
    "act_lg" TEXT,
    "act_loc" TEXT,
    "act_nr" TEXT,
    "act_sl" TEXT,
    "act_tp" TEXT,
    "act_tpdesc" TEXT,
    "cms_ab" TEXT,
    "cms_no" TEXT,
    "nome_entidade_externa" TEXT,
    "tev_tp" TEXT,

    CONSTRAINT "audiencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cms" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "cms_cargo" TEXT,
    "cms_cd" TEXT,
    "cms_lg" TEXT,
    "cms_no" TEXT,
    "cms_situacao" TEXT,
    "cms_sub_cargo" TEXT,

    CONSTRAINT "cms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deslocacoes" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "acc_dtaud" TIMESTAMP(3),
    "act_as" TEXT,
    "act_dtdes1" TIMESTAMP(3),
    "act_dtdes2" TIMESTAMP(3),
    "act_dtent" TIMESTAMP(3),
    "act_id" TEXT,
    "act_lg" TEXT,
    "act_loc" TEXT,
    "act_nr" TEXT,
    "act_sl" TEXT,
    "act_tp" TEXT,
    "act_tpdesc" TEXT,
    "cms_ab" TEXT,
    "cms_no" TEXT,
    "nome_entidade_externa" TEXT,
    "tev_tp" TEXT,

    CONSTRAINT "deslocacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dle" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "dev_dtfim" TIMESTAMP(3),
    "dev_dtini" TIMESTAMP(3),
    "dev_id" TEXT,
    "dev_loc" TEXT,
    "dev_no" TEXT,
    "dev_sel_lg" TEXT,
    "dev_sel_nr" TEXT,
    "dev_tp" TEXT,

    CONSTRAINT "dle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "acc_dtaud" TIMESTAMP(3),
    "act_as" TEXT,
    "act_dtdes1" TIMESTAMP(3),
    "act_dtdes2" TIMESTAMP(3),
    "act_dtent" TIMESTAMP(3),
    "act_id" TEXT,
    "act_lg" TEXT,
    "act_loc" TEXT,
    "act_nr" TEXT,
    "act_sl" TEXT,
    "act_tp" TEXT,
    "act_tpdesc" TEXT,
    "cms_ab" TEXT,
    "cms_no" TEXT,
    "nome_entidade_externa" TEXT,
    "tev_tp" TEXT,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gpa" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "cga_crg" TEXT,
    "cga_dtfim" TIMESTAMP(3),
    "cga_dtini" TIMESTAMP(3),
    "gpl_id" TEXT,
    "gpl_no" TEXT,
    "gpl_sel_lg" TEXT,

    CONSTRAINT "gpa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ini" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "ini_id" TEXT,
    "ini_nr" TEXT,
    "ini_sel_lg" TEXT,
    "ini_sel_nr" TEXT,
    "ini_ti" TEXT,
    "ini_tp" TEXT,
    "ini_tpdesc" TEXT,

    CONSTRAINT "ini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intev" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "int_id" TEXT,
    "int_su" TEXT,
    "int_te" TEXT,
    "pub_dar" TEXT,
    "pub_dtreu" TIMESTAMP(3),
    "pub_lg" TEXT,
    "pub_nr" TEXT,
    "pub_sl" TEXT,
    "pub_tp" TEXT,
    "tin_ds" TEXT,

    CONSTRAINT "intev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parlamento_jovens" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "circulo_eleitoral" TEXT,
    "data" TIMESTAMP(3),
    "estabelecimento" TEXT,
    "legislatura" TEXT,
    "sessao" TEXT,
    "tipo_reuniao" TEXT,

    CONSTRAINT "parlamento_jovens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "req" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "req_as" TEXT,
    "req_dt" TIMESTAMP(3),
    "req_id" TEXT,
    "req_lg" TEXT,
    "req_nr" TEXT,
    "req_per_tp" TEXT,
    "req_sl" TEXT,
    "req_tp" TEXT,

    CONSTRAINT "req_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scgt" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "ccm_dscom" TEXT,
    "cms_cargo" TEXT,
    "cms_situacao" TEXT,
    "scm_cd" TEXT,
    "scm_com_cd" TEXT,
    "scm_com_lg" TEXT,

    CONSTRAINT "scgt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rel_autores_pareceres" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,

    CONSTRAINT "rel_autores_pareceres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rel_contas_publicas" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,

    CONSTRAINT "rel_contas_publicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rel_iniciativas" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "acc_dtrel" TIMESTAMP(3),
    "ini_id" TEXT,
    "ini_nr" TEXT,
    "ini_sel_lg" TEXT,
    "ini_ti" TEXT,
    "ini_tp" TEXT,
    "rel_fase" TEXT,

    CONSTRAINT "rel_iniciativas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rel_ini_europeias" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "ine_data_relatorio" TIMESTAMP(3),
    "ine_id" TEXT,
    "ine_referencia" TEXT,
    "ine_titulo" TEXT,
    "leg" TEXT,

    CONSTRAINT "rel_ini_europeias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rel_peticoes" (
    "id" SERIAL NOT NULL,
    "deputy_id" INTEGER NOT NULL,
    "pec_dtrelf" TIMESTAMP(3),
    "pet_aspet" TEXT,
    "pet_id" TEXT,
    "pet_nr" TEXT,
    "pet_sel_lg_pk" TEXT,
    "pet_sel_nr_pk" TEXT,

    CONSTRAINT "rel_peticoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "deputies_dep_id_key" ON "deputies"("dep_id");

-- CreateIndex
CREATE INDEX "deputies_dep_nome_parlamentar_idx" ON "deputies"("dep_nome_parlamentar");

-- CreateIndex
CREATE INDEX "deputies_dep_cp_des_idx" ON "deputies"("dep_cp_des");

-- CreateIndex
CREATE INDEX "party_history_gp_sigla_idx" ON "party_history"("gp_sigla");

-- AddForeignKey
ALTER TABLE "party_history" ADD CONSTRAINT "party_history_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dados_legis_deputado" ADD CONSTRAINT "dados_legis_deputado_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_p" ADD CONSTRAINT "act_p_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audicoes" ADD CONSTRAINT "audicoes_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias" ADD CONSTRAINT "audiencias_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cms" ADD CONSTRAINT "cms_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deslocacoes" ADD CONSTRAINT "deslocacoes_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dle" ADD CONSTRAINT "dle_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gpa" ADD CONSTRAINT "gpa_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ini" ADD CONSTRAINT "ini_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intev" ADD CONSTRAINT "intev_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parlamento_jovens" ADD CONSTRAINT "parlamento_jovens_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "req" ADD CONSTRAINT "req_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scgt" ADD CONSTRAINT "scgt_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rel_autores_pareceres" ADD CONSTRAINT "rel_autores_pareceres_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rel_contas_publicas" ADD CONSTRAINT "rel_contas_publicas_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rel_iniciativas" ADD CONSTRAINT "rel_iniciativas_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rel_ini_europeias" ADD CONSTRAINT "rel_ini_europeias_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rel_peticoes" ADD CONSTRAINT "rel_peticoes_deputy_id_fkey" FOREIGN KEY ("deputy_id") REFERENCES "deputies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
