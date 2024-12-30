/***********************************************************/
/*********************GLOBAL VARIABLES**********************/
/***********************************************************/

//Try to get rid of global variables:

//want to replace this over a secure uuid.v4() link id
let globalLinkI = 0;

//GLOBALE VARIABELN:
let isGridClippingEnabled = false;

//necessary for the visual grid
let currentSvg = null;
let currentGridSpacing = null;

/***********************************************************/

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

//TODO: wie ich hier schon selber sage, diese 3 Functions zu einer
//refactorn.

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
  const knotenMap = new Map(); //alle knoten in menge
  const links = []; //alle edges

  //knoten auslesen und einmalig übernehmen
  const knotenNamen = parsedPagMatrix[0].slice(1);

  knotenNamen.forEach((name) => {
    console.log("Log: " + knotenNamen);
    knotenMap.set(name, uuid.v4());
  });

  for (let i = 1; i < parsedPagMatrix.length; i++) {
    const quellKnotenName = parsedPagMatrix[i][0];
    for (let j = i + 1; j < parsedPagMatrix[i].length; j++) {
      const kantenTypFromTo = parseInt(parsedPagMatrix[i][j]);
      const kantenTypToFrom = parseInt(parsedPagMatrix[j][i]);
      const zielKnotenName = knotenNamen[j - 1];

      //knotenSet.add(quellKnotenName);
      //knotenSet.add(zielKnotenName);

      const link = pagCreateJsonLinks(
        knotenMap.get(quellKnotenName),
        knotenMap.get(zielKnotenName),
        kantenTypFromTo,
        kantenTypToFrom
        //,knotenFarbe
      );
      if (link) {
        links.push(link);
      }
    }
  }

  //knoten in jsonFormat
  const nodes = Array.from(knotenMap.entries()).map(([name, nodeId]) => ({
    nodeId, // ID aus der Map
    name, // Name aus der Map
    nodeColor: "whitesmoke",
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

function pagCreateJsonLinks(quellId, zielId, kantenTypFromTo, kantenTypToFrom) {
  const edgeMap = {
    0: "none",
    1: "odot",
    2: "normal",
    3: "tail",
  };

  //Wenn beide Edges 0, dann existiert keine Edge
  if (kantenTypFromTo === 0 && kantenTypToFrom === 0) {
    return null;
  }

  //TODO: remove:
  //i really dont need to fill the values for source and target here
  //thats overkill and destroys seperations of concern.
  return {
    linkId: uuid.v4(),
    source: {
      nodeId: quellId,
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    target: {
      nodeId: zielId,
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    arrowhead: edgeMap[kantenTypFromTo] || "none", //none falls zahl unbekannt
    arrowtail: edgeMap[kantenTypToFrom] || "none", //none falls zahl unbekannt
    linkControlX: 0,
    linkControlY: 0,
    isCurved: false,
    isDashed: false,
  };
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
//TODO: Funktioniert, aber:
//   const idToName = Object.fromEntries(jsonData.nodes.map((node) => [node.id, node.name]));
//warum muss ich node.id auf node.name so mappen, ist das die normalste lösung? ich meine zu jedem node.id
//gehört ja auch immer ein node.name, gibt es nicht soetwas wie jsonData.nodes.name[id], oder so?

//Erstmal so lassen, als nächstes kommt Json->DOT und DOT->Json,
//dann müssen stück für stück alle funktionen angepasst weden, das sie jetzt die neue id nutzen
//und falls sie den namen brauchen jetzt über node.name und nicht mehr node.id gehen.
function pagConvertJsonToMatrix(jsonData) {
  //das geht safe besser
  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  const knoten = jsonData.nodes.map((node) => node.nodeId);
  const matrixSize = knoten.length;

  const matrix = Array.from({ length: matrixSize + 1 }, () =>
    Array(matrixSize + 1).fill(0)
  );

  matrix[0][0] = '""'; // Ecke hardcoded
  knoten.forEach((nodeId, index) => {
    matrix[0][index + 1] = `"${mapNodeIdToNodeName[nodeId]}"`;
    matrix[index + 1][0] = `"${mapNodeIdToNodeName[nodeId]}"`;
  });

  jsonData.links.forEach((link) => {
    const sourceIndex = knoten.indexOf(link.source.nodeId) + 1;
    const targetIndex = knoten.indexOf(link.target.nodeId) + 1;

    const [edgeTypeForward, edgeTypeReverse] = mapEdgeToType(
      link.arrowhead,
      link.arrowtail
    );
    matrix[sourceIndex][targetIndex] = edgeTypeForward;
    matrix[targetIndex][sourceIndex] = edgeTypeReverse;
  });

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

//TOOD: //entweder überall trim oder nirgendwo, regwex anpassen
//TODO: remove:
//i really dont need to fill the values for source and target here
//thats overkill and destroys seperations of concern.
//change it when everything else works, for now it works.
function pagDotToJsonConversion(dotSyntax) {
  const knoten = new Map();
  const links = [];

  const edgeRegex =
    /"([^"]+)"\s*->\s*"([^"]+)"\s*\[\s*dir\s*=\s*both\s*,\s*arrowhead\s*=\s*([^,\s]+)\s*,\s*arrowtail\s*=\s*([^,\s]+)(?:\s*,\s*style\s*=\s*([^,\]]+))?\s*\];/g;

  const nodeRegex = /"([^"]+)"\s*\[.*?fillcolor=([^,\]]+).*?\];/g;

  let match;

  //guckt sich alle knoten an für die farbe definiert wurde
  while ((match = nodeRegex.exec(dotSyntax)) !== null) {
    const nodeName = match[1];
    const nodeColor = match[2].trim();

    if (!knoten.has(nodeName)) {
      knoten.set(nodeName, {
        nodeId: uuid.v4(),
        name: nodeName,
        nodeColor: nodeColor || "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }
  }

  //guckt sich alles andere an
  while ((match = edgeRegex.exec(dotSyntax)) !== null) {
    const sourceName = match[1];
    const targetName = match[2];
    const arrowhead = match[3].trim();
    const arrowtail = match[4].trim();
    const style = match[5]?.trim();

    //prüfen ob sourceName oder targetName zsm fassen und im if case dafür dann nach name prüfen und setzen
    if (!knoten.has(sourceName)) {
      knoten.set(sourceName, {
        nodeId: uuid.v4(),
        name: sourceName,
        nodeColor: "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }

    if (!knoten.has(targetName)) {
      knoten.set(targetName, {
        nodeId: uuid.v4(),
        name: targetName,
        nodeColor: "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }

    links.push({
      linkId: uuid.v4(),
      source: knoten.get(sourceName),
      target: knoten.get(targetName),
      arrowhead: arrowhead,
      arrowtail: arrowtail,
      linkControlX: 0,
      linkControlY: 0,
      isCurved: false,
      isDashed: style === "dashed",
    });
  }

  const nodesArray = Array.from(knoten.values());

  const jsonData = {
    nodes: nodesArray,
    links: links,
  };

  return jsonData;
}

//----------------START: JSON -> DOT (PAG)------------------------//

//TODO: vllt kann ich die ja wiederverwenden und von iwas abhängig dann
//diagraph PAG oder halt diagraph ADMG schreiben am anfang der dot-syntax.

//TODO: kommentar durchlesen über node.nodeColor teil
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

  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  jsonData.links.forEach((link) => {
    const source = mapNodeIdToNodeName[link.source.nodeId];
    const target = mapNodeIdToNodeName[link.target.nodeId];
    const arrowhead = link.arrowhead;
    const arrowtail = link.arrowtail;
    const style = link.isDashed ? ", style=dashed" : "";

    dotOutput += `"${source}" -> "${target}" [dir=both, arrowhead=${arrowhead}, arrowtail=${arrowtail}${style}];\n`;
  });

  jsonData.nodes.forEach((node) => {
    //falls node alleinsetehend ist, wird er auch in dot-syntaxt übersetzt
    const nodeIsInLinks = jsonData.links.some(
      (link) =>
        link.source.nodeId === node.nodeId || link.target.nodeId === node.nodeId
    );

    if (node.nodeColor !== "whitesmoke" || !nodeIsInLinks) {
      dotOutput += `"${
        mapNodeIdToNodeName[node.nodeId]
      }" [style=filled, fillcolor=${node.nodeColor}];\n`;
    }
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

//funktion die geil wäre, alles auf dem canvas auswählen können
//also nodes, labels, links so wie sie sind und zsm per
//drag and drop bewegen, erst frei, dann mit grid

//Wie funktioniert alles wenn ich mit einem leeren canvas
//anfangen will und die ersten knoten und kanten zeichne
//ich muss ja iwie die möglichkeit haben die svg canvas zu starten
//ohne etwas zum initialen darstellen zu haben.

//4.
//-> Label Namen ganz oben im contextmenu anzeigen und
//edititierbar machen, dann jsonDataDisplay aktualisieren

//knoten namen anpassen können in der visualisierung!

//Zusätzlich zum rightclick mit dem ich die position ändern kann
//will ich auch einen rightclick haben der den textinhalt
//wenn das geht ändern kann. und der muss dann in der jsonData
//einstellung halt auch überall angepasst werden. so das es nicht
//zum konflikt kommt, also wir z.B. einen node haben ohne link
//oder einen link ohne node. Beides führt zu einem Fehler.
//-> Am besten Kanten mit mind. einem unbekannten knoten
//ignorieren.

//lowkey kann ich die "JSON->Matrix" und "JSON->DOT" funktion
//auch einfach mit in die download funktion des jeweiligen
//typs packen, also wenn ich dann "Download Matrix Button"
//drücke, dann führt er erst aus was jetzt unterm "JSON->Matrix"
//button ist und danach downloaded der mir das einf zu ner .csv
//fertig

//knotengröße anpassen können, bedeutet label, arrowmarker
//alles dynamisch daran anpassen müssen

//Dann geht es um kanten zeichnen können zwischen zwei knoten

//Dann geht es um kanten löschen können zwischne zwei knoten
//+ knoten falls keine kanten mehr vorhanden

//Dann geht es um neue knoten zeichnen können

//als user gridgröße einstellen können

//-->Dann den ganzen scheiss für den admg auch.

//Links referenzieren die nodes aus jsonData, daher steht
//bei den links auch nochmal die koordinaten.
//-> Das ist aber kein problem, da nur änderungen an x,y in der
//node section einen einfluss auf die positionen haben und
//x,y bei den links wird darauf automatisch angepasst

//add the ability in the link-contextmenu to change the colors and arrowmarkers color
//-> seperate.

//add the ability in the node-contextmenu to change the color of the node.

//----------START: BASIC VISUALIZATION + DRAG&DROP --------------//

//Eventlistener for basic visualization
//TODO: JsonData display bei laden der seite mit einem leeren node[],link[] initalisieren, damit ich auch von
//null auf anfangen kann knoten und kanten zu zeichnen, oder maybe falls feld empty dann erstell ich mir node[].link[]
//leer und ruf meine visualize mit d3 auf damit ich halt nen canvas hab.
document
  .getElementById("pagVisualizeJsonWithD3")
  .addEventListener("click", () => {
    resetCheckBoxes();

    const jsonInput = document.getElementById("pagJsonDisplay").value;
    const jsonData = JSON.parse(jsonInput);

    visualizeJsonWithD3(jsonData);
  });

function resetCheckBoxes() {
  //reset grid clipping
  isGridClippingEnabled = false;
  document.getElementById("gridClippingToggle").checked = false;
  const svg = d3.select("svg");
  svg.selectAll(".grid-line").remove();

  //more checkboxes to be cleared...
}

//todo: when drawing something with two edges and the linkOffsets are not set i gotta set them for atleast
//one of them a bit off, for every other edge between the node the same offset upon there.
//todo: wenn graph auch aus matrix oder dot kommt und komplett neu gezeichnet wird, muss offset bei edge between
//two nodes +1 erstellt werden

//TODO: wenn nix mehr geht, kann ich doch einf nen counter hier hin machen, der von 0 auf 1 geht, wenn ich
//einmal diese funktion aufgerufen hab, dadrin rufe ich dann einmal alle contextmenu funktionen auf und dann
//danach halt nie wieder, oder ist das problematisch?

//TODO 1: Überall im code wo es geht css.escape nutzen edge-client um keine probleme
//mit sonderzeichen in namen zu haben.
//TODO 2: Jetzt mit deleteNode im node contextmenu anfangen und dann create und delete node refactorn.
//TODO 3: Kanten dragging so überarbeiten das die kante wirklich da gerade ist wo mein kruser ist
//auch wenn das bedeutet nen hardcoded coordinated +200 rein zu packen.
//TODO 4: Bei langen namen die direkt über oder unter dem kreis anzeigen
function visualizeJsonWithD3(jsonData) {
  const svg = createSvgCanvas();
  currentSvg = svg; //currently only for visual grid needed
  const gridSpacing = 50;
  currentGridSpacing = gridSpacing; //currently only for visual grid needed

  initializePagArrowMarkers(svg);

  initializeNodeCoordinates(jsonData, gridSpacing * 2); //initiales clipping nutz doppelt so breites gridSpacing

  drawEverything(svg, jsonData);

  handleAllContextMenus(svg, jsonData);

  handleAllInteractiveDrags(svg, jsonData, gridSpacing);

  handleCreateNewLink(svg, jsonData);

  handleCreateNewNode(svg, jsonData);

  updatePagJsonDisplay(jsonData);
}

//TODO: Knoten mit Label hinzufügen / Knoten mit Label löschen können + zugehörige Kanten löschen
//TODO Matrix->JSON, JSON->Matrix for Admg

//----------START: NOCH KEINEN NAMEN HIERFUEHR --------------//

function createSvgCanvas() {
  const containerId = "#graph-container";

  d3.select(containerId).selectAll("*").remove();

  const width = d3.select(containerId).node().offsetWidth;
  const height = d3.select(containerId).node().offsetHeight;

  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("contextmenu", (event) => {
      event.preventDefault(); //stelle standart contextmenu vom browser aus
    });

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

/* 
setupArrowMarker():
there doesnt seem to exist a normal arrowshape in d3,
creating ur own using paths is the best options ig
---
wenn width und height bei rect auf 0, dann ist unsichtbar
kann aber trotzdem vom user ausgewählt werden, als eigene arrowmarker art.
*/
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
    // prettier-ignore
    marker
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", fillColor);
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
      .attr("width", 0)
      .attr("height", 0)
      .attr("fill", fillColor);
  }
}

function initializeNodeCoordinates(jsonData, gridSpacing) {
  const amoutOfColumns = Math.ceil(Math.sqrt(jsonData.nodes.length));

  if (jsonData.nodes.length > 35) {
    gridSpacing = gridSpacing / 2;
  }

  jsonData.nodes.forEach((node, index) => {
    if (node.x === null || node.y === null) {
      node.x = (index % amoutOfColumns) * gridSpacing + gridSpacing;
      node.y = Math.floor(index / amoutOfColumns) * gridSpacing + gridSpacing;
    }
  });

  jsonData.links.forEach((link) => {
    link.source = jsonData.nodes.find(
      (node) => node.nodeId === link.source.nodeId
    );
    link.target = jsonData.nodes.find(
      (node) => node.nodeId === link.target.nodeId
    );
  });
}

//----------END: NOCH KEINEN NAMEN HIERFUEHR --------------//

//-------------------------------------------------------------------//

//----------START: SETUP SUPERIOR DRAWING FUNCTIONS, CONTEXTMENUS, LEFT-CLICKS --------------//

//calls the functions that draw the three objects
function drawEverything(svg, jsonData) {
  drawLinks(svg, jsonData);
  drawNodes(svg, jsonData);
  drawLabels(svg, jsonData);
}

//Ich glaube "svg.selectAll(".link").on("contextmenu", null);" ist deadcode und kann weg
//wenn das link dingen iwo gecleared wird dann in der addNewLink Function
//die handleAllContextMenus wird doch eh nie wieder aufgerufen

//calls the functions that implement the contextmenu for the three objects
function handleAllContextMenus(svg, jsonData) {
  svg.selectAll(".link").on("contextmenu", null);
  svg.selectAll(".node").on("contextmenu", null);
  svg.selectAll(".node-label").on("contextmenu", null);
  linkContextMenu(svg, jsonData);
  nodeContextMenu(svg, jsonData);
  labelContextMenu(svg, jsonData);
}

//calls the functions that implement the leftclick for the three objects
function handleAllInteractiveDrags(svg, jsonData, gridSpacing) {
  svg.selectAll(".link").on(".drag", null);
  svg.selectAll(".node").on(".drag", null);
  linkInteractiveDrag(svg, jsonData, gridSpacing);
  nodeInteractiveDrag(svg, jsonData, gridSpacing);
  //labelInteractiveClick(svg, jsonData, gridSpacing); //maybe implement later
}

//----------END: SETUP DRAWING FUNCTION, CONTEXTMENUS, LEFT-CLICKS --------------//

//-------------------------------------------------------------------//

//----------START: drawEverything() === DRAW LINKS + DRAW NODES + DRAW LABELS --------------//

//TODO: Aktuell werden kanten die zwischen den selben knoten sind bei Matrix->Json oder
//DOT->Json auf dem selben strich initialisiert, überlegnung wäre da ein kleines offset
//einzuführen damit man dies immer sieht, genauer überlegen wenn admg implementierung.

//TODO: When i have to edges between two nodes and i ACTIVATE the grid and THEN press
//visualize the two lines get layer above each other

function drawLinks(svg, jsonData) {
  svg
    .selectAll(".link")
    .data(jsonData.links, (d) => d.linkId)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("id", (d) => `link-${d.linkId}`)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", (d) => (d.isDashed ? "4 2" : null))
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
    .attr("d", (d) => calculateLinkPath(d));
}

function drawNodes(svg, jsonData) {
  svg
    .selectAll(".node")
    .data(jsonData.nodes)
    .enter()
    .append("circle")
    .attr("id", (d) => `node-${d.nodeId}`)
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", (d) => d.nodeColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);
}

//------------------------
//TODO: Plan ist ganz einfach, als (1.) möchte ich jetzt überall label-d.id nutzen.
// (2.) Create newLink komplett neu schreiben und den fehler der beim label entsteht möglichst früh finden
// (3.) Nodes löschen können.
//------------------------

function drawLabels(svg, jsonData) {
  svg
    .selectAll(".node-label")
    .data(jsonData.nodes)
    .enter()
    .append("text")
    .attr("id", (d) => `label-${d.nodeId}`) //ist erreichbar über label + die nodeId
    .attr("class", "node-label")
    .attr("x", (d) => d.x + d.labelOffsetX) //idk if needed
    .attr("y", (d) => d.y + d.labelOffsetY) //idk if needed
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text((d) => d.name) //nutzt d.name als anzeige name
    .attr("fill", "black")
    .style("font-size", "15px")
    .style("pointer-events", "all")
    .style("user-select", "none");
}

//----------END: DRAW LINKS + DRAW NODES + DRAW LABELS --------------//

//-------------------------------------------------------------------//

//----------START: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//TODO: anderes wort für setup finden
function linkContextMenu(svg, jsonData) {
  setupContextMenu(
    svg,
    ".link",
    "link-context-menu",
    "data-link-id",
    (d) => d.linkId // Verwende direkt uniquely generated die linkId
  );
  setupLinksContextMenuFunctions(svg, jsonData);
  closeContextMenu("link-context-menu");
}

//TODO: "am besten auch hier für die zukunft eine eigene nodeId mit uuid.v4 erstellen, da wir sonst"
//einen knoten mit dem namen "Knoten A" löschen könnten, für den bestimmte sachen gelten
//dann erstellen wir einen neuen knoten namens "Knoten A" und wenn die id=name ist
//kann dies zu problemen führen, da der neue knoten natürlich nix mit dem alten zu tun hat,
//ausser das beide den selben namen haben.
function nodeContextMenu(svg, jsonData) {
  setupContextMenu(
    svg,
    ".node",
    "node-context-menu",
    "data-node-id",
    (d) => d.nodeId //uses its unique name as an id <- *
  );
  setupNodesContextMenuFunctions(svg, jsonData);
  closeContextMenu("node-context-menu");
}

//TODO: anderes wort für setup finden
//TODO: hier gibts noch keine label id? einführen sinnvoll or nah?
function labelContextMenu(svg, jsonData) {
  setupContextMenu(
    svg,
    ".node-label",
    "label-context-menu",
    "data-label-id",
    (d) => d.nodeId //uses the nodesId, which is its unique name, to be referenced
  );
  setupLabelsContextMenuFunctions(svg, jsonData);
  closeContextMenu("label-context-menu");
}

//----------END: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//-------------------------------------------------------------------//

//----------START: CONTEXTMENU GENERAL FUNCTIONS--------------//

//TODO: brauch ich menu.style.left und menu.sytle.top wirklich?
// prettier-ignore
function setupContextMenu(svg, objectType, contextMenuType, attributeID, calculation) {
  //geileren namen finden für "calculation"
  svg.selectAll(objectType).on("contextmenu", function (event, d) {
    event.preventDefault();

    const menu = document.getElementById(contextMenuType);
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`; 
    menu.style.top = `${event.pageY}px`;

    menu.setAttribute(attributeID, calculation(d));
  });
}

function closeContextMenu(contextMenuType) {
  document.addEventListener("click", (event) => {
    const menu = document.getElementById(contextMenuType);
    if (!menu.contains(event.target)) {
      menu.style.display = "none";
    }
  });
}

//----------END: CONTEXTMENU GENERAL FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//TODO: Diese menuActions kacke iwie anpassen, auch wenn hier eig geil, lieber bei labels anpassen maybe
//wird halt so oft durchgeführt wie "visualisieren" gedrückt wird, aber kann egal sein for now
function setupLinksContextMenuFunctions(svg, jsonData) {
  console.log("Link Contextmenu called");
  const menuActions = [
    // prettier-ignore
    { id: "arrowhead-normal", attr: "arrowhead", value: "normal", marker: "url(#normal-head)", position: "marker-end" },
    // prettier-ignore
    { id: "arrowhead-odot", attr: "arrowhead", value: "odot", marker: "url(#odot-head)", position: "marker-end" },
    // prettier-ignore
    { id: "arrowhead-tail", attr: "arrowhead", value: "tail", marker: "url(#tail-head)", position: "marker-end" },
    // prettier-ignore
    { id: "arrowtail-normal", attr: "arrowtail", value: "normal", marker: "url(#normal-tail)", position: "marker-start" },
    // prettier-ignore
    { id: "arrowtail-odot", attr: "arrowtail", value: "odot", marker: "url(#odot-tail)", position: "marker-start" },
    // prettier-ignore
    { id: "arrowtail-tail", attr: "arrowtail", value: "tail", marker: "url(#tail-tail)", position: "marker-start" },
  ];

  menuActions.forEach((action) => {
    //id hier hat nichts mit nodeId, linkId oder labelId zu tun, id ist intern für menuActions
    document.getElementById(action.id).addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find(
        (link) => link.linkId === linkId
      );

      if (selectedLink) {
        selectedLink[action.attr] = action.value;
        d3.select(`#link-${selectedLink.linkId}`).attr(
          action.position,
          action.marker
        );
        updatePagJsonDisplay(jsonData);
      }
    });
  });

  //buttons, ausserhalb von arrowmarker änderung
  //TODO: Kann man anstatt mit selected Link wie bei delete-link nicht direkt mit linkId arbeiten?
  document.getElementById("straighten-link").addEventListener("click", () => {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
    if (selectedLink) {
      resetLinkCurve(selectedLink);
      updatePagJsonDisplay(jsonData);
    }
  });

  document
    .getElementById("toggle-dashed-on-link")
    .addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find(
        (link) => link.linkId === linkId
      );
      if (selectedLink && !selectedLink.isDashed) {
        setDashed(selectedLink);
        updatePagJsonDisplay(jsonData);
      }
    });

  document
    .getElementById("toggle-dashed-off-link")
    .addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find(
        (link) => link.linkId === linkId
      );
      if (selectedLink && selectedLink.isDashed) {
        unsetDashed(selectedLink);
        updatePagJsonDisplay(jsonData);
      }
    });

  //wird halt so oft ausgeführt wie oft "visualize" button gedrückt wurde... was macht man dagegen
  document.getElementById("delete-link").addEventListener("click", () => {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    if (linkId) {
      deleteLink(linkId, jsonData);
      if (linkMenu) {
        linkMenu.style.display = "none";
      }
    }
  });
}

function resetLinkCurve(selectedLink) {
  const sourceNode = selectedLink.source;
  const targetNode = selectedLink.target;

  selectedLink.linkControlX = (sourceNode.x + targetNode.x) / 2;
  selectedLink.linkControlY = (sourceNode.y + targetNode.y) / 2;
  selectedLink.isCurved = false;

  d3.select(`#link-${selectedLink.linkId}`).attr(
    "d",
    calculateLinkPath(selectedLink)
  );
}

function setDashed(selectedLink) {
  selectedLink.isDashed = true;

  d3.select(`#link-${selectedLink.linkId}`).attr("stroke-dasharray", "4 2");
}

function unsetDashed(selectedLink) {
  selectedLink.isDashed = false;

  d3.select(`#link-${selectedLink.linkId}`).attr("stroke-dasharray", null);
}

function deleteLink(linkId, jsonData) {
  jsonData.links = jsonData.links.filter((link) => link.linkId !== linkId); //löscht link aus jsonData

  d3.select(`#link-${linkId}`).remove(); //löscht link von svg canvas

  updatePagJsonDisplay(jsonData); //passt displayed jsondata auf actual jsondata an
}

//----------END: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: nodeContextMenu === CONTEXTMENU NODES UNIQUE FUNCTIONS--------------//

//TODO: Adapt labelcolor, add labelcolor maybe, and change to black or white, according to the brightness of the color
//automatically
function setupNodesContextMenuFunctions(svg, jsonData) {
  console.log("Node Contextmenu called");
  const colorPalette = document.getElementById("color-palette");

  colorPalette.innerHTML = "";
  //all css-colors with names from W3Schools
  // prettier-ignore
  const namedColors = [
  "white", "whitesmoke", "azure", "aliceblue", "ghostwhite", "floralwhite", "ivory", "beige", "antiquewhite", "mintcream", "snow", "oldlace", 
  "lavenderblush", "seashell", "cornsilk", "blanchedalmond", "papayawhip", "lemonchiffon", "linen", "honeydew", "gainsboro", "navajowhite",
  //yeelows
  "lightyellow", "yellow", "khaki", "gold", "palegoldenrod", "goldenrod", "darkgoldenrod", "darkkhaki",
  //oranges
  "moccasin", "peachpuff", "bisque", "orange", "darkorange", "tan", "sandybrown", "burlywood", "peru", "chocolate", "saddlebrown", "maroon",
  //reds
  "lightpink", "pink", "hotpink", "mistyrose", "salmon", "lightsalmon", "lightcoral", "coral", "tomato", "orangered", "indianred", "darksalmon", "crimson", 
  "firebrick", "red", "darkred",
  //brown
  "rosybrown", "brown", "sienna",
  //lilas
  "thistle", "lavender", "plum", "orchid", "rebeccapurple", "violet", "mediumorchid", "mediumpurple", "blueviolet", "darkorchid", "darkviolet", "purple", "magenta", 
  "fuchsia", "mediumvioletred", "palevioletred", "indigo",
  //blue
  "lightcyan", "lightblue", "lightsteelblue", "powderblue", "skyblue", "lightskyblue", "deepskyblue", "dodgerblue", "cornflowerblue", "steelblue", 
  "royalblue", "mediumblue", "mediumslateblue", "blue", "darkblue", "navy", "midnightblue", "slateblue", "darkslateblue",
  //greens
  "lightgreen", "lightseagreen", "palegreen", "springgreen", "mediumspringgreen", "greenyellow", "lime", "limegreen", "yellowgreen", "lawngreen", 
  "chartreuse", "mediumseagreen", "seagreen", "darkseagreen", "darkolivegreen", "forestgreen", "green", "darkgreen", "olivedrab", "olive",
  //aqua
  "lightgoldenrodyellow", "cyan", "aqua", "aquamarine", "mediumaquamarine", "teal", "turquoise", "paleturquoise", "mediumturquoise", 
  "darkturquoise", "darkcyan", "cadetblue",
  //graus + schwarz
  "lightgray", "lightslategray", "silver", "darkgray", "dimgray", "slategray", "darkslategray", "black"
];

  namedColors.forEach((color) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-swatch";
    colorSwatch.style.backgroundColor = color;

    colorSwatch.addEventListener("click", () => {
      const nodeMenu = document.getElementById("node-context-menu");
      const nodeId = nodeMenu.getAttribute("data-node-id");

      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      if (node) {
        node.nodeColor = color;
        //TODO: Hier auch css.escape, sonst können knoten mit sonderzeichen im namen nicht
        //korrekt im svg canvas gefärbt werden und es geht nur in der jsonData
        const selectedNode = d3.select(`#node-${nodeId}`);
        selectedNode.attr("fill", color).style("fill", color);

        updatePagJsonDisplay(jsonData);
      }
    });

    colorPalette.appendChild(colorSwatch);
  });

  document.getElementById("delete-node").addEventListener("click", () => {
    const nodeMenu = document.getElementById("node-context-menu");
    const nodeId = nodeMenu.getAttribute("data-node-id");
    if (nodeId) {
      deleteNode(nodeId, jsonData);
      if (nodeMenu) {
        nodeMenu.style.display = "none";
      }
    }
  });
}

//TODO: GEHT NOCHT NICHT!
function deleteNode(nodeId, jsonData) {
  // Entferne den Knoten aus dem jsonData.nodes-Array
  jsonData.nodes = jsonData.nodes.filter((node) => node.nodeId !== nodeId);
  jsonData.links = jsonData.links.filter(
    (link) => link.source !== nodeId && link.target !== nodeId
  );

  d3.select(`#node-${nodeId}`).remove();
  //TODO: Das löschen von den passenden links funktioniert noch nicht, dafür einf die delete link Funktion
  //aufrufen oder?
  d3.selectAll(`[data-source='${nodeId}'], [data-target='${nodeId}']`).remove();

  updatePagJsonDisplay(jsonData);
}

//----------END: NodeContextMenu === CONTEXTMENU NODES UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: labelContextMenu === CONTEXTMENU LABEL UNIQUE FUNCTIONS--------------//

function setupLabelsContextMenuFunctions(svg, jsonData) {
  console.log("Label Contextmenu called");
  const menuActions = {
    center: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x).attr("y", (d) => d.y);
      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      node.labelOffsetX = 0;
      node.labelOffsetY = 0;
    },
    above: (label, jsonData, nodeId) => {
      label.attr("y", (d) => d.y - 25);
      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      node.labelOffsetY = -25;
    },
    below: (label, jsonData, nodeId) => {
      label.attr("y", (d) => d.y + 25);
      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      node.labelOffsetY = 25;
    },
    left: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x - 25);
      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      node.labelOffsetX = -25;
    },
    right: (label, jsonData, nodeId) => {
      label.attr("x", (d) => d.x + 25);
      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
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
        .filter((d) => d.nodeId === labelId);

      handler(label, jsonData, labelId);

      updatePagJsonDisplay(jsonData);
    });
  });
}

