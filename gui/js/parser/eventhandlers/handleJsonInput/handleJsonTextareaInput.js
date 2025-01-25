/**
 * @description Updates the dot and matrix textarea based on the json textarea: DOT <- JSON -> Matrix
 */
document
  .getElementById("updateFromJsonButton")
  .addEventListener("click", () => {
    handleTextareaInput();
  });

function handleTextareaInput() {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const jsonString = document.getElementById("jsonDisplay").value;

  const result = callConverterFromJsonInput(jsonString, isAdmg);
  document.getElementById("jsonDisplay").value = jsonString;
  document.getElementById("matrixDisplay").value = result.matrix;
  document.getElementById("dotDisplay").value = result.dot;
}
