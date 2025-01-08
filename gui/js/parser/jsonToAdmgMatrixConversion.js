//TODO: auch nochmal angucken aber scheint zu funktionieren. Kommentare removen
function jsonToAdmgMatrixConversion(jsonData) {
  // Map node IDs to names
  const mapNodeIdToNodeName = Object.fromEntries(
    jsonData.nodes.map((node) => [node.nodeId, node.name])
  );

  // Extract node IDs
  const nodes = jsonData.nodes.map((node) => node.nodeId);
  const matrixSize = nodes.length;

  // Initialize the matrix
  const matrix = Array.from({ length: matrixSize + 1 }, () =>
    Array(matrixSize + 1).fill(0)
  );

  // Set node names in the first row and column
  matrix[0][0] = '""'; // Top-left corner
  nodes.forEach((nodeId, index) => {
    matrix[0][index + 1] = `"${mapNodeIdToNodeName[nodeId]}"`;
    matrix[index + 1][0] = `"${mapNodeIdToNodeName[nodeId]}"`;
  });

  // First pass: Add bi-directed edges (2_2)
  jsonData.links.forEach((link) => {
    if (
      link.arrowhead === "normal" &&
      link.arrowtail === "normal" &&
      link.isDashed
    ) {
      const sourceIndex = nodes.indexOf(link.source.nodeId) + 1;
      const targetIndex = nodes.indexOf(link.target.nodeId) + 1;

      // Set bi-directed edge
      matrix[sourceIndex][targetIndex] = 2;
      matrix[targetIndex][sourceIndex] = 2;
    }
  });

  // Second pass: Add directed edges (1_0, 0_1) or overwrite bi-directed edges
  jsonData.links.forEach((link) => {
    const sourceIndex = nodes.indexOf(link.source.nodeId) + 1;
    const targetIndex = nodes.indexOf(link.target.nodeId) + 1;

    if (
      link.arrowhead === "normal" &&
      link.arrowtail === "tail" &&
      !link.isDashed
    ) {
      // A -> B
      matrix[sourceIndex][targetIndex] = 1;
      //matrix[targetIndex][sourceIndex] = 0; //wofür die null ist doch eh immer null
    } else if (
      link.arrowhead === "tail" &&
      link.arrowtail === "normal" &&
      !link.isDashed
    ) {
      // B -> A
      //matrix[sourceIndex][targetIndex] = 0; //wofür die null ist doch eh immer null
      matrix[targetIndex][sourceIndex] = 1;
    }
  });

  //diesen prettyfie call für die matrix gibts doch schon als function, einf reusen.
  return matrix.map((row) => row.join(", ")).join("\n");
}
