<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-shell">
      <div class="brand">
        <div class="logo">FI</div>
        <div class="brand-text">
          <p class="title">Ferry Islands</p>
          <p class="subtitle">Đăng nhập để tiếp tục</p>
        </div>
      </div>
      <div class="modal-content">
        <button class="close-btn" @click="close">&times;</button>
        <div class="modal-header">
          <h2>Chào mừng trở lại</h2>
          <p>Quản lý đặt vé của bạn nhanh chóng.</p>
        </div>

        <form class="login-form" @submit.prevent="submit">
          <div class="form-group">
            <label>Email hoặc Số điện thoại *</label>
            <div class="input-wrapper">
              <input
                v-model="form.account"
                placeholder="Nhập email hoặc số điện thoại"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Mật khẩu *</label>
            <div class="input-wrapper">
              <input
                v-model="form.password"
                id="password"
                placeholder="Nhập mật khẩu"
                required
                type="password"
              />
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" class="forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" class="btn-submit">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from 'vue'

defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
const form = reactive({
  account: '',
  password: '',
})

const close = () => emit('close')
const submit = () => {
  alert('Đăng nhập demo thành công')
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(12,43,68,0.85), rgba(16,69,111,0.8));
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 1000;
  padding: 16px;
}
.modal-shell {
  display: grid;
  grid-template-columns: 200px 1fr;
  max-width: 840px;
  width: 100%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.35);
}
.brand {
  background: linear-gradient(180deg, #ffd166 0%, #f59e0b 100%);
  color: #0c2b44;
  padding: 26px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.logo {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  background: #0c2b44;
  color: #ffd166;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 18px;
  box-shadow: 0 10px 24px rgba(12,43,68,0.35);
}
.brand-text .title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}
.brand-text .subtitle {
  margin: 4px 0 0;
  color: #0c2b44cc;
  font-weight: 600;
}
.modal-content {
  background: #ffffff;
  border-radius: 0;
  padding: 32px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
}
.modal-header {
  text-align: center;
  margin-bottom: 20px;
}
.modal-header h2 {
  margin: 0;
  color: #0c2b44;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-wrapper input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
}
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}
.forgot-password {
  color: #d39e63;
  text-decoration: none;
}
.btn-submit {
  background: linear-gradient(135deg, #0c2b44 0%, #0f456f 100%);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
.btn-submit:hover {
  box-shadow: 0 8px 18px rgba(0,0,0,0.15);
}
@media (max-width: 900px) {
  .modal-shell {
    grid-template-columns: 1fr;
  }
  .brand {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