//----------END: labelContextMenu === CONTEXTMENU LABEL UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: allInteractiveClicks === LEFTCLICK LINK UNIQUE FUNCTIONS--------------//

//TODO: Hier ist bestimmt so gottlos viel überflüssig
//oder kann umstrukturiert werden.
function linkInteractiveDrag(svg, jsonData, gridSpacing) {
  console.log("linkInteractiveDrag called");
  console.log("I was created!");
  svg.selectAll(".link").call(
    d3
      .drag()
      .on("drag", function (event, d) {
        d.isCurved = true;
        d.linkControlX = event.x;
        d.linkControlY = event.y;
        console.log("drag!");
        const link = jsonData.links.find((link) => link.linkId === d.linkId);
        if (link) {
          link.linkControlX = d.linkControlX;
          link.linkControlY = d.linkControlY;
        }

        d3.select(this).attr("d", calculateLinkPath(d));
        updatePagJsonDisplay(jsonData);
      })
      .on("end", function (event, d) {
        if (isGridClippingEnabled) {
          const refinedSpacing = gridSpacing / 2;
          d.linkControlX =
            Math.round(d.linkControlX / refinedSpacing) * refinedSpacing;
          d.linkControlY =
            Math.round(d.linkControlY / refinedSpacing) * refinedSpacing;
        }

        const link = jsonData.links.find((link) => link.linkId === d.linkId);
        if (link) {
          link.linkControlX = d.linkControlX;
          link.linkControlY = d.linkControlY;
        }

        d3.select(this).attr("d", calculateLinkPath(d));
        updatePagJsonDisplay(jsonData);
      })
  );
}

