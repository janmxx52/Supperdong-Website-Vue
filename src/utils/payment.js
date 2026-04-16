import QRCode from 'qrcode'

export function buildPaymentPayload(booking = {}, method = 'qr') {
  const amount = Number(booking.total || 0)
  const id = booking.id || ''
  const merchant = {
    name: process.env.VUE_APP_MERCHANT_NAME || 'NGUYEN QUOC HAU',
    account: process.env.VUE_APP_MERCHANT_ACCOUNT || '0123456789',
    bank: process.env.VUE_APP_MERCHANT_BANK || 'GDU Bank',
    momoPhone: process.env.VUE_APP_MERCHANT_MOMO_PHONE || '',
    zaloId: process.env.VUE_APP_MERCHANT_ZALO_ID || '',
  }


  if (method === 'momo') {
    return `MOMO|merchantPhone:${merchant.momoPhone};amount:${amount};order:${id}`
  }

  if (method === 'zalopay') {
    return `ZALOPAY|merchant:${merchant.zaloId};amount:${amount};order:${id}`
  }

  if (method === 'bank' || method === 'transfer') {
    return `BANK|merchant:${merchant.name};acc:${merchant.account};bank:${merchant.bank};amount:${amount};order:${id}`
  }

  return `PAY|merchant:${merchant.name};acc:${merchant.account};bank:${merchant.bank};amount:${amount};order:${id}`
}

export async function generateQrDataUrl(payload, options = {}) {
  const opts = { width: options.width || 360 }
  return QRCode.toDataURL(String(payload || ''), opts)
}

export function formatMoney(n = 0) {
  return `${Number(n || 0).toLocaleString()} d`
}
