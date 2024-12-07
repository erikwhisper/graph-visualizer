/****************************************/
/*********START: Initial readin**********/
/****************************************/

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
      //const formattedMatrix = pagFormatMatrix(event.target.result);
      //displayArea.value = formattedMatrix; // Formatierte Matrix anzeigen
      displayArea.value = event.target.result; //Matrix anzeigen
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