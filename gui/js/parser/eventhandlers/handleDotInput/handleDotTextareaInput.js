/**
 * @description Updates the matrix and json textarea based on the dot textarea: DOT -> JSON -> Matrix
 */

document.getElementById("updateFromDotButton").addEventListener("click", () => {
  handleDotTextareaInput();
});

function handleDotTextareaInput() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const dotString = document.getElementById("dotDisplay").value;

  const result = callConverterFromDotInput(dotString, isAdmg);
  const jsonString = JSON.stringify(result.jsonData, null, 2);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = dotString;
}
