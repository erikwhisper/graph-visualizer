//CONTROLLER: FRONTEND + BACKEND
function linkInteractiveDrag(svg, gridSpacing) {

  svg.selectAll(".link").call(
    d3
      .drag()
      .on("drag", function (event, selectedLink) {
        updateCurrentLinkPositionJson(selectedLink, event.x, event.y);
        updateLinkPositionVisualization(this, selectedLink);
        updatePagJsonDisplay();
      })
      .on("end", function (event, selectedLink) {
        const isGridAvtive = !svg.selectAll(".grid-line").empty(); 
        updateFinalLinkPositionJson(isGridAvtive, gridSpacing, selectedLink);
        updateLinkPositionVisualization(this, selectedLink);
        updatePagJsonDisplay();
      })
  );
}

//BACKEND
function updateCurrentLinkPositionJson(
  selectedLink,
  newLinkControlX,
  newLinkControlY
) {
  selectedLink.isCurved = true;
  selectedLink.linkControlX = newLinkControlX;
  selectedLink.linkControlY = newLinkControlY;
}

//BACKEND
function updateFinalLinkPositionJson(isGridAvtive, gridSpacing, selectedLink) {
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
function updateLinkPositionVisualization(linkElement, selectedLink) {
  d3.select(linkElement).attr("d", calculateLinkPath(selectedLink));
}
