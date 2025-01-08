/**
 * @description Updates the matrix and json textarea based on the dot textarea: DOT -> JSON -> Matrix
 */
const updateFromDotButton = document.getElementById("updateFromDotButton");
updateFromDotButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const dotInput = document.getElementById("dotDisplay").value;
  const jsonData = dotToJsonConversion(dotInput);

  document.getElementById("jsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );

  if (isAdmg) {
    const matrixCsv = jsonToAdmgMatrixConversion(jsonData);
    document.getElementById("matrixDisplay").value = matrixCsv;
  } else {
    const matrixCsv = jsonToPagMatrixConversion(jsonData);
    document.getElementById("matrixDisplay").value = matrixCsv;
  }
});
