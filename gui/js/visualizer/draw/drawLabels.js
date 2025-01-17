//TODO: ganz ehrlich, vielleicht erstell ich mir noch eien labelId anstatt die von node zu nutzen
//und verbinde die beiden dann einfach miteinander, das würde das ändern des namens vielleicht auch vereifachen
//oder auch das mapping aufeinander was beim verschieben von labels ja iwie nicht funktioniert.

function drawLabels(svg) {
  const newLabel = svg
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

  newLabel.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for label with ID: ${d.nodeId}`);
    event.preventDefault();

    const menu = document.getElementById("label-context-menu");
    menu.style.display = "block";
    menu.style.left = `0px`;
    menu.style.top = `10%`;

    menu.setAttribute("data-label-id", d.nodeId);
  });
}