function calculateLinkPath(d) {
  const { x: x1, y: y1 } = d.source;
  const { x: x2, y: y2 } = d.target;

  if (d.linkControlX === 0 && d.linkControlY === 0) {
    d.linkControlX = (x1 + x2) / 2;
    d.linkControlY = (y1 + y2) / 2;
  }

  return `M ${x1},${y1} Q ${d.linkControlX},${d.linkControlY} ${x2},${y2}`;
}

//----------END: allInteractiveClicks === LEFTCLICK LINK UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: allInteractiveClicks === LEFTCLICK NODE UNIQUE FUNCTIONS--------------//

function nodeInteractiveDrag(svg, jsonData, gridSpacing) {
  console.log("nodeInteractiveDrag called");
  svg.selectAll(".node").call(
    d3
      .drag()
      .on("drag", (event, d) => {
        d.x = event.x;
        d.y = event.y;
        updatePositions();
        updatePagJsonDisplay(jsonData);
      })
      .on("end", (event, d) => {
        if (isGridClippingEnabled) {
          d.x = Math.round(d.x / gridSpacing) * gridSpacing;
          d.y = Math.round(d.y / gridSpacing) * gridSpacing;
        }
        updatePositions();
        updatePagJsonDisplay(jsonData);
      })
  );
}

