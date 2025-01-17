/***********************************************************/
/***********START: jsonData Visulization for PAG************/
/***********************************************************/

//PARSER TODO:
//TODO 1: Erst die funktionen handleManuel...() ausführen und dann für jeden typ das gewünschte file runterladen.

/////////////////////////////////////////////////////////////////////////////////

//-> Label, also nodeNames ganz oben im contextmenu anzeigen und
//edititierbar machen, dann jsonDataDisplay aktualisieren

//lowkey kann ich die "JSON->Matrix" und "JSON->DOT" funktion
//auch einfach mit in die download funktion des jeweiligen
//typs packen, also wenn ich dann "Download Matrix Button"
//drücke, dann führt er erst aus was jetzt unterm "JSON->Matrix"
//button ist und danach downloaded der mir das einf zu ner .csv
//fertig

//knotengröße anpassen können, bedeutet label, arrowmarker
//alles dynamisch daran anpassen müssen

//----------START: BASIC VISUALIZATION + DRAG&DROP --------------//

//Eventlistener for basic visualization

let jsonData = null;
let contextMenusInitialized = false;

document
  .getElementById("pagVisualizeJsonWithD3")
  .addEventListener("click", () => {
    resetCheckBoxes();

    // Get the JSON input from the DOM
    const jsonInput = document.getElementById("jsonDisplay").value;
    jsonData = JSON.parse(jsonInput); // Assign to global variable

    visualizeJsonWithD3(); // Pass the global variable
  });

