/***********************************************************/
/***********START: jsonData Visulization for PAG************/
/***********************************************************/

//funktion die geil wäre, alles auf dem canvas auswählen können
//also nodes, labels, links so wie sie sind und zsm per
//drag and drop bewegen, erst frei, dann mit grid

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

//-->Dann den ganzen scheiss für den admg auch.

//----------START: BASIC VISUALIZATION + DRAG&DROP --------------//

//Eventlistener for basic visualization
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

//TODO 2: Jetzt mit deleteNode im node contextmenu anfangen und dann create und delete node refactorn.
//TODO 3: Kanten dragging so überarbeiten das die kante wirklich da gerade ist wo mein kruser ist
//auch wenn das bedeutet nen hardcoded coordinated +200 rein zu packen.

//i made the gridSpacing fixed, so there is no need for a global "currentGridSpacing" anymore, because only grid.js used it
//anyways.
function visualizeJsonWithD3(jsonData) {
  const svg = createSvgCanvas();

  const gridSpacing = 50; //ALERT: currently declared twice, once here in visualizer.js and once in grid.js to avoid a global variable

  initializeNodeCoordinates(jsonData, gridSpacing * 2); //initiales clipping nutz doppelt so breites gridSpacing

  drawEverything(svg, jsonData);

  handleAllContextMenus(svg, jsonData);

  handleAllInteractiveDrags(svg, jsonData, gridSpacing);

  handleCreateNewLink(svg, jsonData, gridSpacing);

  handleCreateNewNode(svg, jsonData, gridSpacing);

  updatePagJsonDisplay(jsonData);
}

//TODO: Knoten mit Label löschen können + zugehörige Kanten löschen
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
  svg.selectAll(".link").on("contextmenu", null); //hier maybe link-context-menu und node-context-menu? das ist ja deren id eig?

  svg.selectAll(".node").on("contextmenu", null);

  svg.selectAll(".node-label").on("contextmenu", null);

  linkContextMenu(svg, jsonData);
  console.log("Link context menu reinitialized.");

  nodeContextMenu(svg, jsonData);
  console.log("Node context menu reinitialized.");

  labelContextMenu(svg, jsonData);
  console.log("Label context menu reinitialized.");
}

//calls the functions that implement the leftclick for the three objects
function handleAllInteractiveDrags(svg, jsonData, gridSpacing) {
  svg.selectAll(".link").on(".drag", null);
  svg.selectAll(".node").on(".drag", null);
  linkInteractiveDrag(svg, jsonData, gridSpacing);
  nodeInteractiveDrag(svg, jsonData, gridSpacing);
  //labelInteractiveClick(svg, jsonData, gridSpacing); //man könnte lowkey nen drag&drop für labelOffsexX/Y einfügen
  //der wandert beim moven vom node dann ja immer einf mit dem nodePosition+offset mit, und wenn grid an wird clipping
  //genommen, eig easy.
}

//----------END: SETUP DRAWING FUNCTION, CONTEXTMENUS, LEFT-CLICKS --------------//

//-------------------------------------------------------------------//

//----------START: drawEverything() === DRAW LINKS + DRAW NODES + DRAW LABELS --------------//

//TODO: Aktuell werden kanten die zwischen den selben knoten sind bei Matrix->Json oder
//DOT->Json auf dem selben strich initialisiert, überlegnung wäre da ein kleines offset
//einzuführen damit man dies immer sieht, genauer überlegen wenn admg implementierung.

