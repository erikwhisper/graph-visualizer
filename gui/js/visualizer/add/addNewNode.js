function addNewNode(svg, gridSpacing) {
    svg.on("click", function (event) {
      if (event.shiftKey && event.button === 0) {
        console.log("Shift + Left click detected.");
  
        const newNodeName = window.prompt(
          "Bitte geben Sie den Namen für den neuen Knoten ein:"
        );
        if (newNodeName) {
          console.log(`User entered node name: ${newNodeName}`);
  
          const isDuplicate = jsonData.nodes.some(
            (node) => node.name === newNodeName
          );
          if (isDuplicate) {
            console.log("STOP! Wir haben den Namen schon.");
          } else {
            console.log("Wir haben den Namen noch nicht.");
  
            const [x, y] = d3.pointer(event, this);
  
            const newNode = {
              nodeId: uuid.v4(),
              name: newNodeName,
              nodeColor: "whitesmoke",
              x: x,
              y: y,
              labelOffsetX: 0,
              labelOffsetY: 0,
            };
  
            jsonData.nodes.push(newNode);
  
            drawNewNode(svg, newNode);
  
            drawNewLabel(svg, newNode);
  
            handleAllInteractiveDrags(svg, gridSpacing);
  
            addNewLink(svg, gridSpacing);
  
            updatePagJsonDisplay();
            console.log("New node added:", newNode);
          }
        }
      }
    });
  }