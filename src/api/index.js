const BASE_URL = "http://localhost:8080";

const getToken = () => localStorage.getItem("accessToken");

const setToken = (token) => {
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
};

const headers = (isJson = true) => {
  const h = {};
  if (isJson) h["Content-Type"] = "application/json";
  const token = getToken();
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
};

//  Refresh logic
// refreshPromise dedup: nếu nhiều request cùng nhận 401 đồng thời,
// chỉ gọi /auth/refresh 1 lần, tất cả cùng chờ promise đó.
let refreshPromise = null;

// Callback để AuthContext đăng ký — gọi khi refresh thất bại hoàn toàn
let onAuthFailure = null;
export const setAuthFailureHandler = (fn) => {
  onAuthFailure = fn;
};

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // gửi HttpOnly cookie refreshToken
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setToken(null);
      throw new Error(data.message || "Phiên đăng nhập đã hết hạn");
    }
    setToken(data.data.accessToken);
    return data.data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

//  Core request
const AUTH_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
]);

const request = async (
  method,
  path,
  body = null,
  params = null,
  { retried = false, signal } = {},
) => {
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
    credentials: "include",
    signal,
  });

  const data = await res.json().catch(() => ({}));

  //  Silent refresh
  if (res.status === 401 && !retried && !AUTH_PATHS.has(path) && getToken()) {
    try {
      await refreshAccessToken();
      // Retry request gốc với token mới (headers() sẽ tự đọc token mới)
      return request(method, path, body, params, { retried: true, signal });
    } catch (err) {
      // Refresh thất bại → báo AuthContext logout UI
      onAuthFailure?.();
      throw err;
    }
  }

  //  401 không có token (chưa đăng nhập) → không cần xử lý
  if (res.status === 401 && !getToken()) {
    onAuthFailure?.();
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

//  Decode JWT
const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
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

//  API exports
export const authAPI = {
  login: (body) => request("POST", "/auth/login", body),
  register: (body) => request("POST", "/auth/register", body),
  refresh: () => request("POST", "/auth/refresh"),
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

export const bookAPI = {
  getAll: (params, options) => request("GET", "/books", null, params, options),
  getById: (id, options) => request("GET", `/books/${id}`, null, null, options),
};

export const categoryAPI = {
  getAll: (params, options) =>
    request("GET", "/categories", null, params, options),
  getById: (id, options) =>
    request("GET", `/categories/${id}`, null, null, options),
};

export const authorAPI = {
  getAll: (params, options) =>
    request("GET", "/authors", null, params, options),
  getById: (id, options) =>
    request("GET", `/authors/${id}`, null, null, options),
};

export const publisherAPI = {
  getAll: (params, options) =>
    request("GET", "/publishers", null, params, options),
  getById: (id, options) =>
    request("GET", `/publishers/${id}`, null, null, options),
};

export const adminAPI = {
  books: {
    create: (body) => request("POST", "/admin/books", body),
    update: (id, body) => request("PUT", `/admin/books/${id}`, body),
    delete: (id) => request("DELETE", `/admin/books/${id}`),
  },
  categories: {
    create: (body) => request("POST", "/admin/categories", body),
    update: (id, body) => request("PUT", `/admin/categories/${id}`, body),
    delete: (id) => request("DELETE", `/admin/categories/${id}`),
  },
  authors: {
    create: (body) => request("POST", "/admin/authors", body),
    update: (id, body) => request("PUT", `/admin/authors/${id}`, body),
    delete: (id) => request("DELETE", `/admin/authors/${id}`),
  },
  publishers: {
    create: (body) => request("POST", "/admin/publishers", body),
    update: (id, body) => request("PUT", `/admin/publishers/${id}`, body),
    delete: (id) => request("DELETE", `/admin/publishers/${id}`),
  },
  orders: {
    getAll: (params) => request("GET", "/admin/orders", null, params),
    getById: (id) => request("GET", `/admin/orders/${id}`),
    updateStatus: (id, status) =>
      request("PATCH", `/admin/orders/${id}/status`, null, { status }),
    updatePayment: (id, paymentStatus) =>
      request("PATCH", `/admin/orders/${id}/payment`, { paymentStatus }),
  },
  coupons: {
    getAll: () => request("GET", "/admin/coupons"),
    getById: (id) => request("GET", `/admin/coupons/${id}`),
    create: (body) => request("POST", "/admin/coupons", body),
    update: (id, body) => request("PUT", `/admin/coupons/${id}`, body),
    delete: (id) => request("DELETE", `/admin/coupons/${id}`),
  },
};

export const cartAPI = {
  get: () => request("GET", "/cart"),
  addItem: (body) => request("POST", "/cart/items", body),
  updateItem: (bookId, body) => request("PUT", `/cart/items/${bookId}`, body),
  removeItem: (bookId) => request("DELETE", `/cart/items/${bookId}`),
  clear: () => request("DELETE", "/cart"),
};

export const orderAPI = {
  create: (body) => request("POST", "/orders/checkout", body),
  getMyOrders: (params) => request("GET", "/orders", null, params),
  getById: (id) => request("GET", `/orders/${id}`),
  cancel: (id) => request("PATCH", `/orders/${id}/cancel`),
};

export const couponAPI = {
  validate: (code, subtotal) =>
    request("GET", "/coupons/preview", null, { code, subtotal }),
};

export const addressAPI = {
  getAll: () => request("GET", "/addresses"),
  create: (body) => request("POST", "/addresses", body),
  update: (id, body) => request("PUT", `/addresses/${id}`, body),
  delete: (id) => request("DELETE", `/addresses/${id}`),
  setDefault: (id) => request("PATCH", `/addresses/${id}/default`),
};

export const reviewAPI = {
  getByBook: (bookId, params) =>
    request("GET", `/reviews/book/${bookId}`, null, params),
  create: (body) => request("POST", "/reviews", body),
  update: (id, body) => request("PUT", `/reviews/${id}`, body),
  delete: (id) => request("DELETE", `/reviews/${id}`),
};
