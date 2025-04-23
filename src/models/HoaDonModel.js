export class HoaDonModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.ngaylap = data.ngaylap || new Date();
    this.tongsotien = data.tongsotien || 0;
    this.khachhangId = data.khachhangId || null;
    this.hopdongId = data.hopdongId || null;
    this.donghonuocId = data.donghonuocId || null;
    this.trangthai = data.trangthai || "Chưa thanh toán";
  }
}
