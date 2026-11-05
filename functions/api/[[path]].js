// Cloudflare Pages Function: /api/*
// Handles real-time cloud persistence for Products, Banners/Promo Settings, and Customer Orders using Cloudflare D1 (env.DB)

const DEFAULT_ADMIN_PIN = 'simone2026';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
  'Content-Type': 'application/json; charset=UTF-8'
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

async function ensureSchema(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS store_kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_type TEXT NOT NULL DEFAULT 'pedido',
      customer_name TEXT DEFAULT 'Cliente Web',
      customer_phone TEXT DEFAULT '',
      customer_email TEXT DEFAULT '',
      customer_city TEXT DEFAULT '',
      items_json TEXT NOT NULL DEFAULT '[]',
      total REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'nuevo',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
}

function isAuthorized(request, env) {
  const key = request.headers.get('X-Admin-Key') || '';
  const expected = (env && env.ADMIN_PASSWORD) || DEFAULT_ADMIN_PIN;
  return key === expected;
}

export async function onRequest(context) {
  const { request, env, params } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const pathParts = Array.isArray(params.path) ? params.path : (params.path ? [params.path] : []);
  const route = pathParts[0] || '';
  const subId = pathParts[1] || '';

  const db = env && env.DB ? env.DB : null;

  try {
    if (db) {
      await ensureSchema(db);
    }

    // 1. GET /api/store -> returns { products, settings, cloudActive }
    if (route === 'store' && request.method === 'GET') {
      if (!db) {
        return jsonResponse({ products: null, settings: null, cloudActive: false });
      }
      const prodRow = await db.prepare('SELECT value FROM store_kv WHERE key = ?').bind('products').first();
      const setRow = await db.prepare('SELECT value FROM store_kv WHERE key = ?').bind('settings').first();

      return jsonResponse({
        products: prodRow ? JSON.parse(prodRow.value) : null,
        settings: setRow ? JSON.parse(setRow.value) : null,
        cloudActive: true
      });
    }

    // 2. PUT /api/products -> saves product catalog (Admin only)
    if (route === 'products' && request.method === 'PUT') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      const body = await request.json();
      const products = Array.isArray(body) ? body : body.products;
      if (!Array.isArray(products)) {
        return jsonResponse({ error: 'Formato de catálogo inválido' }, 400);
      }
      if (db) {
        await db.prepare(`
          INSERT INTO store_kv (key, value, updated_at)
          VALUES ('products', ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
        `).bind(JSON.stringify(products)).run();
      }
      return jsonResponse({ ok: true, count: products.length, cloudActive: Boolean(db) });
    }

    // 3. PUT /api/settings -> saves banners, promoPopup, notifications (Admin only)
    if (route === 'settings' && request.method === 'PUT') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      const settings = await request.json();
      if (db) {
        await db.prepare(`
          INSERT INTO store_kv (key, value, updated_at)
          VALUES ('settings', ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
        `).bind(JSON.stringify(settings)).run();
      }
      return jsonResponse({ ok: true, cloudActive: Boolean(db) });
    }

    // 4. GET /api/orders -> list all orders/quotes (Admin only)
    if (route === 'orders' && request.method === 'GET') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      if (!db) {
        return jsonResponse({ orders: [], cloudActive: false });
      }
      const { results } = await db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 300').all();
      const orders = (results || []).map(r => ({
        id: r.id,
        orderType: r.order_type,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerEmail: r.customer_email,
        customerCity: r.customer_city,
        items: JSON.parse(r.items_json || '[]'),
        total: r.total,
        status: r.status,
        notes: r.notes,
        createdAt: r.created_at,
        updatedAt: r.updated_at
      }));
      return jsonResponse({ orders, cloudActive: true });
    }

    // 5. POST /api/orders -> customer creates an order / event quote / inquiry
    if (route === 'orders' && request.method === 'POST') {
      const body = await request.json();
      const id = body.id || ('SIM-' + Date.now().toString().slice(-6));
      const orderType = body.orderType || 'pedido';
      const customerName = body.customerName || 'Cliente Web';
      const customerPhone = body.customerPhone || '';
      const customerEmail = body.customerEmail || '';
      const customerCity = body.customerCity || '';
      const items = Array.isArray(body.items) ? body.items : [];
      const total = Number(body.total) || 0;
      const notes = body.notes || '';
      const nowIso = new Date().toISOString();

      if (db) {
        await db.prepare(`
          INSERT INTO orders (id, order_type, customer_name, customer_phone, customer_email, customer_city, items_json, total, status, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'nuevo', ?, ?, ?)
        `).bind(
          id,
          orderType,
          customerName,
          customerPhone,
          customerEmail,
          customerCity,
          JSON.stringify(items),
          total,
          notes,
          nowIso,
          nowIso
        ).run();
      }

      return jsonResponse({ ok: true, id, createdAt: nowIso, cloudActive: Boolean(db) }, 201);
    }

    // 6. PATCH /api/orders/:id -> update order status or notes (Admin only)
    if (route === 'orders' && subId && request.method === 'PATCH') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      const body = await request.json();
      if (db) {
        if (body.status && body.notes !== undefined) {
          await db.prepare('UPDATE orders SET status = ?, notes = ?, updated_at = datetime("now") WHERE id = ?')
            .bind(body.status, body.notes, subId).run();
        } else if (body.status) {
          await db.prepare('UPDATE orders SET status = ?, updated_at = datetime("now") WHERE id = ?')
            .bind(body.status, subId).run();
        } else if (body.notes !== undefined) {
          await db.prepare('UPDATE orders SET notes = ?, updated_at = datetime("now") WHERE id = ?')
            .bind(body.notes, subId).run();
        }
      }
      return jsonResponse({ ok: true, id: subId });
    }

    // 7. DELETE /api/orders/:id -> delete order (Admin only)
    if (route === 'orders' && subId && request.method === 'DELETE') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      if (db) {
        await db.prepare('DELETE FROM orders WHERE id = ?').bind(subId).run();
      }
      return jsonResponse({ ok: true, id: subId });
    }

    return jsonResponse({ error: 'Endpoint no encontrado' }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message || 'Error interno del servidor' }, 500);
  }
}
