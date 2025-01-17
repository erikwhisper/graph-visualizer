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

  handleCreateNewNode(svg, gridSpacing);

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
function linkContextMenu(svg) {
  //console.log("Initializing link context menu...");
  //wenn ein kontextmenu geöffnet wird sollen die anderen beiden falls offen geschlossen werden.
  setupContextMenu(
    svg,
    ".link",
    "link-context-menu",
    "data-link-id",
    (d) => d.linkId // Unique linkId
  );
  implementLinksContextMenu();
  closeContextMenu("link-context-menu");
}

function nodeContextMenu(svg) {
  //console.log("Initializing node context menu...");
  setupContextMenu(
    svg,
    ".node",
    "node-context-menu",
    "data-node-id",
    (d) => d.nodeId // Unique nodeId
  );
  implementNodesContextMenu();
  closeContextMenu("node-context-menu");
}

function labelContextMenu(svg) {
  //console.log("Initializing label context menu...");
  setupContextMenu(
    svg,
    ".node-label",
    "label-context-menu",
    "data-label-id",
    (d) => d.nodeId // Unique nodeId for label
  );
  implementLabelsContextMenu();
  closeContextMenu("label-context-menu");
}

//TODO: anderes wort für setup finden

//----------END: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//-------------------------------------------------------------------//

//----------START: CONTEXTMENU GENERAL FUNCTIONS--------------//

//TODO: Anzeige des Kontetxmenüs schöner machen
function setupContextMenu(
  svg,
  objectType,
  contextMenuType,
  attributeID,
  calculation
) {
  console.log(`Setting up context menu for ${objectType}...`);

  const selection = svg.selectAll(objectType);

  // Log the number of elements selected
  console.log(`Found ${selection.size()} ${objectType}(s).`);

  // Check if the contextmenu handler already exists // link context menu ist hier immer undefined
  selection.each(function () {
    const existingHandlers = d3.select(this).on("link-context-menu");
    console.log("was ist überhaupt existingHandlers?: " + existingHandlers);
    if (existingHandlers) {
      console.warn(`Context menu handler already exists for ${objectType}.`);
    }
  });

  // Remove any existing contextmenu handlers
  selection.on("contextmenu", null);

  // Attach the new contextmenu handler
  selection.on("contextmenu", function (event, d) {
    console.log(
      `Context menu triggered for ${objectType} with ID: ${calculation(d)}`
    );
    event.preventDefault();

    const menu = document.getElementById(contextMenuType);
    //TODO: okay now i gotta make sure its visually closed when i press on another one so they dont overlap
    menu.style.display = "block";
    menu.style.left = `0px`;
    menu.style.top = `10%`;
    //menu.style.left = `${event.pageX}px`;
    //menu.style.top = `${event.pageY}px`;

    menu.setAttribute(attributeID, calculation(d));
  });

  console.log(
    `Context menu event handlers set for ${selection.size()} ${objectType}(s).`
  );
}

//-------------------------------------//

function closeContextMenu(contextMenuType) {
  console.log(`Setting up close context menu for ${contextMenuType}...`);

  document.addEventListener("click", (event) => {
    const menu = document.getElementById(contextMenuType);
    if (!menu.contains(event.target)) {
      menu.style.display = "none";
      //console.log(`${contextMenuType} hidden.`);
    }
  });
}

