-- ==============================================================================
-- SCRIPT DDL POSTGRESQL - GAMEHUB (EXECUTAR NO NEON / SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. Tabela de Jogos
CREATE TABLE IF NOT EXISTS tb_jogo (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nome_en VARCHAR(150),
    categoria VARCHAR(80) NOT NULL,
    categoria_en VARCHAR(80),
    imagem TEXT NOT NULL,
    fundo TEXT,
    nota NUMERIC(3, 1),
    lancado BOOLEAN DEFAULT TRUE,
    desenvolvedora VARCHAR(100),
    lancamento VARCHAR(20),
    plataformas VARCHAR(200),
    idiomas TEXT,
    idiomas_en TEXT,
    dublado BOOLEAN DEFAULT FALSE,
    legendado BOOLEAN DEFAULT TRUE,
    trailer TEXT,
    trailer_url TEXT,
    descricao_curta TEXT,
    descricao_curta_en TEXT,
    descricao_longa TEXT,
    descricao_longa_en TEXT
);

-- 2. Tabela de Usuários com restrição de e-mail UNIQUE
CREATE TABLE IF NOT EXISTS tb_usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuario_email ON tb_usuario(email);

-- 3. Tabela de Comentários (Relacionamento com Jogos e Usuários)
CREATE TABLE IF NOT EXISTS tb_comentario (
    id BIGSERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    data_criacao TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    jogo_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_comentario_jogo FOREIGN KEY (jogo_id) REFERENCES tb_jogo(id) ON DELETE CASCADE,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (usuario_id) REFERENCES tb_usuario(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comentario_jogo_id ON tb_comentario(jogo_id);