//updaed ALLE positionen, sehr unperformant
function updatePositions() {
  //update node position
  d3.selectAll(".node")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  //update link position
  d3.selectAll(".link").attr("d", (d) => {
    const { x: x1, y: y1 } = d.source;
    const { x: x2, y: y2 } = d.target;

    if (!d.isCurved) {
      d.linkControlX = (x1 + x2) / 2;
      d.linkControlY = (y1 + y2) / 2;
    }

    return `M ${x1},${y1} Q ${d.linkControlX},${d.linkControlY} ${x2},${y2}`;
  });

  //update label position
  d3.selectAll(".node-label")
    .attr("x", (d) => d.x + d.labelOffsetX)
    .attr("y", (d) => d.y + d.labelOffsetY);
}

//----------START: allInteractiveClicks === LEFTCLICK NODE UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: handleAllEditOperations === ALL ADD NEW LINK UNIQUE FUNCTION--------------//

//TODO: Gucken ob das probleme bereitet, notfalls auskommentieren, andere sachen implementieren

//anstatt let einf const firstNode
function handleCreateNewLink(svg, jsonData) {
  console.log("handleCreateNewLink called");
  let firstNode = null;

  svg.selectAll(".node").on("click", null);

  svg.selectAll(".node").on("click", function (event, d) {
    if (!firstNode) {
      firstNode = d;
      //d3.select(this).style("fill", "gray");
      console.log(`First node selected: `, firstNode);
    } else if (d.nodeId !== firstNode.nodeId) {
      const secondNode = d;
      //HOW DO I COLOR IT NORMAL AGAIN
      console.log(`Second node selected: `, secondNode);

      const newLink = {
        linkId: uuid.v4(),
        source: firstNode,
        target: secondNode,
        arrowhead: "normal",
        arrowtail: "tail",
        linkControlX: (firstNode.x + secondNode.x) / 2,
        linkControlY: (firstNode.y + secondNode.y) / 2,
        isCurved: false,
        isDashed: false,
      };
      console.log("Creating new link:", newLink);
      jsonData.links.push(newLink);

      drawOnlyNewLink(svg, jsonData, newLink.linkId);
      updatePagJsonDisplay(jsonData);
      firstNode = null;
      //secondNode = null;
    } else {
      console.log("Click detected on the same node. Resetting firstNode.");
      firstNode = null;
    }
  });

  //Das abbrechen durch click auf den canvas ist ein problem, stattdessen klick auf den selbe knoten
  //zum abbrechen nutzen.
  /*
  svg.on("click", function (event) {
    if (d3.select(event.target).classed("node") === false) {
      if (firstNode) {
        console.log("Click detected on canvas. Resetting firstNode.");
        firstNode = null;
        //svg.selectAll(".node").style("fill", "black");
      }
    }
  });
  */
}

