//TODO: Niedrige kohäsion in draw, da noch in anderen ordnern verwendet wird.
function setupArrowMarker(svg, id, type, color, orient) {
    svg.select(`#${id}`).remove(); //alte arrowmarker löschen
  
    const marker = svg
      .append("defs")
      .append("marker")
      .attr("id", id)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 21.5)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", orient);
  
    if (type === "normal") {
      marker.append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
    } else if (type === "odot") {
      marker
        .append("circle")
        .attr("cx", 5)
        .attr("cy", 0)
        .attr("r", 4)
        .attr("fill", "white")
        .attr("stroke", color)
        .attr("stroke-width", 2);
    } else if (type === "tail") {
      marker
        .append("rect")
        .attr("x", 0)
        .attr("y", -5)
        .attr("width", 0)
        .attr("height", 0)
        .attr("fill", color);
    }
  }
  