//TODO: hab das grid jetzt genauso fein gemacht wie für links
function nodeInteractiveDrag(svg, gridSpacing) {
  console.log("nodeInteractiveDrag called");
  svg.selectAll(".node").call(
    d3
      .drag()
      .on("drag", (event, selectedNode) => {
        updateCurrentNodePosition(selectedNode, event.x, event.y);
        updateNodePositionVisualization();
        updatePagJsonDisplay();
      })
      .on("end", (event, selctedNode) => {
        const isGridAvtive = !svg.selectAll(".grid-line").empty(); 
        updateFinalNodePosition(isGridAvtive, gridSpacing, selctedNode);
        updateNodePositionVisualization();
        updatePagJsonDisplay();
      })
  );
}

//BACKEND
function updateCurrentNodePosition(selectedNode, newX, newY) {
  selectedNode.x = newX;
  selectedNode.y = newY;
}

//BACKEND
function updateFinalNodePosition(isGridAvtive, gridSpacing, selctedNode) {
  if (isGridAvtive) {
    const refinedSpacing = gridSpacing / 2;
    selctedNode.x = Math.round(selctedNode.x / refinedSpacing) * refinedSpacing;
    selctedNode.y = Math.round(selctedNode.y / refinedSpacing) * refinedSpacing;
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
