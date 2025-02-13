document
  .getElementById("downloadMatrixButton")
  .addEventListener("click", () => {
    downloadFile("matrix");
  });

document.getElementById("downloadJsonButton").addEventListener("click", () => {
  downloadFile("json");
});

document.getElementById("downloadDotButton").addEventListener("click", () => {
  downloadFile("dot");
});

function downloadFile(type) {
  const jsonString = document.getElementById("jsonDisplay").value;
  const isAdmg = document.getElementById("matrixTypeToggle").checked;

  if (!jsonString.trim()) {
    alert("JSON-Daten fehlen!");
    return;
  }

  const { matrix, dot } = callConverterFromJsonInput(jsonString, isAdmg);

  let content = "";
  let filename = "";
  let fileType = "";

  if (type === "json") {
    content = jsonString;
    filename = "jsonGraph.json";
    fileType = "application/json";
  } else if (type === "matrix") {
    content = matrix;
    filename = "matrixGraph.csv";
    fileType = "text/csv";
  } else if (type === "dot") {
    content = dot;
    filename = "dotGraph.gv";
    fileType = "text/plain";
  }

  const blob = new Blob([content], { type: fileType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
