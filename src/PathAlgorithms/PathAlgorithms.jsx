import React, { Component } from "react";
import Node from "./Node/Node";
import { aStar } from "../Algorithms/aStar";
import { getNodesInShortestPathOrder } from "../Algorithms/aStar";
import { dijkstra } from "../Algorithms/dijkstra";
import { greedyBFS } from "../Algorithms/greedyBFS";
import "./PathFinding.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BFS } from "../Algorithms/BFS";
import { depthFirstSearch } from "../Algorithms/depthFirstSearch";
import { bidirectionalGreedySearch } from "../Algorithms/bidirectionalGreedySearch";
import { getNodesInShortestPathOrderBidirectionalGreedySearch } from "../Algorithms/bidirectionalGreedySearch";
import { recursiveDivisionMaze } from "../Mazes/recursiveDivisionMaze";
import { randomMaze } from "../Mazes/randomMaze";
import { NavLink } from "react-bootstrap";
const START_NODE_ROW = 10;
const START_NODE_COL = 10;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 56;

export default class PathFinding extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      dragging: false,
      startNode: [],
      isToggled: false,
      generatingMaze: false,
      visualizingAlgorithm: false,
      algorithm: " ",
      speed: "Fast",
      hasMaze: false,
      curAlgo: "",
      algo: null,
      curMaze: "",
      maze: null,
    };


    this.speed = 10;
    this.name = "";
    this.algo = dijkstra;
    this.mazeSpeed = 10;
  }



  setSpeed(speed) {
    if (speed === 10) {
      this.setState({ speed: "Fast" })
    }
    else if (speed === 20) {
      this.setState({ speed: "Medium" })
    }
    else if (speed === 60) {
      this.setState({ speed: "Slow" })
    }
    this.speed = speed;
  }

 

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }


  algoSelection(currentAlgoSelected) {
    this.setState({ curAlgo: currentAlgoSelected });
    if (currentAlgoSelected === "Dijkstra") {
      this.state.algo = dijkstra;
    } else if (currentAlgoSelected === "A*") {
      this.state.algo = aStar;
    } else if (currentAlgoSelected === "Greedy") {
      this.state.algo = greedyBFS;
    } else if (currentAlgoSelected === "BFS") {
      this.state.algo = BFS;
    } else if (currentAlgoSelected === "DFS") {
      this.state.algo = depthFirstSearch;
    } else {
      this.state.algo = bidirectionalGreedySearch;
    }
  }

  mazeSelection(currentMazeSelected) {
    console.log(currentMazeSelected);
    this.setState({ curMaze: currentMazeSelected });
    if (currentMazeSelected === "") return;
    if (currentMazeSelected == "Recursive Division") {
      this.state.maze = recursiveDivisionMaze;
    } else {
      this.state.maze = randomMaze;
    }
  }

  generateCurMaze(curMaze) {
    if (this.state.maze === null) return;
    if (curMaze === recursiveDivisionMaze) {
      this.generateRecursiveDivisionMaze();
    } else {
      this.generateRandomMaze();
    }
  }

  // Moduralizing code to only need one function for visualization.
  visualizeAlgorithm(algo) {
    if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
      return;
    }
    this.setState({ visualizingAlgorithm: true });
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = algo(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBidirectionalGreedySearch() {
    if (this.state.visualizingAlgorithm || this.state.generatingMaze) {
      return;
    }
    this.setState({ visualizingAlgorithm: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = bidirectionalGreedySearch(
        grid,
        startNode,
        finishNode
      );
      const visitedNodesInOrderStart = visitedNodesInOrder[0];
      const visitedNodesInOrderFinish = visitedNodesInOrder[1];
      const isShortedPath = visitedNodesInOrder[2];
      const nodesInShortestPathOrder =
        getNodesInShortestPathOrderBidirectionalGreedySearch(
          visitedNodesInOrderStart[visitedNodesInOrderStart.length - 1],
          visitedNodesInOrderFinish[visitedNodesInOrderFinish.length - 1]
        );
      this.animateBidirectionalAlgorithm(
        visitedNodesInOrderStart,
        visitedNodesInOrderFinish,
        nodesInShortestPathOrder,
        isShortedPath
      );
    }, this.speed);
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, this.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  animateBidirectionalAlgorithm(
    visitedNodesInOrderStart,
    visitedNodesInOrderFinish,
    nodesInShortestPathOrder,
    isShortedPath
  ) {
    let len = Math.max(
      visitedNodesInOrderStart.length,
      visitedNodesInOrderFinish.length
    );
    for (let i = 1; i <= len; i++) {
      let nodeA = visitedNodesInOrderStart[i];
      let nodeB = visitedNodesInOrderFinish[i];
      if (i === visitedNodesInOrderStart.length) {
        setTimeout(() => {
          let visitedNodesInOrder = getVisitedNodesInOrder(
            visitedNodesInOrderStart,
            visitedNodesInOrderFinish
          );
          if (isShortedPath) {
            this.animateShortestPath(
              nodesInShortestPathOrder,
              visitedNodesInOrder
            );
          } else {
            this.setState({ visualizingAlgorithm: false });
          }
        }, i * this.speed);
        return;
      }
      setTimeout(() => {
        if (nodeA !== undefined)
          document.getElementById(`node-${nodeA.row}-${nodeA.col}`).className =
            "node node-visited";
        if (nodeB !== undefined)
          document.getElementById(`node-${nodeB.row}-${nodeB.col}`).className =
            "node node-visited";
      }, i * this.speed);
    }
  }

  generateRecursiveDivisionMaze() {
    if (
      this.state.visualizingAlgorithm ||
      this.state.generatingMaze ||
      this.state.hasMaze
    ) {
      return;
    }
    this.setState({ generatingMaze: true, hasMaze: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = recursiveDivisionMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.mazeSpeed);
  }

  generateRandomMaze() {
    if (
      this.state.visualizingAlgorithm ||
      this.state.generatingMaze ||
      this.state.hasMaze
    ) {
      return;
    }
    this.setState({ generatingMaze: true, hasMaze: true });
    setTimeout(() => {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const walls = randomMaze(grid, startNode, finishNode);
      this.animateMaze(walls);
    }, this.mazeSpeed);
  }

  animateMaze = (walls) => {
    for (let i = 0; i <= walls.length; i++) {
      if (i === walls.length) {
        setTimeout(() => {
          let newGrid = getNewGridWithMaze(this.state.grid, walls);
          this.setState({ grid: newGrid, generatingMaze: false });
        }, i * this.mazeSpeed);
        return;
      }
      let wall = walls[i];
      let node = this.state.grid[wall[0]][wall[1]];
      setTimeout(() => {
        //Walls
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-wall-animated";
      }, i * this.mazeSpeed);
    }
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <React.Fragment>
        <div>
          <Router>
            <Navbar bg="dark" variant="dark" expand="lg" color="">
              <Container fluid>
                <Navbar.Brand href="#">Pathfinding Algorithms</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                  <Nav
                    className="me-auto my-2 my-lg-0"
                    style={{ maxHeight: "150px" }}
                    navbarScroll
                  >
                    <NavLink
                      className="visualizeButton"
                      onClick={() =>
                        this.state.algo !== bidirectionalGreedySearch
                          ? this.visualizeAlgorithm(this.state.algo)
                          : this.visualizeBidirectionalGreedySearch()
                      }
                    >
                      Visualize {this.state.curAlgo}
                    </NavLink>
                    <NavLink
                      className="generateMazeButton"
                      onClick={() => this.generateCurMaze(this.state.maze)}
                    >
                      Generate {this.state.curMaze}
                    </NavLink>

                    <NavDropdown
                      title="Choose an Algorithm!"
                      id="navbarScrollingDropdown"
                    >
                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("Dijkstra");
                        }}
                      >
                        Dijkstra's
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("A*");
                        }}
                      >
                        A*
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("Greedy");
                        }}
                      >
                        Greedy BFS
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("BFS");
                        }}
                      >
                        BFS
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("DFS");
                        }}
                      >
                        Depth First Search
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        onClick={() => {
                          this.algoSelection("Bi directional Greedy");
                        }}
                      >
                        Bi directional Greedy Search
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown
                      title="Choose a Maze!"
                      id="navbarScrollingDropdown"
                    >
                      <NavDropdown.Item
                        onClick={() => this.mazeSelection("Recursive Division")}
                      >
                        Recursive Division
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        onClick={() => this.mazeSelection("Random Maze")}
                      >
                        Random Maze
                      </NavDropdown.Item>
                    </NavDropdown>

                    <NavDropdown
                      title="Speed"
                      id="navbarScrollingDropdown"
                    > 
                      <NavDropdown.Item onClick={() => this.setSpeed(10)}>
                        Fast
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => this.setSpeed(20)}>
                        Medium
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => this.setSpeed(60)}>
                        Slow
                      </NavDropdown.Item>
                    </NavDropdown>

                    <Nav.Link onClick={() => window.location.reload()}>
                      Clear Board
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Router>
        </div>
        <div id='mainText'>
        <ul>
          <li>
            <div class="start"></div>Start Node</li>
          <li>
            <div class="finish"></div>Target Node</li>
          <li>
            <div class="unvisited"></div>Unvisited Node</li>
          <li>
            <div class="visited"></div><div class="visitedobject"></div>Visited Nodes</li>
          <li>
            <div class="node-shortest-path"></div>Shortest-path Node</li>
          <li>
            <div class="wall"></div>Wall Node</li>
            <li>
              <div class="speed"></div>Speed: {this.state.speed}
            </li>
        </ul>
      
      </div>
          

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;

                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 24; row++) {
    const currentRow = [];
    for (let col = 0; col < 70; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }

  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    f: 0,
    g: 0,
    h: 0,
    pos: 0,
    closest: 0,
    totalDis: 0,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    dis: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};


const getNewGridWithMaze = (grid, walls) => {
  let newGrid = grid.slice();
  for (let wall of walls) {
    let node = grid[wall[0]][wall[1]];
    let newNode = {
      ...node,
      isWall: true,
    };
    newGrid[wall[0]][wall[1]] = newNode;
  }
  return newGrid;
};

const getVisitedNodesInOrder = (
  visitedNodesInOrderStart,
  visitedNodesInOrderFinish
) => {
  let visitedNodesInOrder = [];
  let n = Math.max(
    visitedNodesInOrderStart.length,
    visitedNodesInOrderFinish.length
  );
  for (let i = 0; i < n; i++) {
    if (visitedNodesInOrderStart[i] !== undefined) {
      visitedNodesInOrder.push(visitedNodesInOrderStart[i]);
    }
    if (visitedNodesInOrderFinish[i] !== undefined) {
      visitedNodesInOrder.push(visitedNodesInOrderFinish[i]);
    }
  }
  return visitedNodesInOrder;
};


