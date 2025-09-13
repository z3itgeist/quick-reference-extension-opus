BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "UJD" (
	"id"	INTEGER,
	"id_operacao"	INTEGER NOT NULL,
	"tipo_contato"	TEXT NOT NULL,
	"nome_contato"	TEXT NOT NULL,
	"info_copiavel"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("id_operacao") REFERENCES "operacoes"("id")
);
CREATE TABLE IF NOT EXISTS "operacoes" (
	"id"	INTEGER UNIQUE,
	"operacao"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "UJD" VALUES (1,1,'Exames de imagem','Icon: RX, RM, US','(11) 3109-7100');
INSERT INTO "UJD" VALUES (2,1,'Exames de imagem','Pinheiros: RM, US, TM, Mamografia','(11) 4523-4700');
INSERT INTO "UJD" VALUES (3,1,'Exames de imagem','Unica: US, Mamografia, Densitometria','(11) 4523-3636');
INSERT INTO "UJD" VALUES (4,1,'Exames laboratoriais','Laboratorio AFIP/Vila Arens','Laboratorio AFIP (11) 4527-3299 ...');
INSERT INTO "UJD" VALUES (5,1,'Exames laboratoriais','Laboratorio Eloy Chaves','Laboratorio Eloy Chaves,(11) 2108-7760 ...');
INSERT INTO "UJD" VALUES (6,1,'Exames laboratoriais','Laboratorio Anchieta','Laboratorio Anchieta, (11) 4522-7327 ...');
INSERT INTO "UJD" VALUES (7,1,'Exames laboratoriais','***','AFIP (11) 4527-3299, Eloy (11) 2108-7760, Anchieta (11) 4522-7327');
INSERT INTO "UJD" VALUES (8,1,'Contatos Unimeds','Unimed Campinas','0800 013 66 88');
INSERT INTO "UJD" VALUES (9,1,'Contatos Unimeds','Unimed Central Nacional','0800 942 0011');
INSERT INTO "UJD" VALUES (10,1,'Contatos Unimeds','Unimed Seguros','0800 016 66 33');
INSERT INTO "UJD" VALUES (11,1,'Contatos Unimeds','Unimed FESP','0800 772 3030');
INSERT INTO "UJD" VALUES (12,1,'Exames cardiologicos','CD-COR','(11) 4523-1166');
INSERT INTO "UJD" VALUES (13,1,'Exames cardiologicos','JUNDCOR','(11) 4521-411');
INSERT INTO "UJD" VALUES (14,1,'Exames cardiologicos','ANGIOSCAN','(11) 4523-0468');
INSERT INTO "UJD" VALUES (15,1,'Financeiro PF, PJ, ADM','Relações Empresariais PJ','(11) 4583-1089 e (11) 4583-1099');
INSERT INTO "UJD" VALUES (16,1,'Financeiro PF, PJ, ADM','Financeiro PF','(11) 4583-0983');
INSERT INTO "UJD" VALUES (17,1,'Financeiro PF, PJ, ADM','Vendas','(11) 4583-1040');
INSERT INTO "UJD" VALUES (18,1,'Financeiro PF, PJ, ADM','ALLCARE','0800 941 4962.atendimento pelo WhatsApp (11) 3003-5200');
INSERT INTO "UJD" VALUES (19,1,'Financeiro PF, PJ, ADM','CORPORE','(11) 4349-4200 E 08009400473 OU 945024905');
INSERT INTO "UJD" VALUES (20,1,'Financeiro PF, PJ, ADM','UNICONSULT','(11) 2174-4222 ou 11 4807-5955');
INSERT INTO "UJD" VALUES (21,1,'Punção Joelho Drs','Dr. Luiz Otávio e Dr. Raul Munch','Dr. Luiz Otávio Alves (11) 4586-1499. Dr. Raul Munch Cavalcanti (11) 4521-4710');
INSERT INTO "UJD" VALUES (22,1,'AIS/NAS, AMB, LAUDOS','AIS /NAS/ AMBULATORIO','AIS/NAS/AMBULATORIO (11) 2923 9000');
INSERT INTO "UJD" VALUES (23,1,'AIS/NAS, AMB, LAUDOS','Whatsapp envio Laudos','LAUDOS WPP (11) 99496-8083');
INSERT INTO "UJD" VALUES (24,1,'PA','PA Adulto Jundiai','PA Adulto Jundiai Avenida Jundiaí, 405, Anhangabaú, Jundiaí (11) 4523-5000');
INSERT INTO "UJD" VALUES (25,1,'PA','PA Infantil Jundiai','PA Infantil RUA DOUTOR LEONARDO CAVALCANTI, 74 - CENTRO Jundiaí/SP (11) 4523-5480');
INSERT INTO "UJD" VALUES (26,1,'PA','WPP AGENDA PA VIRTUAL','WPP AGENDA PA VIRTUAL +55 21 96696-4821');
INSERT INTO "operacoes" VALUES (1,'Unimed Jundiaí');
COMMIT;
