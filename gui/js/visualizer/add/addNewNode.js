//Controller
function addNewNode(svg, gridSpacing) {
    svg.on("click", function (event) {
      if (event.shiftKey && event.button === 0) {
      
        const nodeName = window.prompt(
          "Bitte geben Sie den Namen für den neuen Knoten ein:"
        );

        if (nodeName) { //not null check
  
          const isDuplicate = checkDuplicates(nodeName);

          if (!isDuplicate) {

            const [x, y] = d3.pointer(event, this);
  
            const newNode = createNewNode(nodeName, x, y);
  
            addNewNodeToJson(newNode);
  
            //uhm... idk... refactor these some day, FRONTEND
            drawNewNode(svg, newNode);
            drawNewLabel(svg, newNode);
            handleAllInteractiveDrags(svg, gridSpacing);
            addNewLink(svg, gridSpacing);
          }
        }
      }
    });
  }

//BACKEND
function checkDuplicates(newNodeName) {
  return jsonData.nodes.some(
    (node) => node.name === newNodeName
  );
}

//BACKEND
function createNewNode(nodeName, x, y) {
  return {
    nodeId: uuid.v4(),
    name: nodeName,
    nodeColor: "whitesmoke",
    x: x,
    y: y,
    labelOffsetX: 0,
    labelOffsetY: 0,
  };
}

//BACKEND
function addNewNodeToJson(newNode) {
  jsonData.nodes.push(newNode);
  updatePagJsonDisplay();
}