//TODO: handelt es sich hier um ein json object oder einen json string als input?
/**
 * @description Turns the graph written as a JSON Object into a DOT Syntax string
 * @param {JSON} jsonData 
 * @returns {string} dotOutput
 */
function jsonToDotConversion(jsonData) {
  const isAdmg = document.getElementById("matrixTypeToggle").checked;
  let dotOutput;
  if (isAdmg) {
    dotOutput = "digraph ADMG {\n";
  } else {
    dotOutput = "digraph PAG {\n";
  }

  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  jsonData.links.forEach((link) => {
    const source = mapNodeIdToNodeName[link.source.nodeId];
    const target = mapNodeIdToNodeName[link.target.nodeId];
    const arrowhead = link.arrowhead;
    const arrowtail = link.arrowtail;
    const style = link.isDashed ? ", style=dashed" : "";
    const color =
      allowedColors.includes(link.linkColor) && link.linkColor !== "black"
        ? `, color=${link.linkColor}`
        : "";

    dotOutput += `"${source}" -> "${target}" [dir=both, arrowhead=${arrowhead}, arrowtail=${arrowtail}${style}${color}];\n`;
  });

  jsonData.nodes.forEach((node) => {
    //falls node alleinsetehend ist, wird er auch in dot-syntaxt übersetzt
    const nodeIsInLinks = jsonData.links.some(
      (link) =>
        link.source.nodeId === node.nodeId || link.target.nodeId === node.nodeId
    );

    if (node.nodeColor !== "whitesmoke" || !nodeIsInLinks) {
      dotOutput += `"${
        mapNodeIdToNodeName[node.nodeId]
      }" [style=filled, fillcolor=${node.nodeColor}];\n`;
    }
  });

  dotOutput += "}";

  return dotOutput;
}
