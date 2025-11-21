// Map mã lỗi -> thông điệp hiển thị cho người dùng (tiếng Việt, không “Firebase…”)
const MESSAGES: Record<string, string> = {
  // ==== lỗi app tùy chỉnh ====
  "app/email-not-verified": "Email chưa xác minh. Hãy kiểm tra hộp thư rồi thử lại.",
  // ==== Firebase Auth phổ biến ====
  "auth/invalid-credential": "Thông tin đăng nhập không đúng.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/user-not-found": "Email chưa đăng ký.",
  "auth/wrong-password": "Mật khẩu không đúng.",
  "auth/too-many-requests": "Bạn thao tác quá nhiều. Vui lòng thử lại sau.",
  "auth/email-already-in-use": "Email đã được sử dụng.",
  "auth/weak-password": "Mật khẩu quá yếu.",
  "auth/network-request-failed": "Lỗi mạng. Hãy kiểm tra kết nối.",
  "auth/missing-email": "Vui lòng nhập email.",
};

export function humanizeAuthError(err: unknown): string {
  // Ưu tiên lấy err.code; fallback parse từ message
  const code =
    (err as any)?.code ||
    ((err as any)?.message && String((err as any).message).match(/auth\/[a-z0-9-]+/i)?.[0]) ||
    "";

  if (code && MESSAGES[code]) return MESSAGES[code];

  // Nếu là string thuần do bạn ném ra
  if (typeof err === "string" && MESSAGES[err]) return MESSAGES[err];

  // Fallback an toàn, không lộ nội bộ
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
