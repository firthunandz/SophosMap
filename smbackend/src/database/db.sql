-- Eliminar tablas existentes si las hay (para idempotencia)
DROP TABLE IF EXISTS user_favorites;
DROP TABLE IF EXISTS users;

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE philosophers (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fecha_nacimiento VARCHAR(255),
    fecha_muerte VARCHAR(255),
    lugar_nacimiento VARCHAR(255),
    lugar_muerte VARCHAR(255),
    escuela VARCHAR(255),
    era VARCHAR(255),
    religion VARCHAR(255),
    notas TEXT,
    lang VARCHAR(5) NOT NULL DEFAULT 'es'
);

-- Tabla de favoritos (solo almacena nombres de filósofos del JSON)
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  philosopher_id INTEGER NOT NULL REFERENCES philosophers(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, philosopher_id)
);


-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para users
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Índices para mejor performance
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);