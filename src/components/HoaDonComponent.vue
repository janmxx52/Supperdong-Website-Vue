<template>
  <div class="hoadon-modal">
    <div class="hoadon-content">
      <h2>Hóa Đơn Thanh Toán</h2>
      <form class="customer-info">
        <label>Họ tên khách hàng:
          <input type="text" required />
        </label>
        <label>Email:
          <input  type="email" required />
        </label>
        <label>Số điện thoại:
          <input  type="phone" required />
        </label>
        <label>Địa chỉ:
          <input  type="text" required />
        </label>
      </form>
      <h3>Danh sách sản phẩm</h3>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>hiển thị tên</td>
            <td>hiển thị số lượng</td>
            <td>hiển thị đơn giá</td>
            <td>hiển thị thành tiền</td>
          </tr>
        </tbody>
      </table>
      <div class="total">Tổng tiền: <b>hiển thị tổng tiền đ</b></div>
      <div class="payment-method">
        <label>
          <input type="radio" value="cash" /> Tiền mặt
        </label>
        <label>
          <input type="radio" value="bank" /> Ngân hàng
        </label>
      </div>
      <div class="qr-section">
        <div class="qr-title">Quét mã QR để thanh toán</div>
        <img src="qrImage" alt="QR ngân hàng" class="qr-image" />
        <div class="qr-note">Vui lòng chuyển khoản đúng số tiền và ghi rõ nội dung!</div>
      </div>
      <div class="hoadon-actions">
        <button class="close-btn" >Đóng</button>
        <button class="pay-btn" >Xác nhận thanh toán</button>
      </div>
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped>
.hoadon-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
}
.hoadon-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px 28px 18px 28px;
  min-width: 380px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.payment-method {
  margin: 18px 0 10px 0;
  font-weight: 500;
  display: flex;
  gap: 24px;
}
.payment-method label {
  cursor: pointer;
}
.qr-section {
  text-align: center;
  margin-bottom: 12px;
}
.qr-title {
  font-weight: 600;
  margin-bottom: 6px;
}
.qr-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 6px;
}
.qr-note {
  font-size: 0.95rem;
  color: #388e3c;
  margin-bottom: 8px;
}
.customer-info label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}
.customer-info input {
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #bdbdbd;
  margin-top: 3px;
  margin-bottom: 8px;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin: 18px 0 10px 0;
}
.cart-table th, .cart-table td {
  border: 1px solid #e0e0e0;
  padding: 7px 10px;
  text-align: center;
}
.total {
  text-align: right;
  font-size: 1.1rem;
  margin: 10px 0 18px 0;
}
.hoadon-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.close-btn, .pay-btn {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.close-btn {
  background: #e0e0e0;
  color: #333;
}
.pay-btn {
  background: #4caf50;
  color: #fff;
}
.pay-btn:hover {
  background: #388e3c;
}
</style>
