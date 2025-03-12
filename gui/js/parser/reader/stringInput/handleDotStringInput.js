/**
 * @description Updates the matrix and json textarea based on the dot textarea: DOT -> JSON -> Matrix
 */

document.getElementById("updateFromDotButton").addEventListener("click", () => {
  handleDotStringInputController();
});

//Schnittstelle mit dem Frontend
function handleDotStringInputController() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const dotString = document.getElementById("dotDisplay").value;
  handleDotStringInput(isAdmg, dotString);
}

//Backend
function handleDotStringInput(isAdmg, dotString) {
  const result = callConverterFromDotInput(dotString, isAdmg);
  jsonData = result.jsonData;
  handleDotInputVisualization(result, dotString);
}

//Schnittstelle mit dem Frontend
function handleDotInputVisualization(result, dotString) {
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  initializeSvgCanvas();
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = dotString;
}
