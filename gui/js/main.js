/***********************************************************/
/*********START: Type-Conversion Functions for PAG**********/
/***********************************************************/

//Listener für PAG matrix
const pagMatrixReadButton = document.getElementById("pagMatrixReadButton");
pagMatrixReadButton.addEventListener("click", readPagMatrix);

//Listener für PAG jsonData
const pagJsonReadButton = document.getElementById("pagJsonReadButton");
pagJsonReadButton.addEventListener("click", readPagJson);

//Listener für PAG dotSyntax
const pagDotReadButton = document.getElementById("pagDotReadButton");
pagDotReadButton.addEventListener("click", readPagDot);

//--------Diese 3 Functions lassen sich zu einer refactorn------------//

//Fuktion für PAG matrix
function readPagMatrix() {
  const fileInput = document.getElementById("pagMatrixFileInput").files[0];
  const displayArea = document.getElementById("pagMatrixDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const formattedMatrix = pagFormatMatrix(event.target.result);
      displayArea.value = formattedMatrix; // Formatierte Matrix anzeigen
      //displayArea.value = event.target.result; //Matrix anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
//hilftfunktion zur schöneren visualisierung der Matrix.
function pagFormatMatrix(csvContent) {
  const zeilen = csvContent.trim().split("\n"); // Zeilen splitten
  return zeilen.map((row) => row.split(",").join(", ")).join("\n"); // Formatieren
}

//Fuktion für PAG jsonData
function readPagJson() {
  const fileInput = document.getElementById("pagJsonFileInput").files[0];
  const displayArea = document.getElementById("pagJsonDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result; // JSON anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}

//Fuktion für PAG dotSyntax
function readPagDot() {
  const fileInput = document.getElementById("pagDotFileInput").files[0];
  const displayArea = document.getElementById("pagDotDisplay");
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result; // DOT anzeigen
    };
    reader.readAsText(fileInput);
  } else {
    alert("Bitte wählen Sie eine Datei aus.");
  }
}
//--------Diese 3 Functions lassen sich zu einer refactorn------------//

/****************************************/
/**********END: Initial readin***********/
/****************************************/

/*********************************************************************/

//----------------START: MATRIX -> JSON (PAG)------------------------//

const pagConvertMatrixToJsonButton = document.getElementById(
  "pagConvertMatrixToJson"
);
pagConvertMatrixToJsonButton.addEventListener(
  "click",
  pagMatrixToJsonConversion
);

function pagConvertMatrixToJson(parsedPagMatrix) {
  const knotenSet = new Set(); //alle knoten in menge
  const links = []; //alle edges

  //knoten auslesen und einmalig übernehmen
  const knotenNamen = parsedPagMatrix[0].slice(1);

  for (let i = 1; i < parsedPagMatrix.length; i++) {
    const quellKnoten = parsedPagMatrix[i][0];
    for (let j = i + 1; j < parsedPagMatrix[i].length; j++) {
      const kantenTypFromTo = parseInt(parsedPagMatrix[i][j]);
      const kantenTypToFrom = parseInt(parsedPagMatrix[j][i]);
      const zielKnoten = knotenNamen[j - 1];

      knotenSet.add(quellKnoten);
      knotenSet.add(zielKnoten);

      const link = pagCreateJsonLinks(
        quellKnoten,
        zielKnoten,
        kantenTypFromTo,
        kantenTypToFrom
      );
      if (link) {
        links.push(link);
      }
    }
  }

  //knoten in jsonFormat
  const nodes = Array.from(knotenSet).map((node) => ({
    id: node,
    x: null,
    y: null,
    labelOffsetX: 0,
    labelOffsetY: 0,
  }));

  return { nodes, links };
}

function pagMatrixToJsonConversion() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = pagConvertMatrixToJson(parsedPagMatrix);

  document.getElementById("pagJsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
}

function parsePagContent(csvContent) {
  return csvContent
    .trim()
    .split("\n")
    .map((row) => row.split(",").map((cell) => cell.replace(/"/g, "").trim()));
}

//brauch ich wirklich bei jedem link die koordinaten ne oder?
//das kann man doch auch mit einem edgeMapping machen aber andersrum
//also wenn ich kantenTypFromTo === 1 hab, dann ist das mit
//edgeMapping[1] = odot z.B. dann kann ich mir so viel schreiben
//sparen oder?
function pagCreateJsonLinks(
  quellKnoten,
  zielKnoten,
  kantenTypFromTo,
  kantenTypToFrom
) {
  //alle Fälle mit 1 vorne
  if (kantenTypFromTo === 1 && kantenTypToFrom === 1) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "odot",
      arrowtail: "odot",
    };
  } else if (kantenTypFromTo === 1 && kantenTypToFrom === 2) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "odot",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 1 && kantenTypToFrom === 3) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "odot",
      arrowtail: "tail",
    };
  }

  //alle Fälle mit 2 vorne
  else if (kantenTypFromTo === 2 && kantenTypToFrom === 2) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "normal",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 2 && kantenTypToFrom === 3) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "normal",
      arrowtail: "tail",
    };
  } else if (kantenTypFromTo === 2 && kantenTypToFrom === 1) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "normal",
      arrowtail: "odot",
    };
  }

  //alle Fälle mit 3 vorne
  else if (kantenTypFromTo === 3 && kantenTypToFrom === 2) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "tail",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 3 && kantenTypToFrom === 3) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "tail",
      arrowtail: "tail",
    };
  } else if (kantenTypFromTo === 3 && kantenTypToFrom === 1) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "tail",
      arrowtail: "odot",
    };
  }

  //kantenTypFromTo = 1,2,3 und kantenTypToFrom = 0
  else if (kantenTypFromTo === 2) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "normal",
      arrowtail: "none",
    };
  } else if (kantenTypFromTo === 3) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "tail",
      arrowtail: "none",
    };
  } else if (kantenTypFromTo === 1) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "odot",
      arrowtail: "none",
    };
  }

  //kantenTypToFrom = 1,2,3 und kantenTypFromTo = 0
  else if (kantenTypToFrom === 2) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "none",
      arrowtail: "normal",
    };
  } else if (kantenTypToFrom === 3) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "none",
      arrowtail: "tail",
    };
  } else if (kantenTypToFrom === 1) {
    return {
      source: {
        id: quellKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: zielKnoten,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: "none",
      arrowtail: "odot",
    };
  }
  return null;
}

