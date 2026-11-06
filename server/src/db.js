import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "store.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price INTEGER NOT NULL,
    oldPrice INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 4.5,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    total INTEGER NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL REFERENCES orders(id),
    productId INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unitPrice INTEGER NOT NULL
  );
`);

const count = db.prepare("SELECT COUNT(*) AS count FROM products").get().count;
if (count === 0) {
  const seed = [
    ["Wireless Bluetooth Headphones","Comfortable wireless headphones with clear sound and long battery life.","Electronics",18500,25000,26,4.6,"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80"],
    ["Smart Watch Series 8","Track your daily activity, notifications and workouts.","Phones & Accessories",32500,42000,23,4.4,"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80"],
    ["Classic Everyday Sneakers","Lightweight casual sneakers for everyday comfort.","Fashion",24500,30000,18,4.3,"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80"],
    ["Modern Desk Lamp","Minimal LED desk lamp for study and work spaces.","Home & Office",12500,16000,22,4.5,"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700&q=80"],
    ["Digital Camera","Compact camera for capturing everyday moments.","Electronics",145000,175000,17,4.7,"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700&q=80"],
    ["Travel Backpack","Durable backpack with multiple compartments.","Fashion",22000,28000,21,4.2,"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80"],
    ["Ceramic Coffee Mug Set","Set of two ceramic mugs for your favourite drinks.","Home & Office",8500,10000,15,4.5,"https://images.unsplash.com/photo-1514228742587-6b1558f19b4d?w=700&q=80"],
    ["Portable Bluetooth Speaker","Portable speaker with rich sound for indoor and outdoor use.","Phones & Accessories",27000,35000,23,4.6,"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700&q=80"],
    ["Skincare Essentials Set","A simple daily skincare collection.","Health & Beauty",19500,24000,19,4.4,"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80"],
    ["Stainless Water Bottle","Reusable insulated bottle for hot and cold drinks.","Home & Office",7500,9500,21,4.3,"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700&q=80"]
  ];
  const insert = db.prepare("INSERT INTO products (name,description,category,price,oldPrice,discount,rating,image) VALUES (?,?,?,?,?,?,?,?)");
  const tx = db.transaction(rows => rows.forEach(row => insert.run(...row)));
  // Replace any malformed demo URL with a valid image.
  seed[8][7] = "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=700&q=80";
  tx(seed);
}
export default db;