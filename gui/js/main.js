//Listener für PAG matrix
const pagMatrixReadButton = document.getElementById("pagMatrixReadButton");
pagMatrixReadButton.addEventListener("click", readPagMatrix);

//Listener für PAG jsonData
const pagJsonReadButton = document.getElementById("pagJsonReadButton");
pagJsonReadButton.addEventListener("click", readPagJson);

//Listener für PAG dotSyntax
const pagDotReadButton = document.getElementById("pagDotReadButton");
pagDotReadButton.addEventListener("click", readPagDot);

//--------Diese 3 Functions lassen sich zu einer refactorn------------//

//Fuktion für PAG matrix
function readPagMatrix() {
  const fileInput = document.getElementById("pagMatrixFileInput").files[0];
  const displayArea = document.getElementById("pagMatrixDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const formattedMatrix = pagFormatMatrix(event.target.result);
      displayArea.value = formattedMatrix; // Formatierte Matrix anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
//hilftfunktion zur schöneren visualisierung der Matrix.
function pagFormatMatrix(csvContent) {
  const zeilen = csvContent.trim().split("\n"); // Zeilen splitten
  return zeilen.map((row) => row.split(",").join(", ")).join("\n"); // Formatieren
}

//Fuktion für PAG jsonData
function readPagJson() {
  const fileInput = document.getElementById("pagJsonFileInput").files[0];
  const displayArea = document.getElementById("pagJsonDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result; // JSON anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}

//Fuktion für PAG dotSyntax
function readPagDot() {
  const fileInput = document.getElementById("pagDotFileInput").files[0];
  const displayArea = document.getElementById("pagDotDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result; // DOT anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
//--------Diese 3 Functions lassen sich zu einer refactorn------------//
