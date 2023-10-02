DROP TABLE IF EXISTS "info_arq";
DROP SEQUENCE IF EXISTS info_arq_id_seq;
CREATE SEQUENCE info_arq_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."info_arq" (
    "id" integer DEFAULT nextval('info_arq_id_seq') NOT NULL,
    "cliente" text,
    "bandeja" text,
    "temp_total" numeric,
    "min_bdj" text,
    "temp_memoria" numeric,
    "mem_fail" integer,
    "memo_index" jsonb,
    "inspec_fail" jsonb,
    "cam_erro" integer,
    "pos_rfg" jsonb,
    "data_insercao" timestamp,
    "type_memory" text,
    "quant_memory" numeric,
    CONSTRAINT "info_arq_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "info_arq" ("id", "cliente", "bandeja", "temp_total", "min_bdj", "temp_memoria", "mem_fail", "memo_index", "inspec_fail", "cam_erro", "pos_rfg", "data_insercao", "type_memory", "quant_memory") VALUES
(1,	'WINTRONIC',	'20',	30.00,	'02:00',	1.00,	20,	'{"1": "1", "2": "2", "3": "3"}',	'{"1": "1", "2": "2", "3": "3"}',	20,	'{"1": "1", "2": "2", "3": "3"}',	'2023-09-30 15:45:30',	'udimm',	80),
(2,	'WINTRONIC',	'12',	300.00,	'03:00',	0.30,	25,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	10,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 17:45:30',	'udimm',	80),
(3,	'AMD',	'5',	15.00,	'03:00',	0.50,	30,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	20,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 15:45:30',	'udimm',	90),
(4,	'AMD',	'5',	15.00,	'03:00',	0.50,	30,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	20,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 20:15:30',	'udimm',	90),
(5,	'AMD',	'5',	15.00,	'03:00',	0.50,	30,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	20,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 05:10:30',	'udimm',	140),
(6,	'WINTRONIC',	'12',	300.00,	'03:00',	0.30,	25,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	10,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 17:12:30',	'udimm',	80),
(7,	'WINTRONIC',	'12',	300.00,	'03:00',	0.30,	25,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	10,	'{"1": "1", "2": "2", "3": "3", "4": "4"}',	'2023-09-30 17:20:30',	'udimm',	80);

-- 2023-10-01 20:48:57.142559+00