//----------END: CONTEXTMENU GENERAL FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//TODO: refactor redrawing of arrowhead/arrowtail...
function implementLinksContextMenu() {
  console.log("Link Contextmenu called");

  function handleArrowheadClick(arrowheadType) {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

    if (selectedLink) {
      console.log(
        "hier weiß er was der arrowhead ist: " + selectedLink.arrowhead
      );
      selectedLink.arrowhead = arrowheadType;

      const markerId = `marker-${selectedLink.linkId}-end`;
      setupArrowMarker(
        d3.select("svg"),
        markerId,
        arrowheadType,
        selectedLink.linkColor,
        "auto"
      );

      d3.select(`#link-${selectedLink.linkId}`).attr(
        "marker-end",
        `url(#${markerId})`
      );

      updatePagJsonDisplay();
      console.log(`Arrowhead updated to '${arrowheadType}' for link ${linkId}`);
    }
  }

  document
    .getElementById("arrowhead-normal")
    .addEventListener("click", () => handleArrowheadClick("normal"));
  document
    .getElementById("arrowhead-odot")
    .addEventListener("click", () => handleArrowheadClick("odot"));
  document
    .getElementById("arrowhead-tail")
    .addEventListener("click", () => handleArrowheadClick("tail"));

  function handleArrowtailClick(arrowtailType) {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

    if (selectedLink) {
      selectedLink.arrowtail = arrowtailType;

      const markerId = `marker-${selectedLink.linkId}-start`;
      setupArrowMarker(
        d3.select("svg"),
        markerId,
        arrowtailType,
        selectedLink.linkColor,
        "auto-start-reverse"
      );

      d3.select(`#link-${selectedLink.linkId}`).attr(
        "marker-start",
        `url(#${markerId})`
      );

      updatePagJsonDisplay();
      console.log(`Arrowtail updated to '${arrowtailType}' for link ${linkId}`);
    }
  }

  document
    .getElementById("arrowtail-normal")
    .addEventListener("click", () => handleArrowtailClick("normal"));
  document
    .getElementById("arrowtail-odot")
    .addEventListener("click", () => handleArrowtailClick("odot"));
  document
    .getElementById("arrowtail-tail")
    .addEventListener("click", () => handleArrowtailClick("tail"));

  //TODO: Kann man anstatt mit selected Link wie bei delete-link nicht direkt mit linkId arbeiten?
  document.getElementById("straighten-link").addEventListener("click", () => {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
    if (selectedLink) {
      resetLinkCurve(selectedLink);
      updatePagJsonDisplay();
    }
  });

  document
    .getElementById("toggle-dashed-link")
    .addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find(
        (link) => link.linkId === linkId
      );
      if (selectedLink && !selectedLink.isDashed) {
        setDashed(selectedLink);
        updatePagJsonDisplay();
      } else if (selectedLink && selectedLink.isDashed) {
        unsetDashed(selectedLink);
        updatePagJsonDisplay();
      }
    });

  //wird halt so oft ausgeführt wie oft "visualize" button gedrückt wurde... was macht man dagegen
  document.getElementById("delete-link").addEventListener("click", () => {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    if (linkId) {
      deleteLink(linkId);
      if (linkMenu) {
        linkMenu.style.display = "none";
      }
    }
  });

  setupLinkColorPalette();
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

//Entfernt Links aus dem jsonData und von svg canvas
function deleteLink(linkId) {
  jsonData.links = jsonData.links.filter((link) => link.linkId !== linkId); //löscht link aus jsonData

  d3.select(`#link-${linkId}`).remove(); //löscht link von svg canvas

  updatePagJsonDisplay(); //passt displayed jsondata auf actual jsondata an
}

function setupLinkColorPalette() {
  const linkColorPalette = document.getElementById("link-color-palette");
  linkColorPalette.innerHTML = "";

  allowedColors.forEach((color) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-swatch";
    colorSwatch.style.backgroundColor = color;

    colorSwatch.addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");

      if (linkId) {
        changeLinkColor(linkId, color);
      }
    });

    linkColorPalette.appendChild(colorSwatch);
  });
}

function changeLinkColor(linkId, color) {
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

  if (selectedLink) {
    selectedLink.linkColor = color;

    const svgLink = d3.select(`#link-${linkId}`);
    svgLink.attr("stroke", color);

    if (selectedLink.arrowhead) {
      const markerId = `marker-${selectedLink.linkId}-end`;
      setupArrowMarker(
        d3.select("svg"),
        markerId,
        selectedLink.arrowhead,
        color,
        "auto"
      );
      d3.select(`#link-${selectedLink.linkId}`).attr(
        "marker-end",
        `url(#${markerId})`
      );
    }

    if (selectedLink.arrowtail) {
      const markerId = `marker-${selectedLink.linkId}-start`;
      setupArrowMarker(
        d3.select("svg"),
        markerId,
        selectedLink.arrowtail,
        color,
        "auto-start-reverse"
      );
      d3.select(`#link-${selectedLink.linkId}`).attr(
        "marker-start",
        `url(#${markerId})`
      );
    }
    updatePagJsonDisplay();
  }
}

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
function implementNodesContextMenu() {
  console.log("Node Contextmenu called");

  document.getElementById("delete-node").addEventListener("click", () => {
    const nodeMenu = document.getElementById("node-context-menu");
    const nodeId = nodeMenu.getAttribute("data-node-id");
    if (nodeId) {
      deleteNode(nodeId);
      if (nodeMenu) {
        nodeMenu.style.display = "none";
      }
    }
  });

  setupNodeColorPalette();
}

function deleteNode(nodeId) {
  //Sammelt alle links die mit dem knoten in verbindung stehen
  const linksToDelete = jsonData.links.filter(
    (link) => link.source.nodeId === nodeId || link.target.nodeId === nodeId
  );

  //Entfernt zugehörige Links aus dem jsonData und von svg canvas
  linksToDelete.forEach((link) => {
    deleteLink(link.linkId);
  });

  d3.select(`#label-${nodeId}`).remove();

  d3.select(`#node-${nodeId}`).remove();

  //Entfernt den Node selbst aus dem jsonData
  jsonData.nodes = jsonData.nodes.filter((node) => node.nodeId !== nodeId);

  updatePagJsonDisplay();
}

