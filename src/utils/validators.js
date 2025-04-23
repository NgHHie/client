// src/utils/validators.js

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone number format (10-11 digits)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone number is valid
 */
export const isValidPhone = (phone) => {
  const regex = /^[0-9]{10,11}$/;
  return regex.test(phone);
};

/**
 * Validate a required field is not empty
 * @param {string} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  return value !== undefined && value !== null && value !== "";
};

/**
 * Validate a number is greater than a minimum value
 * @param {number} value - Value to check
 * @param {number} min - Minimum allowed value
 * @returns {boolean} True if value is greater than min
 */
export const isMinValue = (value, min) => {
  return Number(value) >= min;
};

/**
 * Validate new water meter reading is greater than old reading
 * @param {number} newReading - New meter reading
 * @param {number} oldReading - Old meter reading
 * @returns {boolean} True if new reading is greater than old reading
 */
export const isValidMeterReading = (newReading, oldReading) => {
  return Number(newReading) > Number(oldReading);
};
