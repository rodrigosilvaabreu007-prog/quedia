-- Script de criação do banco de dados EventHub (PostgreSQL)

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    cidade VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'organizador' ou 'comum'
    nome_organizacao VARCHAR(100),
    interesses TEXT[],
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preferencias_tema (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    modo VARCHAR(10) NOT NULL, -- 'claro' ou 'escuro'
    cor_principal VARCHAR(20) NOT NULL,
    cor_fundo VARCHAR(20) NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    classe_principal VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(50) NOT NULL
);

CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id),
    gratuito BOOLEAN NOT NULL,
    preco DECIMAL(10,2),
    imagem VARCHAR(255),
    organizador_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interesses (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
