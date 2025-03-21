// Limitation only formats US numbers correctly
export const formatPhone = (phone: string | number): string => {
    const digits = phone.toString().replace(/\D/g, "");
    if (digits.length !== 10) return phone.toString();

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};