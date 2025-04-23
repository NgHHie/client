export class CanHoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.socanho = data.socanho || null;
    this.toanha = data.toanha || "";
    this.khachhang_id = data.khachhang_id || null;
  }

  validate() {
    const errors = {};

    if (!this.socanho) {
      errors.socanho = "Số căn hộ không được để trống";
    } else if (this.socanho < 1) {
      errors.socanho = "Số căn hộ phải lớn hơn 0";
    }

    if (!this.toanha) errors.toanha = "Tòa nhà không được để trống";

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