function setupNodeColorPalette() {
  const nodeColorPalette = document.getElementById("node-color-palette");
  nodeColorPalette.innerHTML = "";

  allowedColors.forEach((color) => {
    const colorSwatch = document.createElement("div");
    colorSwatch.className = "color-swatch";
    colorSwatch.style.backgroundColor = color;

    colorSwatch.addEventListener("click", () => {
      const nodeMenu = document.getElementById("node-context-menu");
      const nodeId = nodeMenu.getAttribute("data-node-id");

      const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      if (node) {
        node.nodeColor = color;
        const selectedNode = d3.select(`#node-${nodeId}`);
        selectedNode.attr("fill", color).style("fill", color);

        updatePagJsonDisplay();
      }
    });

    nodeColorPalette.appendChild(colorSwatch);
  });
}

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
function implementLabelsContextMenu() {
  

  document.getElementById("menu-center").addEventListener("click", () => {
    const labelMenu = document.getElementById("label-context-menu");
    const labelId = labelMenu.getAttribute("data-label-id");
    if (labelId) {
      //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
      const node = jsonData.nodes.find((n) => n.nodeId === labelId);
      node.labelOffsetX = 0; //später radius hier + iwas 
      node.labelOffsetY = 0; //später radius hier + iwas 
      const selectedLabel = d3.select(`#label-${node.nodeId}`);

        selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
        selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
      if (labelMenu) {
        //labelMenu.style.display = "none";
      }
    }
    updatePagJsonDisplay();
  });

  document.getElementById("menu-above").addEventListener("click", () => {
    const labelMenu = document.getElementById("label-context-menu");
    const labelId = labelMenu.getAttribute("data-label-id");
    if (labelId) {
      //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
      const node = jsonData.nodes.find((n) => n.nodeId === labelId);
      node.labelOffsetX = 0; //später radius hier + iwas 
      node.labelOffsetY = -25; //später radius hier + iwas 
      const selectedLabel = d3.select(`#label-${node.nodeId}`);

        selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
    }
    updatePagJsonDisplay();
  });


document.getElementById("menu-below").addEventListener("click", () => {
  const labelMenu = document.getElementById("label-context-menu");
  const labelId = labelMenu.getAttribute("data-label-id");
  if (labelId) {
    //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
    const node = jsonData.nodes.find((n) => n.nodeId === labelId);
    node.labelOffsetX = 0; //später radius hier + iwas 
    node.labelOffsetY = 25; //später radius hier + iwas 
    const selectedLabel = d3.select(`#label-${node.nodeId}`);

      selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
  }
  updatePagJsonDisplay();
});

document.getElementById("menu-left").addEventListener("click", () => {
  const labelMenu = document.getElementById("label-context-menu");
  const labelId = labelMenu.getAttribute("data-label-id");
  if (labelId) {
    //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
    const node = jsonData.nodes.find((n) => n.nodeId === labelId);
    node.labelOffsetX = -25; //später radius hier + iwas 
    node.labelOffsetY = 0; //später radius hier + iwas 
    const selectedLabel = d3.select(`#label-${node.nodeId}`);

      selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
  }
  updatePagJsonDisplay();
});

document.getElementById("menu-right").addEventListener("click", () => {
  const labelMenu = document.getElementById("label-context-menu");
  const labelId = labelMenu.getAttribute("data-label-id");
  if (labelId) {
    //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
    const node = jsonData.nodes.find((n) => n.nodeId === labelId);
    node.labelOffsetX = 25; //später radius hier + iwas 
    node.labelOffsetY = 0; //später radius hier + iwas 
    const selectedLabel = d3.select(`#label-${node.nodeId}`);

      selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
  }
  updatePagJsonDisplay();
});

}
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

function handleCreateNewNode(svg, gridSpacing) {
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

          handleAllInteractiveDrags(svg, gridSpacing);

          addNewLink(svg, gridSpacing);

          updatePagJsonDisplay();
          console.log("New node added:", newNode);
        }
      }
    }
  });
}

//-------------------------------------------------------------------//

//----------START: UPDATE JSONDATA TEXTAREA--------------//

function updatePagJsonDisplay() {
  //maybe add instant conversion to dot and matrix!!
  const jsonDisplay = document.getElementById("jsonDisplay");
  jsonDisplay.value = JSON.stringify(jsonData, null, 2);
}

//----------END: UPDATE JSONDATA TEXTAREA--------------//
