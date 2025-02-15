//TODO: hab das grid jetzt genauso fein gemacht wie für links
function nodeInteractiveDrag(svg, gridSpacing) {
  console.log("nodeInteractiveDrag called");
  svg.selectAll(".node").call(
    d3
      .drag()
      .on("drag", (event, selectedNode) => {
        updateCurrentNodePosition(selectedNode.nodeId, event.x, event.y);
        updateNodePositionVisualization();
        updatePagJsonDisplay();
      })
      .on("end", (event, selectedNode) => {
        const isGridAvtive = !svg.selectAll(".grid-line").empty(); 
        updateFinalNodePosition(isGridAvtive, gridSpacing, selectedNode.nodeId);
        updateNodePositionVisualization();
        updatePagJsonDisplay();
      })
  );
}

//BACKEND
function updateCurrentNodePosition(nodeId, newX, newY) {
  const selectedNode = jsonData.nodes.find((node) => node.nodeId === nodeId);
  selectedNode.x = newX;
  selectedNode.y = newY;
}

//BACKEND
function updateFinalNodePosition(isGridAvtive, gridSpacing, nodeId) {
  const selectedNode = jsonData.nodes.find((node) => node.nodeId === nodeId);
  if (isGridAvtive) {
    const refinedSpacing = gridSpacing / 2;
    selectedNode.x = Math.round(selectedNode.x / refinedSpacing) * refinedSpacing;
    selectedNode.y = Math.round(selectedNode.y / refinedSpacing) * refinedSpacing;
  }
}

//FRONTEND
function updateNodePositionVisualization() {
  d3.selectAll(".node")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

  d3.selectAll(".node-label")
    .attr("x", (d) => d.x + d.labelOffsetX)
    .attr("y", (d) => d.y + d.labelOffsetY);

  d3.selectAll(".link").attr("d", (d) => calculateLinkPath(d));
}
