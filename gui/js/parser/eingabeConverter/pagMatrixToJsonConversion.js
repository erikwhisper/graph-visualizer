/**
 * @description Turns the graph written as a Pag Matrix into a JSON Object
 * @param {string} pagMatrix 
 * @returns {JSON} jsonData
 */
function pagMatrixToJsonConversion(pagMatrix) {
  const knotenMap = new Map(); //alle knoten in menge
  const links = []; //alle edges

  //knoten auslesen und einmalig übernehmen
  const knotenNamen = pagMatrix[0].slice(1);

  knotenNamen.forEach((name) => {
    console.log("Log: " + knotenNamen);
    knotenMap.set(name, uuid.v4());
  });

  for (let i = 1; i < pagMatrix.length; i++) {
    const quellKnotenName = pagMatrix[i][0];
    for (let j = i + 1; j < pagMatrix[i].length; j++) {
      const kantenTypFromTo = parseInt(pagMatrix[i][j]);
      const kantenTypToFrom = parseInt(pagMatrix[j][i]);
      const zielKnotenName = knotenNamen[j - 1];

      const link = pagCreateJsonLinks(
        knotenMap.get(quellKnotenName),
        knotenMap.get(zielKnotenName),
        kantenTypFromTo,
        kantenTypToFrom,
        quellKnotenName,
        zielKnotenName
        //,knotenFarbe
      );
      if (link) {
        links.push(link);
      }
    }
  }

  //knoten in jsonFormat
  const nodes = Array.from(knotenMap.entries()).map(([name, nodeId]) => ({
    nodeId, // ID aus der Map
    name, // Name aus der Map
    nodeColor: "whitesmoke",
    x: null,
    y: null,
    labelOffsetX: 0,
    labelOffsetY: 0,
  }));

  return { nodes, links };
}

function pagCreateJsonLinks(quellId, zielId, kantenTypFromTo, kantenTypToFrom, quellKnotenName, zielKnotenName) {
  const edgeMap = {
    0: "none",
    1: "odot",
    2: "normal",
    3: "tail",
  };

  //Wenn beide Edges 0, dann existiert keine Edge
  if (kantenTypFromTo === 0 && kantenTypToFrom === 0) {
    return null;
  }

  return {
    linkId: uuid.v4(),
    linkColor: "black",
    source: {
      nodeId: quellId,
      name: quellKnotenName, // Name aus der Map
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    target: {
      nodeId: zielId,
      name: zielKnotenName, // Name aus der Map
      nodeColor: "whitesmoke",
      x: null,
      y: null,
      labelOffsetX: 0,
      labelOffsetY: 0,
    },
    arrowhead: edgeMap[kantenTypFromTo] || "none", //none falls zahl unbekannt
    arrowtail: edgeMap[kantenTypToFrom] || "none", //none falls zahl unbekannt
    linkControlX: 0,
    linkControlY: 0,
    isCurved: false,
    isDashed: false,
  };
}
