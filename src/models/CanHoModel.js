// src/models/CanHoModel.js - Enhanced with validation for apartment management
export class CanHoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.socanho = data.socanho || null;
    this.toanha = data.toanha || "";

    // Handle the case where khachhang might be an object with id
    if (data.khachhang && data.khachhang.id) {
      this.khachhang_id = data.khachhang.id;
      this.khachhang = data.khachhang;
    } else {
      this.khachhang_id = data.khachhang_id || null;
    }
  }

  /**
   * Validates the apartment model data
   * @returns {Object} Object containing validation result and any errors
   */
  validate() {
    const errors = {};

    // Required field validations
    if (!this.socanho && this.socanho !== 0) {
      errors.socanho = "Số căn hộ không được để trống";
    } else if (isNaN(this.socanho) || this.socanho < 1) {
      errors.socanho = "Số căn hộ phải là số dương lớn hơn 0";
    }

    if (!this.toanha || this.toanha.trim() === "") {
      errors.toanha = "Tòa nhà không được để trống";
    }

    if (!this.khachhang_id) {
      errors.khachhang_id = "ID khách hàng không được để trống";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Returns a plain object representation of the model (useful for API calls)
   * @returns {Object} Plain object without methods
   */
  toJSON() {
    return {
      id: this.id,
      socanho: this.socanho,
      toanha: this.toanha,
      khachhang: this.khachhang_id ? { id: this.khachhang_id } : null,
    };
  }

  /**
   * Get full apartment name format
   * @returns {string} Formatted apartment name
   */
  getFullName() {
    return `${this.toanha} - Căn hộ ${this.socanho}`;
  }
}
