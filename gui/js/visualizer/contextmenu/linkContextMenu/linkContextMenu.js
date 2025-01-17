function linkContextMenu(svg) {
    //console.log("Initializing link context menu...");
    //wenn ein kontextmenu geöffnet wird sollen die anderen beiden falls offen geschlossen werden.
    setupContextMenu(
      svg,
      ".link",
      "link-context-menu",
      "data-link-id",
      (d) => d.linkId // Unique linkId
    );
    implementLinksContextMenu();
    closeContextMenu("link-context-menu");
  }

  function implementLinksContextMenu() {
    console.log("Link Contextmenu called");
  
    function handleArrowheadClick(arrowheadType) {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  
      if (selectedLink) {
        console.log(
          "hier weiß er was der arrowhead ist: " + selectedLink.arrowhead
        );
        selectedLink.arrowhead = arrowheadType;
  
        const markerId = `marker-${selectedLink.linkId}-end`;
        setupArrowMarker(
          d3.select("svg"),
          markerId,
          arrowheadType,
          selectedLink.linkColor,
          "auto"
        );
  
        d3.select(`#link-${selectedLink.linkId}`).attr(
          "marker-end",
          `url(#${markerId})`
        );
  
        updatePagJsonDisplay();
        console.log(`Arrowhead updated to '${arrowheadType}' for link ${linkId}`);
      }
    }
  
    document
      .getElementById("arrowhead-normal")
      .addEventListener("click", () => handleArrowheadClick("normal"));
    document
      .getElementById("arrowhead-odot")
      .addEventListener("click", () => handleArrowheadClick("odot"));
    document
      .getElementById("arrowhead-tail")
      .addEventListener("click", () => handleArrowheadClick("tail"));
  
    function handleArrowtailClick(arrowtailType) {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  
      if (selectedLink) {
        selectedLink.arrowtail = arrowtailType;
  
        const markerId = `marker-${selectedLink.linkId}-start`;
        setupArrowMarker(
          d3.select("svg"),
          markerId,
          arrowtailType,
          selectedLink.linkColor,
          "auto-start-reverse"
        );
  
        d3.select(`#link-${selectedLink.linkId}`).attr(
          "marker-start",
          `url(#${markerId})`
        );
  
        updatePagJsonDisplay();
        console.log(`Arrowtail updated to '${arrowtailType}' for link ${linkId}`);
      }
    }
  
    document
      .getElementById("arrowtail-normal")
      .addEventListener("click", () => handleArrowtailClick("normal"));
    document
      .getElementById("arrowtail-odot")
      .addEventListener("click", () => handleArrowtailClick("odot"));
    document
      .getElementById("arrowtail-tail")
      .addEventListener("click", () => handleArrowtailClick("tail"));
  
    //TODO: Kann man anstatt mit selected Link wie bei delete-link nicht direkt mit linkId arbeiten?
    document.getElementById("straighten-link").addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
      if (selectedLink) {
        resetLinkCurve(selectedLink);
        updatePagJsonDisplay();
      }
    });
  
    document
      .getElementById("toggle-dashed-link")
      .addEventListener("click", () => {
        const linkMenu = document.getElementById("link-context-menu");
        const linkId = linkMenu.getAttribute("data-link-id");
        const selectedLink = jsonData.links.find(
          (link) => link.linkId === linkId
        );
        if (selectedLink && !selectedLink.isDashed) {
          setDashed(selectedLink);
          updatePagJsonDisplay();
        } else if (selectedLink && selectedLink.isDashed) {
          unsetDashed(selectedLink);
          updatePagJsonDisplay();
        }
      });
  
    //wird halt so oft ausgeführt wie oft "visualize" button gedrückt wurde... was macht man dagegen
    document.getElementById("delete-link").addEventListener("click", () => {
      const linkMenu = document.getElementById("link-context-menu");
      const linkId = linkMenu.getAttribute("data-link-id");
      if (linkId) {
        deleteLink(linkId);
        if (linkMenu) {
          linkMenu.style.display = "none";
        }
      }
    });
  
    setupLinkColorPalette();
  }
  
  function resetLinkCurve(selectedLink) {
    const sourceNode = selectedLink.source;
    const targetNode = selectedLink.target;
  
    selectedLink.linkControlX = (sourceNode.x + targetNode.x) / 2;
    selectedLink.linkControlY = (sourceNode.y + targetNode.y) / 2;
    selectedLink.isCurved = false;
  
    d3.select(`#link-${selectedLink.linkId}`).attr(
      "d",
      calculateLinkPath(selectedLink)
    );
  }
  
  function setDashed(selectedLink) {
    selectedLink.isDashed = true;
  
    d3.select(`#link-${selectedLink.linkId}`).attr("stroke-dasharray", "4 2");
  }
  
  function unsetDashed(selectedLink) {
    selectedLink.isDashed = false;
  
    d3.select(`#link-${selectedLink.linkId}`).attr("stroke-dasharray", null);
  }
  
  //Entfernt Links aus dem jsonData und von svg canvas
  function deleteLink(linkId) {
    jsonData.links = jsonData.links.filter((link) => link.linkId !== linkId); //löscht link aus jsonData
  
    d3.select(`#link-${linkId}`).remove(); //löscht link von svg canvas
  
    updatePagJsonDisplay(); //passt displayed jsondata auf actual jsondata an
  }
  
  function setupLinkColorPalette() {
    const linkColorPalette = document.getElementById("link-color-palette");
    linkColorPalette.innerHTML = "";
  
    allowedColors.forEach((color) => {
      const colorSwatch = document.createElement("div");
      colorSwatch.className = "color-swatch";
      colorSwatch.style.backgroundColor = color;
  
      colorSwatch.addEventListener("click", () => {
        const linkMenu = document.getElementById("link-context-menu");
        const linkId = linkMenu.getAttribute("data-link-id");
  
        if (linkId) {
          changeLinkColor(linkId, color);
        }
      });
  
      linkColorPalette.appendChild(colorSwatch);
    });
  }
  
  function changeLinkColor(linkId, color) {
    const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  
    if (selectedLink) {
      selectedLink.linkColor = color;
  
      const svgLink = d3.select(`#link-${linkId}`);
      svgLink.attr("stroke", color);
  
      if (selectedLink.arrowhead) {
        const markerId = `marker-${selectedLink.linkId}-end`;
        setupArrowMarker(
          d3.select("svg"),
          markerId,
          selectedLink.arrowhead,
          color,
          "auto"
        );
        d3.select(`#link-${selectedLink.linkId}`).attr(
          "marker-end",
          `url(#${markerId})`
        );
      }
  
      if (selectedLink.arrowtail) {
        const markerId = `marker-${selectedLink.linkId}-start`;
        setupArrowMarker(
          d3.select("svg"),
          markerId,
          selectedLink.arrowtail,
          color,
          "auto-start-reverse"
        );
        d3.select(`#link-${selectedLink.linkId}`).attr(
          "marker-start",
          `url(#${markerId})`
        );
      }
      updatePagJsonDisplay();
    }
  }