function drawLinks(svg, jsonData) {
  svg
    .selectAll(".link")
    .data(jsonData.links, (d) => d.linkId)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("id", (d) => `link-${d.linkId}`)
    .attr("stroke", (d) => d.linkColor)
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", (d) => (d.isDashed ? "4 2" : null))
    .attr("marker-end", (d) => {
      if (d.arrowhead) {
        const markerId = `marker-${d.linkId}-end`;
        setupArrowMarker(svg, markerId, d.arrowhead, d.linkColor, "auto");
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("marker-start", (d) => {
      if (d.arrowtail) {
        const markerId = `marker-${d.linkId}-start`;
        setupArrowMarker(
          svg,
          markerId,
          d.arrowtail,
          d.linkColor,
          "auto-start-reverse"
        );
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("d", (d) => calculateLinkPath(d));
}

function setupArrowMarker(svg, id, type, color, orient) {
  svg.select(`#${id}`).remove(); //alte arrowmarker löschen

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

  if (type === "normal") {
    marker.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
  } else if (type === "odot") {
    marker
      .append("circle")
      .attr("cx", 5)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", "white")
      .attr("stroke", color)
      .attr("stroke-width", 2);
  } else if (type === "tail") {
    marker
      .append("rect")
      .attr("x", 0)
      .attr("y", -5)
      .attr("width", 0)
      .attr("height", 0)
      .attr("fill", color);
  }
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
  console.log("Initializing link context menu...");
  setupContextMenu(
    svg,
    ".link",
    "link-context-menu",
    "data-link-id",
    (d) => d.linkId // Unique linkId
  );
  console.log(
    `Total links with context menu: ${svg.selectAll(".link").size()}`
  );
  setupLinksContextMenuFunctions(svg, jsonData);
  closeContextMenu("link-context-menu");
}

function nodeContextMenu(svg, jsonData) {
  console.log("Initializing node context menu...");
  setupContextMenu(
    svg,
    ".node",
    "node-context-menu",
    "data-node-id",
    (d) => d.nodeId // Unique nodeId
  );
  console.log(
    `Total nodes with context menu: ${svg.selectAll(".node").size()}`
  );
  setupNodesContextMenuFunctions(svg, jsonData);
  closeContextMenu("node-context-menu");
}

function labelContextMenu(svg, jsonData) {
  console.log("Initializing label context menu...");
  setupContextMenu(
    svg,
    ".node-label",
    "label-context-menu",
    "data-label-id",
    (d) => d.nodeId // Unique nodeId for label
  );
  console.log(
    `Total labels with context menu: ${svg.selectAll(".node-label").size()}`
  );
  setupLabelsContextMenuFunctions(svg, jsonData);
  closeContextMenu("label-context-menu");
}

//TODO: anderes wort für setup finden

//----------END: allContextMenus() === CONTEXTMENU ORGANIZATION--------------//

//-------------------------------------------------------------------//

//----------START: CONTEXTMENU GENERAL FUNCTIONS--------------//

//TODO: brauch ich menu.style.left und menu.sytle.top wirklich?
// prettier-ignore
function setupContextMenu(svg, objectType, contextMenuType, attributeID, calculation) {
  console.log(`Setting up context menu for ${objectType}...`);
  
  svg.selectAll(objectType).on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for ${objectType} with ID: ${calculation(d)}`);
    event.preventDefault();

    const menu = document.getElementById(contextMenuType);
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`; 
    menu.style.top = `${event.pageY}px`;

    menu.setAttribute(attributeID, calculation(d));
  });

  console.log(`Context menu event handlers set for ${svg.selectAll(objectType).size()} ${objectType}(s).`);
}

function closeContextMenu(contextMenuType) {
  console.log(`Setting up close context menu for ${contextMenuType}...`);

  document.addEventListener("click", (event) => {
    const menu = document.getElementById(contextMenuType);
    if (!menu.contains(event.target)) {
      menu.style.display = "none";
      console.log(`${contextMenuType} hidden.`);
    }
  });
}

//----------END: CONTEXTMENU GENERAL FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//TODO: refactor redrawing of arrowhead/arrowtail...
function setupLinksContextMenuFunctions(svg, jsonData) {
  console.log("Link Contextmenu called");

  function handleArrowheadClick(arrowheadType) {
    const linkMenu = document.getElementById("link-context-menu");
    const linkId = linkMenu.getAttribute("data-link-id");
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

    if (selectedLink) {
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

      updatePagJsonDisplay(jsonData);
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

      updatePagJsonDisplay(jsonData);
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
      updatePagJsonDisplay(jsonData);
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
        updatePagJsonDisplay(jsonData);
      } else if (selectedLink && selectedLink.isDashed) {
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

  setupLinkColorPalette(svg, jsonData);
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

function setupLinkColorPalette(svg, jsonData) {
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
        changeLinkColor(linkId, color, jsonData, svg);
      }
    });

    linkColorPalette.appendChild(colorSwatch);
  });
}

function changeLinkColor(linkId, color, jsonData, svg) {
  const link = jsonData.links.find((l) => l.linkId === linkId);
  if (link) {
    // Update JSON data
    link.linkColor = color;

    // Update the link's stroke color
    const selectedLink = d3.select(`#link-${linkId}`);
    selectedLink.attr("stroke", color);

    // Update arrow markers if applicable
    if (link.arrowhead) {
      const markerId = `marker-${linkId}-end`;
      setupArrowMarker(svg, markerId, link.arrowhead, color, "auto");
      selectedLink.attr("marker-end", `url(#${markerId})`);
    }
    if (link.arrowtail) {
      const markerId = `marker-${linkId}-start`;
      setupArrowMarker(
        svg,
        markerId,
        link.arrowtail,
        color,
        "auto-start-reverse"
      );
      selectedLink.attr("marker-start", `url(#${markerId})`);
    }

    // Synchronize with JSON display
    updatePagJsonDisplay(jsonData);
  }
}

//----------END: linkContextMenu === CONTEXTMENU LINKS UNIQUE FUNCTIONS--------------//

//-------------------------------------------------------------------//

//----------START: nodeContextMenu === CONTEXTMENU NODES UNIQUE FUNCTIONS--------------//

//TODO: Adapt labelcolor, add labelcolor maybe, and change to black or white, according to the brightness of the color
//automatically
function setupNodesContextMenuFunctions(svg, jsonData) {
  console.log("Node Contextmenu called");

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

  setupNodeColorPalette(svg, jsonData);
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

function setupNodeColorPalette(svg, jsonData) {
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

        updatePagJsonDisplay(jsonData);
      }
    });

    nodeColorPalette.appendChild(colorSwatch);
  });
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
        if (!svg.selectAll(".grid-line").empty()) {
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
        if (!svg.selectAll(".grid-line").empty()) {
          //checks if grid is activated
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
function handleCreateNewLink(svg, jsonData, gridSpacing) {
  console.log("handleCreateNewLink called");
  let firstNode = null;

  svg.selectAll(".node").on("click", null);

  svg.selectAll(".node").on("click", function (event, d) {
    if (!firstNode) {
      firstNode = d;
      console.log(`First node selected: `, firstNode);
    } else if (d.nodeId !== firstNode.nodeId) {
      const secondNode = d;
      console.log(`Second node selected: `, secondNode);

      const newLink = {
        linkId: uuid.v4(),
        linkColor: "black",
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

      drawNewLink(svg, newLink);

      linkInteractiveDrag(svg, jsonData, gridSpacing);

      updatePagJsonDisplay(jsonData);
      firstNode = null;
    } else {
      console.log("Click detected on the same node. Resetting firstNode.");
      firstNode = null;
    }
  });
}

//TODO 1: Hinzufügen das ich meine knoten auswahl auch abbrechen kann, das ganze visuell darstellen.
//-> Fehlt noch, also node färben wenn ausgewählt

//TODO 2: Jetzt die Knoten nochmal neu zeichnen, so das sie durch eine formel passen gekürzt werden,
//damit das mit den arrowmarkern nicht immer so krampfhaft aussieht, frage ist nur, geht mir mein
//clipping und so dann kaputt oder sieht das weiterhin schön aus weil ich die verkürzte kantenform
//irgendwie basierend auf den mittelpunkten der referenzierten knoten zeichnen kann?
//-> Fehlt noch, stattdessen aber kanten einf initial kürzer machen, dann spar ich mir neuzeichenn

//TODO 4: Labels über knotextmenu namen verändern können?

//TODO 6: Knoten löschen können, wenn daran links hängen diese mit löschen, daher delete link, nicht nur
//im kontextmenü unterbringen sondern den wichtigsten teil in aufrufbare funktion versetzen.
//-> bei deletenode muss ich laufende processe wie "einen node ausgewählt" und dann lösche ich diesen knoten
//und dann drücke ich auf den zweiten und will eine kante zeichnen, dann würde mir das um die ohren fliegen
//das iwie absichern.

//The helper function needs to get helper functions, gotta refactor that shit
//idk if calling the "linkInteractiveDrag" function is unstable beeing called every time a edge is created

function drawNewLink(svg, link) {
  console.log("drawNewLink called for link:", link);

  const linkSelection = svg
    .append("path")
    .datum(link)
    .attr("class", "link")
    .attr("id", `link-${link.linkId}`)
    .attr("stroke", (d) => d.linkColor)
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .each(function (d) {
      if (d.isDashed) {
        d3.select(this).attr("stroke-dasharray", "4 2");
      }
    })
    .attr("marker-end", (d) => {
      if (d.arrowhead) {
        const markerId = `marker-${d.linkId}-end`;
        setupArrowMarker(svg, markerId, d.arrowhead, d.linkColor, "auto");
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("marker-start", (d) => {
      if (d.arrowtail) {
        const markerId = `marker-${d.linkId}-start`;
        setupArrowMarker(
          svg,
          markerId,
          d.arrowtail,
          d.linkColor,
          "auto-start-reverse"
        );
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("d", calculateLinkPath(link));

  console.log("New link added to SVG:", link);

  linkSelection.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for link with ID: ${d.linkId}`);
    event.preventDefault();

    const menu = document.getElementById("link-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    menu.setAttribute("data-link-id", d.linkId);
  });

  console.log(`Context menu set up for new link: ${link.linkId}`);
}

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

//TODO 2.1: Beim zeichnen von neuen kanten brauche ich ein offset, falls schon n+1 kante vorhanden ist
//zwischen den beiden knoten

//TODO 3: deleteNode in contextmenu hinzufügen
//TODO 3: Kantenlänge anpassen, damit neue kanten nicht immer so turbo lang drüber sind
//TODO 4: Label/Node namen ändern können
//TODO 5: Knotenradius ändern könnnen (dynamisch mit kantenlänge und labelOffset machen)
//TODO 5: ADMG support
//TODO 6: Alles auf canvas moven können
//TODO 7: Pdf export an graphen größe anpassen

//-> TODO 0: Aktuell erstmal contextmenu für color change von links adden und gucken wie ich die arrowmarker
//von den spezifischen links colorchange, bitte nicht noch eine id... Dann um das labels-nodes problem kümmern
//so wie ich das seh muss ich dann ja das ganze links/arrowmarker ding anders mach, weil wenn ich revisualisiere
//gehört ja kein arrowmarker zu einem link so direkt oder wie.

//-> link colorChange ContextMenu, nodes löschen können

//add a field to the jsonData with nodes, links and maybe type: pag or admg? to determine into what matrice to
//turn it into again?

//TODO 0.1: Beim initialen laden der seite jsonData textfield mit nem leeren jsonData implementieren, damit
//wenn man auf einlesen Visualisieren klickt man direkt mit dem zeichnen anfangen kann, oder einmal direkt das aufrufen am
//anfang damit man sofort schon einen canvas hat, auch wenn mit einem noch leeren element.
//-----------------------------------------------------------------------------
function handleCreateNewNode(svg, jsonData, gridSpacing) {
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

          handleAllInteractiveDrags(svg, jsonData, gridSpacing);

          handleCreateNewLink(svg, jsonData, gridSpacing);

          updatePagJsonDisplay(jsonData);
          console.log("New node added:", newNode);
        }
      }
    }
  });
}

function drawNewNode(svg, node) {
  const newNode = svg
    .append("circle")
    .datum(node)
    .attr("id", `node-${node.nodeId}`)
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", node.nodeColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("cx", node.x)
    .attr("cy", node.y);

  console.log("New node added to SVG with data:", node);

  newNode.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for node with ID: ${d.nodeId}`);
    event.preventDefault();

    const menu = document.getElementById("node-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    menu.setAttribute("data-node-id", d.nodeId);
  });
}

function drawNewLabel(svg, node) {
  const newLabel = svg
    .append("text")
    .datum(node)
    .attr("id", `label-${node.nodeId}`)
    .attr("class", "node-label")
    .attr("x", node.x + node.labelOffsetX)
    .attr("y", node.y + node.labelOffsetY)
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .text(node.name)
    .attr("fill", "black")
    .style("font-size", "15px")
    .style("pointer-events", "all")
    .style("user-select", "none");

  console.log("New label added to SVG with data:", node);

  newLabel.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for label with ID: ${d.nodeId}`);
    event.preventDefault();

    const menu = document.getElementById("label-context-menu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    menu.setAttribute("data-label-id", d.nodeId);
  });
}

//-------------------------------------------------------------------//

//----------START: UPDATE JSONDATA TEXTAREA--------------//

function updatePagJsonDisplay(jsonData) {
  const jsonDisplay = document.getElementById("pagJsonDisplay");
  jsonDisplay.value = JSON.stringify(jsonData, null, 2);
}

//----------END: UPDATE JSONDATA TEXTAREA--------------//
