/**
 * @description Handles the Input of a file containing the graph in the Matrix(PAG/ADMG) Format and 
 * calls the conversion functions, do display the graph as Matrix, JSON and DOT
 */
const pagMatrixReadButton = document.getElementById("pagMatrixReadButton");
pagMatrixReadButton.addEventListener("click", handleMatrixInput);

//Fuktion für PAG matrix
//die drei const werte könnte man auch in den eventlistener lieber packen und als params übergeben
function handleMatrixInput() {
  const fileInput = document.getElementById("matrixFileInput").files[0];
  const displayArea = document.getElementById("matrixDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
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

        document.getElementById("dotDisplay").value =
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

        document.getElementById("dotDisplay").value =
          jsonToDotConversion(jsonData);
      }

      //Matrix -> Json -> Dot
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}

  /**
   * @description Turns the raw csv Matrix into a nicly formated one for future display
   * @param {string} csvContent (unformattedMatrix)
   * @returns {string} csvContent (formattedMatrix)
   */
  function formatMatrix(csvContent) {
    return csvContent
      .trim()
      .split("\n")
      .map((row) => row.split(",").join(", "))
      .join("\n");
  }

  /**
 * @description turns a matrix into a long by comma devided list of its components
 * @param {string} csvContent (matrix as matrix)
 * @returns {string} csvContent (matrix as long linear string)
 */
function parsePagContent(csvContent) {
  return csvContent
    .trim()
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.replace(/"/g, "").trim()));
}