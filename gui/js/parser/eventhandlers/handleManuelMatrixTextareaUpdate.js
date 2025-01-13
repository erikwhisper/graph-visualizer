/**
 * @description Updates the dot and json textarea based on the matrix textarea: Matrix -> JSON -> DOT
 */
const updateFromMatrixButton = document.getElementById(
  "updateFromMatrixButton"
);

updateFromMatrixButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (isAdmg) {
    updateFromMatrix(admgMatrixToJsonConversion);
  } else {
    updateFromMatrix(pagMatrixToJsonConversion);
  }
});

function updateFromMatrix(conversionFunction) {
  const currentPagMatrix = document.getElementById("matrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = conversionFunction(parsedPagMatrix);

  document.getElementById("jsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );

  const dotSyntax = jsonToDotConversion(jsonData);
  document.getElementById("dotDisplay").value = dotSyntax;
}

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