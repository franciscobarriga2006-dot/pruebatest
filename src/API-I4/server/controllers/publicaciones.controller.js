const pool = require('../db'); // mysql2/promise pool

// helper para strings
const t = (s) => (typeof s === 'string' ? s.trim() : s);

// Solo permitimos actualizar estos campos
const ALLOWED_FIELDS = [
  'titulo', 'descripcion', 'direccion', 'horario', 'tipo',
  'monto', 'horas', 'estado', 'ciudad', 'region'
];
const ESTADOS = new Set(['activa', 'pausada', 'cerrada', 'eliminada']);

const patchPublicacion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    // 1) Existe + (opcional) autor
    const [rows] = await pool.query(
      'SELECT id_publicacion, id_usuario FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Publicación no encontrada' });

    const pub = rows[0];
    const userIdHeader = Number(req.header('x-user-id') || 0);
    if (userIdHeader && userIdHeader !== pub.id_usuario) {
      return res.status(403).json({ error: 'No autorizado para modificar esta publicación' });
    }

    // 2) Construir SET dinámico
    const sets = [];
    const params = [];

    for (const key of ALLOWED_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        let val = req.body[key];
        if (key === 'estado' && val && !ESTADOS.has(String(val))) {
          return res.status(400).json({ error: `estado inválido. Use uno de: ${[...ESTADOS].join(', ')}` });
        }
        if (key === 'monto' && val != null) {
          const n = Number(val);
          if (Number.isNaN(n) || n < 0) return res.status(400).json({ error: 'monto inválido' });
          val = n;
        }
        if (typeof val === 'string') val = t(val);
        sets.push('`' + key + '` = ?');
        params.push(val);
      }
    }

    if (!sets.length) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    // 3) Ejecutar UPDATE 
    const sql = `
      UPDATE \`Publicaciones\`
         SET ${sets.join(', ')},
             \`fecha_actualizacion\` = CURRENT_TIMESTAMP(3)
       WHERE \`id_publicacion\` = ?
    `;
    params.push(id);

    await pool.query(sql, params);

    // 4) Devolver fila actualizada
    const [out] = await pool.query(
      'SELECT * FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [id]
    );
    return res.json(out[0]);
  } catch (err) {
    console.error('patchPublicacion error:', err);
    return res.status(500).json({ error: 'Error al actualizar publicación' });
  }
};

const deletePublicacion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    // Comprobar existencia y autoría (opcional)
    const [rows] = await pool.query(
      'SELECT id_publicacion, id_usuario FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Publicación no encontrada' });

    const pub = rows[0];
    const userIdHeader = Number(req.header('x-user-id') || 0);
    if (userIdHeader && userIdHeader !== pub.id_usuario) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta publicación' });
    }

    // Borrar
    const [result] = await pool.query(
      'DELETE FROM `Publicaciones` WHERE id_publicacion = ?',
      [id]
    );
    if (!result.affectedRows) {
      return res.status(500).json({ error: 'No se pudo eliminar (sin filas afectadas)' });
    }

    // 204 No Content
    return res.status(204).send();
  } catch (err) {
    console.error('deletePublicacion error:', err);
    return res.status(500).json({ error: 'Error al eliminar publicación' });
  }
};

const getPublicacionById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const [[pub]] = await pool.query(
      'SELECT * FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [id]
    );
    if (!pub) return res.status(404).json({ error: 'Publicación no encontrada' });

    // Etiquetas (opcional, base)
    const [tags] = await pool.query(
      `SELECT e.id_etiqueta, e.nombre
         FROM Etiquetas e
         JOIN Etiquetas_publicaciones ep ON ep.id_etiqueta = e.id_etiqueta
        WHERE ep.id_publicacion = ?
        ORDER BY e.nombre`,
      [id]
    );

    return res.json({ ...pub, etiquetas: tags });
  } catch (err) {
    console.error('getPublicacionById error:', err);
    return res.status(500).json({ error: 'Error al obtener publicación' });
  }
};

const getPublicaciones = async (req, res) => {
  try {
    const limit  = Math.max(1, Math.min(100, Number(req.query.limit || 20)));
    const offset = Math.max(0, Number(req.query.offset || 0));
    const { q, ciudad, region, estado, mine } = req.query || {};

    const where = [];
    const params = [];

    if (q)       { where.push('(titulo LIKE ? OR descripcion LIKE ?)'); params.push(`%${t(q)}%`, `%${t(q)}%`); }
    if (ciudad)  { where.push('ciudad = ?');  params.push(t(ciudad)); }
    if (region)  { where.push('region = ?');  params.push(t(region)); }
    if (estado)  { where.push('estado = ?');  params.push(t(estado)); }

    // solo mis publicaciones
    if (String(req.query.mine) === '1') {
      const uid = Number(req.cookies?.uid || 0);
      if (!uid) return res.status(401).json({ error: 'No autenticado' });
      where.push('id_usuario = ?');
      params.push(uid);
    }

    const sql = `
      SELECT id_publicacion, id_usuario, titulo, descripcion, direccion, horario,
             tipo, monto, horas, estado, ciudad, region, created_at
      FROM \`Publicaciones\`
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    return res.json({ items: rows, limit, offset });
  } catch (err) {
    console.error('getPublicaciones error:', err);
    return res.status(500).json({ error: 'Error al listar publicaciones' });
  }
};

const createPublicacion = async (req, res) => {
  try {
    const {
      id_usuario,
      titulo,
      descripcion,
      direccion,
      horario,
      tipo,
      monto,
      horas,
      estado,  // si no lo envías, DB usa DEFAULT 'activa'
      ciudad,
      region,
    } = req.body || {};

    if (!id_usuario || !titulo || !descripcion) {
      return res.status(400).json({ error: 'id_usuario, titulo y descripcion son obligatorios' });
    }

    // Construimos INSERT solo con campos presentes (para no romper DEFAULTs NOT NULL)
    const cols = ['id_usuario', 'titulo', 'descripcion'];
    const vals = [Number(id_usuario), t(titulo), t(descripcion)];

    const opt = { direccion, horario, tipo, horas, ciudad, region };
    for (const [k, v] of Object.entries(opt)) {
      if (v !== undefined) {
        cols.push(k);
        vals.push(t(v));
      }
    }

    if (monto !== undefined) {
      const n = Number(monto);
      if (!Number.isNaN(n)) {
        cols.push('monto');
        vals.push(n);
      }
    }

    if (estado !== undefined) {
      cols.push('estado');
      vals.push(t(estado));
    }

    const placeholders = cols.map(() => '?').join(',');
    const sql = `INSERT INTO \`Publicaciones\` (${cols.map(c => '`'+c+'`').join(',')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, vals);

    const [rows] = await pool.query(
      'SELECT * FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createPublicacion error:', err);
    res.status(500).json({ error: 'Error al crear publicación' });
  }
};

module.exports = { getPublicaciones,createPublicacion,patchPublicacion, deletePublicacion, getPublicacionById
};
