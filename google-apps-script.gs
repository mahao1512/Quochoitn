/**
 * Nhận dữ liệu người điền từ index.html và ghi vào Google Sheet.
 *
 * Cách cài:
 * 1. Tạo một Google Sheet mới (đây sẽ là file data để kiểm tra).
 * 2. Trong Sheet: Tiện ích mở rộng → Apps Script, xoá code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Triển khai → Tùy chọn triển khai mới → Loại: Ứng dụng web
 *      - Thực thi dưới dạng: Tôi
 *      - Người có quyền truy cập: Bất kỳ ai
 *    Bấm Triển khai, cấp quyền, rồi sao chép "URL ứng dụng web" (kết thúc bằng /exec).
 * 4. Dán URL đó vào biến SHEET_URL trong index.html.
 *
 * Mỗi lần sửa file này phải vào Triển khai → Quản lý triển khai → sửa → Phiên bản mới thì mới có hiệu lực.
 */
var SHEET_NAME = "Data";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var d = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Thời gian", "Họ và tên", "Lớp", "Hoạt động", "Thiết bị"]);
      sh.setFrozenRows(1);
    }
    sh.appendRow([new Date(), clean(d.name, 80), clean(d.lop, 40), clean(d.action, 200), clean(d.ua, 300)]);
    return ContentService.createTextOutput("ok");
  } catch (err) {
    return ContentService.createTextOutput("error");
  } finally {
    lock.releaseLock();
  }
}

// Cắt độ dài và chặn công thức (=, +, -, @) để người điền không chèn được công thức vào Sheet.
function clean(v, max) {
  var s = String(v == null ? "" : v).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
