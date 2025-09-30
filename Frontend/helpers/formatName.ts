export const formatName = (raw: string) => {
  if (!raw) return "Guest";
  return raw
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" "); // <= this keeps spaces!
};
