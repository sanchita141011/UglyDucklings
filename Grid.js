var Node = require('./Node');

class Box extends Node {
  constructor(x, y, weight) {
    super(x, y, weight);
    this.pointTL = null;
    this.pointBR = null;
    this.nodeType = states.BOX_TYPES.CLEAR;
    this.__path = null;
    this.__centerText = null;
  }

  changeText(text) {
    this.__centerText.content = `${text}`;
  }

  resetText() {
    this.__centerText.content = "";
  }

  setAsStart() {
    this.nodeType = states.BOX_TYPES.START_NODE;
    this.__path.fillColor = {
      gradient: {
        stops: states.COLORS.BOX_TYPE_START_NODE_COLORS
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.bottomRight
    };
  }

  removeAsStart() {
    if (this.nodeType == states.BOX_TYPES.START_NODE) {
      this.setAsClear();
    }
  }

  setAsEnd() {
    this.nodeType = states.BOX_TYPES.END_NODE;
    this.__path.fillColor = {
      gradient: {
        stops: states.COLORS.BOX_TYPE_END_NODE_COLORS
      },
      origin: this.path.bounds.topLeft,
      destination: this.path.bounds.rightCenter
    };
  }

  removeAsEnd() {
    if (this.nodeType == states.BOX_TYPES.END_NODE) {
      this.setAsClear();
    }
  }

  setAsClear() {
    this.nodeType = states.BOX_TYPES.CLEAR;
    this.__path.fillColor = states.COLORS.BOX_TYPE_CLEAR_COLOR;
    this.resetText();
    this.weight = 1;
  }

  setAsBlock() {
    this.nodeType = states.BOX_TYPES.BLOCK;
    this.path.tween(
      {
        fillColor: states.COLORS.BOX_TYPE_BLOCK_COLORS[0]
      },
      {
        fillColor: states.COLORS.BOX_TYPE_BLOCK_COLORS[1]
      },
      300
    );

    this.weight = Infinity;
  }

  setAsTraversed() {
    if (this.nodeType == states.BOX_TYPES.BLOCK) {
      this.nodeType = states.BOX_TYPES.ERROR_NODE;
      this.__path.fillColor = states.COLORS.BOX_TYPE_ERROR_NODE_COLOR;
    } else {
      this.nodeType = states.BOX_TYPES.TRAVERSED_NODE;
      this.path.tween(
        {
          fillColor: states.COLORS.BOX_TYPE_TRAVERSED_NODE_COLORS[0]
        },
        {
          fillColor: states.COLORS.BOX_TYPE_TRAVERSED_NODE_COLORS[1]
        },
        200
      );

      this.isVisited = true;
    }
  }

  setAsPath() {
    if (this.nodeType == states.BOX_TYPES.TRAVERSED_NODE) {
      this.nodeType = states.BOX_TYPES.PATH_NODE;
      this.path.tween(
        {
          fillColor: states.COLORS.BOX_TYPE_PATH_NODE_COLORS[0]
        },
        {
          fillColor: states.COLORS.BOX_TYPE_PATH_NODE_COLORS[1]
        },
        200
      );
    }
  }

  resetTraversed() {
    if (
      this.nodeType == states.BOX_TYPES.TRAVERSED_NODE ||
      this.nodeType == states.BOX_TYPES.PATH_NODE
    ) {
      this.setAsClear();
      this.resetVisit();
    }
  }

  setPoints(pointTL, pointBR) {
    this.pointTL = pointTL;
    this.pointBR = pointBR;
  }

  draw() {
    this.__path = new paper.Path.Rectangle({
      from: this.pointTL,
      to: this.pointBR,
      strokeColor: states.COLORS.BOX_BORDER_COLOR,
      strokeWidth: 0.9,
      fillColor: states.COLORS.BOX_TYPE_CLEAR_COLOR
    });
    this.__centerText = new paper.PointText({
      point: this.__path.bounds.center,
      fillColor: "black",
      justification: "center"
    });
    this.__path.addChild(this.__centerText);
  }

  get path() {
    return this.__path;
  }
};

exports.Box = Box;

class Grid {
  constructor(width, height, graph, boxSize) {
    this.width = width;
    this.height = height;
    this.graph = graph;
    this.boxSize = boxSize;
    this.__dragEnabled = false;
    //this.__runner = null;
    this.__start_node = null;
    this.__end_node = null;
    this.__action_mode = states.TOOL_MODE.START_NODE;
    this.__wallA = null;
    this.__wallB = null;
    //this.__runnerSpeed = states.RunnerSpeeds.Fast;
    this.onStartEndSet = () => {};
    /*this.onRunnerStop = () => {};
    this.onRunnerStart = () => {};*/
  }

  getBoxSideLength() {
    var area = this.width * this.height;
    var singleBoxArea = area / this.graph.nodeCount;
    var singleBoxSideLength = Math.sqrt(singleBoxArea);
    console.log(singleBoxSideLength);
    return singleBoxSideLength;
  }

  /*perfromAction(r, c) {
    var box = this.graph.gridOfNodes[r][c];

    if (!this.runner.running) {
      switch (this.__action_mode) {
        case states.TOOL_MODE.START_NODE:
          if (box != this.endNode) {
            this.__start_node = box;
            this.setStart();
          }
          break;
        case states.TOOL_MODE.TARGET_NODE:
          if (box != this.startNode) {
            this.__end_node = box;
            this.setEnd();
          }
          break;
        case states.TOOL_MODE.WALL_NODES:
          if (
            box == this.__start_node ||
            box == this.__end_node ||
            box.nodeType == states.BOX_TYPES.TRAVERSED_NODE ||
            box.nodeType == states.BOX_TYPES.PATH_NODE
          ) {
            return;
          }
          if (box.nodeType == states.BOX_TYPES.BLOCK) {
            this.setClear(r, c);
          } else {
            this.setBlock(r, c);
          }
          break;
      }
    }
  }*/

