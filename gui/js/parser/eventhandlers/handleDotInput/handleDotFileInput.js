/**
 * @description Handles the Input of a file containing the graph in the DOT Format and 
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
const pagDotReadButton = document.getElementById("pagDotReadButton");
pagDotReadButton.addEventListener("click", handleDotInput);

//Fuktion für PAG dotSyntax
function handleDotInput() {
  const fileInput = document.getElementById("dotFileInput").files[0];
  const displayArea = document.getElementById("dotDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result;
      //Dot -> Json -> Matrix
      //Unterscheiden zwischen ADMG Matrix und PAG Matrix wie?

      const jsonData = dotToJsonConversion(displayArea.value); //hier event.target.result nutzen?

      document.getElementById("jsonDisplay").value = JSON.stringify(
        jsonData,
        null,
        2
      );

      console.log("what is admg" + isAdmg);
      if (isAdmg) {
        document.getElementById("matrixDisplay").value =
          jsonToAdmgMatrixConversion(jsonData);
      } else {
        document.getElementById("matrixDisplay").value =
          jsonToPagMatrixConversion(jsonData);
      }

      //Dot -> Json -> Matrix
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
//--------Diese 3 Functions lassen sich zu einer refactorn------------//
