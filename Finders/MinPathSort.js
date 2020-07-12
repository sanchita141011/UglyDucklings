/* gogo
[[0, 5, 4, 8, 11],
 [5, 0, 16, 2, 9],
 [4, 16, 0, 7, 3], 
 [8, 2, 7, 0, 6],
 [11, 9, 3, 6, 0]]


[src 1 2 3 tgt]; f : 0-1-4 => 14
                     0-2-4 => 7
                     0-3-4 => 14
[src 2 1 3 tgt]; f : 0-2-1-4 => 32
                     0-2-3-4 => 20
[src 2 3 1 tgt]; f : 0-2-3-1-4 => 31
*/

var AStar = require('./Finders/AStar');
var Heuristic = require('./Heuristic');

function MinPathSort(options)
{
    options = options || {};

    this.allowDiagonal = options.allowDiagonal;
    this.dontCrossCorners = options.dontCrossCorners;
    this.heuristic = !options.allowDiagonal ? 
                     (options.heuristic || Heuristic.Manhattan) : 
                     (options.heuristic || Heuristic.Octile);
    this.route = [];
    this.searchAlgo = new AStar({'allowDiagonal' : this.allowDiagonal,
                                  'dontCrossCorners' : this.dontCrossCorners,
                                  'heuristic' : this.heuristic});
}

MinPathSort.prototype.pathFinder = function(activeGrid)
{
    var graph = activeGrid.graph,
        arrayOfInter = activeGrid.arrayOfInter,
        start = graph.getNodeAt(activeGrid.startNode.x, activeGrid.startNode.y),
        end = graph.getNodeAt(activeGrid.endNode.x, activeGrid.endNode.y),
        route = [], i, j;

    /*
        arrayOfInter is an array of intermediate coordinates [x,y]
    */

    route.push(start);

    for(i = 0; i < arrayOfInter.length; i++)
    {
        var interNode = graph.getNodeAt(arrayOfInter[i][0], arrayOfInter[i][1]);
        route.push(interNode);
    }

    route.push(end);

    var l = route.length,
        adjacencyMatrix = new Array(l);

    for(i = 0; i < l; i++)
    {
        adjacencyMatrix[i] = new Array(l);

        adjacencyMatrix[i][i] = 0;

        for(j = i + 1; j < l; j++)
        {
            var path = this.searchAlgo.pathFinder(route[i].x, route[i].y, route[j].x, route[j].y, graph, 'a-star', color = true),
                val = Infinity;

            if(path.length !== 0)
            {
                val = path.length;
            }
            adjacencyMatrix[i][j] = adjacencyMatrix[j][i] = val;
        }
    }

    route[0].g = 0;
    route[0].h = route[0].f = adjacencyMatrix[0][l - 1];
        
    for(i = 1; i < l - 1; i++)
    {
        for(j = i; j < l - 1; j++)
        {
            route[j].g = route[i - 1].g + adjacencyMatrix[i - 1][j];
            route[j].h = adjacencyMatrix[j][l - 1];
            route[j].f = route[j].g + route[j].h;

            if(route[j].f < route[i].f)
            {
                var temp = route[i];
                route[i] = route[j];
                route[j] = temp;
            }
        }
    }

    this.route = route;
};

MinPathSort.prototype.maxStops = function(maxCost = Infinity)
{
    for(var i = this.route.length - 2; i >= 0; i--)
    {
        if(this.route[i].f <= maxCost)
        {
            return i;
        }
    }

    return -1;
};

MinPathSort.prototype.buildPath = function(maxCost, graph)
{
    var lastInter = maxStops(maxCost), route = [],
        l = this.route.length, i, j;

    if(lastInter === -1)
    {
        return [];
    }

    for(i = 0; i <= lastInter; i++)
    {  
        var path = (i === lastInter) ? 
                   this.searchAlgo.pathFinder(this.route[i].x, this.route[i].y, this.route[i + 1].x, this.route[i + 1].y, graph, 'a-star', color = false) :
                   this.searchAlgo.pathFinder(this.route[i].x, this.route[i].y, this.route[l - 1].x, this.route[l - 1].y, graph, 'a-star', color = false);
        
        for(j = 0; j < path.length; j++)
        {
            route.push(path[j]);
        }

        route.pop();

        if(i === lastInter)
        {
            break;
        }
    }

    route.push([this.route[l - 1].x, this.route[l - 1].y]);

    return route;
};

module.exports = MinPathSort;