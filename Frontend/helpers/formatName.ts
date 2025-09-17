export const formatName = (raw: string) => {
  if (!raw) return "Guest";
  return raw
    .trim()
    .split(/\s+/) // split by one or more spaces
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};
