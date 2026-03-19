const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT
  });
}

const db = admin.firestore();

console.log('✓ Firestore conectado');

// ============ USUÁRIOS ============

async function registrarUsuario({ nome, email, senha, estado, cidade, preferencias }) {
  // Verificar se email já existe
  const usuarioExist = await db.collection('usuarios').where('email', '==', email).get();
  if (!usuarioExist.empty) {
    throw new Error('Email já cadastrado');
  }

  // Hash da senha
  const senhaHash = await bcrypt.hash(senha, 10);

  // Criar documento
  const usuarios = db.collection('usuarios');
  const docRef = await usuarios.add({
    nome,
    email,
    senha: senhaHash,
    estado: estado || 'Não informado',
    cidade: cidade || 'Não informado',
    preferencias: preferencias || [],
    tipo: 'comum',
    criado_em: admin.firestore.Timestamp.now()
  });

  console.log(`✓ Usuário registrado: ${email} (ID: ${docRef.id})`);
  return docRef.id;
}

async function autenticarUsuario(email, senha) {
  const usuarios = await db.collection('usuarios').where('email', '==', email).get();
  
  if (usuarios.empty) {
    return null;
  }

  const usuarioDoc = usuarios.docs[0];
  const usuario = { id: usuarioDoc.id, ...usuarioDoc.data() };

  // Verificar senha
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    return null;
  }

  console.log(`✓ Autenticação bem-sucedida: ${email}`);
  return usuario;
}

function verificarEmailExistente(email) {
  return db.collection('usuarios').where('email', '==', email).get().then(snapshot => !snapshot.empty);
}

async function obterUsuarioPorId(usuarioId) {
  const usuarioDoc = await db.collection('usuarios').doc(usuarioId).get();
  if (!usuarioDoc.exists) {
    return null;
  }
  return { id: usuarioDoc.id, ...usuarioDoc.data() };
}

// ============ EVENTOS ============

function cadastrarEvento({ nome, descricao, estado, cidade, endereco, data, horario, gratuito, preco, organizador_id, categoria, subcategorias, imagem }) {
  return db.collection('eventos').add({
    nome,
    descricao,
    estado: estado || 'Não informado',
    cidade,
    endereco: endereco || '',
    data,
    horario,
    categoria,
    subcategorias: subcategorias || [],
    gratuito: gratuito || false,
    preco: Number(preco) || 0,
    imagem: imagem || '',
    organizador_id,
    criado_em: admin.firestore.Timestamp.now()
  }).then(docRef => {
    console.log(`✓ Evento criado: ${nome} (ID: ${docRef.id})`);
    return docRef.id;
  });
}

async function listarEventos() {
  const snapshot = await db.collection('eventos').get();
  const eventos = [];
  snapshot.forEach(doc => {
    const evento = doc.data();
    evento.id = doc.id;
    // Converter Timestamp para string se necessário
    if (evento.criado_em) {
      evento.criado_em = evento.criado_em.toDate().toISOString();
    }
    eventos.push(evento);
  });
  return eventos;
}

async function obterEventosPorOrganizador(organizadorId) {
  const snapshot = await db.collection('eventos')
    .where('organizador_id', '==', organizadorId)
    .get();
  const eventos = [];
  snapshot.forEach(doc => {
    const evento = doc.data();
    evento.id = doc.id;
    if (evento.criado_em) {
      evento.criado_em = evento.criado_em.toDate().toISOString();
    }
    eventos.push(evento);
  });
  return eventos;
}

async function obterEvento(eventoId) {
  const eventoDoc = await db.collection('eventos').doc(eventoId).get();
  if (!eventoDoc.exists) {
    return null;
  }
  const evento = { id: eventoDoc.id, ...eventoDoc.data() };
  if (evento.criado_em) {
    evento.criado_em = evento.criado_em.toDate().toISOString();
  }
  return evento;
}

async function atualizarEvento(eventoId, dados) {
  const eventoRef = db.collection('eventos').doc(eventoId);
  
  // Remover campos que não devem ser atualizados
  delete dados.id;
  delete dados.criado_em;

  await eventoRef.update({
    ...dados,
    atualizado_em: admin.firestore.Timestamp.now()
  });

  console.log(`✓ Evento atualizado: ${eventoId}`);
}

async function deletarEvento(eventoId) {
  await db.collection('eventos').doc(eventoId).delete();
  console.log(`✓ Evento deletado: ${eventoId}`);
}

// ============ INTERESSES ============

async function adicionarInteresse(usuarioId, eventoId) {
  // Verificar se já existe interesse
  const existente = await db.collection('interesses')
    .where('usuario_id', '==', usuarioId)
    .where('evento_id', '==', eventoId)
    .get();

  if (!existente.empty) {
    return { ja_existia: true };
  }

  // Adicionar novo interesse
  await db.collection('interesses').add({
    usuario_id: usuarioId,
    evento_id: eventoId,
    criado_em: admin.firestore.Timestamp.now()
  });

  console.log(`✓ Interesse adicionado: usuário ${usuarioId} → evento ${eventoId}`);
  return { ja_existia: false };
}

async function removerInteresse(usuarioId, eventoId) {
  const snapshot = await db.collection('interesses')
    .where('usuario_id', '==', usuarioId)
    .where('evento_id', '==', eventoId)
    .get();

  snapshot.forEach(doc => {
    doc.ref.delete();
  });

  console.log(`✓ Interesse removido: usuário ${usuarioId} → evento ${eventoId}`);
}

async function contarInteresses(eventoId) {
  const snapshot = await db.collection('interesses')
    .where('evento_id', '==', eventoId)
    .get();
  return snapshot.size;
}

async function listarInteressesDoUsuario(usuarioId) {
  const snapshot = await db.collection('interesses')
    .where('usuario_id', '==', usuarioId)
    .get();
  const interesses = [];
  snapshot.forEach(doc => {
    interesses.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return interesses;
}

// ============ EXPORTAR ============

module.exports = {
  // Usuários
  registrarUsuario,
  autenticarUsuario,
  verificarEmailExistente,
  obterUsuarioPorId,
  
  // Eventos
  cadastrarEvento,
  listarEventos,
  obterEventosPorOrganizador,
  obterEvento,
  atualizarEvento,
  deletarEvento,
  
  // Interesses
  adicionarInteresse,
  removerInteresse,
  contarInteresses,
  listarInteressesDoUsuario
};
