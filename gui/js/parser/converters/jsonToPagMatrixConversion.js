//TODO: Funktioniert, aber:
//const idToName = Object.fromEntries(jsonData.nodes.map((node) => [node.id, node.name]));
//warum muss ich node.id auf node.name so mappen, ist das die normalste lösung? ich meine zu jedem node.id
//gehört ja auch immer ein node.name, gibt es nicht soetwas wie jsonData.nodes.name[id], oder so?


//TODO: handelt es sich hier um ein json object oder einen json string als input?
/**
 * @description Turns the graph written as a JSON Object into a Pag Matrix
 * @param {JSON} jsonData 
 * @returns {string} matrix
 */
function jsonToPagMatrixConversion(jsonData) {
  //das geht safe besser
  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  const knoten = jsonData.nodes.map((node) => node.nodeId);
  const matrixSize = knoten.length;

  const matrix = Array.from({ length: matrixSize + 1 }, () =>
    Array(matrixSize + 1).fill(0)
  );

  matrix[0][0] = '""'; // Ecke hardcoded
  knoten.forEach((nodeId, index) => {
    matrix[0][index + 1] = `"${mapNodeIdToNodeName[nodeId]}"`;
    matrix[index + 1][0] = `"${mapNodeIdToNodeName[nodeId]}"`;
  });

  jsonData.links.forEach((link) => {
    const sourceIndex = knoten.indexOf(link.source.nodeId) + 1;
    const targetIndex = knoten.indexOf(link.target.nodeId) + 1;

    const [edgeTypeForward, edgeTypeReverse] = mapEdgeToType(
      link.arrowhead,
      link.arrowtail
    );
    matrix[sourceIndex][targetIndex] = edgeTypeForward;
    matrix[targetIndex][sourceIndex] = edgeTypeReverse;
  });

  return matrix.map((row) => row.join(", ")).join("\n");
}

function mapEdgeToType(arrowhead, arrowtail) {
  const edgeMap = {
    none: 0,
    odot: 1,
    normal: 2,
    tail: 3,
  };

  if (arrowhead === "odot" && arrowtail === "odot")
    return [edgeMap["odot"], edgeMap["odot"]];
  if (arrowhead === "odot" && arrowtail === "normal")
    return [edgeMap["odot"], edgeMap["normal"]];
  if (arrowhead === "odot" && arrowtail === "tail")
    return [edgeMap["odot"], edgeMap["tail"]];
  if (arrowhead === "odot" && arrowtail === "none")
    return [edgeMap["odot"], edgeMap["none"]];

  if (arrowhead === "normal" && arrowtail === "odot")
    return [edgeMap["normal"], edgeMap["odot"]];
  if (arrowhead === "normal" && arrowtail === "normal")
    return [edgeMap["normal"], edgeMap["normal"]];
  if (arrowhead === "normal" && arrowtail === "tail")
    return [edgeMap["normal"], edgeMap["tail"]];
  if (arrowhead === "normal" && arrowtail === "none")
    return [edgeMap["normal"], edgeMap["none"]];

  if (arrowhead === "tail" && arrowtail === "odot")
    return [edgeMap["tail"], edgeMap["odot"]];
  if (arrowhead === "tail" && arrowtail === "normal")
    return [edgeMap["tail"], edgeMap["normal"]];
  if (arrowhead === "tail" && arrowtail === "tail")
    return [edgeMap["tail"], edgeMap["tail"]];
  if (arrowhead === "tail" && arrowtail === "none")
    return [edgeMap["tail"], edgeMap["none"]];

  if (arrowhead === "none" && arrowtail === "odot")
    return [edgeMap["none"], edgeMap["odot"]];
  if (arrowhead === "none" && arrowtail === "normal")
    return [edgeMap["none"], edgeMap["normal"]];
  if (arrowhead === "none" && arrowtail === "tail")
    return [edgeMap["none"], edgeMap["tail"]];

  return [edgeMap["none"], edgeMap["none"]];
}
