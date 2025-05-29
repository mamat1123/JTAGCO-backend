/**
 * Formats a date string to YYYY-MM-DD format for database operations
 * @param dateString - The date string to format (ISO format or any valid date string)
 * @returns The formatted date string in YYYY-MM-DD format, or undefined if input is undefined
 */
export const formatDateForDatabase = (dateString: string | undefined): string | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString).toISOString().split('T')[0];
};

/**
 * Formats a date string to ISO format
 * @param dateString - The date string to format
 * @returns The formatted date string in ISO format, or undefined if input is undefined
 */
export const formatDateToISO = (dateString: string | undefined): string | undefined => {
  if (!dateString) return undefined;
  return new Date(dateString).toISOString();
}; 