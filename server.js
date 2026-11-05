const http = require('http');
const fs = require('fs');
const path = require('path');
const { defaultProducts, defaultSettings } = require('./js/products.js');

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'simone2026';
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return {
        products: Array.isArray(raw.products) ? raw.products : defaultProducts,
        settings: raw.settings || defaultSettings,
        orders: Array.isArray(raw.orders) ? raw.orders : []
      };
    }
  } catch (e) {
    console.error('Error reading local store-db.json:', e);
  }
  const initial = {
    products: defaultProducts,
    settings: defaultSettings,
    orders: []
  };
  writeDb(initial);
  return initial;
}

function writeDb(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing local store-db.json:', e);
  }
}

function sendJson(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) {
        reject(new Error('Payload demasiado grande'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  const reqUrl = req.url.split('?')[0];

  if (req.method === 'OPTIONS') {
    return sendJson(res, {}, 204);
  }

  // Handle /api/* endpoints (mirrors Cloudflare Pages Functions /api/[[path]].js)
  if (reqUrl.startsWith('/api/')) {
    const parts = reqUrl.replace(/^\/api\//, '').split('/').filter(Boolean);
    const route = parts[0] || '';
    const subId = parts[1] || '';
    const isAuth = (req.headers['x-admin-key'] || '') === ADMIN_PASSWORD;

    try {
      const db = readDb();

      if (route === 'store' && req.method === 'GET') {
        return sendJson(res, {
          products: db.products,
          settings: db.settings,
          cloudActive: true
        });
      }

      if (route === 'products' && req.method === 'PUT') {
        if (!isAuth) return sendJson(res, { error: 'No autorizado' }, 401);
        const body = await parseBody(req);
        const products = Array.isArray(body) ? body : body.products;
        if (!Array.isArray(products)) {
          return sendJson(res, { error: 'Formato de catálogo inválido' }, 400);
        }
        db.products = products;
        writeDb(db);
        return sendJson(res, { ok: true, count: products.length, cloudActive: true });
      }

      if (route === 'settings' && req.method === 'PUT') {
        if (!isAuth) return sendJson(res, { error: 'No autorizado' }, 401);
        const settings = await parseBody(req);
        db.settings = settings;
        writeDb(db);
        return sendJson(res, { ok: true, cloudActive: true });
      }

      if (route === 'orders' && req.method === 'GET') {
        if (!isAuth) return sendJson(res, { error: 'No autorizado' }, 401);
        return sendJson(res, { orders: db.orders, cloudActive: true });
      }

      if (route === 'orders' && req.method === 'POST') {
        const body = await parseBody(req);
        const nowIso = new Date().toISOString();
        const newOrder = {
          id: body.id || ('SIM-' + Date.now().toString().slice(-6)),
          orderType: body.orderType || 'pedido',
          customerName: body.customerName || 'Cliente Web',
          customerPhone: body.customerPhone || '',
          customerEmail: body.customerEmail || '',
          customerCity: body.customerCity || '',
          items: Array.isArray(body.items) ? body.items : [],
          total: Number(body.total) || 0,
          status: 'nuevo',
          notes: body.notes || '',
          createdAt: nowIso,
          updatedAt: nowIso
        };
        db.orders.unshift(newOrder);
        writeDb(db);
        return sendJson(res, { ok: true, id: newOrder.id, createdAt: nowIso, cloudActive: true }, 201);
      }

      if (route === 'orders' && subId && req.method === 'PATCH') {
        if (!isAuth) return sendJson(res, { error: 'No autorizado' }, 401);
        const body = await parseBody(req);
        const idx = db.orders.findIndex(o => o.id === subId);
        if (idx === -1) return sendJson(res, { error: 'Pedido no encontrado' }, 404);
        if (body.status) db.orders[idx].status = body.status;
        if (body.notes !== undefined) db.orders[idx].notes = body.notes;
        db.orders[idx].updatedAt = new Date().toISOString();
        writeDb(db);
        return sendJson(res, { ok: true, id: subId });
      }

      if (route === 'orders' && subId && req.method === 'DELETE') {
        if (!isAuth) return sendJson(res, { error: 'No autorizado' }, 401);
        db.orders = db.orders.filter(o => o.id !== subId);
        writeDb(db);
        return sendJson(res, { ok: true, id: subId });
      }

      return sendJson(res, { error: 'Endpoint no encontrado' }, 404);
    } catch (err) {
      return sendJson(res, { error: err.message || 'Error interno' }, 500);
    }
  }

  let staticPath = reqUrl === '' || reqUrl === '/' ? '/index.html' : reqUrl;
  let filePath = path.join(__dirname, staticPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>404 - Archivo no encontrado</h2><p><a href="/">Volver a Simone</a></p></body></html>`);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simone server running on http://localhost:${PORT}`);
});
