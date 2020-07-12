class Runner
{
    constructor(activeGrid)
    {
        this.finder = null;
        this.finderName = null;
        this.grid = activeGrid;
        this.path = [];
        this.timer = null;
        this.fixedTimer = null;
        this.finish = null;
        this.count = 0;
        this.__speed = 0; // 0 = Max Speed
        this.onStop = null;
        this.onStart = null;
        this.onFrame = null;
        this.__startTime = null;
        this.__endTime = null;
        this.onRunnerStop = () => {};
        this.onRunnerStart = () => {};
        //this.__runnerSpeed = states.RunnerSpeeds.Fast;
        this.Heuristic = {
            //when we can move only in 4 directions (N, S, E, W)
          
            Manhattan: function(dx, dy)
            {
              return dx + dy;
            },
          
            Chebyshev: function(dx, dy)
            {
              return Math.max(dx, dy);
            },
          
            //when we can move in any of the 8 directions
          
            Euclidean: function(dx, dy)
            {
              return Math.sqrt(dx * dx + dy * dy);
            },
          
            Octile: function(dx, dy)
            {
              var root2 = Math.SQRT2;
              return Math.max(dx, dy) + (root2 - 1) * Math.min(dx, dy);
            }
        };
    }

    getAlgo(algo)
    {
        //var algo = event.target.dataset["algo"];
        //var extraData = event.target.dataset;
        /*algo = $(
            '#algorithm_panel ' +
            '.ui-accordion-header[aria-expanded=true]'
        ).attr('id');*/
        var allowDiagonal = true,
                dontCrossCorners = true,
                heuristic = Heuristic['Manhattan'],
                maxCost = 0;
              
        switch (algo)
        {
            case 'aStar':
                /*allowDiagonal = typeof $('#astar_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#astar_section ' +
                                         '.bi-directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#astar_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';

                 parseInt returns NaN (which is falsy) if the string can't be parsed
                weight = parseInt($('#astar_section .spinner').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 

                heuristic = $('input[name=astar_heuristic]:checked').val();*/
                /*if (biDirectional)
                {
                    finder = new states.Runners['biAStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "Bi-Directional A-Star";
                }
                    
                else
                {*/
                    finder = new states.Runners['aStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "A-Star";
                //}
                break;

            case 'idaStar':
                /*allowDiagonal = typeof $('#ida_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#ida_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                trackRecursion = typeof $('#ida_section ' +
                                         '.track_recursion:checked').val() !== 'undefined';

                heuristic = $('input[name=jump_point_heuristic]:checked').val();

                weight = parseInt($('#ida_section input[name=astar_weight]').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 

                timeLimit = parseInt($('#ida_section input[name=time_limit]').val());

                // Any non-negative integer, indicates "forever".
                timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/

                finder = new states.Runners['idaStar']({
                    /*timeLimit: timeLimit,
                    trackRecursion: trackRecursion,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDA-Star";

                break;

            case 'bfs':
                /*allowDiagonal = typeof $('#breadthfirst_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#breadthfirst_section ' +
                                         '.bi-directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#breadthfirst_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                if (biDirectional)
                {
                    finder = new states.Runners['biBFS']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Breadth First Search";
                }
                    
                else
                {*/
                    finder = new states.Runners['bfs']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Breadth First Search";
                //}
                break;

            case 'idDepthFirst':
                /*allowDiagonal = typeof $('#iddepth_first_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#iddepth_first_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                trackRecursion = typeof $('#iddepth_first_section ' +
                                         '.track_recursion:checked').val() !== 'undefined';

                heuristic = $('input[name=jump_point_heuristic]:checked').val();

                weight = parseInt($('#iddepth_first_section input[name=astar_weight]').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 

                timeLimit = parseInt($('#iddepth_first_section input[name=time_limit]').val());
 
                // Any non-negative integer, indicates "forever".
                timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/

                finder = new states.Runners['idDepthFirst']({
                    /*timeLimit: timeLimit,
                    trackRecursion: trackRecursion,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDDepth First Search";

                break;

            case 'bestFirst':
                /*allowDiagonal = typeof $('#bestfirst_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#bestfirst_section ' +
                                         '.bi-directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#bestfirst_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
            
                heuristic = $('input[name=bestfirst_heuristic]:checked').val();
                
                if (biDirectional)
                {
                    finder = new states.Runners['biBestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Bi-Directional Best First Search";
                }
                    
                else
                {*/
                    finder = new states.Runners['bestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Best First Search";
                //}
                break;

            case 'dijkstra':
                /*allowDiagonal = typeof $('#dijkstra_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#dijkstra_section ' +
                                         '.bi-directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#dijkstra_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                  
                /*if (biDirectional)
                {
                    finder = new states.Runners['biDijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Dijkstra";
                }
                    
                else
                {*/
                    finder = new states.Runners['dijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Dijkstra";
                //}
                break;

            /*case 'jps':
                trackRecursion = typeof $('#jump_point_section ' +
                                          '.track_recursion:checked').val() !== 'undefined';
                heuristic = $('input[name=jump_point_heuristic]:checked').val();
        
                finder = new states.Runners['jps']({
                    trackJumpRecursion: trackRecursion,
                    heuristic: this.Heuristic[heuristic],
                    allowDiagonal: true,
                    dontCrossCorners: false
                });

                this.finderName = "Jump Point Search";

                break;
        
            case 'ortho-jps':
                trackRecursion = typeof $('#orth_jump_point_section ' +
                                          '.track_recursion:checked').val() !== 'undefined';
                heuristic = $('input[name=orth_jump_point_heuristic]:checked').val();

                finder = new states.Runners['orthoJps']({
                    trackJumpRecursion: trackRecursion,
                    heuristic: this.Heuristic[heuristic],
                    allowDiagonal: false
                });

                this.finderName = "Orthogonal Jump Point Search";

                break;*/
          
            case 'multiStop':
                /*allowDiagonal = typeof $('#multiple_stops_section ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#multiple_stops_section ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                    
                heuristic = $('input[name=multistop_heuristic]:checked').val();

                maxCost = parseInt($('#multiple_stops_section input[name=max_cost]').val()) || Infinity;
                maxCost = maxCost >= 0 ? maxCost : Infinity;

                //timeLimit = parseInt($('#multiple_stops_section input[name=time_limit]').val());

                // Any non-negative integer, indicates "forever".
                //timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/
  
                finder = new states.Runners['multiStop']({
                    /*timeLimit: timeLimit,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                    maxCost: maxCost
                });

                this.finderName = "Multiple Stops";

                break;
        }
        this.finder = finder;
    }

    mapPath(path)
    {
        this.path = [];
        for(var i = 0; i < path.length; i++)
        {
            var box = this.grid.getBox(path[i][1], path[i][0]);
            this.path.push(box);
        }

        this.grid.endNode.changeText(this.path.length);
        this.count = this.path.length;
    }

    runAlgo()
    {
        var start = this.grid.startNode,
            end = this.grid.endNode,
            path = [];
        
        if(this.finder instanceof AStar ||
           this.finder instanceof Dijkstra ||
           this.finder instanceof BestFirstSearch)
        {
            var algoName = this.finder instanceof BestFirstSearch ? 'best-first-search' :
                           (this.finder instanceof Dijkstra ? 'dijkstra' : 'a-star');
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph, algoName, true);
        }

        else if(this.finder instanceof IDDepthFirstSearch)
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid);
        }

        else if(this.finder instanceof MultipleStops)
        {
            path = this.finder.pathFinder(this.grid);
        }

        else
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph);
        }
        this.done();
        this.mapPath(path);
    }

    recall()
    {
        this.onFrame ? this.onFrame() : null;
        this.runAlgo();
        if (this.finish)
        {
            this.fixedRecall();
            return;
        }
        this.__speed != null ? 
            (this.timer = setTimeout(() => this.recall(), this.__speed)) : null;
    }

    init()
    {
        this.grid.resetTraversal();
        this.grid.fixGrid();
        this.onStart = this.onRunnerStart();
        this.onStop = this.onRunnerStop();
        this.finish = false;
        this.onStart ? this.onStart() : null;
        this.firstFrame();
    
        this.__speed != null ? 
            (this.timer = setTimeout(() => recall(), this.__speed)) : null;
        this.__startTime = new Date().getTime();
    }
    
    fixedRecall()
    {
        if (!this.count)
        {
            this.onStop ? this.onStop() : null;
        }
        
        var i = this.count > states.MAX_FIXED_FRAME_COUNT ? 
            states.MAX_FIXED_FRAME_COUNT : 
            this.count;
        
        this.fixedTimer = setInterval(() => {
            if (i > 0)
            {
                this.fixedFrames();
                i--;
            }
            
            else
            {
                clearInterval(this.fixedTimer);
                this.fixedTimer = null;
                this.onStop ? this.onStop() : null;
            }
        }, this.__speed);
    }

    firstFrame()
    {
        
    }

    fixedFrames()
    {
        var node = this.path.shift();
        node.setAsPath();
    }

    perfromAction(r, c)
    {
        var box = this.grid.getBox(r, c);
    
        if (!this.running) {
            switch (this.grid.__action_mode)
            {
                case states.TOOL_MODE.START_NODE:
                    if (box != this.grid.endNode)
                    {
                        this.grid.__start_node = box;
                        this.grid.setStart();
                    }
                    break;
            
                case states.TOOL_MODE.TARGET_NODE:
                    if (box != this.grid.startNode)
                    {
                        this.grid.__end_node = box;
                        this.grid.setEnd();
                    }
                    break;
            
                case states.TOOL_MODE.WALL_NODES:
                    if (box == this.grid.__start_node ||
                        box == this.grid.__end_node ||
                        box.nodeType == states.BOX_TYPES.TRAVERSED_NODE ||
                        box.nodeType == states.BOX_TYPES.PATH_NODE)
                    {
                        return;
                    }
              
                    if (box.nodeType == states.BOX_TYPES.BLOCK)
                    {
                        this.grid.setClear(r, c);
                    }
                    
                    else
                    {
                        this.grid.setBlock(r, c);
                    }
                    
                    break;
            }
        }
    }

    addEvents(box, r, c)
    {
        var self = this.grid;
        box.path.onMouseEnter = function(e) {
            if (self.__dragEnabled)
            {
                this.perfromAction(r, c);
            }
        };
    
        box.path.onMouseDown = function(event) {
            event.preventDefault();
            self.__dragEnabled = true;
            this.perfromAction(r, c);
        };
        box.path.onMouseUp = function(event) {
            self.__dragEnabled = false;
        };
    }

    paintGrid()
    {
        var sideLength = this.grid.boxSize || this.grid.getBoxSideLength();
        for (var r = 0; r < this.grid.graph.rowCount; r++)
        {
            for (var c = 0; c < this.grid.graph.columnCount; c++)
            {
                var node = this.grid.graph.gridOfNodes[r][c];
                var x1 = sideLength * c;
                var y1 = sideLength * r;
                var x2 = x1 + sideLength;
                var y2 = y1 + sideLength;
    
                node.setPoints(new Point(x1, y1), new Point(x2, y2));
                node.draw();
                this.addEvents(node, r, c);
            }
        }
    
        //this.grid.setRunner(states.DEFAULT_RUNNER_CODE);
        this.finder = new AStar({
            allowDiagonal: true,
            dontCrossCorners: false,
            heuristic: this.Heuristic.Manhattan(),
        });
    }

    clearGrid()
    {
        this.grid.__start_node = null;
        this.grid.__end_node = null;
        this.grid.__wallA = null;
        this.grid.__wallB = null;
        this.grid.onStartEndSet();
        this ? this.stop() : null;
    
        setTimeout(() => {
            this.grid.graph.resetDefault();
            for (var r = 0; r < this.grid.graph.rowCount; r++)
            {
                for (var c = 0; c < this.grid.graph.columnCount; c++)
                {
                    this.grid.setClear(r, c);
                }
            }
        }, 300);
    }
    
    nextStep()
    {
        if (!this.finish) this.recall();
    }
    
    resume()
    {
        this.finish = false;
        this.recall();
    }
    
    done()
    {
        this.finish = true;
        this.stop();
    }
    
    stop()
    {
        clearTimeout(this.timer);
        this.timer = null;
        this.__endTime = new Date().getTime();
        // this.onStop ? this.onStop() : null;
    }

    set speed(speed)
    {
        this.__speed = speed;
    }

    get running()
    {
        return this.timer != null || this.fixedTimer != null ? true : false;
    }

    get speed()
    {
        return this.__speed;
    }
    
    get duration()
    {
        return this.finish ? this.__endTime - this.__startTime : 0;
    }
};

//module.exports = Runner;