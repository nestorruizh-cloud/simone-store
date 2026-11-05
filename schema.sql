-- Simone Store - Cloudflare D1 Database Schema
-- Execute with: npx wrangler d1 execute simone-store-db --file=./schema.sql
-- (Also auto-initialized automatically by functions/api/[[path]].js on first request)

CREATE TABLE IF NOT EXISTS store_kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

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
);
