<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-btn" @click="close">&times;</button>
      <div class="modal-header">
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản mới để tiếp tục.</p>
      </div>

      <form class="register-form" @submit.prevent="submit">
        <div class="form-group">
          <label>Họ và tên *</label>
          <input v-model="form.fullname" required />
        </div>
        <div class="form-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="form-group">
          <label>Số điện thoại *</label>
          <input v-model="form.phone" required />
        </div>
        <div class="form-group">
          <label>Mật khẩu *</label>
          <input v-model="form.password" type="password" minlength="6" required />
        </div>
        <div class="form-group">
          <label>Xác nhận mật khẩu *</label>
          <input v-model="form.confirm" type="password" required />
        </div>
        <div class="form-checkbox">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.accept" required />
            <span>Tôi đồng ý với điều khoản dịch vụ</span>
          </label>
        </div>
        <button type="submit" class="btn-submit">Đăng ký</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from 'vue'

defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['close'])
const form = reactive({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  accept: false,
})

const close = () => emit('close')
const submit = () => {
  if (form.password !== form.confirm) {
    alert('Mật khẩu không khớp')
    return
  }
  alert('Đăng ký demo thành công')
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
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
  max-width: 480px;
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
.register-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}
.form-checkbox {
  margin-top: 4px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
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
