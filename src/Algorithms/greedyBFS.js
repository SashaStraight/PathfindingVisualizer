export function greedyBFS(grid, startNode, finishNode) {
  startNode.dis = 0;
  const openSet = [];
  const closedSet = [];
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((node1, node2) => node1.totalDis - node2.totalDis); // sorting array in place by distance
    let currentNode = openSet.shift(); //pop closest node off of the array

    if (currentNode === finishNode) {
      return closedSet;
    }

    if (currentNode.isWall) continue;
    closedSet.push(currentNode); // pushing node to closed set [visited nodes]
    removeFromArray(openSet, currentNode); // removing current node from the open set.

    let neighbors = getUnvisitedNeighbors(currentNode, grid);
    console.log(neighbors.length);
    for (let i = 0; i < neighbors.length; i++) {
      let distance = currentNode.dis + 1;

      const neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.isWall) {
        openSet.unshift(neighbor);
        neighbor.totalDis = getDistance(neighbor, finishNode);
        neighbor.previousNode = currentNode;
      } else if (distance < neighbor.dis) {
        neighbor.dis = distance;
        neighbor.totalDis = getDistance(neighbor, finishNode);
        neighbor.previousNode = currentNode;
      }
    }
  }
}

function removeFromArray(openSet, currentNode) {
  for (let i = openSet.length - 1; i >= 0; i--) {
    if (openSet[i] === currentNode) {
      openSet.splice(i, 1);
    }
  }
}

function getUnvisitedNeighbors(currentNode, grid) {
  const neighbors = [];
  const { col, row } = currentNode;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getDistance(currentNode, finishNode) {
  let d1 = Math.abs(finishNode.row - currentNode.row);
  let d2 = Math.abs(finishNode.col - currentNode.col);
  return d1 + d2;
}
