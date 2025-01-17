function setupContextMenu(
  svg,
  objectType,
  contextMenuType,
  attributeID,
  calculation
) {
  const selection = svg.selectAll(objectType);

  //check if the contextmenu handler already exists
  //link context menu ist hier immer undefined
  //probably deletable
  selection.each(function () {
    const existingHandlers = d3.select(this).on("link-context-menu");
    if (existingHandlers) {
      console.warn(`Context menu handler already exists for ${objectType}.`);
    }
  });

  //remove any existing contextmenu handlers
  //probably no function
  selection.on("contextmenu", null);

  // Attach the new contextmenu handler
  selection.on("contextmenu", function (event, d) {
    event.preventDefault();

    const menu = document.getElementById(contextMenuType);
    //TODO: okay now i gotta make sure its visually closed when i press on another one so they dont overlap
    menu.style.display = "block";
    menu.style.left = `0px`;
    menu.style.top = `10%`;
    //menu.style.left = `${event.pageX}px`;
    //menu.style.top = `${event.pageY}px`;

    menu.setAttribute(attributeID, calculation(d));
  });
}