//----------------START: JSON -> MATRIX (PAG)------------------------//

//der eventlistener geht doch einfache oder?
const pagConvertJsonToMatrixButton = document.getElementById(
  "pagConvertJsonToMatrix"
);
pagConvertJsonToMatrixButton.addEventListener("click", () => {
  const jsonInput = document.getElementById("pagJsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);
  const matrixCsv = pagConvertJsonToMatrix(jsonData);

  document.getElementById("pagMatrixDisplay").value = matrixCsv;
});

//alle mappings der richtung jsonData -> Matrix
function mapEdgeToType(arrowhead, arrowtail) {
  const edgeMap = {
    none: 0,
    odot: 1,
    normal: 2,
    tail: 3,
  };

  if (arrowhead === "odot" && arrowtail === "odot")
    return [edgeMap["odot"], edgeMap["odot"]];
  if (arrowhead === "odot" && arrowtail === "normal")
    return [edgeMap["odot"], edgeMap["normal"]];
  if (arrowhead === "odot" && arrowtail === "tail")
    return [edgeMap["odot"], edgeMap["tail"]];
  if (arrowhead === "odot" && arrowtail === "none")
    return [edgeMap["odot"], edgeMap["none"]];

  if (arrowhead === "normal" && arrowtail === "odot")
    return [edgeMap["normal"], edgeMap["odot"]];
  if (arrowhead === "normal" && arrowtail === "normal")
    return [edgeMap["normal"], edgeMap["normal"]];
  if (arrowhead === "normal" && arrowtail === "tail")
    return [edgeMap["normal"], edgeMap["tail"]];
  if (arrowhead === "normal" && arrowtail === "none")
    return [edgeMap["normal"], edgeMap["none"]];

  if (arrowhead === "tail" && arrowtail === "odot")
    return [edgeMap["tail"], edgeMap["odot"]];
  if (arrowhead === "tail" && arrowtail === "normal")
    return [edgeMap["tail"], edgeMap["normal"]];
  if (arrowhead === "tail" && arrowtail === "tail")
    return [edgeMap["tail"], edgeMap["tail"]];
  if (arrowhead === "tail" && arrowtail === "none")
    return [edgeMap["tail"], edgeMap["none"]];

  if (arrowhead === "none" && arrowtail === "odot")
    return [edgeMap["none"], edgeMap["odot"]];
  if (arrowhead === "none" && arrowtail === "normal")
    return [edgeMap["none"], edgeMap["normal"]];
  if (arrowhead === "none" && arrowtail === "tail")
    return [edgeMap["none"], edgeMap["tail"]];

  return [edgeMap["none"], edgeMap["none"]];
}

//JSON -> Matrix
function pagConvertJsonToMatrix(jsonData) {
  const knoten = jsonData.nodes.map((node) => node.id);
  const matrixSize = knoten.length;

  //init matirx
  const matrix = Array.from({ length: matrixSize + 1 }, () =>
    Array(matrixSize + 1).fill(0)
  );

  //erstmal leer initialisieren
  matrix[0][0] = '""'; //ecke hardcoded auf ""
  knoten.forEach((id, index) => {
    matrix[0][index + 1] = `"${id}"`;
    matrix[index + 1][0] = `"${id}"`;
  });

  //kanten
  jsonData.links.forEach((link) => {
    const sourceIndex = knoten.indexOf(link.source.id) + 1;
    const targetIndex = knoten.indexOf(link.target.id) + 1;

    //vorwärts kanten reinschreiben
    const [edgeTypeForward, edgeTypeReverse] = mapEdgeToType(
      link.arrowhead,
      link.arrowtail
    );
    matrix[sourceIndex][targetIndex] = edgeTypeForward;

    //rückwärts kanten reinschreiben
    matrix[targetIndex][sourceIndex] = edgeTypeReverse;
  });

  //ausgabe verschoenern
  return matrix.map((row) => row.join(", ")).join("\n");
}

//----------------START: DOT -> JSON (PAG)------------------------//

const pagConvertDotToJsonButton = document.getElementById(
  "pagConvertDotToJson"
);
pagConvertDotToJsonButton.addEventListener("click", () => {
  const dotInput = document.getElementById("pagDotDisplay").value;
  const jsonData = pagDotToJsonConversion(dotInput);

  document.getElementById("pagJsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
});

function pagDotToJsonConversion(dotSyntax) {
  const knoten = new Set();
  const links = [];

  const edgeRegex =
    /"([^"]+)"\s*->\s*"([^"]+)"\s*\[dir=both, arrowhead=([^,]+), arrowtail=([^,]+)\];/g;
  let match;

  while ((match = edgeRegex.exec(dotSyntax)) !== null) {
    const source = match[1];
    const target = match[2];
    const arrowhead = match[3].trim();
    const arrowtail = match[4].trim();

    knoten.add(source);
    knoten.add(target);

    links.push({
      source: {
        id: source,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      target: {
        id: target,
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      },
      arrowhead: arrowhead,
      arrowtail: arrowtail,
    });
  }

  const nodesArray = Array.from(knoten).map((node) => ({
    id: node,
    x: null, //initial null
    y: null, //initial null
    labelOffsetX: 0,
    labelOffsetY: 0,
  }));

  const jsonData = {
    nodes: nodesArray,
    links: links,
  };

  return jsonData;
}

//----------------START: JSON -> DOT (PAG)------------------------//

const pagConvertJsonToDotButton = document.getElementById(
  "pagConvertJsonToDot"
);
pagConvertJsonToDotButton.addEventListener("click", () => {
  const jsonInput = document.getElementById("pagJsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);
  const dotSyntax = jsonToDotConversion(jsonData);
  document.getElementById("pagDotDisplay").value = dotSyntax;
});

function jsonToDotConversion(jsonData) {
  let dotOutput = "digraph PAG {\n";

  jsonData.links.forEach((link) => {
    const source = link.source.id;
    const target = link.target.id;
    const arrowhead = link.arrowhead;
    const arrowtail = link.arrowtail;

    dotOutput += `"${source}" -> "${target}" [dir=both, arrowhead=${arrowhead}, arrowtail=${arrowtail}];\n`;
  });

  dotOutput += "}";

  return dotOutput;
}

/***********************************************************/
/**********END: Type-Conversion Functions for PAG***********/
/***********************************************************/

/***********************************************************/

/***********************************************************/
/***********START: jsonData Visulization for PAG************/
/***********************************************************/

//Wie funktioniert alles wenn ich mit einem leeren canvas
//anfangen will und die ersten knoten und kanten zeichne
//ich muss ja iwie die möglichkeit haben die svg canvas zu starten
//ohne etwas zum initialen darstellen zu haben.

//4.
//-> Label Namen ganz oben im contextmenu anzeigen und
//edititierbar machen, dann jsonDataDisplay aktualisieren

//i need to make the arrowmarkers better so i cant see the
//edges anymore

//knoten namen anpassen können in der visualisierung!

//Zusätzlich zum rightclick mit dem ich die position ändern kann
//will ich auch einen rightclick haben der den textinhalt
//wenn das geht ändern kann. und der muss dann in der jsonData
//einstellung halt auch überall angepasst werden. so das es nicht
//zum konflikt kommt, also wir z.B. einen node haben ohne link
//oder einen link ohne node. Beides führt zu einem Fehler.
//-> Am besten Kanten mit mind. einem unbekannten knoten
//ignorieren.

//die spielerein der professorin hinzuzufügen, also color
//changable nodes.

//Dann geht es zu kanten anklicken können und die arrowmarker
//ändern können

//knotengröße anpassen können, bedeutet label, arrowmarker
//alles dynamisch daran anpassen müssen

//Dann geht es um kanten anklicken und ziehen können so das sie bogen
//förmig werden.

//Dann geht es um kanten zeichnen können zwischen zwei knoten

//Dann geht es um kanten löschen können zwischne zwei knoten
//+ knoten falls keine kanten mehr vorhanden

//Dann geht es um neue knoten zeichnen können

//als user gridgröße einstellen können

//Dann geht es wieder um zoom und movable grid

//-->Dann den ganzen scheiss für den admg auch.

//Links referenzieren die nodes aus jsonData, daher steht
//bei den links auch nochmal die koordinaten.
//-> Das ist aber kein problem, da nur änderungen an x,y in der
//node section einen einfluss auf die positionen haben und
//x,y bei den links wird darauf automatisch angepasst

//GLOBALE VARIABELN:
let isGridClippingEnabled = false;

//necessary for the visual grid
let currentSvg = null;
let currentGridSpacing = null;

//----------START: BASIC VISUALIZATION + DRAG&DROP --------------//

//Eventlistener for basic visualization
document
  .getElementById("pagVisualizeJsonWithD3")
  .addEventListener("click", () => {
    resetCheckBoxStates();

    const jsonInput = document.getElementById("pagJsonDisplay").value;
    const jsonData = JSON.parse(jsonInput);

    visualizeJsonWithD3(jsonData);
  });

function resetCheckBoxStates() {
  //reset grid clipping
  isGridClippingEnabled = false;
  document.getElementById("gridClippingToggle").checked = false;
  const svg = d3.select("svg");
  svg.selectAll(".grid-line").remove();

  //more checkboxes to be cleared...
}

function visualizeJsonWithD3(jsonData) {
  const svg = createSvgCanvas();
  currentSvg = svg; //currently only for visual grid needed

  const gridSpacing = 100;
  currentGridSpacing = gridSpacing; //currently only for visual grid needed

  initializePagArrowMarkers(svg);

  initializeNodeCoordinates(jsonData, gridSpacing);

  //drawLink/Nodes/Labels aufrufen durch funktion "drawGraph"
  //den kann ich dann einf wiederverwenden wenn ich
  //z.B. neue edges hinzufüge, lösche, welche ändere oder knoten etc.
  drawLinks(svg, jsonData);

  drawNodes(svg, jsonData, gridSpacing);

  drawLables(svg, jsonData);

  updatePagJsonDisplay(jsonData);
}

function createSvgCanvas() {
  const containerId = "#graph-container";

  d3.select(containerId).selectAll("*").remove();

  const width = d3.select(containerId).node().offsetWidth;
  const height = d3.select(containerId).node().offsetHeight;

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  return svg;
}

function initializePagArrowMarkers(svg) {
  // prettier-ignore
  setupArrowMarker(svg, "normal-head", "path", "black", null, "auto");
  // prettier-ignore
  setupArrowMarker(svg, "normal-tail", "path", "black", null, "auto-start-reverse"); //fromally red
  // prettier-ignore
  setupArrowMarker(svg, "odot-head", "circle", "white", "black", "auto");
  // prettier-ignore
  setupArrowMarker(svg, "odot-tail", "circle", "white", "black", "auto-start-reverse"); //formally red
  // prettier-ignore
  setupArrowMarker(svg, "tail-head", "rect", "black", null, "auto");
  // prettier-ignore
  setupArrowMarker(svg, "tail-tail", "rect", "black", null, "auto-start-reverse"); //formally red
}

function setupArrowMarker(svg, id, shape, fillColor, strokeColor, orient) {
  const marker = svg
    .append("defs")
    .append("marker")
    .attr("id", id)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 21.5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", orient);

  if (shape === "path") {
    marker.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", fillColor);
  } else if (shape === "circle") {
    marker
      .append("circle")
      .attr("cx", 5)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", fillColor)
      .attr("stroke", strokeColor)
      .attr("stroke-width", 2);
  } else if (shape === "rect") {
    marker
      .append("rect") //unser arrowmarker für tail
      .attr("x", 0)
      .attr("y", -5)
      .attr("width", 0) //von 10 auf 0, dann ist unsichtbar
      .attr("height", 0) //von 10 auf 0, dann ist unsichtbar
      .attr("fill", fillColor);
  }
}

function initializeNodeCoordinates(jsonData, gridSpacing) {
  //grid pattern
  const numColumns = Math.ceil(Math.sqrt(jsonData.nodes.length));

  //update nodes
  jsonData.nodes.forEach((node, index) => {
    if (node.x === null || node.y === null) {
      node.x = (index % numColumns) * gridSpacing + gridSpacing / 2;
      node.y = Math.floor(index / numColumns) * gridSpacing + gridSpacing / 2;
    }
  });

  //update links, matchin nodes
  jsonData.links.forEach((link) => {
    link.source = jsonData.nodes.find(
      (node) => node.id === link.source.id || node.id === link.source
    );
    link.target = jsonData.nodes.find(
      (node) => node.id === link.target.id || node.id === link.target
    );
  });
}

//----------START: DRAW LINKS + HELPER FUNCTIONS --------------//

//wenn ich eine kante anklicke will ich vielleicht arrowhead
//und arrowtail farblich unterschiedlich anzeigen?!

//aktueller plan ist "setupLinkMenuActions(svg, jsonData);" zum
//laufen zu bekommen bzw zu implementieren. also das iwas passiert
//wenn ich auf die knöpfe im context menu drücke.

//-> So jetzt dem ganzen die funktoon zu setze den arrowhead auf
// z.B. normal zu setzen halt.
//json display anzeigen
//maybe neuzeichnen drawlabel, drawnode, drawlink aufrufen

// "closeLinkContextMenu(svg);" anpassen das wenn ich nen knopf drücke
//auch das contextmenu geschlossen wird.

//eigentlich sollte ich doch auch wie ich bei den labels einfach
//labelcoordinateX oder so geändert habe hier
//arrowhead oder so ändern können und dann wird der halt gezeichnet
//und am ende ruf ich die funktion auf die diese änderung am
//jsonObjekt in meine textarea schreibt?
//oder muss ich wirklich komplett nochmal alle
//drawNode/label/link() Funktionen aufrufen nach der änderung
//des arrowmarkers?

function drawLinks(svg, jsonData) {
  const links = initializeLinks(svg, jsonData);
  setupLinkContextMenu(svg, jsonData);
  setupLinkMenuActions(svg, jsonData);
  closeLinkContextMenu(svg);
}

function initializeLinks(svg, jsonData) {
  svg
    .selectAll(".link")
    .data(jsonData.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("marker-end", (d) => {
      if (d.arrowhead === "normal") return "url(#normal-head)";
      if (d.arrowhead === "odot") return "url(#odot-head)";
      if (d.arrowhead === "tail") return "url(#tail-head)";
      return null;
    })
    .attr("marker-start", (d) => {
      if (d.arrowtail === "normal") return "url(#normal-tail)";
      if (d.arrowtail === "odot") return "url(#odot-tail)";
      if (d.arrowtail === "tail") return "url(#tail-tail)";
      return null;
    })
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);
}

function setupLinkContextMenu(svg, jsonData) {
  svg.selectAll(".link").on("contextmenu", function (event, d) {
    event.preventDefault();

    const menu = document.getElementById("link-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.setAttribute("data-link-id", jsonData.links.indexOf(d)); //safe edge index
  });
}

function setupLinkMenuActions(svg, jsonData) {
  //arrowhead-normal
  document.getElementById("arrowhead-normal").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowhead = "normal";

      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-end", "url(#normal-head)");

      updatePagJsonDisplay(jsonData);
      console.log("arrowhead-normal wurde gedrückt und aktualisiert");
    }
  });

  //arrowhead-odot
  document.getElementById("arrowhead-odot").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowhead = "odot";

      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-end", "url(#odot-head)");

      updatePagJsonDisplay(jsonData);
      console.log("arrowhead-odot wurde gedrückt und aktualisiert");
    }
  });

  //arrowhead-tail
  document.getElementById("arrowhead-tail").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowhead = "tail";
      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-end", "url(#tail-head)");
      updatePagJsonDisplay(jsonData);
      console.log("arrowhead-tail wurde gedrückt und aktualisiert");
    }
  });

  //arrowtail-normal
  document.getElementById("arrowtail-normal").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowtail = "normal";
      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-start", "url(#normal-tail)");
      updatePagJsonDisplay(jsonData);
      console.log("arrowtail-normal wurde gedrückt und aktualisiert");
    }
  });

  //arrowtail-odot
  document.getElementById("arrowtail-odot").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowtail = "odot";
      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-start", "url(#odot-tail)");
      updatePagJsonDisplay(jsonData);
      console.log("arrowtail-odot wurde gedrückt und aktualisiert");
    }
  });

  document.getElementById("arrowtail-tail").addEventListener("click", () => {
    const menu = document.getElementById("link-context-menu");
    const linkIndex = menu.getAttribute("data-link-id");
    if (linkIndex !== null) {
      const link = jsonData.links[linkIndex];
      link.arrowtail = "tail";
      svg
        .selectAll(".link")
        .filter((_, i) => i == linkIndex)
        .attr("marker-start", "url(#tail-tail)");
      updatePagJsonDisplay(jsonData);
      console.log("arrowtail-tail wurde gedrückt und aktualisiert");
    }
  });
}

