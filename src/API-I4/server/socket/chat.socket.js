// server/socket/chat.socket.js
const pool = require('../db');
const { randomUUID } = require('crypto'); 

// const { isBlocked } = require('../utils/blocks');

module.exports = function (io) {
  // Autenticación básica por query param ?userId=
  io.use((socket, next) => {
    const userId = Number(socket.handshake.query.userId);
    if (!userId) return next(new Error('userId requerido'));
    socket.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;

    // Sala personal para notificaciones directas
    socket.join(`user:${userId}`);

    // Unirse a un chat existente
    socket.on('chat:join', async ({ chatId } = {}, ack) => {
      try {
        const [[row]] = await pool.query(
          `SELECT id_chat
             FROM Chats
            WHERE id_chat = ?
              AND (id_usuario1 = ? OR id_usuario2 = ?)
            LIMIT 1`,
          [Number(chatId), userId, userId]
        );
        if (!row) return ack && ack({ ok: false, error: 'No puedes unirte a este chat' });

        socket.join(`chat:${chatId}`);
        return ack && ack({ ok: true });
      } catch (e) {
        console.error('chat:join', e);
        return ack && ack({ ok: false, error: 'Error al unirse' });
      }
    });

    // Crear u obtener chat 1:1
    socket.on('chat:get_or_create', async ({ to } = {}, ack) => {
      try {
        const other = Number(to);
        const a = Math.min(userId, other);
        const b = Math.max(userId, other);

        if (!other || Number.isNaN(other)) {
          return ack && ack({ ok: false, error: 'Destinatario inválido' });
        }
        if (a === b) {
          return ack && ack({ ok: false, error: 'No puedes chatear contigo mismo' });
        }

        const [[exist]] = await pool.query(
          `SELECT id_chat FROM Chats WHERE id_usuario1 = ? AND id_usuario2 = ? LIMIT 1`,
          [a, b]
        );
        if (exist) return ack && ack({ ok: true, chatId: exist.id_chat });

        const [ins] = await pool.query(
          `INSERT INTO Chats (id_usuario1, id_usuario2) VALUES (?, ?)`,
          [a, b]
        );
        return ack && ack({ ok: true, chatId: ins.insertId });
      } catch (e) {
        console.error('chat:get_or_create', e);
        return ack && ack({ ok: false, error: 'Error al crear/obtener chat' });
      }
    });

    // Enviar mensaje
    socket.on('message:send', async (payload = {}, ack) => {
      try {
        const { chatId, to, body, client_id } = payload;
        const chatIdNum = Number(chatId);
        const toNum = Number(to);

        if (!chatIdNum || !toNum || !body || String(body).trim() === '') {
          return ack && ack({ ok: false, error: 'chatId, to y body son requeridos' });
        }

        // Verificar pertenencia al chat
        const [[c]] = await pool.query(
          `SELECT id_chat, id_usuario1, id_usuario2
             FROM Chats
            WHERE id_chat = ?
              AND (id_usuario1 = ? OR id_usuario2 = ?)
            LIMIT 1`,
          [chatIdNum, userId, userId]
        );
        if (!c) return ack && ack({ ok: false, error: 'No perteneces al chat' });


        // Insertar mensaje (deduplicando por client_id)
        const cid = client_id || randomUUID();
        const [ins] = await pool.query(
          `INSERT INTO Mensajes (id_chat, id_usuariotx, id_usuariorx, mensaje, client_id)
           VALUES (?, ?, ?, ?, ?)`,
          [chatIdNum, userId, toNum, String(body).trim(), cid]
        );

        const [[msg]] = await pool.query(
          `SELECT * FROM Mensajes WHERE id_mensaje = ? LIMIT 1`,
          [ins.insertId]
        );

        // Emitir a la sala del chat
        io.to(`chat:${chatIdNum}`).emit('message:new', msg);

        return ack && ack({ ok: true, message: msg });
      } catch (e) {
        // Manejo de duplicado por client_id (MySQL ER_DUP_ENTRY)
        if (e && e.code === 'ER_DUP_ENTRY') {
          try {
            const { chatId, client_id } = payload || {};
            if (chatId && client_id) {
              const [[exist]] = await pool.query(
                `SELECT * FROM Mensajes WHERE id_chat = ? AND client_id = ? LIMIT 1`,
                [Number(chatId), String(client_id)]
              );
              if (exist) return ack && ack({ ok: true, message: exist, dedup: true });
            }
            return ack && ack({ ok: false, error: 'Duplicado' });
          } catch (e2) {
            console.error('message:send dedup fallback', e2);
            return ack && ack({ ok: false, error: 'Error al resolver duplicado' });
          }
        }
        console.error('message:send', e);
        return ack && ack({ ok: false, error: 'Error al enviar' });
      }
    });

    socket.on('disconnect', () => {
   //////////////////////
    });
  });
};
