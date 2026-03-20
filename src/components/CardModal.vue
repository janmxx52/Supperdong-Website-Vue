<template>
  <div v-if="props.show" class="cart-modal-overlay" @click.self="close">
    <div class="cart-modal">
      <h2>Giỏ đặt vé</h2>
      <div v-if="!props.cartItems.length">Chưa có chuyến nào.</div>
      <div v-else>
        <div v-for="item in props.cartItems" :key="item.key" class="cart-item">
          <div class="cart-title">{{ item.routeLabel }}</div>
          <div class="cart-meta">
            {{ item.date }} · {{ item.departTime }} → {{ item.arriveTime }} · {{ item.vessel }}
          </div>
          <div class="cart-meta">Hạng: {{ item.className }}</div>
          <div class="cart-meta">
            Khách: NL {{ item.pax.adult }} / TE {{ item.pax.child }}
          </div>
          <div class="cart-total">{{ item.total.toLocaleString() }} đ</div>
          <button class="remove" @click="remove(item.key)">Xóa</button>
        </div>
        <div class="grand">
          <span>Tổng cộng</span>
          <strong>{{ total.toLocaleString() }} đ</strong>
        </div>
      </div>
      <div class="actions">
        <button class="close-btn" @click="close">Đóng</button>
        <button
          class="primary"
          :disabled="!props.cartItems.length"
          @click="checkout"
        >
          Thanh toán (mock)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  cartItems: { type: Array, required: true },
})
const emit = defineEmits(['close', 'remove', 'checkout'])

const total = computed(() => props.cartItems.reduce((sum, i) => sum + i.total, 0))

const close = () => emit('close')
const remove = (key) => emit('remove', key)
const checkout = () => emit('checkout')
</script>

<style scoped>
.cart-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.cart-modal {
  background: #fff;
  min-width: 360px;
  max-width: 520px;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
}
.cart-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
}
.cart-title {
  font-weight: 700;
  color: #0c2b44;
}
.cart-meta {
  color: #64748b;
  font-size: 0.95rem;
}
.cart-total {
  color: #b30404;
  font-weight: 800;
  margin-top: 4px;
}
.remove {
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.grand {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-top: 12px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.close-btn,
.primary {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
.close-btn {
  background: #e2e8f0;
}
.primary {
  background: #0c2b44;
  color: #fff;
  font-weight: 700;
}
.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