//TODO 1: Hinzufügen das ich meine knoten auswahl auch abbrechen kann, das ganze visuell darstellen.
//-> Fehlt noch, also node färben wenn ausgewählt

//TODO 2: Jetzt die Knoten nochmal neu zeichnen, so das sie durch eine formel passen gekürzt werden,
//damit das mit den arrowmarkern nicht immer so krampfhaft aussieht, frage ist nur, geht mir mein
//clipping und so dann kaputt oder sieht das weiterhin schön aus weil ich die verkürzte kantenform
//irgendwie basierend auf den mittelpunkten der referenzierten knoten zeichnen kann?
//-> Fehlt noch, stattdessen aber kanten einf initial kürzer machen, dann spar ich mir neuzeichenn

//TODO 2.1: die borders meine svg canvases nicht durchdringbar machen, bei createSvgCanvas proably und
//gucken ob sich dann neu erstellte knoten auch daran halten
//-> Fehlt auch noch

//TODO 4: Labels über knotextmenu namen verändern können?

//TODO 4.1:Größe von knoten anpassen können, dies unterbringen im jsonData & contextmenu

//TODO 6: Knoten löschen können, wenn daran links hängen diese mit löschen, daher delete link, nicht nur
//im kontextmenü unterbringen sondern den wichtigsten teil in aufrufbare funktion versetzen.
//-> bei deletenode muss ich laufende processe wie "einen node ausgewählt" und dann lösche ich diesen knoten
//und dann drücke ich auf den zweiten und will eine kante zeichnen, dann würde mir das um die ohren fliegen
//das iwie absichern.

