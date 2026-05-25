const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string | null;
  inStock: boolean;
  createdAt: string;
}

export interface Ad {
  id: number;
  image: string;
  title: string | null;
  link: string | null;
  active: boolean;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  address: string;
  items: CartItemData[];
  total: number;
  notes: string | null;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CartItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

function imageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
}

export { imageUrl };

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("فشل تحميل المنتجات");
    return res.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("المنتج غير موجود");
    return res.json();
  },

  // Ads
  getAds: async (): Promise<Ad[]> => {
    const res = await fetch(`${API_URL}/api/ads`, { cache: "no-store" });
    if (!res.ok) throw new Error("فشل تحميل الإعلانات");
    return res.json();
  },

  // Orders
  createOrder: async (data: {
    customerName: string;
    customerPhone: string;
    address: string;
    items: CartItemData[];
    total: number;
    notes?: string;
  }): Promise<{ message: string; order: Order }> => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل إرسال الطلب");
    }
    return res.json();
  },

  // Admin auth
  adminLogin: async (username: string, password: string): Promise<{ token: string }> => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "بيانات الدخول غير صحيحة");
    }
    return res.json();
  },

  // Admin: Products
  createProduct: async (data: FormData, token: string): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل إضافة المنتج");
    }
    return res.json();
  },

  updateProduct: async (id: number, data: FormData, token: string): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل تعديل المنتج");
    }
    return res.json();
  },

  deleteProduct: async (id: number, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل حذف المنتج");
    }
  },

  // Admin: Orders
  getOrders: async (page: number, token: string): Promise<OrdersResponse> => {
    const res = await fetch(`${API_URL}/api/orders?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("فشل تحميل الطلبات");
    return res.json();
  },

  updateOrderStatus: async (id: number, status: string, token: string): Promise<Order> => {
    const res = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل تحديث الحالة");
    }
    return res.json();
  },

  // Admin: Ads
  getAllAds: async (token: string): Promise<Ad[]> => {
    const res = await fetch(`${API_URL}/api/ads/all`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("فشل تحميل الإعلانات");
    return res.json();
  },

  createAd: async (data: FormData, token: string): Promise<Ad> => {
    const res = await fetch(`${API_URL}/api/ads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل إضافة الإعلان");
    }
    return res.json();
  },

  deleteAd: async (id: number, token: string): Promise<void> => {
    const res = await fetch(`${API_URL}/api/ads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل حذف الإعلان");
    }
  },
};
