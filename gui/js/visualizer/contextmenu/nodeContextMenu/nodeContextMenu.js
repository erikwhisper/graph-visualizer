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

      //const node = jsonData.nodes.find((n) => n.nodeId === nodeId);
      if (nodeId) {
        changeNodeColor(color, nodeId);
      }
    });

    nodeColorPalette.appendChild(colorSwatch);
  });
}

function changeNodeColor(color, nodeId) {
  const selectedNode = jsonData.nodes.find((node) => node.nodeId === nodeId);
  if (selectedNode) {
  selectedNode.nodeColor = color;
  const svgNode = d3.select(`#node-${nodeId}`);
  svgNode.attr("fill", color).style("fill", color);

  updatePagJsonDisplay();
  }
}
