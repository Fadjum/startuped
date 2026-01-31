import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { insertPropertySchema, insertEnquirySchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export function registerRoutes(app: Express): void {
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, fullName, phone } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const user = await storage.createUser(email, password, fullName, phone);
      req.session.userId = user.id;
      
      return res.json({ 
        user: { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone } 
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const user = await storage.validatePassword(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      return res.json({ 
        user: { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone } 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      return res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.json({ user: null });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.json({ user: null });
      }

      return res.json({ 
        user: { id: user.id, email: user.email, fullName: user.fullName, phone: user.phone } 
      });
    } catch (error) {
      console.error("Auth check error:", error);
      return res.json({ user: null });
    }
  });

  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const available = req.query.available === "true" ? true : req.query.available === "false" ? false : undefined;
      const props = await storage.getProperties(available);
      return res.json(props);
    } catch (error) {
      console.error("Get properties error:", error);
      return res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.json(property);
    } catch (error) {
      console.error("Get property error:", error);
      return res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.get("/api/properties/:id/similar", async (req: Request, res: Response) => {
    try {
      const property = await storage.getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      const similar = await storage.getPropertiesByType(property.type, property.id);
      return res.json(similar.filter(p => p.id !== property.id).slice(0, 3));
    } catch (error) {
      console.error("Get similar properties error:", error);
      return res.status(500).json({ error: "Failed to fetch similar properties" });
    }
  });

  app.get("/api/my/properties", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const props = await storage.getPropertiesByUserId(req.session.userId);
      return res.json(props);
    } catch (error) {
      console.error("Get my properties error:", error);
      return res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.post("/api/properties", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const propertyData = {
        ...req.body,
        userId: req.session.userId,
      };

      const parsed = insertPropertySchema.safeParse(propertyData);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid property data", details: parsed.error });
      }

      const property = await storage.createProperty(parsed.data);
      return res.json(property);
    } catch (error) {
      console.error("Create property error:", error);
      return res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const success = await storage.deleteProperty(req.params.id, req.session.userId);
      if (!success) {
        return res.status(404).json({ error: "Property not found or not authorized" });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error("Delete property error:", error);
      return res.status(500).json({ error: "Failed to delete property" });
    }
  });

  app.get("/api/my/enquiries", async (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const props = await storage.getPropertiesByUserId(req.session.userId);
      const propertyIds = props.map(p => p.id);
      const enqs = await storage.getEnquiriesByPropertyIds(propertyIds);
      return res.json(enqs);
    } catch (error) {
      console.error("Get enquiries error:", error);
      return res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  });

  app.post("/api/enquiries", async (req: Request, res: Response) => {
    try {
      const parsed = insertEnquirySchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid enquiry data", details: parsed.error });
      }

      const property = await storage.getPropertyById(parsed.data.propertyId);
      if (!property || !property.available) {
        return res.status(400).json({ error: "Property not found or not available" });
      }

      const enquiry = await storage.createEnquiry(parsed.data);
      return res.json(enquiry);
    } catch (error) {
      console.error("Create enquiry error:", error);
      return res.status(500).json({ error: "Failed to create enquiry" });
    }
  });

  app.post("/api/upload", upload.array("files", 5), (req: Request, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const urls = files.map(file => `/uploads/${file.filename}`);
      return res.json({ 
        results: urls.map(url => ({ success: true, url })),
        summary: { total: files.length, successful: files.length, failed: 0 }
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  });
}
