<template>
  <section class="seat-picker">
    <div class="picker-head">
      <h4>Sơ đồ ghế</h4>
      <div class="legend">
        <span class="legend-item"><i class="dot standard"></i> Ghế thường</span>
        <span class="legend-item"><i class="dot vip"></i> Ghế VIP</span>
        <span class="legend-item"><i class="dot selected"></i> Đang chọn</span>
        <span class="legend-item"><i class="dot occupied"></i> Đã đặt/đang giữ</span>
        <span class="legend-item"><i class="dot blocked"></i> Không phù hợp hạng vé</span>
      </div>
    </div>

    <div class="passenger-tabs">
      <button
        v-for="(p, idx) in passengers"
        :key="idx"
        :class="['pax-tab', { active: idx === activePassengerIndex }]"
        @click="$emit('set-active-passenger', idx)"
      >
        <span class="pax-title">HK {{ idx + 1 }}</span>
        <span class="pax-name">{{ p.name?.trim() || 'Chưa nhập tên' }}</span>
        <span class="pax-seat">{{ normalizedSeat(p.seat) || 'Chưa chọn ghế' }}</span>
      </button>
    </div>

    <div class="deck">
      <h5>Lầu 1</h5>
      <div class="block">
        <div v-for="(row, rowIdx) in deck1FrontRows" :key="`d1f-${rowIdx}`" class="seat-row">
          <SeatCell
            v-for="(seat, seatIdx) in row"
            :key="`d1f-${rowIdx}-${seatIdx}-${seat?.code || 'empty'}`"
            :seat="seat"
            :state="seatState(seat)"
            @pick="pickSeat"
          />
        </div>
      </div>
      <div class="service-zone">Khu vực WC + để hành lý + TV</div>
      <div class="block">
        <div v-for="(row, rowIdx) in deck1RearRows" :key="`d1r-${rowIdx}`" class="seat-row">
          <SeatCell
            v-for="(seat, seatIdx) in row"
            :key="`d1r-${rowIdx}-${seatIdx}-${seat?.code || 'empty'}`"
            :seat="seat"
            :state="seatState(seat)"
            @pick="pickSeat"
          />
        </div>
      </div>
    </div>

    <div class="deck">
      <h5>Lầu 2</h5>
      <div class="block vip-block">
        <div v-for="(row, rowIdx) in deck2VipRows" :key="`d2v-${rowIdx}`" class="seat-row vip-row">
          <SeatCell
            v-for="(seat, seatIdx) in row"
            :key="`d2v-${rowIdx}-${seatIdx}-${seat?.code || 'empty'}`"
            :seat="seat"
            :state="seatState(seat)"
            @pick="pickSeat"
          />
        </div>
      </div>
      <div class="service-zone">Khu vực để hành lý + TV</div>
      <div class="block">
        <div v-for="(row, rowIdx) in deck2StandardRows" :key="`d2s-${rowIdx}`" class="seat-row">
          <SeatCell
            v-for="(seat, seatIdx) in row"
            :key="`d2s-${rowIdx}-${seatIdx}-${seat?.code || 'empty'}`"
            :seat="seat"
            :state="seatState(seat)"
            @pick="pickSeat"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineComponent, defineEmits, defineProps, h } from 'vue'

const props = defineProps({
  passengers: { type: Array, default: () => [] },
  activePassengerIndex: { type: Number, default: 0 },
  selectedClass: { type: String, default: '' },
  occupiedSeats: { type: Array, default: () => [] },
})

const emit = defineEmits(['select-seat', 'set-active-passenger'])

const COLUMN_CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

const normalizedSeat = (seat = '') => `${seat}`.trim().toUpperCase()

const standardRow = (rowNumber, prefix = '') =>
  COLUMN_CODES.map((column) => ({ code: `${prefix}${rowNumber}${column}`, type: 'standard' }))

const deck1FrontRows = Array.from({ length: 9 }, (_, idx) => standardRow(idx + 1))
const deck1RearRows = Array.from({ length: 14 }, (_, idx) => standardRow(idx + 10))

const vipSeat = (code) => ({ code, type: 'vip' })
const deck2VipRows = [
  ['16V', '17V', '18V', '1V', '2V', '3V'].map(vipSeat),
  ['15V', null, null, null, null, '4V'].map((code) => (code ? vipSeat(code) : null)),
  ['14V', null, null, null, null, '5V'].map((code) => (code ? vipSeat(code) : null)),
  ['13V', null, null, null, null, '6V'].map((code) => (code ? vipSeat(code) : null)),
  ['12V', '11V', '10V', '9V', '8V', '7V'].map(vipSeat),
]
const deck2StandardRows = Array.from({ length: 13 }, (_, idx) => standardRow(idx + 1, 'V'))

const occupiedSet = computed(() => new Set(props.occupiedSeats.map((seat) => normalizedSeat(seat))))

const selectedByPassenger = computed(() => {
  const map = new Map()
  props.passengers.forEach((passenger, index) => {
    const seatCode = normalizedSeat(passenger?.seat)
    if (!seatCode) return
    map.set(seatCode, index)
  })
  return map
})

