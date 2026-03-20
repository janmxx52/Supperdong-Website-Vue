<template>
  <footer class="footer">
    <!-- PARTNER LOGOS -->
    <div class="footer-partners">
      <img v-for="(logo, index) in partners" :key="index" :src="logo" />
    </div>

    <!-- MAIN FOOTER -->
    <div class="footer-main">
      <!-- <img src="@/assets/logo-superdong.png" class="footer-logo" /> -->

      <h3>CÔNG TY CỔ PHẦN TÀU CAO TỐC SUPERDONG - KIÊN GIANG</h3>

      <p>
        Trụ sở chính: Số 187 Đường Nguyễn Trung Trực, Khu phố 5,
        Đặc khu Phú Quốc, Tỉnh An Giang.
      </p>

      <p>
        Email: <span>online.hotro@superdong.com.vn</span>
        &nbsp; | &nbsp;
        Hotline: <span>0941 130 033</span>
      </p>
    </div>

    <!-- BOTTOM -->
    <div class="footer-bottom">
      <a v-for="(item, index) in links" :key="index" href="#">
        {{ item }}
      </a>
    </div>
  </footer>
</template>

<script setup>
// const partners = [
//   new URL('@/assets/image/mc-travel.png', import.meta.url).href,
//   new URL('@/assets/image/htt.png', import.meta.url).href,
//   new URL('@/assets/image/saigon-star.png', import.meta.url).href,
//   new URL('@/assets/image/ietravel.png', import.meta.url).href,
//   new URL('@/assets/image/aolau.png', import.meta.url).href
// ]

const links = [
  "Điều lệ vận chuyển",
  "Điều kiện đặt vé trực tuyến",
  "Quy định hoàn đổi vé online",
  "Chính sách bảo mật thông tin",
  "Điều khoản và điều kiện sử dụng"
]
</script>

<style scoped>
.footer {
  font-family: Arial, sans-serif;
}

/* LOGO PARTNERS */
.footer-partners {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 30px 0;
  background: #f5f5f5;
}

.footer-partners img {
  height: 60px;
  object-fit: contain;
}

/* MAIN */
.footer-main {
  background: #1f4e8c;
  color: white;
  text-align: center;
  padding: 30px 15px;
}

.footer-logo {
  height: 60px;
  margin-bottom: 10px;
}

.footer-main h3 {
  font-size: 16px;
  margin-bottom: 10px;
}

.footer-main p {
  font-size: 14px;
}

.footer-main span {
  color: #ffd700;
  font-weight: bold;
}

/* BOTTOM */
.footer-bottom {
  background: #1f4e8c;
  padding: 10px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.footer-bottom a {
  color: white;
  font-size: 13px;
  margin: 0 10px;
  text-decoration: none;
}

.footer-bottom a:hover {
  text-decoration: underline;
}
</style>