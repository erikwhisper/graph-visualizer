/***********************************************************/
/*************START: Type-Conversion Functions**************/
/***********************************************************/

//TODO 1:
//Rework: Aus den buttons, die ich teilweise zusammenfüge werden kleine update funktionen, die basically das selbe machen
//wie die einlese funktionen, nur das sie sich auf das beziehen was in der textarea steht, also falls der user etwas per hand
//ändert reagieren sie darauf und updaten die anderen strukturen entsprechend.

//TODO 2:
//Erst die neue funktion aus todo 1 ausführen und dann für jeden typ das gewünschte file runterladen

//TODO 3: Wenn import/export verstanden anfangen den visualizer auseinander zu reissen.

//////////////////////////////////////////////////

//----------------START: MATRIX -> JSON (PAG)------------------------//



//und das hier ist dann auch ein button der aus der textarea matrix direkt json und dannn noch dot hinzufügen macht!

const convertMatrixToJsonButton = document.getElementById(
  "convertMatrixToJson"
);

convertMatrixToJsonButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  if (isAdmg) {
    admgMatrixToJsonConversionCall();
  } else {
    pagMatrixToJsonConversionCall();
  }
});

function admgMatrixToJsonConversionCall() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = admgMatrixToJsonConversion(parsedPagMatrix);

  document.getElementById("jsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
}

function pagMatrixToJsonConversionCall() {
  const currentPagMatrix = document.getElementById("pagMatrixDisplay").value;
  const parsedPagMatrix = parsePagContent(currentPagMatrix);
  const jsonData = pagMatrixToJsonConversion(parsedPagMatrix);

  document.getElementById("jsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
}



//----------------START: MATRIX -> JSON (ADMG)------------------------//

//hier war mal die admg matrix nach json conversion drin

//----------------START: JSON -> MATRIX (PAG)------------------------//


//Die beiden zsm packen: 

//add json to dot conversion call and turn them into an update button for when something was changed
//in the json textarea by hand
const convertJsonToMatrixButton = document.getElementById(
  "convertJsonToMatrix"
);
convertJsonToMatrixButton.addEventListener("click", () => {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  const jsonInput = document.getElementById("jsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);

  if (isAdmg) {
    const matrixCsv = jsonToAdmgMatrixConversion(jsonData);
    document.getElementById("pagMatrixDisplay").value = matrixCsv;
  } else {
    const matrixCsv = jsonToPagMatrixConversion(jsonData);
    document.getElementById("pagMatrixDisplay").value = matrixCsv;
  }
});

//add json to dot conversion call and turn them into an update button for when something was changed
//in the dot textarea by hand
const pagConvertJsonToDotButton = document.getElementById(
  "pagConvertJsonToDot"
);
pagConvertJsonToDotButton.addEventListener("click", () => {
  const jsonInput = document.getElementById("jsonDisplay").value;
  const jsonData = JSON.parse(jsonInput);
  const dotSyntax = jsonToDotConversion(jsonData);
  document.getElementById("pagDotDisplay").value = dotSyntax;
});

//----------------START: JSON -> MATRIX (ADMG)------------------------//

//hier war mal die json nach admg matrix conversion drin

//----------------START: DOT -> JSON (PAG)------------------------//

//add matrix to dot conversion call and turn them into an update button for when something was changed
//in the dot textarea by hand
const pagConvertDotToJsonButton = document.getElementById(
  "pagConvertDotToJson"
);
pagConvertDotToJsonButton.addEventListener("click", () => {
  const dotInput = document.getElementById("pagDotDisplay").value;
  const jsonData = dotToJsonConversion(dotInput);

  document.getElementById("jsonDisplay").value = JSON.stringify(
    jsonData,
    null,
    2
  );
});

//----------------START: JSON -> DOT (PAG)------------------------//



/***********************************************************/
/**************END: Type-Conversion Functions***************/
/***********************************************************/