const currentSeat = computed(() => normalizedSeat(props.passengers?.[props.activePassengerIndex]?.seat))

const isVipSeatBlockedByClass = (seat) =>
  !!seat && seat.type === 'vip' && `${props.selectedClass}`.toUpperCase() !== 'BUS'

const isStandardSeatBlockedByClass = (seat) =>
  !!seat && seat.type === 'standard' && `${props.selectedClass}`.toUpperCase() === 'BUS'

const isSeatOccupied = (seat) => !!seat && occupiedSet.value.has(normalizedSeat(seat.code))

const isSeatTakenByOtherPassenger = (seat) => {
  if (!seat) return false
  const ownerIndex = selectedByPassenger.value.get(normalizedSeat(seat.code))
  return ownerIndex !== undefined && ownerIndex !== props.activePassengerIndex
}

const seatState = (seat) => {
  if (!seat) return 'empty'
  const code = normalizedSeat(seat.code)

  if (isSeatOccupied(seat)) return 'occupied'
  if (isVipSeatBlockedByClass(seat) || isStandardSeatBlockedByClass(seat)) return 'blocked'
  if (isSeatTakenByOtherPassenger(seat)) return 'other-selected'
  if (currentSeat.value === code) return 'selected'
  if (selectedByPassenger.value.has(code)) return 'other-selected'
  return seat.type === 'vip' ? 'vip' : 'standard'
}

const pickSeat = (seat) => {
  if (!seat) return
  const state = seatState(seat)
  if (state === 'occupied' || state === 'blocked' || state === 'other-selected') return
  emit('select-seat', normalizedSeat(seat.code))
}

const SeatCell = defineComponent({
  name: 'SeatCell',
  props: {
    seat: { type: Object, default: null },
    state: { type: String, default: 'empty' },
  },
  emits: ['pick'],
  setup(localProps, { emit: localEmit }) {
    return () =>
      localProps.seat
        ? h(
            'button',
            {
              class: ['seat-cell', localProps.state],
              type: 'button',
              onClick: () => localEmit('pick', localProps.seat),
            },
            localProps.seat.code
          )
        : h('span', { class: 'seat-cell empty' }, '')
  },
})
</script>

<style scoped>
.seat-picker {
  display: grid;
  gap: 14px;
}
.picker-head h4 {
  margin: 0 0 8px;
  color: #0c2b44;
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  display: inline-block;
}
.dot.standard {
  background: #ffffff;
}
.dot.vip {
  background: #fff7e6;
  border-color: #f59e0b;
}
.dot.selected {
  background: #0c2b44;
  border-color: #0c2b44;
}
.dot.occupied {
  background: #cbd5e1;
}
.dot.blocked {
  background: #fee2e2;
  border-color: #ef4444;
}
.passenger-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}
.pax-tab {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  display: grid;
  gap: 3px;
}
.pax-tab.active {
  border-color: #0c2b44;
  box-shadow: 0 0 0 2px rgba(12, 43, 68, 0.1);
  background: #eff6ff;
}
.pax-title {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 700;
}
.pax-name {
  color: #0f172a;
  font-weight: 700;
}
.pax-seat {
  color: #b45309;
  font-weight: 700;
  font-size: 0.9rem;
}
.deck {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 14px;
  display: grid;
  gap: 10px;
}
.deck h5 {
  margin: 0;
  text-align: center;
  color: #0f172a;
}
.block {
  display: grid;
  gap: 8px;
}
.vip-block {
  max-width: 520px;
  margin: 0 auto;
}
.seat-row {
  display: grid;
  grid-template-columns: repeat(8, minmax(46px, 1fr));
  gap: 8px;
}
.vip-row {
  grid-template-columns: repeat(6, minmax(46px, 1fr));
}
.service-zone {
  margin: 6px auto;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
  color: #64748b;
  border-radius: 4px;
  font-weight: 600;
}
.seat-cell {
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.78rem;
  cursor: pointer;
}
.seat-cell.vip {
  border-color: #f59e0b;
  background: #fff7e6;
  color: #92400e;
  font-weight: 700;
}
.seat-cell.selected {
  border-color: #0c2b44;
  background: #0c2b44;
  color: #fff;
  font-weight: 700;
}
.seat-cell.other-selected {
  border-color: #94a3b8;
  background: #e2e8f0;
  color: #475569;
}
.seat-cell.occupied {
  border-color: #cbd5e1;
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
}
.seat-cell.blocked {
  border-color: #fca5a5;
  background: #fee2e2;
  color: #b91c1c;
  cursor: not-allowed;
}
.seat-cell.standard {
  background: #ffffff;
}
.seat-cell.empty {
  border: none;
  background: transparent;
  cursor: default;
}
@media (max-width: 900px) {
  .seat-row {
    grid-template-columns: repeat(4, minmax(44px, 1fr));
  }
  .vip-row {
    grid-template-columns: repeat(3, minmax(44px, 1fr));
  }
}
</style>
