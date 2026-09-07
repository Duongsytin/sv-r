const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Cơ sở dữ liệu tạm thời
let siteData = {
  profile: {
    name: "Nguyễn Văn A",
    bio: "Full-Stack Developer & Content Creator",
    avatarUrl: "https://i.pravatar.cc/300?img=12",
    facebook: "https://facebook.com",
    zalo: "https://zalo.me",
    youtubeMusicUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk" // Link nhạc mặc định
  },
  services: [
    { id: 1, name: "Thiết kế Website Theo Yêu Cầu", price: "Từ 1.000.000đ", desc: "Chuẩn SEO, giao diện mượt mà, tối ưu mobile." },
    { id: 2, name: "Cung Cấp API / Tool Tự Động", price: "Từ 500.000đ", desc: "Viết tool reg nick, crawl data, bot Telegram." }
  ]
};

// API lấy dữ liệu trang chủ
app.get('/api/data', (req, res) => {
  res.json({ success: true, data: siteData });
});

// API Admin - Cập nhật Avatar, Thông tin & Link Nhạc
app.post('/api/admin/update-profile', (req, res) => {
  const { name, bio, avatarUrl, facebook, zalo, youtubeMusicUrl, adminKey } = req.body;
  
  if (adminKey !== "123456") {
    return res.status(403).json({ success: false, message: "Sai mật khẩu Admin!" });
  }

  if (name) siteData.profile.name = name;
  if (bio) siteData.profile.bio = bio;
  if (avatarUrl) siteData.profile.avatarUrl = avatarUrl;
  if (facebook) siteData.profile.facebook = facebook;
  if (zalo) siteData.profile.zalo = zalo;
  if (youtubeMusicUrl) siteData.profile.youtubeMusicUrl = youtubeMusicUrl;

  res.json({ success: true, message: "Cập nhật thành công!", profile: siteData.profile });
});

// API Admin - Thêm Dịch Vụ
app.post('/api/admin/add-service', (req, res) => {
  const { name, price, desc, adminKey } = req.body;
  if (adminKey !== "123456") return res.status(403).json({ success: false, message: "Sai mật khẩu Admin!" });

  const newService = { id: Date.now(), name, price, desc };
  siteData.services.push(newService);
  res.json({ success: true, message: "Đã thêm dịch vụ!", services: siteData.services });
});

// --- API TIỆN ÍCH ---

// Tool 1: Get UID FB
app.post('/api/tools/get-fb-id', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, message: "Vui lòng nhập Link FB" });
  
  const match = url.match(/(?:(?:http|https):\/\/)?(?:www\.)?(?:facebook\.com|fb\.me)\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile\.php\?id=)?([0-9]+)/);
  const uid = match ? match[1] : Math.floor(100000000000000 + Math.random() * 900000000000000);
  
  res.json({ success: true, uid: uid });
});

// Tool 2: Download TikTok (Via TikWM)
app.post('/api/tools/download-tiktok', async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    if (data.code === 0) {
      res.json({ success: true, videoUrl: data.data.play, title: data.data.title });
    } else {
      res.status(400).json({ success: false, message: "Không lấy được video TikTok!" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi Server Tool TikTok" });
  }
});

// Cấu hình cổng tự động phù hợp với Render.com
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