//The helper function needs to get helper functions, gotta refactor that shit
//idk if calling the "linkInteractiveDrag" function is unstable beeing called every time a edge is created
function drawOnlyNewLink(svg, jsonData, linkId) {
  console.log("drawOnlyNewLink called");
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

  if (!selectedLink) {
    console.error(`No link found with ID: ${linkId}`);
    return;
  }

  const linkSelection = svg
    .selectAll(`#link-${linkId}`)
    .data([selectedLink], (d) => d.linkId)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("id", `link-${selectedLink.linkId}`)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .each(function (d) {
      if (d.isDashed) {
        d3.select(this).attr("stroke-dasharray", "4 2");
      }
    })
    .attr("marker-end", () => {
      if (selectedLink.arrowhead === "normal") return "url(#normal-head)";
      if (selectedLink.arrowhead === "odot") return "url(#odot-head)";
      if (selectedLink.arrowhead === "tail") return "url(#tail-head)";
      return null;
    })
    .attr("marker-start", () => {
      if (selectedLink.arrowtail === "normal") return "url(#normal-tail)";
      if (selectedLink.arrowtail === "odot") return "url(#odot-tail)";
      if (selectedLink.arrowtail === "tail") return "url(#tail-tail)";
      return null;
    })
    .attr("d", calculateLinkPath(selectedLink));

  linkSelection.on("contextmenu", function (event, d) {
    event.preventDefault();
    const menu = document.getElementById("link-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.setAttribute("data-link-id", d.linkId);
  });

  //gucken ob das als absicherung vor nicht reproduzierbarem
  //node-label error hilft
  //nein es wird nicht helfen es gibt keien label-d.id
  /*
  svg
    .selectAll(".node-label")
    .data(jsonData.nodes, (d) => d.nodeId)
    .join("text")
    .attr("class", "node-label")
    .attr("id", (d) => `label-${d.nodeId}`); //.attr("id", (d) => `label-${d.id}`);
*/
  //monitoren ob das iwie harmful ist (unstable?)
  linkInteractiveDrag(svg, jsonData, currentGridSpacing);
}

//----------END: handleAllEditOperations === ALL ADD NEW LINK UNIQUE FUNCTION--------------//

//-------------------------------------------------------------------//

//----------START: handleAllEditOperations === ALL ADD NEW NODE UNIQUE FUNCTION--------------//

//TODO 1: Überall im code wo es geht css.escape nutzen edge-client um keine probleme
//mit sonderzeichen in namen zu haben. ÜBERALL dann fr
//TODO 2: Jetzt mit deleteNode im node contextmenu anfangen und dann create und delete node refactorn.
//TODO 3: Kanten dragging so überarbeiten das die kante wirklich da gerade ist wo mein kruser ist
//auch wenn das bedeutet nen hardcoded coordinated +200 rein zu packen.
//TODO 4: Bei langen namen die direkt über oder unter dem kreis anzeigen

//Jetzt klappt die kacke komplett, aber refactorn und console logs raus damits ordentlich aussieht.

//okay, jetzt wo ich nodeId und nodeName getrennt habe ist es bestimmt einfacher das hier zu implementieren
//und auch namen mit sonderzeichen zu haben!

/*
Okay, the next step would now be if the name is not already in out jsonData to add 
the new node to our jsonData with a unique uuid.v4() id and the name as it was typed 
into the window, with the coordinates of the mouse click. Lets for now implement that, 
after that we can care about visual implementation and integrating the new node into our 
other functions for contextmenu, drag&drop and drawing edges from and to.
*/
function handleCreateNewNode(svg, jsonData) {
  svg.on("click", function (event) {
    if (event.shiftKey && event.button === 0) {
      console.log("Shift + Left click detected.");

      const newNodeName = window.prompt(
        "Bitte geben Sie den Namen für den neuen Knoten ein:"
      );
      if (newNodeName) {
        console.log(`User entered node name: ${newNodeName}`);

        const isDuplicate = jsonData.nodes.some(
          (node) => node.name === newNodeName
        );
        if (isDuplicate) {
          console.log("STOP! Wir haben den Namen schon.");
        } else {
          console.log("Wir haben den Namen noch nicht.");

          const [x, y] = d3.pointer(event, this);

          const newNode = {
            nodeId: uuid.v4(),
            name: newNodeName,
            nodeColor: "whitesmoke",
            x: x,
            y: y,
            labelOffsetX: 0,
            labelOffsetY: 0,
          };

          jsonData.nodes.push(newNode);
          drawNewNode(svg, newNode);
          drawNewLabel(svg, newNode);
          handleAllContextMenus(svg, jsonData);
          handleAllInteractiveDrags(svg, jsonData, currentGridSpacing);
          updatePagJsonDisplay(jsonData);
          console.log("New node added:", newNode);
        }
      }
    }
  });
}

function drawNewNode(svg, node) {
  svg
    .append("circle")
    .datum(node) // Bind the node data to the new element
    .attr("id", `node-${node.nodeId}`) // Use unique ID for the node
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", node.nodeColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", node.x)
    .attr("cy", node.y);
  console.log("New node added to SVG with data:", node);
}

