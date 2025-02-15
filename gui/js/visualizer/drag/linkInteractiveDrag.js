//CONTROLLER: FRONTEND + BACKEND
function linkInteractiveDrag(svg, gridSpacing) {

  svg.selectAll(".link").call(
    d3
      .drag()
      .on("drag", function (event, selectedLink) {
        updateCurrentLinkPositionJson(selectedLink.linkId, event.x, event.y);
        updateLinkPositionVisualization(this, selectedLink.linkId);
        updatePagJsonDisplay();
      })
      .on("end", function (event, selectedLink) {
        const isGridAvtive = !svg.selectAll(".grid-line").empty(); 
        updateFinalLinkPositionJson(isGridAvtive, gridSpacing, selectedLink.linkId);
        updateLinkPositionVisualization(this, selectedLink.linkId);
        updatePagJsonDisplay();
      })
  );
}

//BACKEND
function updateCurrentLinkPositionJson(
  linkId,
  newLinkControlX,
  newLinkControlY
) {
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  selectedLink.isCurved = true;
  selectedLink.linkControlX = newLinkControlX;
  selectedLink.linkControlY = newLinkControlY;
}

//BACKEND
function updateFinalLinkPositionJson(isGridAvtive, gridSpacing, linkId) {
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  if (isGridAvtive) {
    const refinedSpacing = gridSpacing / 2;
    selectedLink.linkControlX =
      Math.round(selectedLink.linkControlX / refinedSpacing) * refinedSpacing;
    selectedLink.linkControlY =
      Math.round(selectedLink.linkControlY / refinedSpacing) * refinedSpacing;
  }

  const link = jsonData.links.find((link) => link.linkId === selectedLink.linkId);
  if (link) {
    link.linkControlX = selectedLink.linkControlX;
    link.linkControlY = selectedLink.linkControlY;
  }
}

//FRONTEND
function updateLinkPositionVisualization(linkElement, linkId) {
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  d3.select(linkElement).attr("d", calculateLinkPath(selectedLink));
}
