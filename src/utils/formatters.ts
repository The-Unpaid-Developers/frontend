/**
 * Converts various boolean representations to Yes/No/— display format
 */
export const formatBoolean = (value: unknown): string => {
  if (value === true || value === "TRUE" || value === "true") return "Yes";
  if (value === false || value === "FALSE" || value === "false") return "No";
  return value?.toString() ?? "—";
};

/**
 * Formats date strings for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Safely displays values with fallback to dash
 */
export const displayValue = (value: unknown): string => {
  return value?.toString() ?? "—";
};