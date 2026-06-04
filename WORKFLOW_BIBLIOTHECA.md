# 📋 BIBLIOTHECA — LUỒNG CÔNG VIỆC DỰ ÁN (WORKFLOW / TO-DO LIST)

> **Dự án:** Bibliotheca Bookstore — Web bán sách cổ điển  
> **Stack:** ReactJS (Vite + Tailwind) · Java Spring Boot 3.x · MySQL  
> **Ngày lập:** 2026-06-02  
> **Trạng thái:** Giao diện cơ bản hoàn thiện — đang sửa lỗi tích hợp API & bổ sung tính năng

---

## 🔴 PHẦN A: DANH SÁCH CÁC VIỆC CẦN LÀM MỚI

---

### A1. XÁC THỰC & BẢO MẬT

---

- [ ] **Implement Silent Token Refresh (Auto Refresh Access Token)**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Access Token hết hạn sau 15 phút. Cần dùng Axios interceptor (hoặc custom `request` wrapper) để bắt lỗi `401`, tự động gọi `POST /auth/refresh` (dùng HttpOnly cookie `refreshToken`), lấy Access Token mới, lưu vào `localStorage`, rồi retry request gốc. Nếu refresh cũng thất bại → logout hoàn toàn. Hiện tại `src/api/index.js` dùng `fetch` thuần nên cần refactor hoặc bọc thêm logic này.

---

### A2. TRANG ADMIN

---

- [ ] **Tạo Layout Admin & Route Guard cho ROLE_ADMIN**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Navbar đã có link `/admin` nhưng route này trả 404. Cần tạo `AdminLayout.jsx` với sidebar riêng, và `AdminRoute` guard kiểm tra `user.roles?.includes('ROLE_ADMIN')`. Đặt tất cả sub-route admin dưới prefix `/admin/*`.

- [ ] **Trang Admin: Quản lý Sách (CRUD)**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Gọi các endpoint `POST /admin/books`, `PUT /admin/books/{id}`, `DELETE /admin/books/{id}`. Form cần có: title, slug, description, isbn, price, discountPrice, stockQuantity, pages, language, categoryId, publisherId, publishedDate, status (`ACTIVE`/`INACTIVE`/`OUT_OF_STOCK`), authorIds (multi-select). Hiển thị bảng danh sách với phân trang, tìm kiếm.

- [ ] **Trang Admin: Quản lý Đơn hàng**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Gọi `GET /admin/orders` (có filter theo `status`). Chi tiết đơn dùng `GET /admin/orders/{id}`. Cập nhật trạng thái qua `PATCH /admin/orders/{id}/status` — cần hiển thị đúng state machine: `PENDING→CONFIRMED→PROCESSING→SHIPPED→DELIVERED`. Cập nhật thanh toán qua `PATCH /admin/orders/{id}/payment`.

- [ ] **Trang Admin: Quản lý Coupon (CRUD)**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Gọi các endpoint `/admin/coupons`. Form tạo/sửa coupon gồm: code (uppercase), type (`PERCENTAGE`/`FIXED_AMOUNT`), value, minOrderAmount, maxDiscountAmount, usageLimit, startDate, endDate, status. Lưu ý: coupon đã dùng (`usedCount > 0`) không xóa được — chỉ cho phép chuyển sang `INACTIVE`.

- [ ] **Trang Admin: Quản lý Danh mục, Tác giả, NXB (CRUD)**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Dùng các endpoint `/admin/categories`, `/admin/authors`, `/admin/publishers`. Danh mục hỗ trợ phân cấp cha-con (trường `parentId`). Khi xóa: không được xóa nếu còn sách liên kết hoặc còn danh mục con — cần xử lý thông báo lỗi thân thiện.

---

### A3. TÍNH NĂNG NGƯỜI DÙNG

---

- [ ] **Thêm trường Phương thức thanh toán vào CheckoutPage**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Backend yêu cầu `paymentMethod` bắt buộc khi gọi `POST /orders/checkout`. Cần thêm UI chọn: `COD` (Thu tiền khi nhận), `BANKING`, `MOMO`, `ZALOPAY`, `VNPAY`. Mặc định chọn `COD`. Lưu ý: các phương thức online chưa tích hợp cổng thanh toán thực tế — có thể hiển thị thông báo "sắp ra mắt".