function closeLinkContextMenu(svg) {
  document.addEventListener("click", (event) => {
    const menu = document.getElementById("link-context-menu");
    if (!menu.contains(event.target)) {
      menu.style.display = "none";
    }
  });
}

//----------START: DRAW NODES + HELPER FUNCTIONS --------------//
function drawNodes(svg, jsonData, gridSpacing) {
  svg
    .selectAll(".node")
    .data(jsonData.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .call(
      d3
        .drag()
        .on("drag", (event, d) => {
          d.x = event.x;
          d.y = event.y;
          updatePositions();
          updatePagJsonDisplay(jsonData); //update during dragging?! Geil oder nicht?!
        })
        .on("end", (event, d) => {
          if (isGridClippingEnabled) {
            d.x =
              Math.round((d.x - gridSpacing / 2) / gridSpacing) * gridSpacing +
              gridSpacing / 2;
            d.y =
              Math.round((d.y - gridSpacing / 2) / gridSpacing) * gridSpacing +
              gridSpacing / 2;
          }
          updatePositions();
          updatePagJsonDisplay(jsonData);
        })
    );
}

function updatePositions() {
  //update node position
  d3.selectAll(".node")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  //update link position
  d3.selectAll(".link")
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  //update label position
  d3.selectAll(".node-label")
    .attr("x", (d) => d.x + d.labelOffsetX)
    .attr("y", (d) => d.y + d.labelOffsetY);
}

//----------START: DRAW LABELS + HELPER FUNCTIONS --------------//
function drawLables(svg, jsonData) {
  const labels = initializeLabels(svg, jsonData);
  //labels const noch useless, aber ganz nett, falls man später
  //den user etwas am label ändern lassen will.
  setupLabelsContextMenu(svg, jsonData);
  setupLabelsMenuActions(svg, jsonData);
  closeLabelsContextMenu(svg);
}

function initializeLabels(svg, jsonData) {
  return svg
    .selectAll(".node-label")
    .data(jsonData.nodes)
    .enter()
    .append("text")
    .attr("class", "node-label")
    .attr("x", (d) => d.x + d.labelOffsetX) //idk if needed
    .attr("y", (d) => d.y + d.labelOffsetY) //idk if needed
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text((d) => d.id)
    .attr("fill", "black")
    .style("font-size", "15px")
    .style("pointer-events", "all")
    .style("user-select", "none");
}

function setupLabelsContextMenu(svg, jsonData) {
  svg.selectAll(".node-label").on("contextmenu", function (event, d) {
    event.preventDefault();

    const menu = document.getElementById("label-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.setAttribute("data-label-id", d.id);
  });
}

function setupLabelsMenuActions(svg, jsonData) {
  const menuActions = {
    center: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      const node = jsonData.nodes.find((n) => n.id === nodeId);
      node.labelOffsetX = 0;
      node.labelOffsetY = 0;
    },
    above: (label, jsonData, nodeId) => {
      label.attr("y", (d) => d.y - 25);
      const node = jsonData.nodes.find((n) => n.id === nodeId);
      node.labelOffsetY = -25;
    },
    below: (label, jsonData, nodeId) => {
      label.attr("y", (d) => d.y + 25);
      const node = jsonData.nodes.find((n) => n.id === nodeId);
      node.labelOffsetY = 25;
    },
    left: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x - 25);
      const node = jsonData.nodes.find((n) => n.id === nodeId);
      node.labelOffsetX = -25;
    },
    right: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x + 25);
      const node = jsonData.nodes.find((n) => n.id === nodeId);
      node.labelOffsetX = 25;
    },
  };

  Object.entries(menuActions).forEach(([action, handler]) => {
    document.getElementById(`menu-${action}`).addEventListener("click", () => {
      const labelId = document
        .getElementById("label-context-menu")
        .getAttribute("data-label-id");

      const label = svg
        .selectAll(".node-label")
        .filter((d) => d.id === labelId);

      handler(label, jsonData, labelId);

      updatePagJsonDisplay(jsonData);
    });
  });
}

