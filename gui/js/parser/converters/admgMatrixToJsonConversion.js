//Das hier muss ich auf jeden Fall mir nochmal genauer angucken um keine fehler bei conversions drin zu haben
//sobald ich etwas mehr zeit hab. Sieht aber gut aus.

/**
 * @description Turns the graph written as a Admg Matrix into a JSON Object
 * @param {string} parsedPagMatrix
 * @returns {JSON} jsonData
 */
function admgMatrixToJsonConversion(parsedAdmgMatrix) {
  const knotenMap = new Map();
  const links = [];

  const knotenNamen = parsedAdmgMatrix[0].slice(1);

  knotenNamen.forEach((name) => {
    knotenMap.set(name, uuid.v4());
  });

  for (let i = 1; i < parsedAdmgMatrix.length; i++) {
    const quellKnotenName = parsedAdmgMatrix[i][0];
    for (let j = i + 1; j < parsedAdmgMatrix[i].length; j++) {
      const kantenTypFromTo = parseInt(parsedAdmgMatrix[i][j]);
      const kantenTypToFrom = parseInt(parsedAdmgMatrix[j][i]);
      const zielKnotenName = knotenNamen[j - 1];

      const newLinks = admgCreateJsonLinks(
        knotenMap.get(quellKnotenName),
        knotenMap.get(zielKnotenName),
        kantenTypFromTo,
        kantenTypToFrom
      );

      if (newLinks) {
        links.push(...newLinks); //is der ... operator nötig? //100% nicht, remove das
      }
    }
  }

  const nodes = Array.from(knotenMap.entries()).map(([name, nodeId]) => ({
    nodeId,
    name,
    nodeColor: "whitesmoke",
    x: null,
    y: null,
    labelOffsetX: 0,
    labelOffsetY: 0,
  }));

  return { nodes, links };
}

function admgCreateJsonLinks(
  quellId,
  zielId,
  kantenTypFromTo,
  kantenTypToFrom
) {
  const admgEdgeMap = {
    "0_0": null,
    "1_0": [{ arrowhead: "normal", arrowtail: "tail", isDashed: false }],
    "0_1": [{ arrowhead: "tail", arrowtail: "normal", isDashed: false }],
    "2_2": [{ arrowhead: "normal", arrowtail: "normal", isDashed: true }],
    "2_1": [
      { arrowhead: "normal", arrowtail: "normal", isDashed: true },
      { arrowhead: "tail", arrowtail: "normal", isDashed: false },
    ],
    "1_2": [
      { arrowhead: "normal", arrowtail: "normal", isDashed: true },
      { arrowhead: "normal", arrowtail: "tail", isDashed: false },
    ],
  };

  const key = `${kantenTypFromTo}_${kantenTypToFrom}`;

  if (!admgEdgeMap[key]) return null;

  return admgEdgeMap[key].map((edgeProps) => ({
    linkId: uuid.v4(),
    linkColor: "black",
    source: {
      nodeId: quellId,
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    target: {
      nodeId: zielId,
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    arrowhead: edgeProps.arrowhead,
    arrowtail: edgeProps.arrowtail,
    linkControlX: 0,
    linkControlY: 0,
    isCurved: false,
    isDashed: edgeProps.isDashed,
  }));
}