function drawNewLabel(svg, node) {
  svg
    .append("text")
    .datum(node) // Bind the node data to the label
    .attr("id", `label-${node.nodeId}`) // Use unique ID for the label
    .attr("class", "node-label")
    .attr("x", node.x + node.labelOffsetX)
    .attr("y", node.y + node.labelOffsetY)
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(node.name) // Display the node's name
    .attr("fill", "black")
    .style("font-size", "15px")
    .style("pointer-events", "all")
    .style("user-select", "none");
}

/*
  console.log("Setting up 'Shift + Click' for creating a new node.");
  svg.on("click", function (event) {
    if (event.shiftKey && event.button === 0) {
      // Check if 'Shift' is held and left mouse button clicked
      console.log("Shift + Left click detected.");
      const [x, y] = d3.pointer(event, this); // Get the coordinates relative to the SVG canvas

      // Öffne ein Eingabefeld für den Knoten-Namen
      const nodeName = window.prompt(
        "Bitte geben Sie den Namen für den neuen Knoten ein:"
      );

      if (nodeName) {
        console.log(`User entered node name: ${nodeName}`);
        // Prüfe, ob ein Knoten mit dieser ID bereits existiert
        const isDuplicate = jsonData.nodes.some((node) => node.id === nodeName);
        if (isDuplicate) {
          alert(
            `Ein Knoten mit dem Namen "${nodeName}" existiert bereits. Bitte wählen Sie einen anderen Namen.`
          );
          return;
        }

        // Erstelle den neuen Knoten
        const newNode = {
          id: nodeName,
          nodeColor: "whitesmoke",
          x: x,
          y: y,
          labelOffsetX: 0,
          labelOffsetY: 0,
        };

        // Füge den Knoten zu jsonData hinzu
        console.log("Creating new node:", newNode);
        jsonData.nodes.push(newNode);

        drawOnlyNewNode(svg, jsonData, nodeName);

        // Aktualisiere die Anzeige im JSON-Textfeld
        updatePagJsonDisplay(jsonData);

        console.log(`Neuer Knoten erstellt:`, newNode);
      } else {
        console.log("Kein Name eingegeben. Knoten wird nicht erstellt.");
      }
    }
  });
  */

