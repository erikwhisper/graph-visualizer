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

