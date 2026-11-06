import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import db from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 4000);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/categories", (_req, res) => {
  const rows = db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all();
  res.json(rows.map(row => row.category));
});
app.get("/api/products", (req, res) => {
  const { q, category } = req.query;
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];
  if (q) { sql += " AND (name LIKE ? OR description LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }
  if (category) { sql += " AND category = ?"; params.push(category); }
  sql += " ORDER BY id DESC";
  res.json(db.prepare(sql).all(...params));
});
app.get("/api/products/:id", (req, res) => {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});
app.post("/api/orders", (req, res) => {
  const { customer, items } = req.body || {};
  if (!customer || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: "Customer details and at least one item are required." });
  const required = ["name", "email", "phone", "address"];
  for (const field of required) {
    if (typeof customer[field] !== "string" || !customer[field].trim()) return res.status(400).json({ error: `A valid ${field} is required.` });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) return res.status(400).json({ error: "Enter a valid email address." });
  const normalized = [];
  for (const item of items) {
    const productId = Number(item.productId);
    const quantity = Number(item.quantity);
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return res.status(400).json({ error: "Invalid product or quantity." });
    const product = db.prepare("SELECT id, price FROM products WHERE id = ?").get(productId);
    if (!product) return res.status(400).json({ error: "One of the products is no longer available." });
    normalized.push({ productId, quantity, price: product.price });
  }
  const total = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const createOrder = db.transaction(() => {
    const result = db.prepare("INSERT INTO orders (customerName,email,phone,address,total) VALUES (?,?,?,?,?)")
      .run(customer.name.trim(), customer.email.trim(), customer.phone.trim(), customer.address.trim(), total);
    const orderId = Number(result.lastInsertRowid);
    const insertItem = db.prepare("INSERT INTO order_items (orderId,productId,quantity,unitPrice) VALUES (?,?,?,?)");
    normalized.forEach(item => insertItem.run(orderId, item.productId, item.quantity, item.price));
    return orderId;
  });
  const orderId = createOrder();
  res.status(201).json({ message: "Order created", orderId, total });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));