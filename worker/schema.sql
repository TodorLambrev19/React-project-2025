CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT,
  image_url TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT,
  sold_out INTEGER NOT NULL DEFAULT 0,
  pre_order INTEGER NOT NULL DEFAULT 0,
  images TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  items TEXT NOT NULL,
  total_price REAL NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_method TEXT NOT NULL,
  delivery_city_name TEXT,
  delivery_office_id INTEGER,
  delivery_office_name TEXT,
  delivery_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
