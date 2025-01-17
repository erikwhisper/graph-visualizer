function linkInteractiveDrag(svg, gridSpacing) {
    console.log("linkInteractiveDrag called");
    svg.selectAll(".link").call(
      d3
        .drag()
        .on("drag", function (event, d) {
          d.isCurved = true;
          d.linkControlX = event.x;
          d.linkControlY = event.y;
          console.log("drag!");
          const link = jsonData.links.find((link) => link.linkId === d.linkId);
          if (link) {
            link.linkControlX = d.linkControlX;
            link.linkControlY = d.linkControlY;
          }
  
          d3.select(this).attr("d", calculateLinkPath(d));
          updatePagJsonDisplay();
        })
        .on("end", function (event, d) {
          if (!svg.selectAll(".grid-line").empty()) {
            const refinedSpacing = gridSpacing / 2;
            d.linkControlX =
              Math.round(d.linkControlX / refinedSpacing) * refinedSpacing;
            d.linkControlY =
              Math.round(d.linkControlY / refinedSpacing) * refinedSpacing;
          }
  
          const link = jsonData.links.find((link) => link.linkId === d.linkId);
          if (link) {
            link.linkControlX = d.linkControlX;
            link.linkControlY = d.linkControlY;
          }
  
          d3.select(this).attr("d", calculateLinkPath(d));
          updatePagJsonDisplay();
        })
    );
  }
  