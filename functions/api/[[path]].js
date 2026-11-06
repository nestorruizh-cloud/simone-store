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

    // 8. GET /api/accounting -> returns ERP accounting & inventory database (Admin only)
    if (route === 'accounting' && request.method === 'GET') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      if (!db) {
        return jsonResponse({ accounting: null, cloudActive: false });
      }
      const accRow = await db.prepare('SELECT value FROM store_kv WHERE key = ?').bind('accounting').first();
      return jsonResponse({
        accounting: accRow ? JSON.parse(accRow.value) : null,
        cloudActive: true
      });
    }

    // 9. PUT /api/accounting -> saves ERP accounting & inventory database to D1 (Admin only)
    if (route === 'accounting' && request.method === 'PUT') {
      if (!isAuthorized(request, env)) {
        return jsonResponse({ error: 'No autorizado' }, 401);
      }
      const accountingData = await request.json();
      if (db) {
        await db.prepare(`
          INSERT INTO store_kv (key, value, updated_at)
          VALUES ('accounting', ?, datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
        `).bind(JSON.stringify(accountingData)).run();
      }
      return jsonResponse({ ok: true, cloudActive: Boolean(db) });
    }

    // 10. POST /api/radar -> Real AI Market Radar (Cloudflare Workers AI + Mercado Libre Colombia MCO)
    if (route === 'radar' && request.method === 'POST') {
      const body = await request.json();
      const query = (body.query || 'Vela Aromática Cera de Soja').trim();
      const yourPrice = Number(body.yourPrice) || 35000;
      const productName = body.productName || query;

      // Paso A: Intentar obtener listados reales en Mercado Libre Colombia (MCO)
      let realListings = [];
      try {
        const searchQ = query.toLowerCase().includes('vela') ? query : `vela artesanal ${query}`;
        const mlRes = await fetch(
          `https://api.mercadolibre.com/sites/MCO/search?q=${encodeURIComponent(searchQ)}&limit=5`,
          { headers: { 'Accept': 'application/json', 'User-Agent': 'SimoneStoreMarketRadar/1.0' } }
        );
        if (mlRes.ok) {
          const mlData = await mlRes.json();
          if (Array.isArray(mlData.results) && mlData.results.length > 0) {
            realListings = mlData.results.slice(0, 5).map(item => {
              const offer = Math.round(Number(item.price) || yourPrice);
              const orig = Math.round(Number(item.original_price) || Math.round(offer * 1.12));
              const disc = orig > offer ? Math.round(((orig - offer) / orig) * 100) : 0;
              return {
                store: (item.seller && item.seller.nickname) ? item.seller.nickname : 'Mercado Libre Colombia',
                channel: 'Mercado Libre MCO (En Vivo)',
                product: item.title || searchQ,
                regularPrice: orig,
                offerPrice: offer,
                discountPercent: disc,
                promotionText: (item.shipping && item.shipping.free_shipping) ? 'Envío Gratis Nacional' : 'Pago con PSE / Cuotas sin interés',
                url: item.permalink || `https://listado.mercadolibre.com.co/${encodeURIComponent(searchQ)}`
              };
            });
          }
        }
      } catch (_) {
        // Continúa con inferencia IA si la API de ML bloquea la IP del datacenter
      }

      // Paso B: Invocar Modelo de IA Gratuito (1º Cloudflare Workers AI env.AI, 2º Inferencia LLM gratuita en la nube)
      const systemPrompt = `Eres un analista experto en e-commerce y precios de velas artesanales de cera de soja y recordatorios en Colombia (moneda: Pesos Colombianos COP).
Devuelve ÚNICAMENTE un objeto JSON válido (sin bloques markdown \`\`\`json) con esta estructura exacta:
{
  "competitors": [
    {
      "store": "Nombre de tienda o marca en Colombia",
      "channel": "Canal (Mercado Libre Colombia, Shopify Colombia, Instagram Shop, Falabella Colombia)",
      "product": "Nombre exacto del producto comparable",
      "regularPrice": 42000,
      "offerPrice": 36000,
      "discountPercent": 14,
      "promotionText": "Promoción activa (ej: Envío gratis >$90.000, 10% OFF Nequi/PSE, Pack x3)",
      "url": "https://listado.mercadolibre.com.co/velas-artesanales"
    }
  ],
  "suggestedPrice": 34000,
  "suggestedBadge": "10% OFF",
  "diagnosticSummary": "Párrafo breve analizando el precio actual de Simone frente al mercado colombiano.",
  "strategyRecommendation": "Recomendación accionable específica para Simone Velas protegiendo margen artesanal."
}`;

      const userPrompt = `Producto de Simone Velas: "${productName}" (Búsqueda: "${query}").
Precio actual en Simone Store: $${yourPrice} COP.
${realListings.length > 0 ? `Datos reales encontrados hoy en Mercado Libre Colombia: ${JSON.stringify(realListings)}` : 'Genera 5 referencias realistas del mercado colombiano actual (Bogotá/Medellín/Nacional) en pesos colombianos (COP) cercanas al rango real de este tipo de vela artesanal.'}
Calcula el precio sugerido óptimo en múltiplos de $500 o $1.000 COP y redacta el diagnóstico y estrategia.`;

      let aiParsed = null;
      let modelUsed = '';

      // 1. Intentar con Cloudflare Workers AI (env.AI) si está vinculado
      if (env && env.AI && typeof env.AI.run === 'function') {
        try {
          const cfRes = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 900
          });
          const rawText = (cfRes && cfRes.response) ? cfRes.response : '';
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiParsed = JSON.parse(jsonMatch[0]);
            modelUsed = 'Cloudflare Workers AI (Meta Llama 3.1 8B)';
          }
        } catch (_) {}
      }

      // 2. Si env.AI aún no está activo o falló el parseo, usar LLM gratuito sin API Key (Pollinations OpenAI-compatible)
      if (!aiParsed) {
        try {
          const llmRes = await fetch('https://text.pollinations.ai/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'openai',
              temperature: 0.3,
              response_format: { type: 'json_object' },
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ]
            })
          });
          if (llmRes.ok) {
            const llmJson = await llmRes.json();
            const content = llmJson?.choices?.[0]?.message?.content || '';
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              aiParsed = JSON.parse(jsonMatch[0]);
              modelUsed = 'IA Generativa Cloud (OpenAI / Llama Free Tier)';
            }
          }
        } catch (_) {}
      }

      return jsonResponse({
        ok: true,
        modelUsed: modelUsed || 'Motor Heurístico Colombiano + Mercado Libre MCO',
        realListingsCount: realListings.length,
        realListings,
        aiResult: aiParsed
      });
    }

    return jsonResponse({ error: 'Endpoint no encontrado' }, 404);
  } catch (err) {
    return jsonResponse({ error: err.message || 'Error interno del servidor' }, 500);
  }
}
