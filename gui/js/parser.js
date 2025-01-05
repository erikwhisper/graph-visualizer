/***********************************************************/
/*************START: Type-Conversion Functions**************/
/***********************************************************/

const allowedColors = [
  "white",
  "whitesmoke",
  "azure",
  "aliceblue",
  "ghostwhite",
  "floralwhite",
  "ivory",
  "beige",
  "antiquewhite",
  "mintcream",
  "snow",
  "oldlace",
  "lavenderblush",
  "seashell",
  "cornsilk",
  "blanchedalmond",
  "papayawhip",
  "lemonchiffon",
  "linen",
  "honeydew",
  "gainsboro",
  "navajowhite",
  //yeelows
  "lightyellow",
  "yellow",
  "khaki",
  "gold",
  "palegoldenrod",
  "goldenrod",
  "darkgoldenrod",
  "darkkhaki",
  //oranges
  "moccasin",
  "peachpuff",
  "bisque",
  "orange",
  "darkorange",
  "tan",
  "sandybrown",
  "burlywood",
  "peru",
  "chocolate",
  "saddlebrown",
  "maroon",
  //reds
  "lightpink",
  "pink",
  "hotpink",
  "mistyrose",
  "salmon",
  "lightsalmon",
  "lightcoral",
  "coral",
  "tomato",
  "orangered",
  "indianred",
  "darksalmon",
  "crimson",
  "firebrick",
  "red",
  "darkred",
  //brown
  "rosybrown",
  "brown",
  "sienna",
  //lilas
  "thistle",
  "lavender",
  "plum",
  "orchid",
  "rebeccapurple",
  "violet",
  "mediumorchid",
  "mediumpurple",
  "blueviolet",
  "darkorchid",
  "darkviolet",
  "purple",
  "magenta",
  "fuchsia",
  "mediumvioletred",
  "palevioletred",
  "indigo",
  //blue
  "lightcyan",
  "lightblue",
  "lightsteelblue",
  "powderblue",
  "skyblue",
  "lightskyblue",
  "deepskyblue",
  "dodgerblue",
  "cornflowerblue",
  "steelblue",
  "royalblue",
  "mediumblue",
  "mediumslateblue",
  "blue",
  "darkblue",
  "navy",
  "midnightblue",
  "slateblue",
  "darkslateblue",
  //aqua
  "lightgoldenrodyellow",
  "cyan",
  "aqua",
  "aquamarine",
  "mediumaquamarine",
  "teal",
  "turquoise",
  "paleturquoise",
  "mediumturquoise",
  "darkturquoise",
  "darkcyan",
  "cadetblue",
  //greens
  "lightgreen",
  "lightseagreen",
  "palegreen",
  "springgreen",
  "mediumspringgreen",
  "greenyellow",
  "lime",
  "limegreen",
  "yellowgreen",
  "lawngreen",
  "chartreuse",
  "mediumseagreen",
  "seagreen",
  "darkseagreen",
  "darkolivegreen",
  "forestgreen",
  "green",
  "darkgreen",
  "olivedrab",
  "olive",
  //graus + schwarz
  "lightgray",
  "lightslategray",
  "silver",
  "darkgray",
  "dimgray",
  "slategray",
  "darkslategray",
  "black",
];
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
      const formattedMatrix = pagFormatMatrix(event.target.result); // Formatierte Matrix anzeigen (1)
      displayArea.value = formattedMatrix; // Formatierte Matrix anzeigen (2)
      //displayArea.value = event.target.result; //Matrix anzeigen (unformatiert)
      //Matrix -> Json -> Dot

      const jsonData = pagConvertMatrixToJson(parsePagContent(displayArea.value));

      document.getElementById("pagJsonDisplay").value = JSON.stringify(
        jsonData,
        null,
        2
      );

      document.getElementById("pagDotDisplay").value =
        jsonToDotConversion(jsonData);

      //Matrix -> Json -> Dot
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
      displayArea.value = event.target.result;
      //Json -> Matrix & Json -> Dot

      const jsonData = JSON.parse(displayArea.value);

      document.getElementById("pagMatrixDisplay").value =
        pagConvertJsonToMatrix(jsonData);

      document.getElementById("pagDotDisplay").value =
        jsonToDotConversion(jsonData);

      //Json -> Matrix & Json -> Dot
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
      displayArea.value = event.target.result;
      //Dot -> Json -> Matrix

      const jsonData = pagDotToJsonConversion(displayArea.value);

      document.getElementById("pagJsonDisplay").value = JSON.stringify(
        jsonData,
        null,
        2
      );

      document.getElementById("pagMatrixDisplay").value =
        pagConvertJsonToMatrix(jsonData);

      //Dot -> Json -> Matrix
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

//aus den conversion buttons download buttons machen, es reicht dann json->matrix für download matrix
//json->dot für download dot und download json selbst
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
    linkColor: "black",
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

function pagDotToJsonConversion(dotSyntax) {
  const knoten = new Map();
  const links = [];

  const edgeRegex =
    /"([^"]+)"\s*->\s*"([^"]+)"\s*\[\s*dir\s*=\s*both[,\s]*arrowhead\s*=\s*([^,\s]+)[,\s]*arrowtail\s*=\s*([^,\s]+)(?:[,\s]*style\s*=\s*([^,\]]+))?(?:[,\s]*color\s*=\s*([^,\]]+))?\s*\];/g;

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
    const color = match[6]?.trim() || "black";

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

    const validatedColor = allowedColors.includes(color) ? color : "black";

    links.push({
      linkId: uuid.v4(),
      linkColor: validatedColor,
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
    const color =
      allowedColors.includes(link.linkColor) && link.linkColor !== "black"
        ? `, color=${link.linkColor}`
        : "";

    dotOutput += `"${source}" -> "${target}" [dir=both, arrowhead=${arrowhead}, arrowtail=${arrowtail}${style}${color}];\n`;
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
/**************END: Type-Conversion Functions***************/
/***********************************************************/
