<template>
  <div class="modal-overlay" >
    <div class="modal-content" >
      <button class="close-btn" >&times;</button>
      
      <div class="modal-header">
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới để bắt đầu!</p>
      </div>

      <!-- Thông báo thành công -->
      <div   class="alert alert-success">
        hiển thị thông báo thành công
      </div>

      <!-- Thông báo lỗi -->
      <div  class="alert alert-error">
        hiển thị thông báo lỗi
      </div>
<!-- khi click vao form luôn luôn chuyển trang, tránh chuyển trang -->
      <form class="register-form">
        <div class="form-group">
          <label for="fullname">Họ và tên</label>
          <div class="input-wrapper">
            <i class="icon-user">👤</i>
            <input
              type="text"
              id="fullname"
              
              placeholder="Nhập họ và tên đầy đủ"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="register-email">Email</label>
          <div class="input-wrapper">
            <i class="icon-email">📧</i>
            <input
              type="email"
              id="register-email"
             
              placeholder="Nhập địa chỉ email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Số điện thoại</label>
          <div class="input-wrapper">
            <i class="icon-phone">📱</i>
            <input
              type="tel"
              id="phone"
              
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="register-password">Mật khẩu</label>
          <div class="input-wrapper">
            <i class="icon-lock">🔒</i>
            <input
            
              id="register-password"
             
              placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
              required
              minlength="6"
            />
            <button
              type="button"
              class="toggle-password"
              
            >
              hiển thị mật khẩu
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="confirm-password">Xác nhận mật khẩu</label>
          <div class="input-wrapper">
            <i class="icon-lock">🔒</i>
            <input
             
              id="confirm-password"
              
              placeholder="Nhập lại mật khẩu"
              required
            />
            <button
              type="button"
              class="toggle-password"
             
            >
              hiển thị mật khẩu
            </button>
          </div>
        </div>

        <div class="form-checkbox">
          <label class="checkbox-label">
            <input type="checkbox" required />
            <span>
              Tôi đồng ý với 
              <a href="#" >Điều khoản dịch vụ</a> và 
              <a href="#" >Chính sách bảo mật</a>
            </span>
          </label>
        </div>

        <button type="submit" class="btn-submit" >
        hieeen thị đăng ký
        </button>

        <div class="divider">
          <span>Hoặc đăng ký với</span>
        </div>

        <div class="social-login">
          <button type="button" class="btn-social btn-google">
            <i>G</i> Google
          </button>
          <button type="button" class="btn-social btn-facebook">
            <i>f</i> Facebook
          </button>
        </div>

        <p class="login-link">
          Đã có tài khoản? 
          <a href="#" >Đăng nhập ngay</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  max-width: 480px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s, transform 0.3s;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.close-btn:hover {
  color: #333;
  transform: rotate(90deg);
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.modal-header h2 {
  font-size: 28px;
  color: #0c2b44;
  margin-bottom: 8px;
  font-weight: 700;
}

.modal-header p {
  color: #666;
  font-size: 15px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #d39e63;
  box-shadow: 0 0 0 3px rgba(211, 158, 99, 0.1);
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  font-size: 18px;
  opacity: 0.6;
}

.toggle-password {
  position: absolute;
  right: 15px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
}

.form-checkbox {
  margin: 5px 0;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
}

.checkbox-label a {
  color: #d39e63;
  text-decoration: none;
  font-weight: 600;
}

.checkbox-label a:hover {
  text-decoration: underline;
}

.btn-submit {
  background: linear-gradient(135deg, #d39e63 0%, #c48a4f 100%);
  color: #fff;
  border: none;
  padding: 15px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(211, 158, 99, 0.3);
  margin-top: 10px;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(211, 158, 99, 0.4);
}

.btn-submit:active {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: #fff;
  padding: 0 15px;
  color: #999;
  font-size: 14px;
}

.social-login {
  display: flex;
  gap: 15px;
}

.btn-social {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-social i {
  font-weight: bold;
  font-size: 18px;
}

.btn-google:hover {
  background: #f5f5f5;
  border-color: #db4437;
  color: #db4437;
}

.btn-facebook:hover {
  background: #f5f5f5;
  border-color: #1877f2;
  color: #1877f2;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin-top: 10px;
}

.login-link a {
  color: #d39e63;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #c48a4f;
  text-decoration: underline;
}

/* Scrollbar styling */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #d39e63;
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #c48a4f;
}

/* Alert Messages */
.alert {
  padding: 14px 18px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 15px;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: #fff;
  border: 2px solid #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.alert-error {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: #fff;
  border: 2px solid #f44336;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}
</style>