- [ ] **Tính năng Wishlist (Danh sách yêu thích)**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Backend đã có bảng `wishlists` và API đầy đủ. Cần thêm nút trái tim trên `BookCard` và `BookDetailPage`. Tạo `wishlistAPI` trong `src/api/index.js`. Tạo trang `/profile/wishlist` liệt kê sách đã yêu thích. Dùng `WishlistContext` hoặc lưu state trong ProfilePage.

- [ ] **Tính năng Thông báo (Notifications)**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Backend có bảng `notifications` với type `ORDER`, `PROMOTION`, `SYSTEM`, `REVIEW`. Thêm icon chuông vào Navbar với badge số thông báo chưa đọc. Tạo dropdown hoặc trang `/notifications` hiển thị danh sách. Gọi API đánh dấu đã đọc khi click.

- [ ] **Quản lý Địa chỉ trong ProfilePage**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Hiện ProfilePage chỉ có đổi mật khẩu. Cần thêm tab/section "Địa chỉ của tôi" với CRUD đầy đủ. Dùng các API `/addresses` đã có trong `src/api/index.js`. Cho phép đặt địa chỉ mặc định (`PATCH /addresses/{id}/default`). Lưu ý: không cho xóa địa chỉ đang là default.

- [ ] **Lọc đơn hàng theo trạng thái trong OrdersPage**
  - **Độ ưu tiên:** Thấp
  - **Mô tả & Lưu ý kỹ thuật:** API `GET /orders` hỗ trợ query param `status`. Thêm tabs hoặc select filter: Tất cả / Chờ xác nhận / Đang giao / Đã giao / Đã huỷ.

- [ ] **Ghi nhận lịch sử xem sách**
  - **Độ ưu tiên:** Thấp
  - **Mô tả & Lưu ý kỹ thuật:** Khi user đã đăng nhập vào `BookDetailPage`, gọi API ghi nhận vào `view_histories`. Không block UI nếu call này thất bại (fire-and-forget). Có thể hiển thị "Đã xem gần đây" trong ProfilePage sau.

---

## 🟠 PHẦN B: DANH SÁCH CÁC VIỆC CẦN SỬA ĐỔI / TỐI ƯU

---

### B1. LỖI NGHIÊM TRỌNG — SẼ CRASH (Sửa ngay)

---

- [ ] **Sửa `authAPI.me()` đang gọi sai endpoint**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** `src/api/index.js` đang gọi `request("GET", "/books")` thay vì lấy thông tin user. Backend không có endpoint `/auth/me`. Giải pháp: decode JWT trực tiếp ở client để lấy `userId`, `email`, `roles` từ payload (dùng thư viện `jwt-decode` hoặc decode thủ công base64). Cập nhật `AuthContext` để parse token thay vì gọi API.

- [ ] **Sửa `orderAPI.create()` gọi sai endpoint**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** `src/api/index.js` dùng `POST /orders` nhưng backend cần `POST /orders/checkout`. Sửa lại path. Đồng thời kiểm tra request body — cần thêm `paymentMethod` (bắt buộc).

- [ ] **Sửa `orderAPI.cancel()` dùng sai HTTP method**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Đang dùng `PUT /orders/{id}/cancel`, cần đổi sang `PATCH /orders/{id}/cancel`.

- [ ] **Sửa `addressAPI.setDefault()` dùng sai HTTP method**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Đang dùng `PUT /addresses/{id}/default`, cần đổi sang `PATCH /addresses/{id}/default`.

- [ ] **Sửa `couponAPI.validate()` — sai endpoint và thiếu param**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** 2 vấn đề: (1) Endpoint sai `/coupons/validate` → đổi thành `/coupons/preview`. (2) API yêu cầu cả `code` lẫn `subtotal` (tổng tiền giỏ hàng hiện tại). Cập nhật `couponAPI.validate(code, subtotal)` và truyền `totalPrice` từ CartContext vào `CheckoutPage` khi gọi.

