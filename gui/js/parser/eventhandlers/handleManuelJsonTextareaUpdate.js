/**
 * @description Updates the dot and matrix textarea based on the json textarea: DOT <- JSON -> Matrix
 */
const updateFromJsonTextareaButton = document.getElementById(
  "updateFromJsonButton"
);
updateFromJsonTextareaButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const jsonInput = document.getElementById("jsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);

  if (isAdmg) {
    const matrixCsv = jsonToAdmgMatrixConversion(jsonData);
    document.getElementById("matrixDisplay").value = matrixCsv;
  } else {
    const matrixCsv = jsonToPagMatrixConversion(jsonData);
    document.getElementById("matrixDisplay").value = matrixCsv;
  }

  const dotSyntax = jsonToDotConversion(jsonData);
  document.getElementById("dotDisplay").value = dotSyntax;
});
