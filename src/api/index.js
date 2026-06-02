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

const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    // base64url → base64 → decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const claims = JSON.parse(json);
    const roles = (claims.roles || []).map((r) =>
      r.startsWith("ROLE_") ? r : `ROLE_${r}`,
    );
    return {
      id: claims.userId,
      email: claims.sub,
      name: claims.name || claims.sub,
      roles,
    };
  } catch {
    return null;
  }
};

// Auth
export const authAPI = {
  login: (body) => request("POST", "/auth/login", body),
  register: (body) => request("POST", "/auth/register", body),
  logout: () => request("POST", "/auth/logout"),
  me: () => {
    const token = getToken();
    if (!token) return Promise.reject(new Error("No token"));
    const user = decodeJwt(token);
    if (!user) return Promise.reject(new Error("Invalid token"));
    return Promise.resolve({ data: user });
  },
  changePassword: (body) => request("PUT", "/auth/change-password", body),
};

// Books
export const bookAPI = {
  getAll: (params) => request("GET", "/books", null, params),
  getById: (id) => request("GET", `/books/${id}`),
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
  create: (body) => request("POST", "/orders/checkout", body),
  getMyOrders: (params) => request("GET", "/orders", null, params),
  getById: (id) => request("GET", `/orders/${id}`),
  cancel: (id) => request("PATCH", `/orders/${id}/cancel`),
};

// Coupons
export const couponAPI = {
  validate: (code, subtotal) =>
    request("GET", "/coupons/preview", null, { code, subtotal }),
};

// Address
export const addressAPI = {
  getAll: () => request("GET", "/addresses"),
  create: (body) => request("POST", "/addresses", body),
  update: (id, body) => request("PUT", `/addresses/${id}`, body),
  delete: (id) => request("DELETE", `/addresses/${id}`),
  setDefault: (id) => request("PATCH", `/addresses/${id}/default`),
};

// Reviews
export const reviewAPI = {
  getByBook: (bookId, params) =>
    request("GET", `/reviews/book/${bookId}`, null, params),
  create: (body) => request("POST", "/reviews", body),
  update: (id, body) => request("PUT", `/reviews/${id}`, body),
  delete: (id) => request("DELETE", `/reviews/${id}`),
};
