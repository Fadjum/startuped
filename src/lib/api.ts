export interface ApiUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
}

export interface ApiProperty {
  id: string;
  userId: string;
  title: string;
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
  available: boolean | null;
  landlordPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEnquiry {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  whatsapp: boolean | null;
  message: string | null;
  createdAt: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
  return response.json();
}

export const api = {
  auth: {
    async signup(email: string, password: string, fullName?: string, phone?: string): Promise<{ user: ApiUser }> {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phone }),
      });
      return handleResponse(res);
    },

    async login(email: string, password: string): Promise<{ user: ApiUser }> {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    async logout(): Promise<void> {
      await fetch("/api/auth/logout", { method: "POST" });
    },

    async me(): Promise<{ user: ApiUser | null }> {
      const res = await fetch("/api/auth/me");
      return handleResponse(res);
    },
  },

  properties: {
    async list(available?: boolean): Promise<ApiProperty[]> {
      const params = available !== undefined ? `?available=${available}` : "";
      const res = await fetch(`/api/properties${params}`);
      return handleResponse(res);
    },

    async get(id: string): Promise<ApiProperty> {
      const res = await fetch(`/api/properties/${id}`);
      return handleResponse(res);
    },

    async getSimilar(id: string): Promise<ApiProperty[]> {
      const res = await fetch(`/api/properties/${id}/similar`);
      return handleResponse(res);
    },

    async getMyProperties(): Promise<ApiProperty[]> {
      const res = await fetch("/api/my/properties");
      return handleResponse(res);
    },

    async create(property: {
      title: string;
      type: string;
      price: number;
      location: string;
      bedrooms: number;
      bathrooms: number;
      description?: string;
      features?: string[];
      images?: string[];
      landlordPhone: string;
    }): Promise<ApiProperty> {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });
      return handleResponse(res);
    },

    async delete(id: string): Promise<void> {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      await handleResponse(res);
    },
  },

  enquiries: {
    async getMyEnquiries(): Promise<ApiEnquiry[]> {
      const res = await fetch("/api/my/enquiries");
      return handleResponse(res);
    },

    async create(enquiry: {
      propertyId: string;
      name: string;
      phone: string;
      whatsapp?: boolean;
      message?: string;
    }): Promise<ApiEnquiry> {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiry),
      });
      return handleResponse(res);
    },
  },

  upload: {
    async uploadImages(files: File[]): Promise<{ results: { success: boolean; url?: string; error?: string }[]; summary: { total: number; successful: number; failed: number } }> {
      const formData = new FormData();
      files.forEach(file => formData.append("files", file));
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      return handleResponse(res);
    },
  },
};