function resetCheckBoxes() {
  //reset grid clipping
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

function visualizeJsonWithD3() {
  //clear current jsonData if existing, then do this:...

  const svg = initializeSvgCanvas();

  const gridSpacing = 50; //ALERT: currently declared twice, once here in visualizer.js and once in grid.js to avoid a global variable

  initializeNodeCoordinates(gridSpacing * 2); //initiales clipping nutz doppelt so breites gridSpacing

  drawEverything(svg);

  if (!contextMenusInitialized) {
    handleAllContextMenus(svg);
    contextMenusInitialized = true; // Setze das Flag auf true, um die Kontextmenü-Erstellung zu verhindern
  }

  handleAllInteractiveDrags(svg, gridSpacing);

  addNewLink(svg, gridSpacing);

  addNewNode(svg, gridSpacing);

  updatePagJsonDisplay();
}

//----------START: NOCH KEINEN NAMEN HIERFUEHR --------------//

//----------END: NOCH KEINEN NAMEN HIERFUEHR --------------//

//-------------------------------------------------------------------//

//----------START: SETUP SUPERIOR DRAWING FUNCTIONS, CONTEXTMENUS, LEFT-CLICKS --------------//

//calls the functions that draw the three objects
function drawEverything(svg) {
  drawLinks(svg);
  drawNodes(svg);
  drawLabels(svg);
}

//Ich glaube "svg.selectAll(".link").on("contextmenu", null);" ist deadcode und kann weg
//wenn das link dingen iwo gecleared wird dann in der addNewLink Function
//die handleAllContextMenus wird doch eh nie wieder aufgerufen
function handleAllContextMenus(svg) {
  linkContextMenu(svg);
  console.log("Link context menu initialized.");

  nodeContextMenu(svg);
  console.log("Node context menu initialized.");

  labelContextMenu(svg);
  console.log("Label context menu initialized.");
}

//calls the functions that implement the leftclick for the three objects
function handleAllInteractiveDrags(svg, gridSpacing) {
  svg.selectAll(".link").on(".drag", null); //das geht doch eh nicht? aber ist auch egal oder?
  svg.selectAll(".node").on(".drag", null); //das geht doch eh nicht? aber ist auch egal oder?
  linkInteractiveDrag(svg, gridSpacing);
  nodeInteractiveDrag(svg, gridSpacing);
  //labelInteractiveClick(svg, jsonData, gridSpacing); //man könnte lowkey nen drag&drop für labelOffsexX/Y einfügen
  //der wandert beim moven vom node dann ja immer einf mit dem nodePosition+offset mit, und wenn grid an wird clipping
  //genommen, eig easy.
}

//----------END: SETUP DRAWING FUNCTION, CONTEXTMENUS, LEFT-CLICKS --------------//

//-------------------------------------------------------------------//

//----------START: drawEverything() === DRAW LINKS + DRAW NODES + DRAW LABELS --------------//

//----------END: DRAW LINKS + DRAW NODES + DRAW LABELS --------------//

//-------------------------------------------------------------------//

//----------START: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//TODO: anderes wort für setup finden






//TODO: anderes wort für setup finden

//----------END: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//-------------------------------------------------------------------//

//----------START: CONTEXTMENU GENERAL FUNCTIONS--------------//

//TODO: Anzeige des Kontetxmenüs schöner machen

//-------------------------------------//



//----------END: CONTEXTMENU GENERAL FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//TODO: refactor redrawing of arrowhead/arrowtail...


//----------END: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: nodeContextMenu === CONTEXTMENU NODES UNIQUE FUNCTIONS--------------//

//TODO: Adapt labelcolor, add labelcolor maybe, and change to black or white, according to the brightness of the color
//automatically

//die funktion abbrechen wenn ich einen leftclick auf den node mache um das kontextmenu zu öffnen, was wir
//bei einem delete baren knoten vermeiden wollen
//TODO 6: Knoten löschen können, wenn daran links hängen diese mit löschen, daher delete link, nicht nur
//im kontextmenü unterbringen sondern den wichtigsten teil in aufrufbare funktion versetzen.
//-> bei deletenode muss ich laufende processe wie "einen node ausgewählt" und dann lösche ich diesen knoten
//und dann drücke ich auf den zweiten und will eine kante zeichnen, dann würde mir das um die ohren fliegen
//das iwie absichern.

//----------END: NodeContextMenu === CONTEXTMENU NODES UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: labelContextMenu === CONTEXTMENU LABEL UNIQUE FUNCTIONS--------------//

//TODO: ACHTUNG DIESER SCHNIPSEL IST EINE WICHTIGE IDEE!!
/*const linkMenu = document.getElementById("link-context-menu");
    const nodeMenu = document.getElementById("node-context-menu");
    if (nodeMenu) {
      nodeMenu.style.display = "none";
    }
    if (linkMenu) {
      linkMenu.style.display = "none";
    }
    iwo sowas hin das wenn ich ein contextmenü anklicke die anderen sich schließen!!!  
    */

//setup label komplett neu machen, wenn ich radius hinzugefügt hab?! sonst klappt alles mit global jetzt!!!
//----------END: labelContextMenu === CONTEXTMENU LABEL UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: allInteractiveClicks === LEFTCLICK LINK UNIQUE FUNCTIONS--------------//

//TODO: Falls zwischen den beiden Knoten schon eine Kante existiert, setze die neue auf isCurved und ihre
//d.X und d.Y auf (x1 + x2) / 2 + offsetWert; //das auch beim zeichnen neuer kanten machen.
//Muss in utils funktion, wird für contextmenu und drag genutzt //ist eig nicht auf calculate Link Path bezogen  oder?
//Was ist denn fürs zeichnen verantworklich? initial und bei handleAddNewLink

function calculateLinkPath(d) {
  const { x: x1, y: y1 } = d.source;
  const { x: x2, y: y2 } = d.target;

  if (!d.isCurved) {
    //alternativ kann man hier jetzt auch .isCurved=false nutzen
    d.linkControlX = (x1 + x2) / 2;
    d.linkControlY = (y1 + y2) / 2;
  }

  return `M ${x1},${y1} Q ${d.linkControlX},${d.linkControlY} ${x2},${y2}`;
}

//----------END: allInteractiveClicks === LEFTCLICK LINK UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: allInteractiveClicks === LEFTCLICK NODE UNIQUE FUNCTIONS--------------//

//----------START: allInteractiveClicks === LEFTCLICK NODE UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: handleAllEditOperations === ALL ADD NEW LINK UNIQUE FUNCTION--------------//

//TODO 4: Labels über knotextmenu namen verändern können?

//TODO 6: Knoten löschen können, wenn daran links hängen diese mit löschen, daher delete link, nicht nur
//im kontextmenü unterbringen sondern den wichtigsten teil in aufrufbare funktion versetzen.
//-> bei deletenode muss ich laufende processe wie "einen node ausgewählt" und dann lösche ich diesen knoten
//und dann drücke ich auf den zweiten und will eine kante zeichnen, dann würde mir das um die ohren fliegen
//das iwie absichern.

//----------END: handleAllEditOperations === ALL ADD NEW LINK UNIQUE FUNCTION--------------//

//-------------------------------------------------------------------//

//----------START: handleAllEditOperations === ALL ADD NEW NODE UNIQUE FUNCTION--------------//

//TODO 3: Kanten dragging so überarbeiten das die kante wirklich da gerade ist wo mein kruser ist
//auch wenn das bedeutet nen hardcoded coordinated +200 rein zu packen.
//TODO 4: Bei langen namen die direkt über oder unter dem kreis anzeigen

//-----------------------------------------------------------------------------
//TODO 1: Bei neuen Knoten hat er das Problem das er beim LabelContextMenu sagt das er den Knoten nicht kennt
//woran kann das liegen? Es passiert auch erst nach dem zweiten "Visualisieren" drücken
//mit console logs rausfinden was der grund sein kann.

//TODO 1.2: ContextMenu implementation funktioniert jetzt für newNode+newLabel und für newlink
//einziges problem ist jetzt weiterhin noch das verschieben von Labels über deren kontextmenu
//bei neuen nodes, mal gucken ob die contextMenuLabel function nen problem hat oder was es sonst
//sein könnte + LabelOffset dynamisch an radius anpassen.

//TODO 3: Kantenlänge anpassen, damit neue kanten nicht immer so turbo lang drüber sind
//TODO 4: Label/Node namen ändern können
//TODO 5: Knotenradius ändern könnnen (dynamisch mit kantenlänge und labelOffset machen)
//TODO 7: Pdf export an graphen größe anpassen

//-----------------------------------------------------------------------------



//-------------------------------------------------------------------//

//----------START: UPDATE JSONDATA TEXTAREA--------------//

function updatePagJsonDisplay() {
  //maybe add instant conversion to dot and matrix!!
  const jsonDisplay = document.getElementById("jsonDisplay");
  jsonDisplay.value = JSON.stringify(jsonData, null, 2);
}

//----------END: UPDATE JSONDATA TEXTAREA--------------//
