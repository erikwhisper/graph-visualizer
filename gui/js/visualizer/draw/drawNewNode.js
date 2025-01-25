//TODO: ganz ehrlich, vielleicht erstell ich mir noch eien labelId anstatt die von node zu nutzen
//und verbinde die beiden dann einfach miteinander, das würde das ändern des namens vielleicht auch vereifachen
//oder auch das mapping aufeinander was beim verschieben von labels ja iwie nicht funktioniert.

function drawNewNode(svg, node) {
  const newNode = svg
    .append("circle")
    .datum(node)
    .attr("id", `node-${node.nodeId}`)
    .attr("class", "node")
    .attr("r", 15)
    .attr("fill", node.nodeColor)
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("cx", node.x)
    .attr("cy", node.y);

  console.log("New node added to SVG with data:", node);

  newNode.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for node with ID: ${d.nodeId}`);
    event.preventDefault();

    const menu = document.getElementById("node-context-menu");
    menu.style.display = "block";
    menu.style.left = `0px`;
    menu.style.top = `10%`;

    menu.setAttribute("data-node-id", d.nodeId);
  });
}
