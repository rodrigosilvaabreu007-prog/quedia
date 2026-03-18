const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Função para cadastrar evento
async function cadastrarEvento(dados) {
  const {
    nome,
    descricao,
    cidade,
    endereco,
    data,
    horario,
    categoria_principal,
    subcategoria,
    gratuito,
    preco,
    imagem,
    organizador_id
  } = dados;

  // Busca ou cria categoria
  let categoriaId;
  const catRes = await pool.query({
    text: 'SELECT id FROM categorias WHERE classe_principal = $1 AND subcategoria = $2',
    values: [categoria_principal, subcategoria]
  });
  if (catRes.rows.length > 0) {
    categoriaId = catRes.rows[0].id;
  } else {
    const newCat = await pool.query({
      text: 'INSERT INTO categorias (classe_principal, subcategoria) VALUES ($1, $2) RETURNING id',
      values: [categoria_principal, subcategoria]
    });
    categoriaId = newCat.rows[0].id;
  }

  const query = {
    text: `INSERT INTO eventos
      (nome, descricao, cidade, endereco, data, horario, categoria_id, gratuito, preco, imagem, organizador_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    values: [nome, descricao, cidade, endereco, data, horario, categoriaId, gratuito, preco || 0, imagem || null, organizador_id || null]
  };
  const result = await pool.query(query);
  return result.rows[0].id;
}

// Função para listar eventos
async function listarEventos(filtros = {}) {
  let query = 'SELECT * FROM eventos';
  let conditions = [];
  let values = [];
  let idx = 1;
  if (filtros.cidade) {
    conditions.push(`cidade = $${idx++}`);
    values.push(filtros.cidade);
  }
  if (filtros.data) {
    conditions.push(`data = $${idx++}`);
    values.push(filtros.data);
  }
  if (filtros.categoria_principal) {
    conditions.push(`categoria_id IN (SELECT id FROM categorias WHERE classe_principal = $${idx++})`);
    values.push(filtros.categoria_principal);
  }
  if (filtros.subcategoria) {
    conditions.push(`categoria_id IN (SELECT id FROM categorias WHERE subcategoria = $${idx++})`);
    values.push(filtros.subcategoria);
  }
  if (filtros.gratuito) {
    conditions.push(`gratuito = true`);
  }
  if (filtros.preco_max) {
    conditions.push(`preco <= $${idx++}`);
    values.push(filtros.preco_max);
  }
  if (filtros.organizador_id) {
    conditions.push(`organizador_id = $${idx++}`);
    values.push(filtros.organizador_id);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY data ASC';
  const result = await pool.query(query, values);
  return result.rows;
}

// Editar evento
async function editarEvento(evento_id, dados, usuario_id) {
  // Só permite editar se for o organizador
  const res = await pool.query('SELECT organizador_id FROM eventos WHERE id = $1', [evento_id]);
  if (!res.rows.length || res.rows[0].organizador_id != usuario_id) throw new Error('Não autorizado');
  const {
    nome, descricao, cidade, endereco, data, horario, categoria_principal, subcategoria, gratuito, preco, imagem
  } = dados;
  // Atualiza categoria se necessário
  let categoriaId;
  if (categoria_principal && subcategoria) {
    const catRes = await pool.query({
      text: 'SELECT id FROM categorias WHERE classe_principal = $1 AND subcategoria = $2',
      values: [categoria_principal, subcategoria]
    });
    if (catRes.rows.length > 0) {
      categoriaId = catRes.rows[0].id;
    } else {
      const newCat = await pool.query({
        text: 'INSERT INTO categorias (classe_principal, subcategoria) VALUES ($1, $2) RETURNING id',
        values: [categoria_principal, subcategoria]
      });
      categoriaId = newCat.rows[0].id;
    }
  }
  await pool.query({
    text: `UPDATE eventos SET nome=$1, descricao=$2, cidade=$3, endereco=$4, data=$5, horario=$6, categoria_id=$7, gratuito=$8, preco=$9, imagem=$10 WHERE id=$11`,
    values: [nome, descricao, cidade, endereco, data, horario, categoriaId, gratuito, preco || 0, imagem || null, evento_id]
  });
}

// Excluir evento
async function excluirEvento(evento_id, usuario_id) {
  // Só permite excluir se for o organizador
  const res = await pool.query('SELECT organizador_id FROM eventos WHERE id = $1', [evento_id]);
  if (!res.rows.length || res.rows[0].organizador_id != usuario_id) throw new Error('Não autorizado');
  await pool.query('DELETE FROM eventos WHERE id = $1', [evento_id]);
}

module.exports = {
  cadastrarEvento,
  listarEventos
  , editarEvento
  , excluirEvento
};
