export function BFS(grid, startNode, finishNode) {
  const openSet = new Queue();
  const closedSet = [];
  startNode.isVisied = true;
  openSet.enqueue(startNode);
  while (!openSet.isEmpty) {
    const currentNode = openSet.dequeue();
    if (currentNode.isWall) continue;
    closedSet.push(currentNode);
    if (currentNode === finishNode) {
      // 1 => 2 => 3 => 4 => 5
      return closedSet;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (!closedSet.includes(neighbor) && !neighbor.isWall) {
        neighbor.previousNode = currentNode;
        neighbor.isVisited = true;
        openSet.enqueue(neighbor);
      }
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

class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}
