import express from "express";
import cors from "cors";
import morgan from "morgan";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());              // чтобы ЛР-5 сразу работала с фронтом
app.use(express.json());      // JSON body
app.use(morgan("dev"));       // лог запросов

// --- мок-данные (в памяти) ---
let products = [
  { id: "pr-1001", name: "Яблоко",  category: "фрукты",  price: 79,  emoji: "🍎" },
  { id: "pr-1002", name: "Хлеб",    category: "выпечка", price: 49,  emoji: "🍞" },
  { id: "pr-1003", name: "Молоко",  category: "молочное",price: 89,  emoji: "🥛" },
  { id: "pr-1004", name: "Сыр",     category: "молочное",price: 349, emoji: "🧀" }
];

// простая валидация
function validateProduct(p) {
  if (!p || typeof p !== "object") return "empty";
  if (!p.name || typeof p.name !== "string") return "name";
  if (!p.category || typeof p.category !== "string") return "category";
  if (typeof p.price !== "number" || Number.isNaN(p.price)) return "price";
  if (!p.emoji || typeof p.emoji !== "string") return "emoji";
  return null;
}

// 1) список с фильтром: /api/products?query=строка&category=...&priceMin=..&priceMax=..
app.get("/api/products", (req, res) => {
  const { query = "", category, priceMin, priceMax } = req.query;
  const q = String(query).trim().toLowerCase();

  let list = [...products].filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (category) {
    const c = String(category).toLowerCase();
    list = list.filter(p => p.category.toLowerCase() === c);
  }
  if (priceMin !== undefined) {
    list = list.filter(p => p.price >= Number(priceMin));
  }
  if (priceMax !== undefined) {
    list = list.filter(p => p.price <= Number(priceMax));
  }

  res.json({ total: list.length, items: list });
});

// 2) одна запись
app.get("/api/products/:id", (req, res) => {
  const item = products.find(p => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "not_found" });
  res.json(item);
});

// 3) добавление
app.post("/api/products", (req, res) => {
  const err = validateProduct(req.body);
  if (err) return res.status(400).json({ error: "bad_request", field: err });

  const item = { ...req.body, id: nanoid(8) };
  products.unshift(item);
  res.status(201).json(item);
});

// 4) редактирование (полное или частичное)
app.put("/api/products/:id", (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "not_found" });

  const next = { ...products[idx], ...req.body, id: products[idx].id };
  const err = validateProduct(next);
  if (err) return res.status(400).json({ error: "bad_request", field: err });

  products[idx] = next;
  res.json(products[idx]);
});

// 5) удаление
app.delete("/api/products/:id", (req, res) => {
  const before = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === before) return res.status(404).json({ error: "not_found" });
  res.status(204).send();
});

// healthcheck
app.get("/health", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});