  /*addEvents(box, r, c) {
    var self = this;
    box.path.onMouseEnter = function(e) {
      if (self.__dragEnabled) {
        self.perfromAction(r, c);
      }
    };

    box.path.onMouseDown = function(event) {
      event.preventDefault();
      self.__dragEnabled = true;
      self.perfromAction(r, c);
    };
    box.path.onMouseUp = function(event) {
      self.__dragEnabled = false;
    };
  }*/

  setBlock(r, c) {
    //this.graph.removeAdjacent(r, c);
    this.graph.gridOfNodes[r][c].setAsBlock();
  }
  setClear(r, c) {
    //this.graph.joinAdjacent(r, c);
    this.graph.gridOfNodes[r][c].setAsClear();
  }

  setStart() {
    for (let r = 0; r < this.graph.rowCount; r++) {
      for (let c = 0; c < this.graph.columnCount; c++) {
        this.graph.gridOfNodes[r][c].removeAsStart();
      }
    }
    if (this.__wallA) {
      this.setBlock(...this.__wallA.value);
      this.__wallA = null;
    }
    if (this.startNode.nodeType == states.BOX_TYPES.BLOCK) {
      this.__wallA = this.startNode;
      this.setClear(...this.startNode.value);
    }
    this.startNode.setAsStart();
    this.onStartEndSet();
    //this.setRunnerNodes();
  }

  fixGrid() {
    for (let r = 0; r < this.graph.rowCount; r++) {
      for (let c = 0; c < this.graph.columnCount; c++) {
        if (
          this.graph.gridOfNodes[r][c].nodeType == states.BOX_TYPES.BLOCK ||
          this.graph.gridOfNodes[r][c].nodeType == states.BOX_TYPES.ERROR_NODE
        ) {
          this.setBlock(r, c);
        }
      }
    }
  }

  resetTraversal() {
    for (let r = 0; r < this.graph.rowCount; r++) {
      for (let c = 0; c < this.graph.columnCount; c++) {
        var box = this.graph.gridOfNodes[r][c];
        box.resetTraversed();
      }
    }
    this.__wallA = null;
    this.__wallB = null;
  }

  setEnd() {
    for (let r = 0; r < this.graph.rowCount; r++) {
      for (let c = 0; c < this.graph.columnCount; c++) {
        this.graph.gridOfNodes[r][c].removeAsEnd();
      }
    }
    if (this.__wallB) {
      this.setBlock(...this.__wallB.value);
      this.__wallB = null;
    }
    if (this.endNode.nodeType == states.BOX_TYPES.BLOCK) {
      this.__wallB = this.endNode;
      this.setClear(...this.endNode.value);
    }
    this.__end_node.setAsEnd();
    this.onStartEndSet();
    //this.setRunnerNodes();
  }

  /*clearGrid() {
    this.__start_node = null;
    this.__end_node = null;
    this.__wallA = null;
    this.__wallB = null;
    this.onStartEndSet();
    this.runner ? this.runner.stop() : null;

    setTimeout(() => {
      for (let r = 0; r < this.graph.rowCount; r++) {
        for (let c = 0; c < this.graph.columnCount; c++) {
          this.setClear(r, c);
        }
      }
    }, 300);
  }*/

  /*paintGrid() {
    var sideLength = this.boxSize || this.getBoxSideLength();
    for (let r = 0; r < this.graph.rowCount; r++) {
      for (let c = 0; c < this.graph.columnCount; c++) {
        var node = this.graph.nodes[r][c];
        var x1 = sideLength * c;
        var y1 = sideLength * r;
        var x2 = x1 + sideLength;
        var y2 = y1 + sideLength;

        node.setPoints(new Point(x1, y1), new Point(x2, y2));
        node.draw();
        this.addEvents(node, r, c);
      }
    }

    this.setRunner(states.DEFAULT_RUNNER_CODE);
  }*/

  /*setRunnerNodes() {
    this.runner.setNode(this.__start_node, this.__end_node);
  }*/

  /*setRunner(runnerCode, extra) {
    this.__runner = new states.Runners[runnerCode](extra);
    this.setRunnerSpeed(this.__runnerSpeed);
  }*/

  /*setRunnerSpeed(speed) {
    this.__runnerSpeed = speed;
    this.__runner.speed = speed;
  }*/

 /* visualize(path) 
  {
    //this.setRunnerNodes();
    //this.resetTraversal();
    //this.fixGrid();
    //this.__runner.onStart = this.onRunnerStart; //444444444444444444
    //this.__runner.onStop = this.onRunnerStop; //444444444444444444
    //this.__runner.init();
  }*/

  getBox(r, c) {
    return this.graph.gridOfNodes[r][c];
  }

  set actionMode(mode) {
    this.__action_mode = mode;
  }

  get actionMode() {
    return this.__action_mode;
  }

  get boxes() {
    return this.graph.gridOfNodes;
  }

  get boxArea() {
    return this.graph.gridOfNodes[0][0].path.area;
  }
  /*get runner() {
    return this.__runner;
  }*/

  get startNode() {
    return this.__start_node;
  }

  get endNode() {
    return this.__end_node;
  }
}

exports.Grid = Grid;