- [ ] **Sửa `bookAPI.search()` — endpoint không tồn tại**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** `BooksPage.jsx` gọi `/books/search` khi có keyword nhưng backend không có route này. Cần dùng `GET /books` với query param `keyword` cho cả hai trường hợp. Xóa hàm `search` khỏi `bookAPI`, thay vào đó truyền `keyword` vào `bookAPI.getAll(params)`.

---

### B2. LỖI DỮ LIỆU — FIELD MAPPING SAI

---

- [ ] **Sửa mapping field địa chỉ (Address)**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Backend trả `fullName`, `street`, `province` nhưng frontend dùng `recipientName`, `address`, `city`. Cần cập nhật toàn bộ: `CheckoutPage.jsx` (form thêm địa chỉ, hiển thị danh sách), `OrderDetailPage` (hiển thị địa chỉ đơn hàng). Mapping đúng: `fullName`↔`recipientName`, `street`↔`address`, `province`↔`city`.

- [ ] **Sửa mapping field OrderResponse**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** `OrderDetailPage` dùng `order.subtotalAmount` và `order.discountAmount` nhưng backend trả `subtotal` và `discountAmount`. Sửa lại các tham chiếu trong `OrderPages.jsx`.

- [ ] **Sửa mapping field CartResponse**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Backend trả `bookCoverUrl` và `unitPrice` (không phải `coverImageUrl` và `price`). Kiểm tra `CartContext` và `CartPage.jsx`. Cần đảm bảo `totalPrice` trong CartContext tính đúng từ `item.unitPrice * item.quantity`.

- [ ] **Sửa hiển thị `publishedYear` trong BookDetailPage**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Backend lưu `publishedDate` (datetime string), không có `publishedYear`. Trong `BookDetailPage.jsx` cần đổi `book.publishedYear` thành `new Date(book.publishedDate).getFullYear()`. Thêm guard nếu `publishedDate` là null.

- [ ] **Sửa hiển thị `discountPercent` trong BookCard và BookDetailPage**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Backend không có trường `discountPercent`. Cần tính ở phía client: `Math.round((1 - book.discountPrice / book.price) * 100)`. Tạo helper `getDiscountPercent(book)` trong `src/utils/index.js` để tái sử dụng.

---

### B3. LỖI LOGIC PHÂN TRANG (Page chưa được fix đúng số hay sao ớ)

---

- [ ] **Sửa lệch số trang do `one-indexed-parameters`**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Backend cấu hình `spring.data.web.pageable.one-indexed-parameters=true` — page bắt đầu từ **1**, không phải **0**. Toàn bộ frontend đang gửi `page: 0` cho trang đầu, gây lệch dữ liệu. Cần sửa: (1) `usePagination` hook trong `src/hooks/index.js` — đổi `page: 0` thành `page: 1` và tăng +1 khi gửi request. (2) `Pagination` component — điều chỉnh lại logic hiển thị số trang cho khớp. (3) Kiểm tra `PageResponse`: backend trả `hasNext`/`hasPrevious` thay vì `last`/`first` — sửa trong component `Pagination`.

- [ ] **Sửa format params sort**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Frontend gửi `sort: "createdAt,desc"` (Spring MVC default) nhưng backend nhận `sortBy` và `sortDir` riêng biệt. Sửa `BooksPage.jsx` — split giá trị sort thành 2 params khi gọi API: `{ sortBy: "createdAt", sortDir: "desc" }`.

---

### B4. TỐI ƯU CODE & CẤU TRÚC

---

- [ ] **Refactor `src/api/index.js` — Thêm interceptor xử lý 401**
  - **Độ ưu tiên:** Cao
  - **Mô tả & Lưu ý kỹ thuật:** Hiện tại dùng `fetch` thuần, không có cơ chế retry. Cân nhắc chuyển sang `axios` để dễ dùng interceptor, hoặc bọc hàm `request()` hiện tại với logic: nếu nhận 401 và chưa retry → gọi `/auth/refresh` → cập nhật token → retry request gốc. Thêm cờ `isRetrying` để tránh vòng lặp vô hạn.

