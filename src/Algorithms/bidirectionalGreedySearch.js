export function bidirectionalGreedySearch(grid, startNode, finishNode) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
    let openSetStart = [];
    let closedSetStart = [];
    let openSetFinish = [];
    let closedSetFinish = [];
    startNode.distance = 0;
    finishNode.distance = 0;
    openSetStart.push(startNode);
    openSetFinish.push(finishNode);
  
    while (
      openSetStart.length !== 0 &&
      openSetFinish.length !== 0
    ) {
      openSetStart.sort((a, b) => a.totalDistance - b.totalDistance);
      openSetFinish.sort((a, b) => a.totalDistance - b.totalDistance);
      let closestNodeStart = openSetStart.shift();
      let closestNodeFinish = openSetFinish.shift();
  
      closestNodeStart.isVisited = true;
      closestNodeFinish.isVisited = true;
      closedSetStart.push(closestNodeStart);
      closedSetFinish.push(closestNodeFinish);
      if (isNeighbor(closestNodeStart, closestNodeFinish)) {
        return [closedSetStart, closedSetFinish, true];
      }
  
      
      let neighbors = getNeighbors(closestNodeStart, grid);
      for (let neighbor of neighbors) {
        if (!neighborNotInOpenSet(neighbor, openSetFinish)) {
          closedSetStart.push(closestNodeStart);
          closedSetFinish.push(neighbor);
          return [closedSetStart, closedSetFinish, true];
        }
        let distance = closestNodeStart.distance + 1;
        
        if (neighborNotInOpenSet(neighbor, openSetStart)) {
          openSetStart.unshift(neighbor);
          neighbor.distance = distance;
          neighbor.totalDistance = manhattenDistance(neighbor, finishNode);
          neighbor.previousNode = closestNodeStart;
        } else if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.totalDistance = manhattenDistance(neighbor, finishNode);
          neighbor.previousNode = closestNodeStart;
        }
      }
  
      
      neighbors = getNeighbors(closestNodeFinish, grid);
      for (let neighbor of neighbors) {
        if (!neighborNotInOpenSet(neighbor, openSetStart)) {
          closedSetStart.push(closestNodeFinish);
          closedSetStart.push(neighbor);
          return [closedSetStart, closedSetFinish, true];
        }
        let distance = closestNodeFinish.distance + 1;
        
        if (neighborNotInOpenSet(neighbor, openSetFinish)) {
          openSetFinish.unshift(neighbor);
          neighbor.distance = distance;
          neighbor.totalDistance = manhattenDistance(neighbor, startNode);
          neighbor.previousNode = closestNodeFinish;
        } else if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.totalDistance = manhattenDistance(neighbor, startNode);
          neighbor.previousNode = closestNodeFinish;
        }
      }
    }
    return [closedSetStart, closedSetFinish, false];
  }
  
  function isNeighbor(closestNodeStart, closestNodeFinish) {
    let rowStart = closestNodeStart.row;
    let colStart = closestNodeStart.col;
    let rowFinish = closestNodeFinish.row;
    let colFinish = closestNodeFinish.col;
    if (rowFinish === rowStart - 1 && colFinish === colStart) return true;
    if (rowFinish === rowStart && colFinish === colStart + 1) return true;
    if (rowFinish === rowStart + 1 && colFinish === colStart) return true;
    if (rowFinish === rowStart && colFinish === colStart - 1) return true;
    return false;
  }
  
  function getNeighbors(node, grid) {
    let neighbors = [];
    let { row, col } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(
      (neighbor) => !neighbor.isWall && !neighbor.isVisited
    );
  }
  
  function manhattenDistance(nodeA, nodeB) {
    let x = Math.abs(nodeA.row - nodeB.row);
    let y = Math.abs(nodeA.col - nodeB.col);
    return x + y;
  }
  
  function neighborNotInOpenSet(neighbor, unvisitedNodes) {
    for (let node of unvisitedNodes) {
      if (node.row === neighbor.row && node.col === neighbor.col) {
        return false;
      }
    }
    return true;
  }
  
  export function getNodesInShortestPathOrderBidirectionalGreedySearch(
    nodeA,
    nodeB
  ) {
    let nodesInShortestPathOrder = [];
    let currentNode = nodeB;
    while (currentNode !== null) {
      nodesInShortestPathOrder.push(currentNode);
      currentNode = currentNode.previousNode;
    }
    currentNode = nodeA;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}