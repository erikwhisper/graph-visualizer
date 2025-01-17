function initializeNodeCoordinates(gridSpacing) {
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

  //SOWAS BRAUCH ICH DANN DOCH LOWKEY ARE FÜR NODEID und NEUE LINKID,
  //dann passt das doch, aber ich müsste dann ja node.nodeid und node.labelid haben?
  jsonData.links.forEach((link) => {
    link.source = jsonData.nodes.find(
      (node) => node.nodeId === link.source.nodeId
    );
    link.target = jsonData.nodes.find(
      (node) => node.nodeId === link.target.nodeId
    );
  });
}
