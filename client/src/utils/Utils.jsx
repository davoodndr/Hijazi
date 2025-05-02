export const hexToRgba = (hex, alpha = 100) => {

  if (typeof hex !== 'string' || !/^#([A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error('Invalid hex color format. Expected format: #RRGGBB');
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

export function isEmailValid(email) {
  // Regular expression for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export const blobToFile = (blob, filename) => {
  return new File([blob], filename, { type: blob.type });
};