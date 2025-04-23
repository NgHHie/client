export class KhachHangModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.hoten = data.hoten || "";
    this.sodienthoai = data.sodienthoai || "";
    this.email = data.email || "";
    this.canho = data.canho || [];
  }

  validate() {
    const errors = {};

    if (!this.hoten) errors.hoten = "Họ tên không được để trống";

    if (!this.sodienthoai) {
      errors.sodienthoai = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(this.sodienthoai)) {
      errors.sodienthoai = "Số điện thoại không hợp lệ";
    }

    if (!this.email) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.email = "Email không hợp lệ";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
