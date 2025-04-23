// src/utils/formatters.js

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale for formatting (default: 'vi-VN')
 * @param {string} currency - Currency code (default: 'VND')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = "vi-VN", currency = "VND") => {
  if (amount === null || amount === undefined) return "-";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date to a localized string
 * @param {string|Date} date - Date to format
 * @param {string} locale - Locale for formatting (default: 'vi-VN')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (
  date,
  locale = "vi-VN",
  options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
) => {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Calculate water usage amount based on consumption
 * @param {number} consumption - Water consumption in cubic meters
 * @param {Object} rates - Water rates
 * @returns {number} Total amount
 */
export const calculateWaterAmount = (
  consumption,
  rates = {
    // Default rates per cubic meter (sample rates)
    base: 5700, // 0-10 m³
    tier1: 7000, // 11-20 m³
    tier2: 8500, // 21-30 m³
    tier3: 10000, // Over 30 m³
  }
) => {
  let amount = 0;

  if (consumption <= 10) {
    amount = consumption * rates.base;
  } else if (consumption <= 20) {
    amount = 10 * rates.base + (consumption - 10) * rates.tier1;
  } else if (consumption <= 30) {
    amount =
      10 * rates.base + 10 * rates.tier1 + (consumption - 20) * rates.tier2;
  } else {
    amount =
      10 * rates.base +
      10 * rates.tier1 +
      10 * rates.tier2 +
      (consumption - 30) * rates.tier3;
  }

  // Add 10% VAT
  amount *= 1.1;

  return Math.round(amount);
};

/**
 * Calculate days between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date (default: current date)
 * @returns {number} Number of days between dates
 */
export const daysBetween = (startDate, endDate = new Date()) => {
  if (!startDate) return 0;

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  const differenceMs = Math.abs(end - start);
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};
