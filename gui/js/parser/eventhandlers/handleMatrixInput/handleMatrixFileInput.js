/**
 * @description Handles the Input of a file containing the graph in the Matrix(PAG/ADMG) Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
document
  .getElementById("matrixFileInputButton")
  .addEventListener("click", () => {
    handleMatrixFileInputController();
  });

function handleMatrixFileInputController() {
  const fileInput = document.getElementById("matrixFileInput").files[0];
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (!fileInput) {
    alert("Bitte wählen Sie eine Datei aus.");
    return;
  }
  matrixFileReader(fileInput, isAdmg);
}

function matrixFileReader(fileInput, isAdmg) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const matrixString = event.target.result;
    handleMatrixTextareaInput(matrixString, isAdmg);
  };
  reader.readAsText(fileInput);
}
