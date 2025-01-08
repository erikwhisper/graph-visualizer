function dotToJsonConversion(dotSyntax) {
  const knoten = new Map();
  const links = [];

  const edgeRegex =
    /"([^"]+)"\s*->\s*"([^"]+)"\s*\[\s*dir\s*=\s*both[,\s]*arrowhead\s*=\s*([^,\s]+)[,\s]*arrowtail\s*=\s*([^,\s]+)(?:[,\s]*style\s*=\s*([^,\]]+))?(?:[,\s]*color\s*=\s*([^,\]]+))?\s*\];/g;

  const nodeRegex = /"([^"]+)"\s*\[.*?fillcolor=([^,\]]+).*?\];/g;

  let match;

  //guckt sich alle knoten an für die farbe definiert wurde
  while ((match = nodeRegex.exec(dotSyntax)) !== null) {
    const nodeName = match[1];
    const nodeColor = match[2].trim();

    if (!knoten.has(nodeName)) {
      knoten.set(nodeName, {
        nodeId: uuid.v4(),
        name: nodeName,
        nodeColor: nodeColor || "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }
  }

  //guckt sich alles andere an
  while ((match = edgeRegex.exec(dotSyntax)) !== null) {
    const sourceName = match[1];
    const targetName = match[2];
    const arrowhead = match[3].trim();
    const arrowtail = match[4].trim();
    const style = match[5]?.trim();
    const color = match[6]?.trim() || "black";

    //prüfen ob sourceName oder targetName zsm fassen und im if case dafür dann nach name prüfen und setzen
    if (!knoten.has(sourceName)) {
      knoten.set(sourceName, {
        nodeId: uuid.v4(),
        name: sourceName,
        nodeColor: "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }

    if (!knoten.has(targetName)) {
      knoten.set(targetName, {
        nodeId: uuid.v4(),
        name: targetName,
        nodeColor: "whitesmoke",
        x: null,
        y: null,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }

    const validatedColor = allowedColors.includes(color) ? color : "black";

    links.push({
      linkId: uuid.v4(),
      linkColor: validatedColor,
      source: knoten.get(sourceName),
      target: knoten.get(targetName),
      arrowhead: arrowhead,
      arrowtail: arrowtail,
      linkControlX: 0,
      linkControlY: 0,
      isCurved: false,
      isDashed: style === "dashed",
    });
  }

  const nodesArray = Array.from(knoten.values());

  const jsonData = {
    nodes: nodesArray,
    links: links,
  };

  return jsonData;
}
