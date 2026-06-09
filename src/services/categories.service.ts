const API_BASE = "http://localhost:5000";

export const categoriesApi = {
  async getAllCategories() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("[CategoriesAPI] Failed to fetch categories:", err);
      return [];
    }
  }
};
