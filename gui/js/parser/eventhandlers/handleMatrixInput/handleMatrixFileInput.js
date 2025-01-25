/**
 * @description Handles the Input of a file containing the graph in the Matrix(PAG/ADMG) Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
document
  .getElementById("matrixFileInputButton")
  .addEventListener("click", () => {
    handleMatrixInput();
  });

//Fuktion für PAG matrix
//die drei const werte könnte man auch in den eventlistener lieber packen und als params übergeben
function handleMatrixInput() {
  const fileInput = document.getElementById("matrixFileInput").files[0];
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const matrixString = event.target.result;
      const result = callConverterFromMatrixInput(matrixString, isAdmg);

      const jsonString = JSON.stringify(result.jsonData, null, 2);
      document.getElementById("jsonDisplay").value = jsonString;
      document.getElementById("matrixDisplay").value = matrixString;
      document.getElementById("dotDisplay").value = result.dot;
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
