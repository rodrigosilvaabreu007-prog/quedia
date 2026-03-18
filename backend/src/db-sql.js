const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

// Criar/conectar ao banco SQLite
const dbPath = path.join(__dirname, '../usuarios.db');
const db = new Database(dbPath);

console.log(`📦 Banco de dados: ${dbPath}`);

// Criar tabelas se não existirem
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    estado TEXT,
    cidade TEXT,
    tipo TEXT DEFAULT 'comum',
    preferencias TEXT,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    estado TEXT,
    cidade TEXT NOT NULL,
    endereco TEXT,
    data TEXT,
    horario TEXT,
    categoria TEXT,
    subcategorias TEXT,
    gratuito BOOLEAN,
    preco REAL,
    imagem TEXT,
    organizador_id INTEGER,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(organizador_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS interesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    evento_id INTEGER NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(evento_id) REFERENCES eventos(id)
  );
`);

// Preparar consultas
const stmts = {
  insertUsuario: db.prepare(`
    INSERT INTO usuarios (nome, email, senha, estado, cidade, preferencias, tipo)
    VALUES (?, ?, ?, ?, ?, ?, 'comum')
  `),
  selectUsuarioEmail: db.prepare('SELECT * FROM usuarios WHERE email = ?'),
  selectUsuarioId: db.prepare('SELECT * FROM usuarios WHERE id = ?'),
  selectAllUsuarios: db.prepare('SELECT id, nome, email FROM usuarios'),
  updateUsuario: db.prepare(`
    UPDATE usuarios SET nome=?, email=?, estado=?, cidade=?, preferencias=?
    WHERE id=?
  `),
  deleteUsuario: db.prepare('DELETE FROM usuarios WHERE id = ?'),
  
  insertEvento: db.prepare(`
    INSERT INTO eventos (nome, descricao, estado, cidade, endereco, data, horario, categoria, subcategorias, gratuito, preco, imagem, organizador_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  selectAllEventos: db.prepare('SELECT * FROM eventos'),
  selectEvento: db.prepare('SELECT * FROM eventos WHERE id = ?'),
  selectEventosPorOrganizador: db.prepare('SELECT * FROM eventos WHERE organizador_id = ?'),
  updateEvento: db.prepare(`
    UPDATE eventos SET nome=?, descricao=?, estado=?, cidade=?, endereco=?, data=?, horario=?, categoria=?, gratuito=?, preco=?, imagem=?
    WHERE id=?
  `),
  deleteEvento: db.prepare('DELETE FROM eventos WHERE id = ?'),
  
  insertInteresse: db.prepare(`
    INSERT INTO interesses (usuario_id, evento_id) VALUES (?, ?)
  `),
  countInteresses: db.prepare('SELECT COUNT(*) as total FROM interesses WHERE evento_id = ?'),
  selectInteresses: db.prepare('SELECT COUNT(*) as total FROM interesses WHERE evento_id = ? AND usuario_id = ?')
};

// Exported functions
module.exports = {
  // Usuários
  registrarUsuario: async (dados) => {
    const { nome, email, senha, estado, cidade, preferencias } = dados;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const prefs = Array.isArray(preferencias) ? JSON.stringify(preferencias) : '[]';
    
    try {
      const result = stmts.insertUsuario.run(nome, email, senhaCriptografada, estado, cidade, prefs);
      console.log(`✓ Usuário cadastrado: ${email}`);
      return result.lastID;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        throw new Error('Email já cadastrado');
      }
      throw err;
    }
  },

  autenticarUsuario: async (email, senha) => {
    const usuario = stmts.selectUsuarioEmail.get(email);
    if (!usuario) {
      console.log(`❌ Email não encontrado: ${email}`);
      return null;
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log(`❌ Senha inválida para: ${email}`);
      return null;
    }

    console.log(`✓ Login bem-sucedido: ${email}`);
    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      cidade: usuario.cidade,
      estado: usuario.estado,
      preferencias: usuario.preferencias ? JSON.parse(usuario.preferencias) : []
    };
  },

  verificarEmailExistente: (email) => {
    return !!stmts.selectUsuarioEmail.get(email);
  },

  atualizarUsuario: (id, dados) => {
    const { nome, email, estado, cidade, preferencias } = dados;
    const prefs = Array.isArray(preferencias) ? JSON.stringify(preferencias) : '[]';
    
    try {
      // Verificar se o email já existe em outro usuário
      const usuarioExistente = stmts.selectUsuarioEmail.get(email);
      if (usuarioExistente && usuarioExistente.id !== id) {
        throw new Error('Email já cadastrado');
      }
      
      stmts.updateUsuario.run(nome, email, estado, cidade, prefs, id);
      
      // Retornar usuário atualizado
      const usuarioAtualizado = stmts.selectUsuarioId.get(id);
      if (!usuarioAtualizado) return null;
      
      return {
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo,
        cidade: usuarioAtualizado.cidade,
        estado: usuarioAtualizado.estado,
        preferencias: usuarioAtualizado.preferencias ? JSON.parse(usuarioAtualizado.preferencias) : []
      };
    } catch (err) {
      console.error(`❌ Erro ao atualizar usuário:`, err.message);
      throw err;
    }
  },

  deletarUsuario: (id) => {
    try {
      const usuario = stmts.selectUsuarioId.get(id);
      if (!usuario) return false;
      
      stmts.deleteUsuario.run(id);
      console.log(`✓ Usuário deletado: ID ${id}`);
      return true;
    } catch (err) {
      console.error(`❌ Erro ao deletar usuário:`, err.message);
      throw err;
    }
  },

  // Eventos
  cadastrarEvento: (dados) => {
    const {
      nome, descricao, estado, cidade, endereco, data, horario, 
      gratuito, preco, organizador_id, categoria, subcategorias, imagem
    } = dados;
    
    const subcategoriasJson = Array.isArray(subcategorias) ? subcategorias.join(',') : '';
    
    try {
      const result = stmts.insertEvento.run(
        nome, descricao, estado, cidade, endereco, data, horario,
        categoria, subcategoriasJson, gratuito ? 1 : 0, preco || 0, imagem || '', organizador_id || 1
      );
      console.log(`✓ Evento cadastrado: ${nome}`);
      return result.lastID;
    } catch (err) {
      console.error(`❌ Erro ao cadastrar evento:`, err.message);
      throw err;
    }
  },

  listarEventos: () => {
    return stmts.selectAllEventos.all();
  },

  obterEvento: (id) => {
    return stmts.selectEvento.get(id);
  },

  obterEventosPorOrganizador: (organizador_id) => {
    return stmts.selectEventosPorOrganizador.all(organizador_id);
  },

  atualizarEvento: (id, dados) => {
    const { nome, descricao, estado, cidade, endereco, data, horario, gratuito, preco, imagem } = dados;
    stmts.updateEvento.run(
      nome, descricao, estado, cidade, endereco, data, horario, 'categoria', gratuito ? 1 : 0, preco, imagem, id
    );
  },

  deletarEvento: (id) => {
    stmts.deleteEvento.run(id);
  },

  // Interesses
  marcarInteresse: (usuario_id, evento_id) => {
    try {
      stmts.insertInteresse.run(usuario_id, evento_id);
      return true;
    } catch (err) {
      // Interesse já existe, ok
      return true;
    }
  },

  contarInteressados: (evento_id) => {
    const result = stmts.countInteresses.get(evento_id);
    return result.total;
  },

  verificarInteresse: (usuario_id, evento_id) => {
    const result = stmts.selectInteresses.get(evento_id, usuario_id);
    return result.total > 0;
  }
};