function closeLabelsContextMenu(svg) {
  svg.on("click", function () {
    const menu = document.getElementById("label-context-menu");
    menu.style.display = "none";
  });

  document.addEventListener("click", function (event) {
    const menu = document.getElementById("label-context-menu");
    const clickedOnMenu = menu.contains(event.target);
    const clickedOnLabel = svg.node().contains(event.target);

    if (!clickedOnMenu && !clickedOnLabel) {
      menu.style.display = "none";
    }
  });

  svg.on("contextmenu", function (event) {
    event.preventDefault();
  });
}

//----------START: UPDATE JSONDATA TEXTAREA--------------//

function updatePagJsonDisplay(jsonData) {
  const jsonDisplay = document.getElementById("pagJsonDisplay");
  jsonDisplay.value = JSON.stringify(jsonData, null, 2);
}

//----------START: TOGGLE GRID / (TOGGLE ZOOM)--------------//

//Eventlistener for grid clipping
document
  .getElementById("gridClippingToggle")
  .addEventListener("change", (event) => {
    isGridClippingEnabled = event.target.checked;

    if (currentSvg) {
      if (isGridClippingEnabled) {
        drawGrid(currentSvg, currentGridSpacing);
      } else {
        currentSvg.selectAll(".grid-line").remove();
      }
    }
  });

