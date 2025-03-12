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
