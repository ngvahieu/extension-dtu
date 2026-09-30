# 🎓 Hieu Extension Pro — DTU Student Assistant Suite

> **Bộ tiện ích mở rộng (Extension) hỗ trợ thao tác học tập, tra cứu, tự động hoá và tối ưu trải nghiệm trên cổng thông tin sinh viên Đại học Duy Tân (DTU).**

---

## 📑 Mục lục
1. [Giới thiệu tổng quan](#-giới-thiệu-tổng-quan)
2. [Các tính năng nổi bật](#-các-tính-năng-nổi-bật)
3. [Cấu trúc dự án](#-cấu-trúc-dự-án)
4. [Hướng dẫn cài đặt & sử dụng: Hieu Extension Chrome](#-hướng-dẫn-cài-đặt--sử-dụng-hieu-extension-chrome)
5. [Hướng dẫn cài đặt & sử dụng: Hieu Extension Safari](#-hướng-dẫn-cài-đặt--sử-dụng-hieu-extension-safari)
   - [Cách 1: Cài đặt trực tiếp file IPA trên iOS (TrollStore, AltStore, Sideloadly)](#cách-1-cài-đặt-trực-tiếp-file-ipa-trên-ios)
   - [Cách 2: Sử dụng ứng dụng trên macOS](#cách-2-sử-dụng-ứng-dụng-trên-macos)
   - [Cách 3: Tự Build từ mã nguồn Xcode](#cách-3-tự-build-từ-mã-nguồn-xcode)
6. [Cẩm nang sử dụng các tính năng chi tiết](#-cẩm-nang-sử-dụng-các-tính-năng-chi-tiết)
   - [1. Tự động đăng nhập MyDTU & Giải Captcha](#1-tự-động-đăng-nhập-mydtu--giải-captcha)
   - [2. Hỗ trợ Đăng ký môn học siêu tốc](#2-hỗ-trợ-đăng-ký-môn-học-siêu-tốc)
   - [3. Tự động Đánh giá Giảng viên](#3-tự-động-đánh-giá-giảng-viên)
   - [4. AutoQuiz - Làm trắc nghiệm tự động](#4-autoquiz---làm-trắc-nghiệm-tự-động)
   - [5. Menu Nhanh & Thêm liên kết tùy chỉnh](#5-menu-nhanh--thêm-liên-kết-tùy-chỉnh)
   - [6. Ghi chú cá nhân](#6-ghi-chú-cá-nhân)
7. [Bảo mật & Quyền riêng tư](#-bảo-mật--quyền-riêng-tư)
8. [Xử lý sự cố thường gặp (FAQ)](#-xử-lý-sự-cố-thường-gặp-faq)

---

## 🌟 Giới thiệu tổng quan

**Hieu Extension Pro** (phiên bản **`v3.5.8`**) là giải pháp tiện ích mở rộng toàn diện được thiết kế chuyên biệt cho sinh viên Đại học Duy Tân (DTU). Bộ công cụ được đóng gói hoàn chỉnh cho 2 nền tảng trình duyệt lớn nhất hiện nay:

1. 🌐 **Hieu Extension Chrome** (`hieu-extension-chrome/`): Dành cho máy tính sử dụng các trình duyệt nhân Chromium như **Google Chrome, Microsoft Edge, Brave, Cốc Cốc, Opera,...**
2. 🍏 **Hieu Extension Safari** (`hieu-extension-safari/`): Dành cho hệ sinh thái Apple gồm **iPhone, iPad (iOS/iPadOS)** và **máy Mac (macOS)** thông qua ứng dụng Safari Web Extension.

Ứng dụng sở hữu giao diện phong cách **Cyberpunk / Sci-Fi Neon Glow** hiện đại, mượt mà với hiệu ứng sóng động lực học, mang lại trải nghiệm tiện dụng và chuyên nghiệp.

---

## ⚡ Các tính năng nổi bật

- 🤖 **AI / OCR Auto Captcha Solver:** Tự động nhận dạng mã Captcha hình ảnh trên các trang đăng nhập MyDTU, đăng ký môn học và đánh giá giảng viên thông qua API Backend OCR tốc độ cao, điền ngay lập tức vào form. Hỗ trợ tự động thử lại (Auto-retry) nếu gặp lỗi 400 hoặc ảnh mờ.
- 🔑 **Tự động đăng nhập & Điều hướng thông minh MyDTU / Sakai (v3.5.8):** Lưu trữ nhiều tài khoản sinh viên, tự động điền Mã SV, Mật khẩu và click Đăng nhập. Tự động nhận diện và phân luồng đăng nhập giữa Cổng thông tin (Portal) và Hệ thống học trực tuyến Sakai E-learning (`_hieu_login_type`).
- 🔄 **Watchdog thông minh & Tự động phục hồi kết nối (Smart Protected Reload):** Tự động phát hiện khi hệ thống trường gặp lỗi máy chủ (500, 502, 503, 504, Quá tải, Server Error, trang trắng) hoặc bị kẹt treo đăng nhập để refresh lại trang. Tự động nhận diện trang an toàn để vô hiệu hóa reload khi người dùng đã vào MyDTU hoặc đang trong Sakai Portal.
- 📆 **Tự động chọn Năm học & Học kỳ:** Tự động phát hiện và chọn năm học mới nhất, học kỳ mới nhất (HK1, HK2, HK3, Học kỳ hè) và bấm nút Tiếp tục.
- 📚 **Hỗ trợ Đăng ký môn học siêu tốc:** Lưu trước danh sách tối đa 10 mã môn học / mã lớp cần đăng ký. Tự động điền mã lớp vào ô đăng ký, tự động thử lại khi captcha sai và ghi nhận lịch sử môn đã đăng ký thành công.
- 📝 **Đánh giá Giảng viên 1-Click:** Hỗ trợ 6 mức đánh giá (Mức 1: Tốt ➔ Mức 6: Kém). Tự động điền 4 nhận xét ngẫu nhiên (R48: Giảng viên, R49: Phòng ban hỗ trợ, R50: Cơ sở vật chất, R51: Chương trình học) và tích chọn toàn bộ các thang điểm radio tương ứng, tự giải captcha và submit.
- 🎯 **AutoQuiz (Luyện tập trắc nghiệm):** Nhập chuỗi đáp án (ví dụ `1A 2B 3C 4D...`) để tiện ích tự động click chọn đáp án trên tab bài làm trực tuyến với delay điều chỉnh linh hoạt.
- 🚀 **DTU Quick Menu & Custom Links:** Phím tắt 1 chạm truy cập nhanh: Bảng điểm, Điểm chi tiết, Chương trình học, Sakai, MyDTU, Danh sách thi và cho phép thêm các bookmark tùy biến cá nhân (+).
- 📌 **Ghi chú cá nhân (Personal Notes):** Lưu nhanh ghi chú, dặn dò bài tập ngay trên giao diện tiện ích, tự động đồng bộ cục bộ.
- 🛡️ **Bypass Alert/Confirm gián đoạn:** Tự động đóng các pop-up alert xác nhận làm ngắt quãng thao tác của sinh viên.

---

## 📁 Cấu trúc dự án

```text
dtu extension/
├── README.md                      # Tài liệu hướng dẫn chi tiết (File này)
├── hieu-extension-chrome/         # Phiên bản Extension cho Chromium (Chrome, Edge, Cốc Cốc, Brave, Opera)
│   ├── manifest.json              # Manifest V3 (v3.5.8) cấu hình quyền và tài nguyên
│   ├── background.js              # Service Worker: OCR Captcha, điều hướng & Watchdog bảo vệ
│   ├── content.js                 # Script can thiệp DOM: Auto login, điền captcha, đánh giá, đăng ký môn
│   ├── bypass.js                  # Script can thiệp Main World: bypass alert/confirm chặn luồng
│   ├── popup.html                 # Giao diện chính của tiện ích
│   ├── v.js                       # Logic xử lý giao diện popup, lưu trữ local storage
│   ├── v.css                      # Hệ thống style Cyberpunk Neon giao diện
│   └── *.png                      # Bộ icon và tài nguyên đồ họa (16, 32, 48, 128, 512, dtu, book, pen, logo)
│
└── hieu-extension-safari/         # Phiên bản Xcode Safari Web Extension cho iOS & macOS
    ├── Hieu Extension pro v4.ipa  # File IPA v4 mới nhất đã đóng gói sẵn để cài lên iPhone / iPad
    ├── Hieu Extension pro v3.ipa  # File IPA v3
    ├── Hieu Extension pro (macOS).app # Ứng dụng chạy trực tiếp trên macOS
    ├── Hieu Extension pro.xcodeproj # Dự án Xcode nguồn để build hoặc chỉnh sửa
    ├── Shared (App)/              # Mã nguồn giao diện ứng dụng chứa (Container App)
    ├── Shared (Extension)/        # Mã nguồn lõi Safari Extension
    │   ├── Resources/             # Web resources đồng bộ (HTML, CSS, JS)
    │   └── SafariWebExtensionHandler.swift # Cầu nối Native Swift & Web Extension
    ├── iOS (App)/ & iOS (Extension)/       # Cấu hình riêng cho nền tảng iOS/iPadOS
    └── macOS (App)/ & macOS (Extension)/   # Cấu hình riêng cho nền tảng macOS
```

---

## 🌐 Hướng dẫn cài đặt & sử dụng: Hieu Extension Chrome

Áp dụng cho các trình duyệt trên máy tính Windows, macOS hoặc Linux: **Google Chrome, Microsoft Edge, Cốc Cốc, Brave, Opera,...**

### Bước 1: Mở trang quản lý Tiện ích mở rộng
- **Google Chrome:** Nhập `chrome://extensions` vào thanh địa chỉ và nhấn Enter.
- **Microsoft Edge:** Nhập `edge://extensions` và nhấn Enter.
- **Cốc Cốc:** Nhập `coccoc://extensions` và nhấn Enter.
- **Brave:** Nhập `brave://extensions` và nhấn Enter.

### Bước 2: Bật chế độ Nhà phát triển (Developer Mode)
- Tìm công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải màn hình và gạt sang **BẬT (ON)**.

### Bước 3: Nạp tiện ích vào trình duyệt (Load Unpacked)
1. Bấm vào nút **Tải tiện ích đã giải nén (Load unpacked)** xuất hiện ở góc trên bên trái.
2. Điều hướng và chọn thư mục:
   ```text
   hieu-extension-chrome/
   ```
3. Nhấn **Select / Mở** để hoàn tất nạp tiện ích.

### Bước 4: Ghim và cấu hình ban đầu
1. Nhấn vào biểu tượng mảnh ghép (Extensions) trên thanh công cụ của trình duyệt và bấm biểu tượng chiếc ghim (Pin) để cố định **Hieu Extension pro** lên thanh công cụ.
2. Bấm vào icon tiện ích để mở cửa sổ giao diện chính.
3. Bấm vào icon **Cài đặt** (nút có các thanh gạt bên cạnh nút ghi chú).
4. Nhập **Mã SV / Tên đăng nhập** và **Mật khẩu** MyDTU của bạn.
5. Tích chọn *"Tự động reload khi kẹt hoặc lỗi kết nối"*.
6. Nhấn nút **Lưu thông tin**.

---

## 🍏 Hướng dẫn cài đặt & sử dụng: Hieu Extension Safari

Phiên bản dành riêng cho các thiết bị Apple: **iPhone, iPad (iOS/iPadOS 15.0 trở lên)** và **Máy Mac (macOS 12.0 trở lên)**.

---

### Cách 1: Cài đặt trực tiếp file IPA trên iOS

Thư mục `hieu-extension-safari/` đã có sẵn các file IPA đóng gói:
- 👉 **`hieu-extension-safari/Hieu Extension pro v4.ipa`** *(Bản mới nhất - Khuyên dùng)*
- 👉 `hieu-extension-safari/Hieu Extension pro v3.ipa` *(Bản dự phòng)*

Bạn có thể cài đặt file này lên iPhone / iPad bằng một trong các phương pháp sau:

#### Phương án A: Cài qua TrollStore (Tốt nhất - Vĩnh viễn không thu hồi)
*(Dành cho máy đã cài sẵn TrollStore)*
1. Gửi file `Hieu Extension pro v4.ipa` sang iPhone qua AirDrop, Telegram, Google Drive hoặc chép qua cáp.
2. Mở file trong ứng dụng **TrollStore** và chọn **Install**.
3. Ứng dụng sẽ được cài đặt ngay lập tức và không bao giờ bị hết hạn chứng chỉ (revoked).

#### Phương án B: Cài qua AltStore / Sideloadly / Scarlet / ESign
*(Dành cho thiết bị chưa cài TrollStore, sử dụng Apple ID cá nhân để ký chứng chỉ 7 ngày)*
1. Mở **Sideloadly** hoặc **AltStore** trên máy tính.
2. Kết nối iPhone/iPad với máy tính bằng cáp.
3. Kéo thả file `Hieu Extension pro v4.ipa` vào Sideloadly.
4. Điền tài khoản Apple ID để ký chứng chỉ và bấm **Start**.
5. Sau khi cài xong trên điện thoại: Vào **Cài đặt** ➔ **Cài đặt chung** ➔ **Quản lý VPN & Thiết bị** ➔ Chọn chứng chỉ Apple ID của bạn và chọn **Tin cậy (Trust)**.

#### Kích hoạt Extension trong Safari trên iOS:
1. Mở ứng dụng **"Hieu Extension pro"** trên màn hình chính của iPhone ít nhất 1 lần để hệ thống nhận diện tiện ích.
2. Mở ứng dụng **Cài đặt (Settings)** của iOS.
3. Cuộn xuống danh sách ứng dụng và chọn mục **Safari**.
4. Chọn mục **Phần mở rộng (Extensions)**.
5. Tìm và bấm vào **Hieu Extension pro**, gạt công tắc sang **BẬT (ON)**.
6. Tại mục **Quyền truy cập trang web (Websites permissions)**: Chọn **Cho phép (Allow)** hoặc **Luôn cho phép (Always Allow)** đối với các trang `duytan.edu.vn`.
7. Mở trình duyệt Safari trên iPhone ➔ Bấm vào biểu tượng **`aA`** (hoặc biểu tượng Extension) trên thanh địa chỉ để mở giao diện popup tiện ích bất kỳ lúc nào!

---

### Cách 2: Sử dụng ứng dụng trên macOS

Nếu bạn đang sử dụng máy Mac:
1. Trong thư mục `hieu-extension-safari/`, bạn có sẵn file ứng dụng:
   👉 `hieu-extension-safari/Hieu Extension pro (macOS).app`
2. Kéo ứng dụng vào thư mục `/Applications` (Ứng dụng) trên máy Mac của bạn.
3. Mở ứng dụng lên một lần.
4. Mở trình duyệt **Safari** trên macOS:
   - Vào menu trên cùng: **Safari** ➔ **Cài đặt (Settings...)** (hoặc phím tắt `Cmd + ,`).
   - Chuyển sang thẻ **Phần mở rộng (Extensions)**.
   - Tích chọn vào ô vuông bên cạnh **Hieu Extension pro** để kích hoạt.
   - Bấm nút **Luôn cho phép trên mọi trang web... (Always Allow on Every Website...)** để tiện ích có quyền giải captcha và điền form tự động.

---

### Cách 3: Tự Build từ mã nguồn Xcode

Nếu bạn muốn tùy biến mã nguồn hoặc tự cài trực tiếp qua cáp lập trình:
1. Mở file dự án:
   ```text
   hieu-extension-safari/Hieu Extension pro.xcodeproj
   ```
2. Trong cửa sổ Xcode, chọn target:
   - Chọn **iOS (App)** nếu muốn cài lên iPhone / iPad thật hoặc máy ảo iOS Simulator.
   - Chọn **macOS (App)** nếu muốn chạy trên máy tính Mac.
3. Vào tab **Signing & Capabilities**:
   - Tích chọn *Automatically manage signing*.
   - Chọn **Team** của bạn (Tài khoản Apple ID miễn phí hoặc tài khoản Developer).
   - Đổi Bundle Identifier nếu hệ thống báo trùng ID.
4. Kết nối iPhone/iPad qua cáp USB.
5. Nhấn tổ hợp phím **`Cmd + R`** (hoặc nút Play ▶️) để Xcode tiến hành build và cài đặt trực tiếp vào thiết bị.

---

## 📖 Cẩm nang sử dụng các tính năng chi tiết

### 1. Tự động đăng nhập MyDTU & Giải Captcha
- **Cơ chế:** Khi bạn mở trang `https://mydtu.duytan.edu.vn/Signin.aspx`:
  1. Tiện ích tự động điền Mã sinh viên.
  2. Tự động điền Mật khẩu.
  3. Quét ảnh Captcha, chuyển thành Base64 và gửi đến API Backend OCR để giải mã ký tự.
  4. Điền chuỗi kết quả Captcha vào ô xác thực.
  5. Tự động kích hoạt nút Đăng nhập (`btnLogin`).
- **Quản lý nhiều tài khoản:** Bạn có thể lưu nhiều tài khoản (ví dụ tài khoản chính, tài khoản phụ, tài khoản bạn bè) trong phần Cài đặt của tiện ích và chuyển đổi chỉ với 1 click.

### 2. Hỗ trợ Đăng ký môn học siêu tốc
- **Cơ chế:**
  1. Mở popup tiện ích ➔ Chọn thẻ **02 · Đăng ký môn học**.
  2. Nhập danh sách mã môn / mã lớp dự kiến đăng ký vào ô văn bản (mỗi dòng một mã, tối đa 10 môn).
  3. Bấm nút **Lưu danh sách môn**.
  4. Bấm **Mở trang đăng ký môn học** (tiện ích sẽ tự mở trang đăng ký và chọn kỳ học nếu cần).
  5. Khi vào giao diện chọn lớp, bạn chỉ cần bấm vào nút mã môn đã lưu trên tiện ích, hệ thống sẽ tự động điền mã lớp, tự giải Captcha xác nhận và tự bấm Đăng ký.
  6. Nếu trường báo lỗi captcha không khớp, tiện ích tự động click đổi ảnh mới và thử lại (Auto-retry). Khi đăng ký thành công, môn học sẽ được đánh dấu hoàn tất.

### 3. Tự động Đánh giá Giảng viên
- **Cơ chế:**
  1. Truy cập vào biểu mẫu khảo sát ý kiến giảng viên trên MyDTU (`p=home_ratingform`).
  2. Mở popup tiện ích ➔ Chọn mục **Đánh giá Giảng Viên**.
  3. Lựa chọn mức độ từ **1 (Tốt)** đến **6 (Kém)**.
  4. Bấm nút **Auto Đánh Giá**.
  5. Tiện ích sẽ:
     - Tự động tick tất cả các câu hỏi đánh giá theo mức tương ứng.
     - Tự động điền 4 đoạn văn nhận xét độc đáo, câu từ tự nhiên vào 4 ô R48, R49, R50, R51.
     - Tự giải mã Captcha và nhấn Gửi đánh giá.

### 4. AutoQuiz - Làm trắc nghiệm tự động
- **Cơ chế:**
  1. Mở bài làm trắc nghiệm trên tab hiện tại (hỗ trợ các dạng bài trực tuyến tại DTU / VinkayLearn).
  2. Mở popup tiện ích ➔ Chọn **AutoQuiz**.
  3. Dán chuỗi đáp án vào ô (hỗ trợ cú pháp chuẩn: `1A 2B 3C 4D 5A...`).
  4. Điều chỉnh độ trễ (Delay) giữa mỗi lần click (mặc định 80ms).
  5. Nhấn **Chạy chọn đáp án**. Tiện ích chỉ hỗ trợ tick chọn đáp án, hoàn toàn không tự ý nộp bài để sinh viên kiểm tra lại trước khi nộp.

### 5. Menu Nhanh & Thêm liên kết tùy chỉnh
- Nút bấm truy cập tức thì:
  - **Bảng điểm**: Xem bảng điểm tổng quát các kỳ.
  - **Điểm chi tiết**: Xem điểm thành phần, chuyên cần, kiểm tra từng môn.
  - **Chương trình học**: Xem khung chương trình và các môn tiên quyết.
  - **Sakai & MyDTU**: Mở nhanh hệ thống học trực tuyến và cổng sinh viên.
- **Thêm liên kết cá nhân (+):** Bạn có thể tự thêm bất kỳ đường link nào thường xuyên dùng (ví dụ: Link Drive môn học, Nhóm Zalo lớp, Trang web thư viện) để mở nhanh trong popup.

### 6. Ghi chú cá nhân
- Bấm vào biểu tượng chiếc bút ở thanh tiêu đề tiện ích để mở sổ tay cá nhân.
- Viết thời khóa biểu tạm thời, ghi chú deadline, bài tập cần nộp.
- Dữ liệu ghi chú được lưu tự động theo thời gian thực (Auto-save) và bảo lưu ngay cả khi đóng trình duyệt.

---

## 🔒 Bảo mật & Quyền riêng tư

- **Lưu trữ an toàn tại máy (Local Only):** Toàn bộ thông tin tài khoản, mật khẩu, danh sách môn học và ghi chú đều được lưu trữ hoàn toàn bên trong cơ sở dữ liệu `chrome.storage.local` của chính trình duyệt trên máy bạn.
- **Không gửi thông tin cá nhân:** Tiện ích tuyệt đối không thu thập, không lưu trữ và không gửi tên đăng nhập hay mật khẩu của bạn về bất kỳ máy chủ bên thứ ba nào.
- **Backend OCR:** Chỉ có hình ảnh Captcha (dạng chuỗi điểm ảnh) được gửi lên máy chủ OCR phục vụ mục đích giải mã ký tự hình ảnh và trả về kết quả trong vài mili-giây, không kèm theo bất kỳ siêu dữ liệu định danh nào.

---

## ❓ Xử lý sự cố thường gặp (FAQ)

#### 1. Tại sao Captcha không tự động giải?
- Kiểm tra lại kết nối mạng internet của thiết bị.
- Dịch vụ backend giải captcha miễn phí (`vinkaycaptcha.onrender.com`) thỉnh thoảng có thể cần vài giây để khởi động lại nếu không có truy cập trong một khoảng thời gian dài. Bạn hãy đợi khoảng 15-30 giây và tải lại trang.

#### 2. Trên Safari iOS không thấy popup hoặc không tự điền?
- Kiểm tra lại trong **Cài đặt ➔ Safari ➔ Phần mở rộng ➔ Hieu Extension pro**: Đảm bảo bạn đã chọn **Cho phép (Allow)** và mục quyền truy cập các website thuộc `duytan.edu.vn` đã được gạt sang **Luôn cho phép (Always Allow)**.

#### 3. Tôi muốn tắt tạm thời tiện ích thì làm thế nào?
- Ngay ở đầu thanh tiêu đề của giao diện Popup có một công tắc chuyển đổi ON/OFF màu đỏ/xanh. Bạn chỉ cần gạt công tắc sang OFF, toàn bộ tính năng can thiệp tự động trên trang sẽ dừng hoạt động ngay lập tức mà không cần gỡ cài đặt tiện ích.

#### 4. Cách cập nhật khi sửa mã nguồn?
- Đối với **Chrome**: Vào `chrome://extensions` ➔ Nhấn biểu tượng nút xoay tròn **Reload (Tải lại)** tại ô tiện ích *Hieu Extension pro*.
- Đối với **Safari**: Rebuild lại dự án từ Xcode hoặc cài đè file IPA mới.

---

<p align="center">
  <b>Tác giả: Nguyen Van Hieu (<a href="https://github.com/hieung195">@hieung195</a>)</b><br>
  <i>Chúc các bạn sinh viên DTU có những kỳ học tập thật hiệu quả và thuận lợi!</i>
</p>
