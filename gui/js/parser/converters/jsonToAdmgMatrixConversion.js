//TODO: auch nochmal angucken aber scheint zu funktionieren.
//TODO: handelt es sich hier um ein json object oder einen json string als input?
/**
 * @description Turns the graph written as a JSON Object into a Admg Matrix
 * @param {JSON} jsonData
 * @returns {string} matrix
 */
function jsonToAdmgMatrixConversion(jsonData) {
  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  const nodes = jsonData.nodes.map((node) => node.nodeId);
  const matrixSize = nodes.length;

  const matrix = Array.from({ length: matrixSize + 1 }, () =>
    Array(matrixSize + 1).fill(0)
  );

  matrix[0][0] = '""';
  nodes.forEach((nodeId, index) => {
    matrix[0][index + 1] = `"${mapNodeIdToNodeName[nodeId]}"`;
    matrix[index + 1][0] = `"${mapNodeIdToNodeName[nodeId]}"`;
  });

  jsonData.links.forEach((link) => {
    if (
      link.arrowhead === "normal" &&
      link.arrowtail === "normal" &&
      link.isDashed
    ) {
      const sourceIndex = nodes.indexOf(link.source.nodeId) + 1;
      const targetIndex = nodes.indexOf(link.target.nodeId) + 1;

      matrix[sourceIndex][targetIndex] = 2;
      matrix[targetIndex][sourceIndex] = 2;
    }
  });

  jsonData.links.forEach((link) => {
    const sourceIndex = nodes.indexOf(link.source.nodeId) + 1;
    const targetIndex = nodes.indexOf(link.target.nodeId) + 1;

    if (
      link.arrowhead === "normal" &&
      link.arrowtail === "tail" &&
      !link.isDashed
    ) {
      //A->B
      matrix[sourceIndex][targetIndex] = matrix[sourceIndex][targetIndex] === 2 ? 4 : 2;
      matrix[targetIndex][sourceIndex] = matrix[targetIndex][sourceIndex] === 2 ? 5 : 3;
    } else if (
      link.arrowhead === "tail" &&
      link.arrowtail === "normal" &&
      !link.isDashed
    ) {
      //B -> A
      matrix[sourceIndex][targetIndex] = matrix[sourceIndex][targetIndex] === 2 ? 5 : 3;
      matrix[targetIndex][sourceIndex] = matrix[targetIndex][sourceIndex] === 2 ? 4 : 2;
    }
  });

  //diesen prettyfie call für die matrix gibts doch schon als function, einf reusen.
  return matrix.map((row) => row.join(", ")).join("\n");
}
