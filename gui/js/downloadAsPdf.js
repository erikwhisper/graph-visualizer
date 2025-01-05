//TODO: Canvas is too large for pdf to 1:1 downlaod it
//therefore, if our graph on the canvas is too large we need to
//downsize our graph to fit on the pdf. It works for the png
//the png covers the full canvas.
document.getElementById("downloadPdfButton").addEventListener("click", () => {
    downloadSvgAsPdf();
  });
  
  function downloadSvgAsPdf() {
    //secelt current svg
    const svgElement = document.querySelector("#graph-container svg");
  
    if (!svgElement) {
      alert("No SVG graph found!");
      return;
    }
  
    //object with options for html2pdf
    const options = {
      margin: 10,
      filename: "graph.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 10 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      //alternative to landscape would be portrait / make user decide?
    };
  
    //svg to pdf with html2pdf
    html2pdf().from(svgElement).set(options).save();
  }
  