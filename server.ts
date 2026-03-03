import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { initDb } from "./src/db.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "./src/db.ts";

const JWT_SECRET = process.env.JWT_SECRET || "kora-cms-secret-key-2024";

async function startServer() {
  // Initialize Database
  initDb();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, fullName, companyName, subdomain } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const companyResult = db.prepare(
        "INSERT INTO companies (name, subdomain) VALUES (?, ?)"
      ).run(companyName, subdomain);
      
      const companyId = companyResult.lastInsertRowid;
      const adminRole = db.prepare("SELECT id FROM roles WHERE name = 'admin'").get() as any;

      db.prepare(
        "INSERT INTO users (company_id, email, password, full_name, role_id) VALUES (?, ?, ?, ?, ?)"
      ).run(companyId, email, hashedPassword, fullName, adminRole.id);

      res.status(201).json({ message: "Company and Admin created successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare(
      "SELECT u.*, c.subdomain, r.name as role FROM users u JOIN companies c ON u.company_id = c.id JOIN roles r ON u.role_id = r.id WHERE u.email = ?"
    ).get(email) as any;

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    // Fetch permissions
    const permissions = db.prepare(`
      SELECT p.name 
      FROM permissions p 
      JOIN role_permissions rp ON p.id = rp.permission_id 
      WHERE rp.role_id = ?
    `).all(user.role_id) as { name: string }[];

    const permissionNames = permissions.map(p => p.name);

    const token = jwt.sign(
      { id: user.id, companyId: user.company_id, role: user.role, permissions: permissionNames },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        fullName: user.full_name, 
        email: user.email, 
        role: user.role, 
        companyId: user.company_id,
        permissions: permissionNames
      } 
    });
  });

  // CMS Data Routes
  app.get("/api/dashboard/stats", authenticate, (req: any, res) => {
    const companyId = req.user.companyId;
    const pagesCount = db.prepare("SELECT COUNT(*) as count FROM pages WHERE company_id = ?").get(companyId) as any;
    const postsCount = db.prepare("SELECT COUNT(*) as count FROM posts WHERE company_id = ?").get(companyId) as any;
    const productsCount = db.prepare("SELECT COUNT(*) as count FROM products WHERE company_id = ?").get(companyId) as any;
    const paymentsSum = db.prepare("SELECT SUM(amount) as total FROM payments WHERE company_id = ? AND status = 'completed'").get(companyId) as any;

    res.json({
      pages: pagesCount.count,
      posts: postsCount.count,
      products: productsCount.count,
      revenue: paymentsSum.total || 0
    });
  });

  app.get("/api/pages", authenticate, (req: any, res) => {
    const pages = db.prepare("SELECT * FROM pages WHERE company_id = ?").all(req.user.companyId);
    res.json(pages);
  });

  app.post("/api/pages", authenticate, (req: any, res) => {
    const { title, slug, content } = req.body;
    db.prepare(
      "INSERT INTO pages (company_id, title, slug, content) VALUES (?, ?, ?, ?)"
    ).run(req.user.companyId, title, slug, JSON.stringify(content));
    res.status(201).json({ message: "Page created" });
  });

  app.get("/api/products", authenticate, (req: any, res) => {
    const products = db.prepare("SELECT * FROM products WHERE company_id = ?").all(req.user.companyId);
    res.json(products);
  });

  app.get("/api/payments", authenticate, (req: any, res) => {
    const payments = db.prepare("SELECT * FROM payments WHERE company_id = ? ORDER BY created_at DESC").all(req.user.companyId);
    res.json(payments);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KoraCMS Server running on http://localhost:${PORT}`);
  });
}

startServer();
