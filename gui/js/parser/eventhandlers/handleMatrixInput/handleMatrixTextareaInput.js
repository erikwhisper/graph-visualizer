/**
 * @description Updates the dot and json textarea based on the matrix textarea: Matrix -> JSON -> DOT
 */

document
  .getElementById("updateFromMatrixButton")
  .addEventListener("click", () => {
    handleMatrixTextareaInput();
  });

function handleMatrixTextareaInput() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const matrixString = document.getElementById("matrixDisplay").value;

  const result = callConverterFromMatrixInput(matrixString, isAdmg);
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = matrixString;
  document.getElementById("dotDisplay").value = result.dot;
}
