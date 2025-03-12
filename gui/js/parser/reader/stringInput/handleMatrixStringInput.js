/**
 * @description Updates the dot and json textarea based on the matrix textarea: Matrix -> JSON -> DOT
 */

document
  .getElementById("updateFromMatrixButton")
  .addEventListener("click", () => {
    handleMatrixStringInputController();
  });

//Schnittstelle mit dem Frontend
function handleMatrixStringInputController() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const matrixString = document.getElementById("matrixDisplay").value;
  handleMatrixStringInput(matrixString, isAdmg);
}

//Backend
function handleMatrixStringInput(matrixString, isAdmg) {
  const result = callConverterFromMatrixInput(matrixString, isAdmg);
  jsonData = result.jsonData;
  handleMatrixInputVisualization(result, matrixString);
}

//Schnittstelle mit dem Frontend
function handleMatrixInputVisualization(result, matrixString) {
  initializeSvgCanvas();
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = matrixString;
  document.getElementById("dotDisplay").value = result.dot;
}
