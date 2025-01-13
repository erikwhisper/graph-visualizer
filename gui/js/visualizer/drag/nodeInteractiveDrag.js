function nodeInteractiveDrag(svg, jsonData, gridSpacing) {
    console.log("nodeInteractiveDrag called");
    svg.selectAll(".node").call(
      d3
        .drag()
        .on("drag", (event, d) => {
          d.x = event.x;
          d.y = event.y;
          updatePositions();
          updatePagJsonDisplay(jsonData);
        })
        .on("end", (event, d) => {
          if (!svg.selectAll(".grid-line").empty()) {
            //checks if grid is activated
            d.x = Math.round(d.x / gridSpacing) * gridSpacing;
            d.y = Math.round(d.y / gridSpacing) * gridSpacing;
          }
          updatePositions();
          updatePagJsonDisplay(jsonData);
        })
    );
  }
  
  //updaed ALLE positionen, sehr unperformant
  function updatePositions() {
    //update node position
    d3.selectAll(".node")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);
  
    //update link position
    d3.selectAll(".link").attr("d", (d) => {
      const { x: x1, y: y1 } = d.source;
      const { x: x2, y: y2 } = d.target;
  
      if (!d.isCurved) {
        d.linkControlX = (x1 + x2) / 2;
        d.linkControlY = (y1 + y2) / 2;
      }
  
      return `M ${x1},${y1} Q ${d.linkControlX},${d.linkControlY} ${x2},${y2}`;
    });
  
    //update label position
    d3.selectAll(".node-label")
      .attr("x", (d) => d.x + d.labelOffsetX)
      .attr("y", (d) => d.y + d.labelOffsetY);
  }
  