- [ ] **Bổ sung trạng thái đơn hàng còn thiếu trong `utils/index.js`**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Backend có thêm `PROCESSING` và `RETURNED` trong enum `OrderStatus` nhưng `getOrderStatusLabel()` và `getOrderStatusColor()` chưa có. Bổ sung cả nhãn hiển thị lẫn màu sắc (gợi ý: `PROCESSING` → màu indigo, `RETURNED` → màu orange).

- [ ] **Tách `adminAPI` riêng trong `src/api/index.js`**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Tạo object `adminAPI` tập hợp tất cả các call đến `/admin/*` (books, categories, authors, publishers, orders, coupons) để dễ quản lý và phân biệt với API public.

- [ ] **Thêm Error Boundary cho các page chính**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Khi API lỗi mà không bắt được, React crash toàn màn hình trắng. Bọc các `<Route>` chính trong `<ErrorBoundary>` để hiển thị UI lỗi thân thiện thay vì crash.

- [ ] **Tối ưu `useAsync` và `usePagination` hooks**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** `useAsync` hiện không có cơ chế cancel (cleanup) khi component unmount → có thể gây lỗi "setState on unmounted component". Thêm `AbortController` vào `fetch` calls hoặc dùng flag `isMounted`.

- [ ] **Thêm loading skeleton thay vì chỉ dùng Spinner**
  - **Độ ưu tiên:** Thấp
  - **Mô tả & Lưu ý kỹ thuật:** UX tốt hơn khi hiển thị skeleton card (placeholder có hình dạng nội dung) thay vì spinner giữa màn hình. Tạo `BookCardSkeleton.jsx` dùng Tailwind `animate-pulse`.

- [ ] **Lazy loading các trang (Code Splitting)**
  - **Độ ưu tiên:** Thấp
  - **Mô tả & Lưu ý kỹ thuật:** Dùng `React.lazy()` + `Suspense` cho các page (đặc biệt AdminPages) để giảm bundle size ban đầu. Thêm fallback `<LoadingPage />` trong `Suspense`.

---

### B5. BẢO MẬT & KIỂM TRA

---

- [ ] **Kiểm tra và vá lỗ hổng API public write (Books/Categories/Authors/Publishers)**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Theo spec, các endpoint `POST/PUT/DELETE /books`, `/categories`, `/authors`, `/publishers` (không có prefix `/admin`) đang được cấu hình `permitAll` — ai cũng có thể gọi. Frontend không nên gọi các endpoint này; chỉ dùng các endpoint `/admin/*` đã được bảo vệ. Cần yêu cầu backend team sửa `SecurityConfig` đồng thời.

- [ ] **Validate form phía client cho CheckoutPage**
  - **Độ ưu tiên:** Trung bình
  - **Mô tả & Lưu ý kỹ thuật:** Thêm validate số điện thoại theo regex VN `^(0[3|5|7|8|9])+([0-9]{8})$` khi thêm địa chỉ mới. Kiểm tra giỏ hàng không rỗng trước khi cho phép vào trang checkout. Hiển thị lỗi rõ ràng từng field.

---

## 📊 TỔNG KẾT ƯU TIÊN

| Mức độ        | Số lượng | Ghi chú                                  |
| ------------- | -------- | ---------------------------------------- |
| 🔴 Cao        | 14       | Cần giải quyết trước khi demo/production |
| 🟠 Trung bình | 10       | Hoàn thiện trong sprint tiếp theo        |
| 🟡 Thấp       | 4        | Nice-to-have, làm sau khi ổn định        |

---

> **Gợi ý thứ tự Sprint:**
>
> **Sprint 1 (Sửa lỗi cốt lõi):** Toàn bộ mục B1 + B2 + B3 → hệ thống hoạt động đúng  
> **Sprint 2 (Admin & Checkout):** A2 (Admin Layout + Sách + Đơn hàng) + A3 (Phương thức thanh toán)  
> **Sprint 3 (Tính năng người dùng):** A3 (Wishlist, Notifications, Quản lý địa chỉ) + B4 (Refactor)  
> **Sprint 4 (Hoàn thiện):** Admin Coupon/Category/Author/NXB + B5 + các việc độ ưu tiên Thấp
