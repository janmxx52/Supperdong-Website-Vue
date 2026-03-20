// Static sample data for Vietnam island ferry routes
export const ports = [
  { id: 1, code: 'RG', name: 'Rạch Giá', province: 'Kiên Giang' },
  { id: 2, code: 'PQ', name: 'Phú Quốc', province: 'Kiên Giang' },
  { id: 3, code: 'HT', name: 'Hà Tiên', province: 'Kiên Giang' },
  { id: 4, code: 'CD', name: 'Côn Đảo', province: 'Bà Rịa - Vũng Tàu' },
  { id: 5, code: 'ST', name: 'Sóc Trăng', province: 'Sóc Trăng' },
];

export const routes = [
  { id: 101, fromPort: 'RG', toPort: 'PQ', durationMinutes: 150 },
  { id: 102, fromPort: 'HT', toPort: 'PQ', durationMinutes: 90 },
  { id: 103, fromPort: 'ST', toPort: 'CD', durationMinutes: 165 },
];

// Simple helper to build ISO date strings (YYYY-MM-DD) relative to today
const today = new Date();
const addDays = (d) => {
  const copy = new Date(today);
  copy.setDate(copy.getDate() + d);
  return copy.toISOString().slice(0, 10);
};

// Sample sailings across a few days
export const sailings = [
  {
    id: 1001,
    routeId: 101,
    date: addDays(1),
    departTime: '07:30',
    arriveTime: '10:00',
    vessel: 'Superdong XI',
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: 340000, priceChild: 250000 },
      { code: 'BUS', name: 'Thương gia', priceAdult: 520000, priceChild: 380000 },
    ],
  },
  {
    id: 1002,
    routeId: 101,
    date: addDays(1),
    departTime: '13:30',
    arriveTime: '16:00',
    vessel: 'Superdong XII',
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: 340000, priceChild: 250000 },
      { code: 'BUS', name: 'Thương gia', priceAdult: 520000, priceChild: 380000 },
    ],
  },
  {
    id: 1003,
    routeId: 102,
    date: addDays(2),
    departTime: '09:00',
    arriveTime: '10:30',
    vessel: 'Superdong VIII',
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: 280000, priceChild: 200000 },
      { code: 'BUS', name: 'Thương gia', priceAdult: 430000, priceChild: 320000 },
    ],
  },
  {
    id: 1004,
    routeId: 103,
    date: addDays(3),
    departTime: '08:15',
    arriveTime: '11:00',
    vessel: 'Trưng Trắc',
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: 600000, priceChild: 450000 },
      { code: 'BUS', name: 'Thương gia', priceAdult: 780000, priceChild: 600000 },
    ],
  },
  {
    id: 1005,
    routeId: 103,
    date: addDays(4),
    departTime: '13:00',
    arriveTime: '15:45',
    vessel: 'Trưng Nhị',
    classOptions: [
      { code: 'ECO', name: 'Phổ thông', priceAdult: 600000, priceChild: 450000 },
      { code: 'BUS', name: 'Thương gia', priceAdult: 780000, priceChild: 600000 },
    ],
  },
];

export function findRouteById(id) {
  return routes.find((r) => r.id === id);
}

export function portName(code) {
  const p = ports.find((x) => x.code === code);
  return p ? p.name : code;
}
