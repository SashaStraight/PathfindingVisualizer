export function aStar(grid, startNode, finishNode) {
  const openSet = [];
  const closedSet = [];
  openSet.push(startNode);

  while (openSet.length > 0) {
    let lowestIndex = 0;

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) lowestIndex = i;
    }
    let currentNode = openSet[lowestIndex];

    currentNode.isVisited = true;

    if (currentNode === finishNode) {
      return closedSet; // return every node visted.
    }

    removeFromArray(openSet, currentNode);

    if (currentNode.isWall) continue;

    closedSet.push(currentNode);

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    console.log("got neighbors array");
    console.log(neighbors.length);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.isWall) {
        let tempG = currentNode.g + 1;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, finishNode);
        neighbor.f = neighbor.h + neighbor.g;
        neighbor.previousNode = currentNode; // keeping track of its parent node
      }
    }
  }
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function removeFromArray(openSet, currentNode) {
  for (let i = openSet.length - 1; i >= 0; i--) {
    if (openSet[i] === currentNode) {
      openSet.splice(i, 1);
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];

  const { col, row } = node;

  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  for (let i = 0; i < neighbors; i++) {
    console.log(neighbors[i]);
  }
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function heuristic(neighborNode, finishNode) {
  let d1 = Math.abs(finishNode.row - neighborNode.row);
  let d2 = Math.abs(finishNode.col - neighborNode.col);
  return d1 + d2;
}
