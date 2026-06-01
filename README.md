# 📚 BookStore Frontend

Website thương mại điện tử bán sách - React + Tailwind CSS

## Cấu trúc dự án

```
src/
├── api/           # Tất cả API calls (async/await)
├── context/       # AuthContext, CartContext (React Context)
├── hooks/         # useAsync, usePagination, useToast
├── components/
│   ├── layout/    # Navbar, Footer
│   ├── common/    # Toast, Spinner, Pagination, Modal, ...
│   └── book/      # BookCard
├── pages/
│   ├── HomePage.jsx
│   ├── BooksPage.jsx       # Danh sách + bộ lọc
│   ├── BookDetailPage.jsx  # Chi tiết + reviews
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx    # Địa chỉ + coupon + đặt hàng
│   ├── OrderPages.jsx      # Danh sách + chi tiết đơn hàng
│   ├── AuthPages.jsx       # Login + Register
│   └── ProfilePage.jsx
└── utils/         # formatPrice, formatDate, constants
```

## Cài đặt & Chạy

```bash
# Cài dependencies
npm install

# Chạy dev server (port 3000)
npm run dev

# Build production
npm run build
```

## Yêu cầu

- Node.js >= 18
- Backend đang chạy tại `http://localhost:8080`

## Tính năng

- ✅ Async/await toàn bộ API calls
- ✅ Responsive (mobile-first với Tailwind)
- ✅ Authentication (JWT Bearer Token)
- ✅ Giỏ hàng real-time
- ✅ Tìm kiếm & lọc sách
- ✅ Đặt hàng + coupon
- ✅ Quản lý địa chỉ giao hàng
- ✅ Đánh giá sách
- ✅ Theo dõi đơn hàng
- ✅ Protected routes
- ✅ Loading states & error handling

## Cấu hình API

Mặc định kết nối `http://localhost:8080`. Để thay đổi, sửa `BASE_URL` trong `src/api/index.js`.