//nodeId escaped damit auch sonderzeichen in den namen akzeptiert werden wie #,?,...
function drawOnlyNewNode(svg, jsonData, nodeId) {
  /*
  // Find the newly created node in jsonData
  console.log("node id" + nodeId);
  const selectedNode = jsonData.nodes.find((node) => node.id === nodeId);

  if (!selectedNode) {
    console.error(`No node found with ID: ${nodeId}`);
    return;
  }

  // Draw the new node (circle)
  const nodeSelection = svg
  .selectAll(`#node-${nodeId}`) // Ensure no duplicate nodes are added
    .data([selectedNode], (d) => d.id)
    .enter()
    .append("circle")
    .attr("id", `node-${nodeId}`)
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", selectedNode.nodeColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", selectedNode.x)
    .attr("cy", selectedNode.y);

  nodeSelection.on("contextmenu", function (event, d) {
    event.preventDefault();
    const menu = document.getElementById("node-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.setAttribute("data-node-id", d.id);
  });

  // Draw the new label (text)
  const labelSelection = svg
  .selectAll(`#label-${nodeId}`)// Ensure no duplicate labels are added
    .data([selectedNode], (d) => d.id)
    .enter()
    .append("text")
    .attr("id", `label-${nodeId}`)
    .attr("class", "node-label")
    .attr("x", selectedNode.x + selectedNode.labelOffsetX)
    .attr("y", selectedNode.y + selectedNode.labelOffsetY)
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(selectedNode.id)
    .attr("fill", "black")
    .style("font-size", "15px")
    .style("pointer-events", "all")
    .style("user-select", "none");

  labelSelection.on("contextmenu", function (event, d) {
    event.preventDefault();
    const menu = document.getElementById("label-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
    menu.setAttribute("data-label-id", d.id);
  });

  nodeInteractiveDrag(svg, jsonData, currentGridSpacing);
  //handleCreateNewLink aufruf klappt, da abbrechen jetzt so funktioniert das ich auf den selben
  //knoten nochmal klicken muss anstatt einf iwo aufn canvas
  handleCreateNewLink(svg, jsonData);
  */
}

//----------START: handleAllEditOperations === ALL ADD NEW NODE UNIQUE FUNCTION--------------//

//-------------------------------------------------------------------//

//----------START: UPDATE JSONDATA TEXTAREA--------------//

function updatePagJsonDisplay(jsonData) {
  const jsonDisplay = document.getElementById("pagJsonDisplay");
  jsonDisplay.value = JSON.stringify(jsonData, null, 2);
}

//----------END: UPDATE JSONDATA TEXTAREA--------------//

//-------------------------------------------------------------------//

//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//UNORGANIZED BELOW HERE
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//
//-------------------------------------------------------------------//

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

//TODO: maybe sind solche sachen bissl oberkill
//.attr("stroke-width", x % gridSpacing === 0 ? 1 : 0.5);
//geht bestimmt auch für normale menschen lesbar in 2 lines
function drawGrid(svg, gridSpacing) {
  //clear grid, if present
  svg.selectAll(".grid-line").remove();

  if (isGridClippingEnabled) {
    const width = parseInt(svg.attr("width"), 10);
    const height = parseInt(svg.attr("height"), 10);

    const refinedSpacing = gridSpacing / 2;

    const gridGroup = svg.append("g").attr("class", "grid");

    //draw lines
    for (let x = 0; x < width; x += refinedSpacing) {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        //refactor this to make it easier
        .attr("stroke-width", x % gridSpacing === 0 ? 1 : 0.5);
    }
    for (let y = 0; y < height; y += refinedSpacing) {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .attr("stroke", "#ccc")
        //refactor this to make it easier
        .attr("stroke-width", y % gridSpacing === 0 ? 1 : 0.5);
    }
    //eventhough grid is drawn last, put it at the bottom layer
    gridGroup.lower();
  }
}

//----------START: EXPORT TO PNG / PDF--------------//
//TODO: Look above the svgToPdf function!

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

  const width = parseInt(svgElement.getAttribute("width"));
  const height = parseInt(svgElement.getAttribute("height"));
  canvas.width = width;
  canvas.height = height;

  const img = new Image();
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {
    //make user decide if he wants a filled or clear background later
    //context.clearRect(0, 0, width, height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0, width, height);

    const link = document.createElement("a");
    link.download = "graph.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

//-----------------------//

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

//----------START: ERERVYTHING CONCERNING THE UI--------------//

// First event listener for menu-toggle
document.addEventListener("DOMContentLoaded", () => {
  const navigationBarButton = document.getElementById("right-slidemenu-toggle");
  const slideMenuMinor = document.getElementById("right-slidemenu-minor");
  const slideMenuMajor = document.querySelectorAll(".right-slidemenu-major");

  navigationBarButton.addEventListener("click", () => {
    const isActive = slideMenuMinor.classList.contains("active");

    if (isActive) {
      slideMenuMajor.forEach((menu) => menu.classList.remove("active"));
    }

    slideMenuMinor.classList.toggle("active");
  });
});

// Second event listener for menu-buttons (separate logic for buttons)
document.addEventListener("DOMContentLoaded", () => {
  const slideMenuMinorButtons = document.querySelectorAll(
    "#right-slidemenu-minor-buttons button"
  );
  const slideMenuMajor = document.querySelectorAll(".right-slidemenu-major");

  slideMenuMinorButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const currentSlideMenuMajor = document.getElementById(
        `menu-content-${index + 1}`
      );

      if (currentSlideMenuMajor) {
        const isActive = currentSlideMenuMajor.classList.contains("active");

        slideMenuMajor.forEach((menu) => menu.classList.remove("active"));

        if (!isActive) {
          currentSlideMenuMajor.classList.add("active");
        }
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-textarea");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const textarea = document.getElementById(targetId);

      if (textarea) {
        textarea.classList.toggle("active");
      }
    });
  });
});
