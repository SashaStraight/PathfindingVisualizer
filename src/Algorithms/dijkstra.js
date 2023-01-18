export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = []; // create empty array that will store visited nodes.
  const unVisitedNodes = getAllNodes(grid, {});
  startNode.dis = 0; // Starting nodes distance is 0.

  while (!!unVisitedNodes.length) {
    sortNodesbyDistance(unVisitedNodes);
    const currentNode = unVisitedNodes.shift(); // pop first element off of array.

    // If we encounter a wall, we skip it.
    if (currentNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (currentNode.dis === Infinity) {
      return visitedNodesInOrder;
    }
    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder; // We found the path!
    updateUnvisitedNeighbors(currentNode, grid);
  }
}

function getAllNodes(grid) {
  const nodes = [];

  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }

  return nodes;
}

function sortNodesbyDistance(unVisitedNodes) {
  unVisitedNodes.sort((node1, node2) => node1.dis - node2.dis); // sorting unVisitedNodes array in place and returning reference of newly sorted array
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.dis = node.dis + 1;
    neighbor.previousNode = node;
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
