//TODO: ganz ehrlich, vielleicht erstell ich mir noch eien labelId anstatt die von node zu nutzen
//und verbinde die beiden dann einfach miteinander, das würde das ändern des namens vielleicht auch vereifachen
//oder auch das mapping aufeinander was beim verschieben von labels ja iwie nicht funktioniert.

function drawLabels(svg, jsonData) {
    svg
      .selectAll(".node-label")
      .data(jsonData.nodes)
      .enter()
      .append("text")
      .attr("id", (d) => `label-${d.nodeId}`) //ist erreichbar über label + die nodeId
      .attr("class", "node-label")
      .attr("x", (d) => d.x + d.labelOffsetX) //idk if needed
      .attr("y", (d) => d.y + d.labelOffsetY) //idk if needed
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text((d) => d.name) //nutzt d.name als anzeige name
      .attr("fill", "black")
      .style("font-size", "15px")
      .style("pointer-events", "all")
      .style("user-select", "none");
  }