/**
 * @description Handles the Input of a file containing the graph in the JSON Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
document.getElementById("jsonFileInputButton").addEventListener("click", () => {
  handleFileInput();
});

function handleFileInput() {
  const fileInput = document.getElementById("jsonFileInput").files[0];
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (fileInput) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonString = event.target.result;
      const result = callConverterFromJsonInput(jsonString, isAdmg);
      document.getElementById("jsonDisplay").value = jsonString;
      document.getElementById("matrixDisplay").value = result.matrix;
      document.getElementById("dotDisplay").value = result.dot;
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
