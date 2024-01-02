/**
 * Converts a timestamp in milliseconds to a formatted date string in "MM-DD-YYYY" format.
 *
 * @param {number} msDate - The timestamp in milliseconds.
 * @returns {string} The formatted date string.
 */
export default function formatDate(msDate: number) {
  const date = new Date(msDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}-${year}`;
}
