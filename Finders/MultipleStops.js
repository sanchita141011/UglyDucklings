//var MinPathSort = require('./Finders/MinPathSort');

function MultipleStops(options)
{
    options = options || {};
    this.pathSorter = new MinPathSort({'allowDiagonal' : options.allowDiagonal,
                                    'dontCrossCorners' : options.dontCrossCorners,
                                    'heuristic' : options.heuristic});
    this.maxCost = options.maxCost || Infinity; 
}

MultipleStops.prototype.pathFinder = function(activeGrid)
{
    pathSorter.pathFinder(activeGrid);
    var route = pathSorter.buildPath(this.maxCost, activeGrid.graph);

    return route;
}

//module.exports = MultipleStops;