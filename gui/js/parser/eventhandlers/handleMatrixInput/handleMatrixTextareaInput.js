/**
 * @description Updates the dot and json textarea based on the matrix textarea: Matrix -> JSON -> DOT
 */

document
  .getElementById("updateFromMatrixButton")
  .addEventListener("click", () => {
    handleMatrixStringInputController();
  });

function handleMatrixStringInputController() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const matrixString = document.getElementById("matrixDisplay").value;
  handleMatrixTextareaInput(matrixString, isAdmg);
}

function handleMatrixTextareaInput(matrixString, isAdmg) {
  const result = callConverterFromMatrixInput(matrixString, isAdmg);
  jsonData = result.jsonData;

  handleMatrixInputVisualization(result, matrixString);
}

function handleMatrixInputVisualization(result, matrixString) {
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = matrixString;
  document.getElementById("dotDisplay").value = result.dot;
}
