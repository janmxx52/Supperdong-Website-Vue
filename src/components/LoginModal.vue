<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">&times;</button>

      <div class="modal-header">
        <h2>Đăng nhập</h2>
        <p>Chào mừng bạn trở lại!</p>
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
}
.modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  max-width: 420px;
  width: 90%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  background: linear-gradient(135deg, #d39e63 0%, #c48a4f 100%);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
</style>
