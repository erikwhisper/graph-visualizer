//TODO: ist abhängig von "calculateLinkPath", das ist aber bei mehrern dingen
// in verwendung. alternativ in höheren order util packen und immer wieder aufrufen halt

function drawLinks(svg) {
  const linkSelection = svg
    .selectAll(".link")
    .data(jsonData.links, (d) => d.linkId)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("id", (d) => `link-${d.linkId}`)
    .attr("stroke", (d) => d.linkColor)
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("stroke-dasharray", (d) => (d.isDashed ? "4 2" : null))
    .attr("marker-end", (d) => {
      if (d.arrowhead) {
        const markerId = `marker-${d.linkId}-end`;
        setupArrowMarker(svg, markerId, d.arrowhead, d.linkColor, "auto");
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("marker-start", (d) => {
      if (d.arrowtail) {
        const markerId = `marker-${d.linkId}-start`;
        setupArrowMarker(
          svg,
          markerId,
          d.arrowtail,
          d.linkColor,
          "auto-start-reverse"
        );
        return `url(#${markerId})`;
      }
      return null;
    })
    .attr("d", (d) => calculateLinkPath(d));

  linkSelection.on("contextmenu", function (event, d) {
    console.log(`Context menu triggered for link with ID: ${d.linkId}`);
    event.preventDefault();

    const menu = document.getElementById("link-context-menu");
    menu.style.display = "block";
    menu.style.left = `0px`;
    menu.style.top = `10%`;

    menu.setAttribute("data-link-id", d.linkId);
  });
}
