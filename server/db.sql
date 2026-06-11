-- DROP TABLES IF EXIST TO INITIALIZE
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS punches;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;

-- CREATE USERS TABLE
CREATE TABLE users (
  id VARCHAR(100) PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL
);

-- CREATE PERMISSIONS TABLE
CREATE TABLE permissions (
  role VARCHAR(50) PRIMARY KEY,
  dashboard BOOLEAN DEFAULT TRUE,
  catalog BOOLEAN DEFAULT TRUE,
  scanner BOOLEAN DEFAULT TRUE,
  map BOOLEAN DEFAULT TRUE,
  admin BOOLEAN DEFAULT FALSE,
  manage_punches BOOLEAN DEFAULT FALSE,
  manage_documents BOOLEAN DEFAULT FALSE,
  view_logs BOOLEAN DEFAULT FALSE,
  manage_permissions BOOLEAN DEFAULT FALSE
);

-- CREATE PUNCHES TABLE
CREATE TABLE punches (
  id VARCHAR(100) PRIMARY KEY,
  reference VARCHAR(50) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(100) NOT NULL,
  metal_id VARCHAR(50) NOT NULL,
  titre_id VARCHAR(50),
  categorie_id VARCHAR(50) NOT NULL,
  date_vigueur VARCHAR(50) NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  legal_ref VARCHAR(100) NOT NULL,
  different_info TEXT,
  place_different VARCHAR(100)
);

-- CREATE DOCUMENTS TABLE
CREATE TABLE documents (
  id VARCHAR(100) PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date_publication VARCHAR(50) NOT NULL,
  contenu TEXT NOT NULL
);

-- CREATE ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
  id VARCHAR(100) PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  entity_name VARCHAR(100) NOT NULL,
  timestamp VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  user_role VARCHAR(50) NOT NULL
);

-- INSERT SEED DATA FOR USERS
INSERT INTO users (id, nom, email, password, role) VALUES
('u-admin', 'Chérif Alami', 'admin@douane.gov.ma', 'admin123', 'ADMIN'),
('u-expert', 'Meryem Benjelloun', 'expert@douane.gov.ma', 'expert123', 'EXPERT'),
('u-agent', 'Youssef Naciri', 'agent@douane.gov.ma', 'agent123', 'AGENT'),
('u-vendeur', 'Bijouterie Royale', 'vendeur@bijouterie.ma', 'vendeur123', 'VENDEUR');

