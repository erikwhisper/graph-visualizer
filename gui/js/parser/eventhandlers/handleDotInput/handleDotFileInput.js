/**
 * @description Handles the Input of a file containing the graph in the DOT Format and
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */

document.getElementById("dotFileInputButton").addEventListener("click", () => {
  handleDotFileInputController();
});


function handleDotFileInputController(){
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const fileInput = document.getElementById("dotFileInput").files[0];
  if (!fileInput) {
    alert("Bitte wählen Sie eine Datei aus.");
    return;
  }
  dotFileReader(isAdmg, fileInput);
}

function dotFileReader(isAdmg, fileInput) {
  
  const reader = new FileReader();

  reader.onload = function (event) {
    const dotString = event.target.result;
    handleDotStringInput(isAdmg, dotString);
  };
  reader.readAsText(fileInput);
}





