/**
 * @description Updates the dot and matrix textarea based on the json textarea: DOT <- JSON -> Matrix
 */
document
  .getElementById("updateFromJsonButton")
  .addEventListener("click", () => {
    handleJsonStringInputController();
  });

  function handleJsonStringInputController(){
    const jsonString = document.getElementById("jsonDisplay").value;
    const isAdmg = document.getElementById("matrixTypeToggle").checked;
    handleJsonStringInput(jsonString, isAdmg);
  }

function handleJsonStringInput(jsonString, isAdmg) {

  const result = callConverterFromJsonInput(jsonString, isAdmg);
  jsonData = JSON.parse(jsonString);

  handleJsonInputVisualization(jsonString, result);
}


function handleJsonInputVisualization(jsonString, result) {
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = result.dot;
}
