//TODO: ganz ehrlich, vielleicht erstell ich mir noch eien labelId anstatt die von node zu nutzen
//und verbinde die beiden dann einfach miteinander, das würde das ändern des namens vielleicht auch vereifachen
//oder auch das mapping aufeinander was beim verschieben von labels ja iwie nicht funktioniert.

function drawNewLabel(svg, node) {
    const newLabel = svg
      .append("text")
      .datum(node)
      .attr("id", `label-${node.nodeId}`)
      .attr("class", "node-label")
      .attr("x", node.x + node.labelOffsetX)
      .attr("y", node.y + node.labelOffsetY)
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(node.name)
      .attr("fill", "black")
      .style("font-size", "15px")
      .style("pointer-events", "all")
      .style("user-select", "none");
  
    console.log("New label added to SVG with data:", node);
  
    newLabel.on("contextmenu", function (event, d) {
      console.log(`Context menu triggered for label with ID: ${d.nodeId}`);
      event.preventDefault();
  
      const menu = document.getElementById("label-context-menu");
      menu.style.display = "block";
      menu.style.left = `${event.pageX}px`;
      menu.style.top = `${event.pageY}px`;
  
      menu.setAttribute("data-label-id", d.nodeId);
    });
  }
  