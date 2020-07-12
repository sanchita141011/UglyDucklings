class Node {
  constructor(x, y, weight) {
    this.x = x;

    this.y = y;

    this.weight = weight;

    this.isVisited = false; //check this again

    this.parent = null;
  }

  resetToDefault() {
    this.weight = 1;
    this.resetVisit();
  }

  resetVisit() {
    this.isVisited = false;
    this.parent = null;
  }

  /*setParent(parent) {
    this.parent = parent;
  }*/
}

//module.exports = Node;
