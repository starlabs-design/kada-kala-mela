import type {
  InventoryItem,
  InsertInventoryItem,
  Seller,
  InsertSeller,
  Transaction,
  InsertTransaction,
  Settings,
  InsertSettings,
} from "@shared/schema";

const API_BASE = "";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const inventoryAPI = {
  getAll: () => fetchAPI<InventoryItem[]>("/api/inventory"),
  getById: (id: number) => fetchAPI<InventoryItem>(`/api/inventory/${id}`),
  create: (data: InsertInventoryItem) =>
    fetchAPI<InventoryItem>("/api/inventory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<InsertInventoryItem>) =>
    fetchAPI<InventoryItem>(`/api/inventory/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/api/inventory/${id}`, {
      method: "DELETE",
    }),
};

export const sellersAPI = {
  getAll: () => fetchAPI<Seller[]>("/api/sellers"),
  getById: (id: number) => fetchAPI<Seller>(`/api/sellers/${id}`),
  create: (data: InsertSeller) =>
    fetchAPI<Seller>("/api/sellers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<InsertSeller>) =>
    fetchAPI<Seller>(`/api/sellers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/api/sellers/${id}`, {
      method: "DELETE",
    }),
};

export const transactionsAPI = {
  getAll: () => fetchAPI<Transaction[]>("/api/transactions"),
  getById: (id: number) => fetchAPI<Transaction>(`/api/transactions/${id}`),
  create: (data: InsertTransaction) =>
    fetchAPI<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/api/transactions/${id}`, {
      method: "DELETE",
    }),
};

export const settingsAPI = {
  get: () => fetchAPI<Settings>("/api/settings"),
  update: (data: Partial<InsertSettings>) =>
    fetchAPI<Settings>("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
