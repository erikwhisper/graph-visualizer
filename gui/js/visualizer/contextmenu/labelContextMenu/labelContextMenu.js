function labelContextMenu(svg) {
  //console.log("Initializing label context menu...");
  setupContextMenu(
    svg,
    ".node-label",
    "label-context-menu",
    "data-label-id",
    (d) => d.nodeId // Unique nodeId for label
  );
  setupLabelContextMenuInteractions();
  closeContextMenu("label-context-menu");
}

function setupLabelContextMenuInteractions() {
  document
    .getElementById("menu-center")
    .addEventListener("click", () => moveLabel(0, 0));
  document
    .getElementById("menu-above")
    .addEventListener("click", () => moveLabel(null, -25));
  document
    .getElementById("menu-below")
    .addEventListener("click", () => moveLabel(null, 25));
  document
    .getElementById("menu-left")
    .addEventListener("click", () => moveLabel(-25, null));
  document
    .getElementById("menu-right")
    .addEventListener("click", () => moveLabel(25, null));
}

// FRONTEND & BACKEND
function moveLabel(offsetX, offsetY) {
  const labelMenu = document.getElementById("label-context-menu");
  const labelId = labelMenu.getAttribute("data-label-id");

  if (labelId) {
    moveLabelJson(labelId, offsetX, offsetY);
    moveLabelVisualization(labelId);
    updatePagJsonDisplay();
  }
}

// BACKEND (setzt die offset-Werte eines Knotens auf zwei neue Werte)
function moveLabelJson(labelId, offsetX, offsetY) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  const nodeNameLength = node.name.length * 3;
  if (node) {
    if( offsetX == -25 ){
      node.labelOffsetX = offsetX !== null ? offsetX - nodeNameLength : node.labelOffsetX;
      node.labelOffsetY = offsetY !== null ? offsetY - nodeNameLength : node.labelOffsetY;
    }
    else if( offsetX == 25 ){
      node.labelOffsetX = offsetX !== null ? offsetX + nodeNameLength : node.labelOffsetX;
      node.labelOffsetY = offsetY !== null ? offsetY + nodeNameLength : node.labelOffsetY;
    }
    else{
    node.labelOffsetX = offsetX !== null ? offsetX : node.labelOffsetX;
    node.labelOffsetY = offsetY !== null ? offsetY : node.labelOffsetY;
    }
  }
}

// FRONTEND (visualisiert das label basierend auf der knoten und offset position)
function moveLabelVisualization(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
  selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
}
