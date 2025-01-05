/***********************************************************/
/******************START: Grid Functions********************/
/***********************************************************/
//Eventlistener for grid clipping
document
  .getElementById("gridClippingToggle")
  .addEventListener("change", (event) => {
    isGridClippingEnabled = event.target.checked;

    if (currentSvg) {
      if (isGridClippingEnabled) {
        drawGrid(currentSvg, currentGridSpacing);
      } else {
        currentSvg.selectAll(".grid-line").remove();
      }
    }
  });

//TODO: maybe sind solche sachen bissl oberkill
//.attr("stroke-width", x % gridSpacing === 0 ? 1 : 0.5);
//geht bestimmt auch für normale menschen lesbar in 2 lines
function drawGrid(svg, gridSpacing) {
  //clear grid, if present
  svg.selectAll(".grid-line").remove();

  if (isGridClippingEnabled) {
    const width = parseInt(svg.attr("width"), 10);
    const height = parseInt(svg.attr("height"), 10);

    const refinedSpacing = gridSpacing / 2;

    const gridGroup = svg.append("g").attr("class", "grid");

    //draw lines
    for (let x = 0; x < width; x += refinedSpacing) {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", x)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        //refactor this to make it easier
        .attr("stroke-width", x % gridSpacing === 0 ? 1 : 0.5);
    }
    for (let y = 0; y < height; y += refinedSpacing) {
      gridGroup
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", width)
        .attr("y2", y)
        .attr("stroke", "#ccc")
        //refactor this to make it easier
        .attr("stroke-width", y % gridSpacing === 0 ? 1 : 0.5);
    }
    //eventhough grid is drawn last, put it at the bottom layer
    gridGroup.lower();
  }
}
/***********************************************************/
/*******************END: Grid Functions*********************/
/***********************************************************/