// src/models/KhachHangModel.js - Fixed version
import { isValidEmail, isValidPhone, isRequired } from "../utils/validators";

export class KhachHangModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.hoten = data.hoten || "";
    this.sodienthoai = data.sodienthoai || "";
    this.email = data.email || "";
    this.diachi = data.diachi || "";
    this.quoctich = data.quoctich || "Việt Nam";
    this.cccd = data.cccd || "";
    this.ngaytao = data.ngaytao || null;
    this.canho = data.canho || [];
  }

  /**
   * Validates the customer model data
   * @returns {Object} Object containing validation result and any errors
   */
  validate() {
    const errors = {};

    // Required field validation
    if (!isRequired(this.hoten)) {
      errors.hoten = "Họ tên không được để trống";
    }

    // Phone number validation
    if (!isRequired(this.sodienthoai)) {
      errors.sodienthoai = "Số điện thoại không được để trống";
    } else if (!isValidPhone(this.sodienthoai)) {
      errors.sodienthoai = "Số điện thoại không hợp lệ (yêu cầu 10-11 số)";
    }

    // Email validation
    if (!isRequired(this.email)) {
      errors.email = "Email không được để trống";
    } else if (!isValidEmail(this.email)) {
      errors.email = "Email không hợp lệ";
    }

    // Additional validations can be added here (CCCD, address, etc)
    if (this.cccd && !/^[0-9]{9,12}$/.test(this.cccd)) {
      errors.cccd = "Số CCCD không hợp lệ";
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
      hoten: this.hoten,
      sodienthoai: this.sodienthoai,
      email: this.email,
      diachi: this.diachi,
      quoctich: this.quoctich,
      cccd: this.cccd,
      ngaytao: this.ngaytao,
      // Omit canho if it's empty
      ...(this.canho && this.canho.length > 0 ? { canho: this.canho } : {}),
    };
  }
}
