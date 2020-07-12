//var Path = require('./Path');
//var DiagonalOptions = require('./DiagonalOptions');

//for unweighted graphs

function BreadthFirstSearch(options)
{
    options = options || {};
    
    if(!options.allowDiagonal)
    {
        this.diagonalOption = DiagonalOptions.Never;
    }

    else if(options.dontCrossCorners)
    {
        this.diagonalOption = DiagonalOptions.noNeighborBlocked;
    }

    else
    {
        this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
    }
}

BreadthFirstSearch.prototype.PathFinder = function(startX, startY, endX, endY, graph)
{
    graph.resetTraversal();

    var openList = [],
        start = graph.getNodeAt(startX, startY),
        end = graph.getNodeAt(endX, endY),
        diagOption = this.diagonalOption,
        neighbors = [];

    //start.isVisited = true;
    openList.push(start);

    while (openList.length)
    {
        var node = openList.shift();
            //box = graph.getBox(node.y, node.x);

        if (end === node)
        {
            return Path.traceFromEnd(end);
        }

        else
        {
            node.setAsTraversed();
        }

        neighbors = graph.getNeighbors(node.x, node.y, diagOption);
        for (var i = 0, l = neighbors.length; i < neighbors.length; ++i)
        {
            if (!neighbors[i].isVisited)
            {
                neighbors[i].isVisited = true;
                openList.push(neighbors[i]);
                neighbors[i].setParent(node);
            }
        }
    }

    return [];
};

//module.exports = BreadthFirstSearch;


