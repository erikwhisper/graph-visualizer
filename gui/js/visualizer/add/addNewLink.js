//TODO 2: Jetzt die Knoten nochmal neu zeichnen, so das sie durch eine formel passen gekürzt werden,
//damit das mit den arrowmarkern nicht immer so krampfhaft aussieht, frage ist nur, geht mir mein
//clipping und so dann kaputt oder sieht das weiterhin schön aus weil ich die verkürzte kantenform
//irgendwie basierend auf den mittelpunkten der referenzierten knoten zeichnen kann?
//-> Fehlt noch, stattdessen aber kanten einf initial kürzer machen, dann spar ich mir neuzeichenn

function addNewLink(svg, jsonData, gridSpacing) {
  console.log("addNewLink called");
  let firstNode = null;

  svg.selectAll(".node").on("click", null);

  svg.selectAll(".node").on("click", function (event, d) {
    if (!firstNode) {
      firstNode = d;
      d3.select(`#node-${firstNode.nodeId}`).attr("fill", "green");
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

      //setze firstNode wieder auf standartfarbe zurück
      d3.select(`#node-${firstNode.nodeId}`).attr("fill", firstNode.nodeColor);
      firstNode = null;
    } else {
      //setze firstNode wieder auf standartfarbe zurück
      d3.select(`#node-${firstNode.nodeId}`).attr("fill", firstNode.nodeColor);
      console.log("Click detected on the same node. Resetting firstNode.");
      firstNode = null;
    }
  });
}
