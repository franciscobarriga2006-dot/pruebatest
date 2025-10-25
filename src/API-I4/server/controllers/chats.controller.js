const pool = require('../db');
const { isBlocked } = require('../utils/block.js');

const createChat = async (req, res) => {
  try {
    const a = Number(req.body.userA);
    const b = Number(req.body.userB);
    if (!a || !b || a === b) return res.status(400).json({ error: 'userA y userB válidos' });

    if (await isBlocked(a, b)) {
      return res.status(403).json({ error: 'No se puede crear chat: usuarios bloqueados' });
    }

    const u1 = Math.min(a, b), u2 = Math.max(a, b);
    const [[exist]] = await pool.query(
      `SELECT id_chat FROM Chats WHERE id_usuario1 = ? AND id_usuario2 = ? LIMIT 1`,
      [u1, u2]
    );
    if (exist) return res.status(200).json({ id_chat: exist.id_chat });

    const [ins] = await pool.query(
      `INSERT INTO Chats (id_usuario1, id_usuario2) VALUES (?, ?)`,
      [u1, u2]
    );
    return res.status(201).json({ id_chat: ins.insertId });
  } catch (e) {
    console.error('createChat', e);
    res.status(500).json({ error: 'Error al crear chat' });
  }
};
const getChats = async (req, res) => {
  try {
    const userId = Number(req.query.userId || req.header('x-user-id'));
    if (!userId) return res.status(400).json({ error:'userId requerido' });

    const [rows] = await pool.query(
      `SELECT c.*,
              u1.nombres AS u1_nombre, u2.nombres AS u2_nombre
         FROM Chats c
         JOIN Usuarios u1 ON u1.id_usuario = c.id_usuario1
         JOIN Usuarios u2 ON u2.id_usuario = c.id_usuario2
        WHERE c.id_usuario1 = ? OR c.id_usuario2 = ?
        ORDER BY c.fecha DESC`,
      [userId, userId]
    );
    res.json({ items: rows });
  } catch (e) {
    console.error('getChats', e);
    res.status(500).json({ error:'Error al listar chats' });
  }
};

const getMensajes = async (req, res) => {
  try {
    const chatId = Number(req.params.id);
    if (!chatId) return res.status(400).json({ error:'chatId inválido' });
    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 30)));
    const offset = Math.max(0, Number(req.query.offset || 0));

    const [rows] = await pool.query(
      `SELECT * FROM Mensajes
        WHERE id_chat = ?
        ORDER BY fecha DESC
        LIMIT ? OFFSET ?`,
      [chatId, limit, offset]
    );
    res.json({ items: rows, limit, offset });
  } catch (e) {
    console.error('getMensajes', e);
    res.status(500).json({ error:'Error al listar mensajes' });
  }
};


module.exports = { createChat,getMensajes,getChats };
