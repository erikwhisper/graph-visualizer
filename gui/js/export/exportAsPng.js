document.getElementById("downloadPngButton").addEventListener("click", () => {
  downloadSvgAsPng();
});

//User entscheiden lassen ob er einen Transparenten hintergrund will
//in einem untermenü wo ich diese download dinger hinmoven werde
//dann kann ich mit checkbox das hinzufügen.

//Mit einem regler maybe die auflösung einstellen können

//ist es möglich nur einen bestimmten bereich iwie auszuwählen
//oder ist erstmal egal i think, ohne zoom passt ganzes canvas

//dann in dem unterfeld auch die buttons hinzufügen um es als
//Matrix, Dot-Syntax und jsonData file runterzuladen, keine ahnung
//was da due passende endung ist für jsonData, bei matrix und dot-syntax
//ist ja einf .csv
function downloadSvgAsPng() {
  //current svg
  const svgElement = document.querySelector("#graph-container svg");

  if (!svgElement) {
    alert("No SVG graph found!");
    return;
  }

  const svgString = new XMLSerializer().serializeToString(svgElement);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const scaleFactor = 10;

  const width = parseInt(svgElement.getAttribute("width"));
  const height = parseInt(svgElement.getAttribute("height"));

  canvas.width = width * scaleFactor;
  canvas.height = height * scaleFactor;

  context.scale(scaleFactor, scaleFactor); //skalierung anwenden

  const img = new Image();
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    // Hintergrundfarbe des Canvas (weiß oder transparent je nach Wahl)
    context.fillStyle = "#ffffff"; // Für weißen Hintergrund
    context.fillRect(0, 0, canvas.width, canvas.height); // Hintergrund füllen
    context.drawImage(img, 0, 0, width, height); // Bild auf Canvas zeichnen

    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    URL.revokeObjectURL(url);
  };

  img.src = url;
}
