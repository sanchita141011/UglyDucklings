/*
Iterative-deepening A*. The iterative-deepening technique used for depth-first search (IDDFS) as 
mentioned above can also be used for an A* search. This entirely eliminates the Open and Closed lists. Do
a simple recursive search, keep track of the accumulated path cost g(n), and cut off the search when the 
rating f(n) = g(n) + h(n) exceeds the limit. Begin the first iteration with the cutoff equal to h(start),
and in each succeeding iteration, make the new cutoff the smallest f(n) value which exceeded the old 
cutoff. Similar to IDDFS among brute-force searches, IDA* is asymptotically optimal in space and time 
usage among heuristic searches.
*/

//var DiagonalOptions = require('./DiagonalOptions')
//var Node = require('./Node');
//var Heuristic = require('./Heuristic');

function IDAStar(options)
{
    options = options || {};

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

IDAStar.prototype.PathFinder = function(startX, startY, endX, endY, graph)
{
    graph.resetTraversal();
    /*
        haven't implemented time limit
    */

    var start = graph.getNodeAt(startX, startY),
        end = graph.getNodeAt(endX, endY),
        diagOption = this.diagonalOption,
        threshold = this.heuristic(Math.abs(startX - endX), Math.abs(startY - endY)),
        path = [];

    var search = function(currentNode, g, threshold)
    {
        /*
            g - distance from source of currentNode
            h - distance to end from currentNode
            f = g + h
        */
        f = g + this.heuristic(currentNode, end);
        /*
            when a node with f > cutoff value found, return the new cutoff
        */
        if(f > threshold)
        {
            return f;
        }

        //var box = graph.getBox(currentNode.y, currentNode.x);

        if(currentNode === end)
        {
            /*
                path starts being populated only after the end node is found
            */
            path.push([currentNode.x, currentNode.y]);
            return currentNode;
        }

        else
        {
            currentNode.setAsTraversed();
        }

        var neighbors = graph.getNeighbors(currentNode.x, currentNode.y, diagOption),
            min = Infinity,
            gNew, i;

        for(i = 0; i < neighbors.length; i++)
        {
            var neighbor = neighbors[i],
                val = (currentNode.weight + neighbor.weight) / 2.0,
                isDiag = false;
        
            if(neighbor.x !== currentNode.x && neighbor.y !== currentNode.y)
            {
                isDiag = true;
            }
        
            gNew = g + (isDiag ? Math.SQRT2 * val : val);

            var temp = search(neighbor, gNew, threshold);

            /*
                Search() returns a Node object only when the goal has been found
            */
            if(temp instanceof Node)
            {
                /*
                    retracing path - once end node is found, keep returning the end node in temp
                    and adding the currentNode in path
                */
                path.push([currentNode.x, currentNode.y]);
                return temp;
            }

            /*
                In case the goal is not found for the current threshold, temp would carry the minimum 
                'f' that crosses the threshold. We return this value to be made the new threshold.
            */ 
            if(temp < min)
            {
                min = temp;
            }
        }
        return(min);

    }.bind(this);

    while(1)
    {
        path = [];

        //graph.resetTraversal();

        var temp = search(start, 0, threshold);

        /*
            when goal is found, end node is returned
        */
        if(temp instanceof Node)
        {
            return(path.reverse());
        }

        /*
            when goal cannot be found, threshold value returned would become very big over time
        */
        if(temp === Infinity)
        {
            return [];
        }

        /*
            if none of the above conditions are true, temp would be the minimum 'f' that crossed 
            the threshold.
        */
        threshold = temp;
    }

    return [];
};

//module.exports = IDAStar;

