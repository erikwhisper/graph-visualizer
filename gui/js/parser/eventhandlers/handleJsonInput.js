//Listener für PAG jsonData
const pagJsonReadButton = document.getElementById("pagJsonReadButton");
pagJsonReadButton.addEventListener("click", handleJsonInput);

//Fuktion für PAG jsonData
function handleJsonInput() {
  const fileInput = document.getElementById("pagJsonFileInput").files[0];
  const displayArea = document.getElementById("jsonDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result;
      //Json -> Matrix & Json -> Dot

      const jsonData = JSON.parse(displayArea.value);

      if (isAdmg) {
        document.getElementById("matrixDisplay").value =
          jsonToAdmgMatrixConversion(jsonData);
      } else {
        document.getElementById("matrixDisplay").value =
          jsonToPagMatrixConversion(jsonData);
      }

      document.getElementById("dotDisplay").value =
        jsonToDotConversion(jsonData);

      //Json -> Matrix & Json -> Dot
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
