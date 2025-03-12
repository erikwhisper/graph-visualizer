/**
 * @description Turns the raw csv Matrix into a nicly formated one for future display
 * @param {string} csvContent (unformattedMatrix)
 * @returns {string} csvContent (formattedMatrix)
 */
/*
function formatMatrix(csvContent) {
  return csvContent
    .trim()
    .split("\n")
    .map((row) => row.split(",").join(", "))
    .join("\n");
}
*/

/**
 * @description turns a matrix into a long by comma devided list of its components
 * @param {string} csvContent (matrix as matrix)
 * @returns {string} csvContent (matrix as long linear string)
 */
function parsePagContent(csvContent) {
  return csvContent
    .trim()
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.replace(/"/g, "").trim()));
}