function drawGrid(svg, gridSpacing) {
  //clear grid, if present
  svg.selectAll(".grid-line").remove();

  if (isGridClippingEnabled) {
    const width = parseInt(svg.attr("width"), 10);
    const height = parseInt(svg.attr("height"), 10);

    const xOffset = gridSpacing / 2;
    const yOffset = gridSpacing / 2;

    //draw lines
    for (let x = xOffset; x < width; x += gridSpacing) {
      svg
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);
    }
    for (let y = yOffset; y < height; y += gridSpacing) {
      svg
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 0.5);
    }
  }
}

//----------START: EXPORT TO PNG / PDF--------------//

document.getElementById("downloadPngButton").addEventListener("click", () => {
  downloadSvgAsPng();
});

function downloadSvgAsPng() {
  //current svg
  const svgElement = document.querySelector("#graph-container svg");

  if (!svgElement) {
    alert("No SVG graph found!");
    return;
  }

  //svg to string conversion
  const svgString = new XMLSerializer().serializeToString(svgElement);

  //create canvas for svg drawing
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  //dimensions from svg
  const width = parseInt(svgElement.getAttribute("width"));
  const height = parseInt(svgElement.getAttribute("height"));
  canvas.width = width;
  canvas.height = height;

  //create an imagine
  const img = new Image();
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    //draw svg onto canvas
    //context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);

    //start png download
    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    //clea up
    URL.revokeObjectURL(url);
  };

  img.src = url;
}

//-----------------------//

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
