var MinHeap = require('./MinHeap');
var Path = require('./Path');
var Heuristic = require('./Heuristic');
var DiagonalOptions = require('./DiagonalOptions');

function AStar(options)
{
    options = options || {};

    //this.heuristic = opt.heuristic || Heuristic.Manhattan;
    
    if (!options.allowDiagonal)
    {
        this.diagonalOption = DiagonalOptions.Never;
        this.heuristic = options.heuristic || Heuristic.Manhattan;
    }
    
    else 
    {
        this.heuristic = options.heuristic || Heuristic.Octile;
        if (options.dontCrossCorners)
        {
            this.diagonalOption = DiagonalOptions.noNeighborBlocked;
        }
    
        else
        {
            this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
        }
    }
}

AStar.prototype.pathFinder = function(startX, startY, endX, endY, graph, algo = 'a-star', color = true)
{
    //graph.resetTraversal();

    var start = graph.getNodeAt(startX, startY),
        end = graph.getNodeAt(endX, endY),
        diagOption = this.diagonalOption,
        heuristic = this.heuristic,
        closedList = new Array(graph.rowCount),
        openList = new MinHeap();

    for(var i = 0; i < graph.rowCount; ++i)
    {
        closedList[i] = new Array(graph.columnCount);
        for(var j = 0; j < graph.columnCount; ++j)
        {
            closedList[i][j] = false;
        }
    }

    //initializing f, g, h for the start node
    openList.insert({f : 0, coord : [startX, startY]});
    start.isVisited = true;
    start.g = start.h = start.f = 0;
    start.parent = null;

    while(!openList.isEmpty())
    {
        var minElement = openList.popMin(),
            currentX = minElement.coord[0],
            currentY = minElement.coord[1],
            currentNode = graph.getNodeAt(currentX, currentY),
            neighbors = graph.getNeighbors(currentX, currentY, diagOption),
            neighbor, i, gNew, hNew, fNew;

        closedList[currentY][currentX] = true;

        if(currentNode === end)
        {
            foundDest = true;
            return (Path.traceFromEnd(end))
        }

        for(i = 0; i < neighbors.length; ++i)
        {
            neighbor = neighbors[i];

            var isDiag = false;

            if(neighbor.x !== currentX && neighbor.y !== currentY)
            {
                isDiag = true;
            }
            
            if(!closedList[neighbor.y][neighbor.x])
            {
                var val = (neighbor.weight + currentNode.weight) / 2.0;
                gNew = algo === 'best-first-search' ? 0 : currentNode.g + (isDiag ? Math.SQRT2 * val : val);
                hNew = algo === 'dijkstra' ? 0 : heuristic(Math.abs(currentX - neighbor.x), Math.abs(currentY - neighbor.y));
                fNew = gNew + hNew;

                if(!neighbor.isVisited)
                {
                    //var box = graph.getBox(neighbor.y, neighbor.x);
                    openList.insert({f : fNew, coord : [neighbor.x, neighbor.y]});
                    neighbor.isVisited = true;
                    if(color === true) //color the node only when we want to show the search
                    {
                        neighbor.setAsTraversed();
                    }
                    neighbor.f = fNew;
                    neighbor.g = gNew;
                    neighbor.h = hNew;
                    neighbor.parent = currentNode;
                }

                else if(neighbor.f > fNew)
                {
                    openList.decreaseKey(fNew, neighbor.x, neighbor.y);
                    neighbor.f = fNew;
                    neighbor.g = gNew;
                    neighbor.h = hNew;
                    neighbor.parent = currentNode;
                }
            }
        }
    }
    return [];
};

module.exports = AStar;