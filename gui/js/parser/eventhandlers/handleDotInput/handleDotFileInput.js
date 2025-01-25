/**
 * @description Handles the Input of a file containing the graph in the DOT Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */

document.getElementById("dotFileInputButton").addEventListener("click", () => {
  handleDotInput();
});

function handleDotInput() {
  const fileInput = document.getElementById("dotFileInput").files[0];
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const dotString = event.target.result;
      const result = callConverterFromDotInput(dotString, isAdmg);

      const jsonString = JSON.stringify(result.jsonData, null, 2);
      document.getElementById("jsonDisplay").value = jsonString;
      document.getElementById("matrixDisplay").value = result.matrix;
      document.getElementById("dotDisplay").value = dotString;
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
