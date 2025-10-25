const pool = require('../db');
const { isBlocked } = require('../utils/block.js');

const createMensaje = async (req, res) => {
  try {
    const io = req.app.locals.io; // para emitir
    const { chatId, from, to, body, client_id } = req.body || {};
    if (!chatId || !from || !to || !body) {
      return res.status(400).json({ error: 'chatId, from, to, body requeridos' });
    }

    const [[c]] = await pool.query(
      `SELECT id_chat FROM Chats
        WHERE id_chat = ? AND (id_usuario1 = ? OR id_usuario2 = ?) LIMIT 1`,
      [Number(chatId), Number(from), Number(from)]
    );
    if (!c) return res.status(403).json({ error: 'No perteneces al chat' });

    if (await isBlocked(Number(from), Number(to))) {
      return res.status(403).json({ error: 'No puedes enviar mensajes: usuarios bloqueados' });
    }

    const [ins] = await pool.query(
      `INSERT INTO Mensajes (id_chat, id_usuariotx, id_usuariorx, mensaje, client_id)
       VALUES (?, ?, ?, ?, ?)`,
      [Number(chatId), Number(from), Number(to), String(body).trim(), client_id || null]
    );

    const [[msg]] = await pool.query(
      `SELECT * FROM Mensajes WHERE id_mensaje = ? LIMIT 1`,
      [ins.insertId]
    );

    // 🔔 emitir al room del chat
    io.to(`chat:${chatId}`).emit('message:new', msg);

    return res.status(201).json(msg);
  } catch (e) {
    if (e && e.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Duplicado (client_id ya existe en este chat)' });
    }
    console.error('createMensaje', e);
    res.status(500).json({ error: 'Error al crear mensaje' });
  }
};

module.exports = { createMensaje };
