//TODO: ganz ehrlich, vielleicht erstell ich mir noch eien labelId anstatt die von node zu nutzen
//und verbinde die beiden dann einfach miteinander, das würde das ändern des namens vielleicht auch vereifachen
//oder auch das mapping aufeinander was beim verschieben von labels ja iwie nicht funktioniert.

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