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

const convertMatrixToJsonButton = document.getElementById(
  "convertMatrixToJson"
);
convertMatrixToJsonButton.addEventListener("click", pagMatrixToJsonConversion);

function convertMatrixToJson(parsedPagMatrix) {
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
  }));

  return { nodes, links };
}

function pagMatrixToJsonConversion() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = convertMatrixToJson(parsedPagMatrix);

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
function pagCreateJsonLinks(
  quellKnoten,
  zielKnoten,
  kantenTypFromTo,
  kantenTypToFrom
) {
  //alle Fälle mit 1 vorne
  if (kantenTypFromTo === 1 && kantenTypToFrom === 1) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "odot",
      arrowtail: "odot",
    };
  } else if (kantenTypFromTo === 1 && kantenTypToFrom === 2) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "odot",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 1 && kantenTypToFrom === 3) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "odot",
      arrowtail: "tail",
    };
  }

  //alle Fälle mit 2 vorne
  else if (kantenTypFromTo === 2 && kantenTypToFrom === 2) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "normal",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 2 && kantenTypToFrom === 3) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "normal",
      arrowtail: "tail",
    };
  } else if (kantenTypFromTo === 2 && kantenTypToFrom === 1) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "normal",
      arrowtail: "odot",
    };
  }

  //alle Fälle mit 3 vorne
  else if (kantenTypFromTo === 3 && kantenTypToFrom === 2) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "tail",
      arrowtail: "normal",
    };
  } else if (kantenTypFromTo === 3 && kantenTypToFrom === 3) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "tail",
      arrowtail: "tail",
    };
  } else if (kantenTypFromTo === 3 && kantenTypToFrom === 1) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "tail",
      arrowtail: "odot",
    };
  }

  //kantenTypFromTo = 1,2,3 und kantenTypToFrom = 0
  else if (kantenTypFromTo === 2) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "normal",
      arrowtail: "none",
    };
  } else if (kantenTypFromTo === 3) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "tail",
      arrowtail: "none",
    };
  } else if (kantenTypFromTo === 1) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "odot",
      arrowtail: "none",
    };
  }

  //kantenTypToFrom = 1,2,3 und kantenTypFromTo = 0
  else if (kantenTypToFrom === 2) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "none",
      arrowtail: "normal",
    };
  } else if (kantenTypToFrom === 3) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "none",
      arrowtail: "tail",
    };
  } else if (kantenTypToFrom === 1) {
    return {
      source: { id: quellKnoten, x: null, y: null },
      target: { id: zielKnoten, x: null, y: null },
      arrowhead: "none",
      arrowtail: "odot",
    };
  }
  return null;
}

//----------------START: JSON -> MATRIX (PAG)------------------------//

//der eventlistener geht doch einfache oder?
const convertJsonToMatrixButton = document.getElementById(
  "convertJsonToMatrix"
);
convertJsonToMatrixButton.addEventListener("click", () => {
  const jsonInput = document.getElementById("pagJsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);
  const matrixCsv = convertJsonToMatrix(jsonData);

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
function convertJsonToMatrix(jsonData) {
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

const convertDotToJsonButton = document.getElementById("convertDotToJson");
convertDotToJsonButton.addEventListener("click", () => {
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
      source: { id: source, x: null, y: null },
      target: { id: target, x: null, y: null },
      arrowhead: arrowhead,
      arrowtail: arrowtail,
    });
  }

  const nodesArray = Array.from(knoten).map((node) => ({
    id: node,
    x: null, //initial null
    y: null, //initial null
  }));

  const jsonData = {
    nodes: nodesArray,
    links: links,
  };

  return jsonData;
}

//----------------START: JSON -> DOT (PAG)------------------------//

const convertJsonToDotButton = document.getElementById("convertJsonToDot");
convertJsonToDotButton.addEventListener("click", () => {
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
/*********START: Type-Conversion Functions for PAG**********/
/***********************************************************/