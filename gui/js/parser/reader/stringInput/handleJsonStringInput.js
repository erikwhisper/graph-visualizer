/**
 * @description Updates the dot and matrix textarea based on the json textarea: DOT <- JSON -> Matrix
 */
document
  .getElementById("updateFromJsonButton")
  .addEventListener("click", () => {
    handleJsonStringInputController();
  });

//Schnittstelle mit dem Frontend
function handleJsonStringInputController() {
  const jsonString = document.getElementById("jsonDisplay").value;
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  handleJsonStringInput(jsonString, isAdmg);
}

//Backend
function handleJsonStringInput(jsonString, isAdmg) {
  const result = callConverterFromJsonInput(jsonString, isAdmg);
  jsonData = JSON.parse(jsonString);
  handleJsonInputVisualization(jsonString, result);
}

//Schnittstelle mit dem Frontend
function handleJsonInputVisualization(jsonString, result) {
  initializeSvgCanvas();
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = result.dot;
}
