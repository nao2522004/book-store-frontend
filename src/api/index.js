const BASE_URL = "http://localhost:8080";

const getToken = () => localStorage.getItem("accessToken");

const headers = (isJson = true) => {
  const h = {};
  if (isJson) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

const request = async (method, path, body = null, params = null) => {
  let url = `${BASE_URL}${path}`;
  if (params) {
    const q = new URLSearchParams(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    );
    if ([...q].length) url += `?${q}`;
  }
  const res = await fetch(url, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// Auth
export const authAPI = {
  login: (body) => request("POST", "/auth/login", body),
  register: (body) => request("POST", "/auth/register", body),
  logout: () => request("POST", "/auth/logout"),
  me: () => request("GET", "/books"),
  changePassword: (body) => request("PUT", "/auth/change-password", body),
};

// Books
export const bookAPI = {
  getAll: (params) => request("GET", "/books", null, params),
  getById: (id) => request("GET", `/books/${id}`),
  search: (params) => request("GET", "/books/search", null, params),
  create: (body) => request("POST", "/books", body),
  update: (id, body) => request("PUT", `/books/${id}`, body),
  delete: (id) => request("DELETE", `/books/${id}`),
};

// Categories
export const categoryAPI = {
  getAll: (params) => request("GET", "/categories", null, params),
  getById: (id) => request("GET", `/categories/${id}`),
  create: (body) => request("POST", "/categories", body),
  update: (id, body) => request("PUT", `/categories/${id}`, body),
  delete: (id) => request("DELETE", `/categories/${id}`),
};

// Authors
export const authorAPI = {
  getAll: (params) => request("GET", "/authors", null, params),
  getById: (id) => request("GET", `/authors/${id}`),
  create: (body) => request("POST", "/authors", body),
  update: (id, body) => request("PUT", `/authors/${id}`, body),
  delete: (id) => request("DELETE", `/authors/${id}`),
};

// Publishers
export const publisherAPI = {
  getAll: (params) => request("GET", "/publishers", null, params),
  getById: (id) => request("GET", `/publishers/${id}`),
  create: (body) => request("POST", "/publishers", body),
  update: (id, body) => request("PUT", `/publishers/${id}`, body),
  delete: (id) => request("DELETE", `/publishers/${id}`),
};

// Cart
export const cartAPI = {
  get: () => request("GET", "/cart"),
  addItem: (body) => request("POST", "/cart/items", body),
  updateItem: (bookId, body) => request("PUT", `/cart/items/${bookId}`, body),
  removeItem: (bookId) => request("DELETE", `/cart/items/${bookId}`),
  clear: () => request("DELETE", "/cart"),
};

// Orders
export const orderAPI = {
  create: (body) => request("POST", "/orders", body),
  getMyOrders: (params) => request("GET", "/orders/my-orders", null, params),
  getById: (id) => request("GET", `/orders/${id}`),
  cancel: (id) => request("PUT", `/orders/${id}/cancel`),
};

// Coupons
export const couponAPI = {
  validate: (code) => request("GET", "/coupons/validate", null, { code }),
};

// Address
export const addressAPI = {
  getAll: () => request("GET", "/addresses"),
  create: (body) => request("POST", "/addresses", body),
  update: (id, body) => request("PUT", `/addresses/${id}`, body),
  delete: (id) => request("DELETE", `/addresses/${id}`),
  setDefault: (id) => request("PUT", `/addresses/${id}/default`),
};

// Reviews
export const reviewAPI = {
  getByBook: (bookId, params) =>
    request("GET", `/reviews/book/${bookId}`, null, params),
  create: (body) => request("POST", "/reviews", body),
  update: (id, body) => request("PUT", `/reviews/${id}`, body),
  delete: (id) => request("DELETE", `/reviews/${id}`),
};
