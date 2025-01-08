//Listener für PAG matrix
const pagMatrixReadButton = document.getElementById("pagMatrixReadButton");
pagMatrixReadButton.addEventListener("click", handleMatrixInput);

//Fuktion für PAG matrix
function handleMatrixInput() {
  const fileInput = document.getElementById("pagMatrixFileInput").files[0];
  const displayArea = document.getElementById("pagMatrixDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      //formatMatrix gets called to make it look nice on the displayArea
      displayArea.value = formatMatrix(event.target.result);
      //displayArea.value = event.target.result;
      //Matrix -> Json -> Dot
      if (isAdmg) {
        console.log("Converting ADMG matrix to JSON...");
        const jsonData = admgMatrixToJsonConversion(
          parsePagContent(event.target.result)
        );

        document.getElementById("jsonDisplay").value = JSON.stringify(
          jsonData,
          null,
          2
        );

        document.getElementById("pagDotDisplay").value =
          jsonToDotConversion(jsonData);
      } else {
        console.log("Converting PAG matrix to JSON...");
        const jsonData = pagMatrixToJsonConversion(
          parsePagContent(event.target.result)
        );

        document.getElementById("jsonDisplay").value = JSON.stringify(
          jsonData,
          null,
          2
        );

        document.getElementById("pagDotDisplay").value =
          jsonToDotConversion(jsonData);
      }

      //Matrix -> Json -> Dot
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
