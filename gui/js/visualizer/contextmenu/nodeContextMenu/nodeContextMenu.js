function nodeContextMenu(svg) {
  //console.log("Initializing node context menu...");
  setupContextMenu(
    svg,
    ".node",
    "node-context-menu",
    "data-node-id",
    (d) => d.nodeId // Unique nodeId
  );
  setupNodeContextMenuInteractions();
  closeContextMenu("node-context-menu");
}

function setupNodeContextMenuInteractions() {
  document.getElementById("delete-node").addEventListener("click", deleteNode);
  setupNodeColorPalette();
}

//Controller: FRONTEND und BACKEND
function deleteNode() {
  const nodeMenu = document.getElementById("node-context-menu");
  const nodeId = nodeMenu.getAttribute("data-node-id");

  if (nodeId) {
    const linksToDelete = detectlinkToDelete(nodeId);
    deleteNodeJson(nodeId, linksToDelete);
    deleteNodeVisualization(nodeId, linksToDelete);
    updatePagJsonDisplay();
    nodeMenu.style.display = "none";
  }
}

//BACKEND
function detectlinkToDelete(nodeId) {
  return jsonData.links.filter(
    (link) => link.source.nodeId === nodeId || link.target.nodeId === nodeId
  );
}

//BACKEND
function deleteNodeJson(nodeId, linksToDelete) {
  linksToDelete.forEach((link) => deleteLinkJson(link.linkId));

  jsonData.nodes = jsonData.nodes.filter((node) => node.nodeId !== nodeId);
}

//FRONTEND
function deleteNodeVisualization(nodeId, linksToDelete) {
  linksToDelete.forEach((link) => deleteLinkVisualization(link.linkId));

  d3.select(`#label-${nodeId}`).remove();
  d3.select(`#node-${nodeId}`).remove();
}

//----------------------------------------------------------------------------------//

//FRONTEND und BACKEND
//refactor mit setupLinkColorPallate, zu setupColorPallate
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

      if (nodeId) {
        changeNodeColorJson(color, nodeId);
        changeNodeColorVisualization(nodeId);
        updatePagJsonDisplay();
      }
    });

    nodeColorPalette.appendChild(colorSwatch);
  });
}

//BACKEND
function changeNodeColorJson(color, nodeId) {
  const selectedNode = jsonData.nodes.find((node) => node.nodeId === nodeId);
  selectedNode.nodeColor = color;
}

//FRONTEND
function changeNodeColorVisualization(nodeId) {
  const selectedNode = jsonData.nodes.find((node) => node.nodeId === nodeId);
  const svgNode = d3.select(`#node-${selectedNode.nodeId}`);
  svgNode.attr("fill", selectedNode.nodeColor).style("fill", selectedNode.nodeColor);
}
