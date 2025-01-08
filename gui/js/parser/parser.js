/***********************************************************/
/*************START: Type-Conversion Functions**************/
/***********************************************************/

//Einen hebel einführen wenn links dann erwartet die Matrix eingabe einen Pag, wenn nach rechts wird ein ADMG erwartet
//dann kann dem entsprechend matrix->json oder json->matrix korrekt für admg oder pag ausgeführt werden

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
//------------------------------------------------------------------
//------------------------------------------------------------------

//abhängig vom switch auch die automatischen umwandlungen aus json Einlesen und Dot Einlesen anpassen
//um zu gucken ob dot->json->pag oder dot->json->admg, sowie dot<-json->pag oder dot<-json->admg

/*
Direction (Admg) Matrix -> Json

Admg mapping: 
Keine Kanten:
"", "A", "B"
"A", 0, 0
"B", 0, 0
----------
Directed Edge A -> B [1 edge between two nodes]:
"", "A", "B"
"A", 0, 1
"B", 0, 0

json: arrowhead: normal arrowtail: tail
----------
Directed Edge B -> A [1 edge between two nodes]:
"", "A", "B"
"A", 0, 0
"B", 1, 0

json: arrowhead: tail arrowtail: normal
----------
Bi-Directed Edge A <-> B (only a Bi-Directed edge, so the same as B <-> A) [1 edge between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 2, 0

json: arrowhead: normal arrowtail: normal isDashed: true
#----------
Bi-Directed Edge B <-> A (only a Bi-Directed edge, so the same as B <-> A) [1 edge between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 2, 0

json: arrowhead: normal arrowtail: normal isDashed: true

From now on remeber A <-> B is the same as B <-> A. 
----------
Bi-Directed A <-> B + Directed Edge A -> B [2 edges between two nodes]:
"", "A", "B"
"A", 0, 1
"B", 2, 0

json: 
Edge 1: arrowhead: normal arrowtail: normal isDashed: true
Edge 2: arrowhead: normal arrowtail: tail
----------
Bi-Directed A <-> B + Directed Edge B -> A [2 edges between two nodes]:
"", "A", "B"
"A", 0, 2
"B", 1, 0

Edge 1: arrowhead: normal arrowtail: normal isDashed: true
Edge 2: arrowhead: tail arrowtail: nornmal

those are already all possible mappings for the edges of an admg.
------------------------------------------------------------------
Direction Json -> (Admg) Matrix

Zwei mal über alle Edges iterieren.

Erst alle Bi-Directed Edges in die Matrix eintragen, so das überall eine 2 ist wo eine sein muss
und dann die Directed Edges da ergänzen wo sie hin müssen, das heißt aus 0 0 kann 1 0 oder 0 1 werden
oder falls es schon eine bidrected kante zwischen den beiden knoten gibt kann aus 2 2 ein 1 2 oder 2 1 werden.

In der jsonData sind bi-directed edges die die arrowhead=normal und arrowtail=normal haben und zusätzlich isDashed = true,
directed edges sind die die A->B: arrowhead=normal und arrowtail=tail ODER B->A: arrowhead=tail und arrowhead=normal haben

durch zweifaches iterieren spart man sich überprüfen ob man schon irgendwas in die matrix geschrieben hat und kann so
einf mit den directed edges den aktuellen stand mit nur bidirected edges durch überschreiben ergänzen.
*/

//TODO 1: Überprüfen das die Admg->Json und Json->Admg conversion nicht nur kacke ist
//TODO 2:dieses isAdmg bei den Buttons zur conversion und bei den zukünftigen download as matrix einfügen.
//------------------------------------------------------------------
//------------------------------------------------------------------

//TODO: wie ich hier schon selber sage, diese 3 Functions zu einer
//refactorn.

