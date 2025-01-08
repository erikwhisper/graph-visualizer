//Listener für PAG dotSyntax
const pagDotReadButton = document.getElementById("pagDotReadButton");
pagDotReadButton.addEventListener("click", handleDotInput);

//Fuktion für PAG dotSyntax
function handleDotInput() {
  const fileInput = document.getElementById("pagDotFileInput").files[0];
  const displayArea = document.getElementById("pagDotDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result;
      //Dot -> Json -> Matrix
      //Unterscheiden zwischen ADMG Matrix und PAG Matrix wie?

      const jsonData = dotToJsonConversion(displayArea.value);

      document.getElementById("jsonDisplay").value = JSON.stringify(
        jsonData,
        null,
        2
      );

      if (isAdmg) {
        document.getElementById("pagMatrixDisplay").value =
          jsonToAdmgMatrixConversion(jsonData);
      } else {
        document.getElementById("pagMatrixDisplay").value =
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
