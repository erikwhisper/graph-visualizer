function labelContextMenu(svg) {
    //console.log("Initializing label context menu...");
    setupContextMenu(
      svg,
      ".node-label",
      "label-context-menu",
      "data-label-id",
      (d) => d.nodeId // Unique nodeId for label
    );
    implementLabelsContextMenu();
    closeContextMenu("label-context-menu");
  }

  function implementLabelsContextMenu() {
    document.getElementById("menu-center").addEventListener("click", () => {
      const labelMenu = document.getElementById("label-context-menu");
      const labelId = labelMenu.getAttribute("data-label-id");
      if (labelId) {
        //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
        moveCenter(labelId);
        if (labelMenu) {
          //labelMenu.style.display = "none";
        }
      }
      updatePagJsonDisplay();
    });
  
    document.getElementById("menu-above").addEventListener("click", () => {
      const labelMenu = document.getElementById("label-context-menu");
      const labelId = labelMenu.getAttribute("data-label-id");
      if (labelId) {
        //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
        moveAbove(labelId);
      }
      updatePagJsonDisplay();
    });
  
    document.getElementById("menu-below").addEventListener("click", () => {
      const labelMenu = document.getElementById("label-context-menu");
      const labelId = labelMenu.getAttribute("data-label-id");
      if (labelId) {
        //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
        moveBelow(labelId);
      }
      updatePagJsonDisplay();
    });
  
    document.getElementById("menu-left").addEventListener("click", () => {
      const labelMenu = document.getElementById("label-context-menu");
      const labelId = labelMenu.getAttribute("data-label-id");
      if (labelId) {
        //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
        moveLeft(labelId);
      }
      updatePagJsonDisplay();
    });
  
    document.getElementById("menu-right").addEventListener("click", () => {
      const labelMenu = document.getElementById("label-context-menu");
      const labelId = labelMenu.getAttribute("data-label-id");
      if (labelId) {
        //TODO: hier nodeMenu und link Menu = "none" machen, damit nur immer eins offen ist!
        moveRight(labelId);
      }
      updatePagJsonDisplay();
    });
  }

function moveCenter(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  node.labelOffsetX = 0; //später radius hier + iwas
  node.labelOffsetY = 0; //später radius hier + iwas
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
  selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
}

function moveRight(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  node.labelOffsetX = 25; //später radius hier + iwas

  //node.labelOffsetY = 0; //später radius hier + iwas
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
}

function moveLeft(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  node.labelOffsetX = -25; //später radius hier + iwas

  //node.labelOffsetY = 0; //später radius hier + iwas
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("x", (d) => d.x + node.labelOffsetX);
}

function moveBelow(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  //node.labelOffsetX = 0; //später radius hier + iwas
  node.labelOffsetY = 25; //später radius hier + iwas
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
}

function moveAbove(labelId) {
  const node = jsonData.nodes.find((n) => n.nodeId === labelId);
  //node.labelOffsetX = 0; //später radius hier + iwas
  node.labelOffsetY = -25; //später radius hier + iwas
  const selectedLabel = d3.select(`#label-${node.nodeId}`);

  selectedLabel.attr("y", (d) => d.y + node.labelOffsetY);
}
  