/**
 * @description Updates the matrix and json textarea based on the dot textarea: DOT -> JSON -> Matrix
 */

document.getElementById("updateFromDotButton").addEventListener("click", () => {
  handleDotStringInputController();
});

function handleDotStringInputController(){
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const dotString = document.getElementById("dotDisplay").value;
  handleDotStringInput(isAdmg, dotString);
}

function handleDotStringInput(isAdmg, dotString) {
  
  const result = callConverterFromDotInput(dotString, isAdmg);
  jsonData = result.jsonData;

  handleDotInputVisualization(result, dotString);
}


function handleDotInputVisualization(result, dotString) {
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = dotString;
}