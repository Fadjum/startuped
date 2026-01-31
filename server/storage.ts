import { db } from "./db";
import { users, properties, enquiries, User, InsertUser, Property, InsertProperty, Enquiry, InsertEnquiry } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  createUser(email: string, password: string, fullName?: string, phone?: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  validatePassword(email: string, password: string): Promise<User | null>;
  
  getProperties(available?: boolean): Promise<Property[]>;
  getPropertyById(id: string): Promise<Property | undefined>;
  getPropertiesByUserId(userId: string): Promise<Property[]>;
  getPropertiesByType(type: string, excludeId?: string): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, userId: string, updates: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string, userId: string): Promise<boolean>;
  
  getEnquiriesByPropertyIds(propertyIds: string[]): Promise<Enquiry[]>;
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
}

export class DatabaseStorage implements IStorage {
  async createUser(email: string, password: string, fullName?: string, phone?: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        fullName: fullName || null,
        phone: phone || null,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async getProperties(available?: boolean): Promise<Property[]> {
    if (available !== undefined) {
      return db.select().from(properties).where(eq(properties.available, available)).orderBy(desc(properties.createdAt));
    }
    return db.select().from(properties).orderBy(desc(properties.createdAt));
  }

  async getPropertyById(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByUserId(userId: string): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.userId, userId)).orderBy(desc(properties.createdAt));
  }

  async getPropertiesByType(type: string, excludeId?: string): Promise<Property[]> {
    if (excludeId) {
      return db.select().from(properties)
        .where(and(eq(properties.type, type), eq(properties.available, true)))
        .orderBy(desc(properties.createdAt))
        .limit(3);
    }
    return db.select().from(properties)
      .where(and(eq(properties.type, type), eq(properties.available, true)))
      .orderBy(desc(properties.createdAt))
      .limit(3);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, userId: string, updates: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updated] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(properties.id, id), eq(properties.userId, userId)))
      .returning();
    return updated;
  }

  async deleteProperty(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(properties)
      .where(and(eq(properties.id, id), eq(properties.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getEnquiriesByPropertyIds(propertyIds: string[]): Promise<Enquiry[]> {
    if (propertyIds.length === 0) return [];
    const allEnquiries: Enquiry[] = [];
    for (const propertyId of propertyIds) {
      const propertyEnquiries = await db.select().from(enquiries).where(eq(enquiries.propertyId, propertyId));
      allEnquiries.push(...propertyEnquiries);
    }
    return allEnquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const [newEnquiry] = await db.insert(enquiries).values(enquiry).returning();
    return newEnquiry;
  }
}

export const storage = new DatabaseStorage();
