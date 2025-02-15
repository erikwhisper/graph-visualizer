/**
 * @description Handles the Input of a file containing the graph in the JSON Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
document.getElementById("jsonFileInputButton").addEventListener("click", () => {
  handleJsonFileInputController();
});

function handleJsonFileInputController() {
  const fileInput = document.getElementById("jsonFileInput").files[0];
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (!fileInput) {
    alert("Bitte wählen Sie eine Datei aus.");
    return;
  }
  jsonFileReader(fileInput, isAdmg);
}

function jsonFileReader(fileInput, isAdmg) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const jsonString = event.target.result;
    handleJsonStringInput(jsonString, isAdmg)
  };
  reader.readAsText(fileInput);
}