//Fuktion für PAG matrix
function readPagMatrix() {
  const fileInput = document.getElementById("pagMatrixFileInput").files[0];
  const displayArea = document.getElementById("pagMatrixDisplay");
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const formattedMatrix = pagFormatMatrix(event.target.result); // Formatierte Matrix anzeigen (1)
      displayArea.value = formattedMatrix; // Formatierte Matrix anzeigen (2)
      //displayArea.value = event.target.result; //Matrix anzeigen (unformatiert)

      //Matrix -> Json -> Dot
      if (isAdmg) {
        console.log("Converting ADMG matrix to JSON...");
        const jsonData = admgMatrixToJsonConversion(
          parsePagContent(displayArea.value)
        );

        document.getElementById("pagJsonDisplay").value = JSON.stringify(
          jsonData,
          null,
          2
        );

        document.getElementById("pagDotDisplay").value =
          jsonToDotConversion(jsonData);
      } else {
        console.log("Converting PAG matrix to JSON...");
        const jsonData = pagMatrixToJsonConversion(
          parsePagContent(displayArea.value)
        );

        document.getElementById("pagJsonDisplay").value = JSON.stringify(
          jsonData,
          null,
          2
        );

        document.getElementById("pagDotDisplay").value =
          jsonToDotConversion(jsonData);
      }

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
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result;
      //Json -> Matrix & Json -> Dot

      const jsonData = JSON.parse(displayArea.value);

      if (isAdmg) {
        document.getElementById("pagMatrixDisplay").value =
          jsonToAdmgMatrixConversion(jsonData);
      } else {
        document.getElementById("pagMatrixDisplay").value =
          jsonToPagMatrixConversion(jsonData);
      }

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
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (fileInput) {
    const reader = new FileReader();
    reader.onload = function (event) {
      displayArea.value = event.target.result;
      //Dot -> Json -> Matrix
      //Unterscheiden zwischen ADMG Matrix und PAG Matrix wie?

      const jsonData = dotToJsonConversion(displayArea.value);

      document.getElementById("pagJsonDisplay").value = JSON.stringify(
        jsonData,
        null,
        2
      );

      if (isAdmg) {
        document.getElementById("pagMatrixDisplay").value =
          jsonToAdmgMatrixConversion(jsonData);
      } else {
        document.getElementById("pagMatrixDisplay").value =
          jsonToPagMatrixConversion(jsonData);
      }

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

pagConvertMatrixToJsonButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (isAdmg) {
    admgMatrixToJsonConversion();
  } else {
    pagMatrixToJsonConversion();
  }
});

function admgMatrixToJsonConversion() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = admgMatrixToJsonConversion(parsedPagMatrix);

  document.getElementById("pagJsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
}

function pagMatrixToJsonConversion() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = pagMatrixToJsonConversion(parsedPagMatrix);

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


//----------------START: MATRIX -> JSON (ADMG)------------------------//

//hier war mal die admg matrix nach json conversion drin

//----------------START: JSON -> MATRIX (PAG)------------------------//

const pagConvertJsonToMatrixButton = document.getElementById(
  "pagConvertJsonToMatrix"
);
pagConvertJsonToMatrixButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const jsonInput = document.getElementById("pagJsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);

  if (isAdmg) {
    const matrixCsv = jsonToAdmgMatrixConversion(jsonData);
    document.getElementById("pagMatrixDisplay").value = matrixCsv;
  } else {
    const matrixCsv = jsonToPagMatrixConversion(jsonData);
    document.getElementById("pagMatrixDisplay").value = matrixCsv;
  }
});



//----------------START: JSON -> MATRIX (ADMG)------------------------//

//hier war mal die json nach admg matrix conversion drin

//----------------START: DOT -> JSON (PAG)------------------------//

const pagConvertDotToJsonButton = document.getElementById(
  "pagConvertDotToJson"
);
pagConvertDotToJsonButton.addEventListener("click", () => {
  const dotInput = document.getElementById("pagDotDisplay").value;
  const jsonData = dotToJsonConversion(dotInput);

  document.getElementById("pagJsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
});

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

/***********************************************************/
/**************END: Type-Conversion Functions***************/
/***********************************************************/
