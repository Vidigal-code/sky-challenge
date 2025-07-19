-- Criação da tabela Langs
CREATE TABLE IF NOT EXISTS Langs (
                                     lang_code VARCHAR(5) PRIMARY KEY,
    description VARCHAR(500) NOT NULL
    );

-- Criação da tabela Genres
CREATE TABLE IF NOT EXISTS Genres (
                                      id BIGSERIAL PRIMARY KEY,
                                      genre_name VARCHAR(500) NOT NULL,
    lang_code VARCHAR(5) NOT NULL,
    CONSTRAINT fk_genre_lang FOREIGN KEY (lang_code) REFERENCES Langs(lang_code) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Criação da tabela Users
CREATE TABLE IF NOT EXISTS Users (
                                     id BIGSERIAL PRIMARY KEY,
                                     full_name VARCHAR(500) NOT NULL,
    email VARCHAR(500) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    rg VARCHAR(20),
    phone VARCHAR(20),
    street VARCHAR(255),
    number VARCHAR(10),
    complement VARCHAR(500),
    neighborhood VARCHAR(500),
    city VARCHAR(500),
    state VARCHAR(500),
    postal_code VARCHAR(500),
    lang_code VARCHAR(5),
    CONSTRAINT fk_user_lang FOREIGN KEY (lang_code) REFERENCES Langs(lang_code) ON DELETE SET NULL ON UPDATE CASCADE,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    plan VARCHAR(20) DEFAULT 'super I' CHECK (plan IN ('super I', 'super II', 'top II')),
    plan_value VARCHAR(500) NOT NULL,
    has_special_needs VARCHAR(500),
    special_needs_description VARCHAR(500),
    gender VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                                    );

-- Criação da tabela Medias
CREATE TABLE IF NOT EXISTS Medias (
                                      id BIGSERIAL PRIMARY KEY,
                                      title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(10) NOT NULL CHECK (type IN ('movie', 'series')),
    release_year INTEGER NOT NULL CHECK (release_year >= 1900 AND release_year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    genre VARCHAR(255) NOT NULL,
    genre_id BIGINT NOT NULL,
    CONSTRAINT fk_media_genre FOREIGN KEY (genre_id) REFERENCES Genres(id) ON DELETE CASCADE,
    lang_code VARCHAR(5),
    CONSTRAINT fk_media_lang FOREIGN KEY (lang_code) REFERENCES Langs(lang_code) ON DELETE SET NULL ON UPDATE CASCADE,
    image_url TEXT,
    trailer_url TEXT,
    release_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                                                                               );

-- Criação da tabela Favorites
CREATE TABLE IF NOT EXISTS Favorites (
                                         id BIGSERIAL PRIMARY KEY,
                                         user_id BIGINT NOT NULL,
                                         media_id BIGINT NOT NULL,
                                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                         CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_media FOREIGN KEY (media_id) REFERENCES Medias(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_media UNIQUE (user_id, media_id)
    );

-- Criação de índices para performance
CREATE INDEX idx_medias_lang_code ON Medias(lang_code);
CREATE INDEX idx_medias_genre_id ON Medias(genre_id);
CREATE INDEX idx_favorites_user_id ON Favorites(user_id);
CREATE INDEX idx_favorites_media_id ON Favorites(media_id);

-- Inserção de idiomas na tabela Langs
INSERT INTO Langs (lang_code, description)
VALUES ('pt', 'Português'),
       ('en', 'Inglês'),
       ('es', 'Espanhol')
    ON CONFLICT (lang_code) DO NOTHING;

-- Inserção de gêneros na tabela Genres
INSERT INTO Genres (genre_name, lang_code)
VALUES ('Ficção Científica', 'pt'),
       ('Ação', 'pt'),
       ('Drama', 'pt'),
       ('Science Fiction', 'en'),
       ('Action', 'en'),
       ('Drama', 'en'),
       ('Ciencia Ficción', 'es'),
       ('Acción', 'es'),
       ('Drama', 'es');

-- Inserção de usuários na tabela Users
INSERT INTO Users (
    full_name, email, password, cpf, rg, phone,
    street, number, complement, neighborhood, city, state, postal_code,
    lang_code, role, plan, plan_value,
    has_special_needs, special_needs_description, gender
)
VALUES
    ('Kauan Vidigal', 'kauanvidigalcontato@gmail.com', 'hashed_password_placeholder',
     '529.982.247-25', '12.345.678-9', '+55 11 98765-4321',
     'Rua Augusta', '1234', 'Apto 56', 'Consolação', 'São Paulo', 'SP', '01310-100',
     'pt', 'user', 'super I', 'R$ 29,90/mês',
     'Não', NULL, 'Masculino'),
    ('Ana Silva', 'ana.silva@gmail.com', 'hashed_password_placeholder',
     '987.654.321-00', '98.765.432-1', '+55 11 91234-5678',
     'Avenida Paulista', '1000', NULL, 'Bela Vista', 'São Paulo', 'SP', '01311-000',
     'pt', 'admin', 'super I', 'R$ 29,90/mês',
     'Não', NULL, 'Feminino');

-- Inserção de 30 mídias na tabela Medias
INSERT INTO Medias (title, description, type, release_year, genre, genre_id, lang_code, image_url, trailer_url, release_date)
VALUES
-- Português (pt)
('O Código do Futuro', 'Um programador descobre uma conspiração digital.', 'movie', 2023, 'Ficção Científica', (SELECT id FROM Genres WHERE genre_name = 'Ficção Científica' AND lang_code = 'pt'), 'pt', 'https://example.com/images/codigo_futuro.jpg', 'https://example.com/trailers/codigo_futuro.mp4', '2023-06-15'),
('Guerreiros do Asfalto', 'Perseguições em alta velocidade em São Paulo.', 'movie', 2021, 'Ação', (SELECT id FROM Genres WHERE genre_name = 'Ação' AND lang_code = 'pt'), 'pt', 'https://example.com/images/guerreiros_asfalto.jpg', 'https://example.com/trailers/guerreiros_asfalto.mp4', '2021-09-10'),
('Sombras do Passado', 'Uma história de redenção e segredos.', 'movie', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'pt'), 'pt', 'https://example.com/images/sombras_passado.jpg', 'https://example.com/trailers/sombras_passado.mp4', '2020-03-22'),
('Invasores Cósmicos', 'Alienígenas invadem a Terra.', 'movie', 2024, 'Ficção Científica', (SELECT id FROM Genres WHERE genre_name = 'Ficção Científica' AND lang_code = 'pt'), 'pt', 'https://example.com/images/invasores_cosmicos.jpg', 'https://example.com/trailers/invasores_cosmicos.mp4', '2024-07-01'),
('Operação Relâmpago', 'Missão secreta contra o crime.', 'movie', 2022, 'Ação', (SELECT id FROM Genres WHERE genre_name = 'Ação' AND lang_code = 'pt'), 'pt', 'https://example.com/images/operacao_relampago.jpg', 'https://example.com/trailers/operacao_relampago.mp4', '2022-11-18'),
('Crônicas de São Paulo', 'Vidas entrelaçadas na metrópole.', 'series', 2023, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'pt'), 'pt', 'https://example.com/images/cronicas_sp.jpg', 'https://example.com/trailers/cronicas_sp.mp4', '2023-01-10'),
('Hackers do Amanhã', 'Jovens hackers enfrentam megacorporações.', 'series', 2025, 'Ficção Científica', (SELECT id FROM Genres WHERE genre_name = 'Ficção Científica' AND lang_code = 'pt'), 'pt', 'https://example.com/images/hackers_amanha.jpg', 'https://example.com/trailers/hackers_amanha.mp4', '2025-02-14'),
('Fuga Impossível', 'Um grupo planeja uma fuga audaciosa.', 'series', 2021, 'Ação', (SELECT id FROM Genres WHERE genre_name = 'Ação' AND lang_code = 'pt'), 'pt', 'https://example.com/images/fuga_impossivel.jpg', 'https://example.com/trailers/fuga_impossivel.mp4', '2021-08-30'),
('Segredos de Família', 'Mistérios em uma mansão antiga.', 'series', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'pt'), 'pt', 'https://example.com/images/segredos_familia.jpg', 'https://example.com/trailers/segredos_familia.mp4', '2020-05-05'),
('Portal Estelar', 'Viagens no tempo e espaço.', 'series', 2024, 'Ficção Científica', (SELECT id FROM Genres WHERE genre_name = 'Ficção Científica' AND lang_code = 'pt'), 'pt', 'https://example.com/images/portal_estelar.jpg', 'https://example.com/trailers/portal_estelar.mp4', '2024-10-12'),
-- Inglês (en)
('Code of Tomorrow', 'A coder uncovers a digital conspiracy.', 'movie', 2023, 'Science Fiction', (SELECT id FROM Genres WHERE genre_name = 'Science Fiction' AND lang_code = 'en'), 'en', 'https://example.com/images/code_tomorrow.jpg', 'https://example.com/trailers/code_tomorrow.mp4', '2023-06-15'),
('Highway Warriors', 'High-speed chases in New York.', 'movie', 2021, 'Action', (SELECT id FROM Genres WHERE genre_name = 'Action' AND lang_code = 'en'), 'en', 'https://example.com/images/highway_warriors.jpg', 'https://example.com/trailers/highway_warriors.mp4', '2021-09-10'),
('Shadows of the Past', 'A tale of redemption and secrets.', 'movie', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'en'), 'en', 'https://example.com/images/shadows_past.jpg', 'https://example.com/trailers/shadows_past.mp4', '2020-03-22'),
('Cosmic Invaders', 'Aliens invade Earth.', 'movie', 2024, 'Science Fiction', (SELECT id FROM Genres WHERE genre_name = 'Science Fiction' AND lang_code = 'en'), 'en', 'https://example.com/images/cosmic_invaders.jpg', 'https://example.com/trailers/cosmic_invaders.mp4', '2024-07-01'),
('Operation Thunder', 'A secret mission against crime.', 'movie', 2022, 'Action', (SELECT id FROM Genres WHERE genre_name = 'Action' AND lang_code = 'en'), 'en', 'https://example.com/images/operation_thunder.jpg', 'https://example.com/trailers/operation_thunder.mp4', '2022-11-18'),
('City Chronicles', 'Intertwined lives in a metropolis.', 'series', 2023, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'en'), 'en', 'https://example.com/images/city_chronicles.jpg', 'https://example.com/trailers/city_chronicles.mp4', '2023-01-10'),
('Future Hackers', 'Young hackers vs. megacorporations.', 'series', 2025, 'Science Fiction', (SELECT id FROM Genres WHERE genre_name = 'Science Fiction' AND lang_code = 'en'), 'en', 'https://example.com/images/future_hackers.jpg', 'https://example.com/trailers/future_hackers.mp4', '2025-02-14'),
('Escape Plan', 'A group plans a daring escape.', 'series', 2021, 'Action', (SELECT id FROM Genres WHERE genre_name = 'Action' AND lang_code = 'en'), 'en', 'https://example.com/images/escape_plan.jpg', 'https://example.com/trailers/escape_plan.mp4', '2021-08-30'),
('Family Secrets', 'Mysteries in an old mansion.', 'series', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'en'), 'en', 'https://example.com/images/family_secrets.jpg', 'https://example.com/trailers/family_secrets.mp4', '2020-05-05'),
('Stellar Gateway', 'Time and space travel adventures.', 'series', 2024, 'Science Fiction', (SELECT id FROM Genres WHERE genre_name = 'Science Fiction' AND lang_code = 'en'), 'en', 'https://example.com/images/stellar_gateway.jpg', 'https://example.com/trailers/stellar_gateway.mp4', '2024-10-12'),
-- Espanhol (es)
('El Código del Futuro', 'Un programador descubre una conspiración digital.', 'movie', 2023, 'Ciencia Ficción', (SELECT id FROM Genres WHERE genre_name = 'Ciencia Ficción' AND lang_code = 'es'), 'es', 'https://example.com/images/codigo_futuro_es.jpg', 'https://example.com/trailers/codigo_futuro_es.mp4', '2023-06-15'),
('Guerreros del Asfalto', 'Persecuciones a alta velocidad en Madrid.', 'movie', 2021, 'Acción', (SELECT id FROM Genres WHERE genre_name = 'Acción' AND lang_code = 'es'), 'es', 'https://example.com/images/guerreros_asfalto_es.jpg', 'https://example.com/trailers/guerreros_asfalto_es.mp4', '2021-09-10'),
('Sombras del Pasado', 'Una historia de redención y secretos.', 'movie', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'es'), 'es', 'https://example.com/images/sombras_pasado_es.jpg', 'https://example.com/trailers/sombras_pasado_es.mp4', '2020-03-22'),
('Invasores Cósmicos', 'Extraterrestres invaden la Tierra.', 'movie', 2024, 'Ciencia Ficción', (SELECT id FROM Genres WHERE genre_name = 'Ciencia Ficción' AND lang_code = 'es'), 'es', 'https://example.com/images/invasores_cosmicos_es.jpg', 'https://example.com/trailers/invasores_cosmicos_es.mp4', '2024-07-01'),
('Operación Relámpago', 'Misión secreta contra el crimen.', 'movie', 2022, 'Acción', (SELECT id FROM Genres WHERE genre_name = 'Acción' AND lang_code = 'es'), 'es', 'https://example.com/images/operacion_relampago_es.jpg', 'https://example.com/trailers/operacion_relampago_es.mp4', '2022-11-18'),
('Crónicas de la Ciudad', 'Vidas entrelazadas en la metrópoli.', 'series', 2023, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'es'), 'es', 'https://example.com/images/cronicas_ciudad.jpg', 'https://example.com/trailers/cronicas_ciudad.mp4', '2023-01-10'),
('Hackers del Mañana', 'Jóvenes hackers contra megacorporaciones.', 'series', 2025, 'Ciencia Ficción', (SELECT id FROM Genres WHERE genre_name = 'Ciencia Ficción' AND lang_code = 'es'), 'es', 'https://example.com/images/hackers_manana.jpg', 'https://example.com/trailers/hackers_manana.mp4', '2025-02-14'),
('Fuga Imposible', 'Un grupo planea una fuga audaz.', 'series', 2021, 'Acción', (SELECT id FROM Genres WHERE genre_name = 'Acción' AND lang_code = 'es'), 'es', 'https://example.com/images/fuga_imposible_es.jpg', 'https://example.com/trailers/fuga_imposible_es.mp4', '2021-08-30'),
('Secretos de Familia', 'Misterios en una mansión antigua.', 'series', 2020, 'Drama', (SELECT id FROM Genres WHERE genre_name = 'Drama' AND lang_code = 'es'), 'es', 'https://example.com/images/secretos_familia_es.jpg', 'https://example.com/trailers/secretos_familia_es.mp4', '2020-05-05'),
('Portal Estelar', 'Aventuras de viajes en el tiempo y el espacio.', 'series', 2024, 'Ciencia Ficción', (SELECT id FROM Genres WHERE genre_name = 'Ciencia Ficción' AND lang_code = 'es'), 'es', 'https://example.com/images/portal_estelar_es.jpg', 'https://example.com/trailers/portal_estelar_es.mp4', '2024-10-12');

/*
-- Inserção de favoritos
INSERT INTO Favorites (user_id, media_id)
VALUES ((SELECT id FROM Users WHERE email = 'kauanvidigalcontato@gmail.com'), (SELECT id FROM Medias WHERE title = 'O Código do Futuro')),
       ((SELECT id FROM Users WHERE email = 'kauanvidigalcontato@gmail.com'), (SELECT id FROM Medias WHERE title = 'Crônicas de São Paulo')),
       ((SELECT id FROM Users WHERE email = 'ana.silva@gmail.com'), (SELECT id FROM Medias WHERE title = 'Code of Tomorrow'));
*/