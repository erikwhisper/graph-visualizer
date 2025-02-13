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
  setupLinkContextMenuInteractions();
  closeContextMenu("link-context-menu");
}

function setupLinkContextMenuInteractions() {
  document.getElementById("arrowhead-normal").addEventListener("click", () => updateArrowhead("normal"));
  document.getElementById("arrowhead-odot").addEventListener("click", () => updateArrowhead("odot"));
  document.getElementById("arrowhead-tail").addEventListener("click", () => updateArrowhead("tail"));

  document.getElementById("arrowtail-normal").addEventListener("click", () => updateArrowtail("normal"));
  document.getElementById("arrowtail-odot").addEventListener("click", () => updateArrowtail("odot"));
  document.getElementById("arrowtail-tail").addEventListener("click", () => updateArrowtail("tail"));

  document.getElementById("straighten-link").addEventListener("click", resetLinkCurve);
  document.getElementById("toggle-dashed-link").addEventListener("click", toggleDashedJson);
  document.getElementById("delete-link").addEventListener("click", deleteLinkJson);
  setupLinkColorPalette();
}

// Backend & Frontend
function updateArrowhead(type){
  const linkId = getSelectedLinkId();
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  updateArrowheadJson(selectedLink, type);
  updateArrowheadVisualization(selectedLink);
  updatePagJsonDisplay()
}

// Backend: Aktualisiert Arrowhead im jsonData
function updateArrowheadJson(selectedLink, type) {
  selectedLink.arrowhead = type;
}

// Frontend: Aktualisiert die Darstellung des Arrowheads
function updateArrowheadVisualization(link) {
  const markerId = `marker-${link.linkId}-end`;
  setupArrowMarker(d3.select("svg"), markerId, link.arrowhead, link.linkColor, "auto");
  d3.select(`#link-${link.linkId}`).attr("marker-end", `url(#${markerId})`);
}

// Backend & Frontend
function updateArrowtail(type){
  const linkId = getSelectedLinkId();
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);
  updateArrowtailJson(selectedLink, type);
  updateArrowtailVisualization(selectedLink);
  updatePagJsonDisplay()
}

// Backend: Aktualisiert Arrowtail im jsonData
function updateArrowtailJson(selectedLink, type) {
  selectedLink.arrowtail = type;
}

// Frontend: Aktualisiert die Darstellung des Arrowtails
function updateArrowtailVisualization(link) {
  const markerId = `marker-${link.linkId}-start`;
  setupArrowMarker(d3.select("svg"), markerId, link.arrowtail, link.linkColor, "auto-start-reverse");
  d3.select(`#link-${link.linkId}`).attr("marker-start", `url(#${markerId})`);
}


// Backend: Schaltet gestrichelte Linien um
function toggleDashedJson() {
  const linkId = getSelectedLinkId();

  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

  selectedLink.isDashed = !selectedLink.isDashed;
  toggleDashedVisualization(selectedLink);
  updatePagJsonDisplay();
}

// Backend: Löscht einen Link
function deleteLinkJson() {
  const linkId = getSelectedLinkId();
  jsonData.links = jsonData.links.filter((link) => link.linkId !== linkId);
  deleteLinkVisualization(linkId);
  updatePagJsonDisplay();
}

// Frontend: Holt die ID des aktuell ausgewählten Links
function getSelectedLinkId() {
  const linkMenu = document.getElementById("link-context-menu");
  return linkMenu ? linkMenu.getAttribute("data-link-id") : null;
}


// Frontend: Schaltet gestrichelte Linie um
function toggleDashedVisualization(link) {
  d3.select(`#link-${link.linkId}`).attr("stroke-dasharray", link.isDashed ? "4 2" : null);
}

// Frontend: Entfernt Link aus der Visualisierung
function deleteLinkVisualization(linkId) {
  d3.select(`#link-${linkId}`).remove();
}

// Frontend: Setzt eine Kurve zurück
function resetLinkCurve() {
  const linkId = getSelectedLinkId();

  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

  selectedLink.linkControlX = (selectedLink.source.x + selectedLink.target.x) / 2;
  selectedLink.linkControlY = (selectedLink.source.y + selectedLink.target.y) / 2;
  selectedLink.isCurved = false;

  d3.select(`#link-${selectedLink.linkId}`).attr("d", calculateLinkPath(selectedLink));
}


// Frontend: Setzt die Farbpalette für Links
function setupLinkColorPalette() {
  const palette = document.getElementById("link-color-palette");
  palette.innerHTML = "";
  allowedColors.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "color-swatch";
    swatch.style.backgroundColor = color;
    swatch.addEventListener("click", () => changeLinkColor(getSelectedLinkId(), color));
    palette.appendChild(swatch);
  });
}

// Frontend: Ändert die Farbe eines Links
function changeLinkColor(linkId, color) {
  const selectedLink = jsonData.links.find((link) => link.linkId === linkId);

  selectedLink.linkColor = color;
  d3.select(`#link-${linkId}`).attr("stroke", color);
  if (selectedLink.arrowhead) updateArrowheadVisualization(selectedLink);
  if (selectedLink.arrowtail) updateArrowtailVisualization(selectedLink);
  updatePagJsonDisplay();
}
