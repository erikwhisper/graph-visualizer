
//FRONTEND
document
  .getElementById("downloadMatrixButton")
  .addEventListener("click", () => {
    startDownload("matrix");
  });

document.getElementById("downloadJsonButton").addEventListener("click", () => {
  startDownload("json");
});

document.getElementById("downloadDotButton").addEventListener("click", () => {
  startDownload("dot");
});

function startDownload(type){
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  handleOutput(type, isAdmg);
}


function handleOutput(type, isAdmg) {

  const jsonString = JSON.stringify(jsonData, null, 2);

  const result = callConverterFromJsonInput(jsonString, isAdmg);

  fileWriter(type, jsonString, result.matrix, result.dot);
}

function fileWriter(type, jsonString, matrixString, dotString) {
  let content = "";
  let filename = "";
  let fileType = "";

  if (type === "json") {
    content = jsonString;
    filename = "jsonGraph.json";
    fileType = "application/json";
  } else if (type === "matrix") {
    content = matrixString;
    filename = "matrixGraph.csv";
    fileType = "text/csv";
  } else if (type === "dot") {
    content = dotString;
    filename = "dotGraph.gv";
    fileType = "text/plain";
  }

  const blob = new Blob([content], { type: fileType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

