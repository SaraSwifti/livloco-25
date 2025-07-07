export const formatPhone = (phone) => {
  // Remove non-digit characters, then grab last 10 digits (in case of +1 country code)
  const digits = phone.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return phone; // fallback

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};