-- INSERT SEED DATA FOR PERMISSIONS
INSERT INTO permissions (role, dashboard, catalog, scanner, map, admin, manage_punches, manage_documents, view_logs, manage_permissions) VALUES
('ADMIN', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('EXPERT', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE),
('AGENT', TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE),
('VENDEUR', TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE),
('PUBLIC', TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE);

-- INSERT SEED DATA FOR PUNCHES
INSERT INTO punches (id, reference, nom, description, image, metal_id, titre_id, categorie_id, date_vigueur, actif, legal_ref, place_different, different_info) VALUES
('p-poisson', 'Fig. 1', 'Poisson (Platine 950‰)', 'Poinçon officiel pour les ouvrages en platine. Représente un poisson de profil droit nageant.', 'poisson', 'm-platine', 't-platine-950', 'c-platine', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Sous le corps du poisson.', 'Casablanca (sans lettre), Fès (lettre F sous le corps), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-mulet-1', 'Fig. 2', 'Tête de Mulet - 1er Titre (Or 920‰)', 'Ouvrages en or de premier titre (920/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre ''1'' inscrit sur son cou.', 'mulet-1', 'm-or', 't-or-920', 'c-or-1er', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Entre le cou et la tête, sur le fond.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-mulet-2', 'Fig. 3', 'Tête de Mulet - 2ème Titre (Or 840‰)', 'Ouvrages en or de deuxième titre (840/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre ''2'' inscrit sur son cou.', 'mulet-2', 'm-or', 't-or-840', 'c-or-2e', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Entre le cou et la tête, sur le fond.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-mulet-3', 'Fig. 4', 'Tête de Mulet - 3ème Titre (Or 750‰)', 'Ouvrages en or de troisième titre (750/1000) essayés à la coupelle. Représente une tête de mulet tournée vers la gauche avec le chiffre ''3'' inscrit sur son cou.', 'mulet-3', 'm-or', 't-or-750', 'c-or-3e', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Entre le cou et la tête, sur le fond.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-gazelle', 'Fig. 5', 'Tête de Gazelle (Or Petite Garantie)', 'Ouvrages en or essayés au touchau (Petite Garantie). Représente une tête de gazelle gracile tournée vers la droite de profil.', 'gazelle', 'm-or', NULL, 'c-or-petite', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Au-dessous de la tête.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-papillon', 'Fig. 6', 'Papillon (Or Importation)', 'Poinçon unique d''importation pour les ouvrages en or importés de l''étranger. Représente un papillon stylisé aux ailes déployées vu de dessus.', 'papillon', 'm-or', NULL, 'c-or-import', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Au-dessous de l''aile gauche.', 'La marque du différent régional est apposée à côté du poinçon principal lors du dédouanement.'),
('p-vache-1', 'Fig. 7', 'Tête de Vache - 1er Titre (Argent 950‰)', 'Ouvrages en argent de premier titre (950/1000) essayés à la coupelle. Représente une tête de vache tournée vers la gauche avec le chiffre ''1'' gravé sur son cou.', 'vache-1', 'm-argent', 't-argent-950', 'c-argent-1er', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Au-dessous de la tête.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-vache-2', 'Fig. 8', 'Tête de Vache - 2ème Titre (Argent 800‰)', 'Ouvrages en argent de deuxième titre (800/1000) essayés à la coupelle. Représente une tête de vache tournée vers la gauche avec le chiffre ''2'' gravé sur son cou.', 'vache-2', 'm-argent', 't-argent-800', 'c-argent-2e', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Au-dessous de la tête.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-belier', 'Fig. 9', 'Tête de Bélier (Argent Petite Garantie)', 'Ouvrages en argent essayés au touchau (Petite Garantie). Représente de profil droit une tête de bélier avec ses cornes enroulées.', 'belier', 'm-argent', NULL, 'c-argent-petite', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Dans l''angle inférieur gauche de la cellule.', 'Casablanca (sans lettre), Fès (lettre F), Marrakech (lettre M), Agadir (lettre A), Tanger (lettre T).'),
('p-vautour', 'Fig. 10', 'Vautour (Argent Importation)', 'Poinçon unique d''importation pour les ouvrages en argent importés. Représente un vautour debout de face, tête tournée.', 'vautour', 'm-argent', NULL, 'c-argent-import', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Derrière la tête, dans l''angle supérieur droit.', 'Appliqué par les bureaux frontaliers de douane.'),
('p-palme', 'Fig. 11', 'Palme (Poinçon de Recence)', 'Poinçon de recence pour les ouvrages se trouvant au Maroc dans le commerce et déjà revêtus de poinçons en usage avant le Dahir du 1er octobre 1925. Représente une palme (feuille de palmier).', 'palme', 'm-autre', NULL, 'c-recence', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Dans la partie supérieure gauche.', 'Poinçon historique utilisé lors des recensements de stocks d''orfèvrerie.'),
('p-hibou', 'Fig. 12', 'Hibou Grand-Duc (Poinçon Hors Titre)', 'Poinçon pour les ouvrages déjà importés avant le Dahir du 1er octobre 1925 et qui étaient au-dessous du titre légal minimum. Représente un hibou grand-duc de face.', 'hibou', 'm-autre', NULL, 'c-hors-titre', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Au-dessus de la tête.', 'Poinçon exceptionnel de tolérance historique.'),
('p-vase', 'Fig. 13', 'Vase (Objets d''Art)', 'Poinçon spécifique pour les objets d''art ou de curiosité. Représente un vase classique ornemental muni de deux anses.', 'vase', 'm-autre', NULL, 'c-objets-art', '1977-10-09', TRUE, 'Dahir N° 1.77.340', 'Dans la partie supérieure entre les anses.', 'Utilisé pour les pièces uniques d''orfèvrerie d''art historique ou de grande valeur patrimoniale.');

-- INSERT SEED DATA FOR DOCUMENTS
INSERT INTO documents (id, titre, description, date_publication, contenu) VALUES
('doc-dahir-1977', 'Dahir portant loi n° 1.77.340 du 25 Chaoual 1397 (9 octobre 1977)', 'Réglementation des titres et contrôle de garantie des métaux précieux en République du Maroc.', '1977-10-09', 'Le présent Dahir détermine les conditions de fabrication, de contrôle de titre et de poinçonnement de garantie pour tous les ouvrages d''or, d''argent et de platine fabriqués ou importés au Maroc.
    
Principaux points :
- Fixation des titres légaux : Platine (950‰), Or (920‰, 840‰, 750‰) et Argent (950‰, 800‰).
- Obligation du poinçonnement de titre par la coupelle ou le touchau par les agents de l''administration douanière.
- Définition des sanctions en cas de contrefaçon de poinçons de l''État.'),
('doc-arrete-1977', 'Arrêté du Ministre des Finances n° 1309-77 du 25 Chaoual 1397 (9 octobre 1977)', 'Définition des empreintes officielles des poinçons de titre et de garantie applicables.', '1977-10-09', 'Cet arrêté ministériel officialise les dessins et les caractéristiques géométriques des poinçons (Fig 1 à Fig 13), leurs représentations animales (Poisson, Mulet, Gazelle, Papillon, Vache, Bélier, Vautour, Palme, Hibou, Vase) ainsi que la position du différent (lettre spécifique à chaque bureau régional de douane).');
