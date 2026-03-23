<template>
  <header class="admin-header">
    <div class="title">Bảng điều khiển</div>
    <div class="user-box">
      <div class="avatar">AD</div>
      <div class="info">
        <p class="name">Admin</p>
        <p class="role">Quản trị</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-weight: 800;
  color: #0c2b44;
}
.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #0c2b44;
  color: #ffd166;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.name {
  margin: 0;
  font-weight: 700;
}
.role {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
