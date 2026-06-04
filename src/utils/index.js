export const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

export const formatDate = (date) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + "..." : str;

export const getOrderStatusColor = (status) => {
  const map = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-orange-100 text-orange-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
};

export const getOrderStatusLabel = (status) => {
  const map = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đang giao",
    DELIVERED: "Đã giao",
    CANCELLED: "Đã huỷ",
    RETURNED: "Đã trả hàng",
  };
  return map[status] || status;
};

export const getPaymentStatusLabel = (status) => {
  const map = {
    UNPAID: "Chưa thanh toán",
    PAID: "Đã thanh toán",
    REFUNDED: "Đã hoàn tiền",
  };
  return map[status] || status;
};

export const PLACEHOLDER_BOOK =
  "https://placehold.co/300x400/f0e6d3/8b5e3c?text=📖";

export const getDiscountPercent = (book) => {
  if (!book?.discountPrice || !book?.price || book.discountPrice >= book.price)
    return 0;
  return Math.round((1 - book.discountPrice / book.price) * 100);
};
