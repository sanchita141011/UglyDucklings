function Path()
{
    this.path = [];
}
    
Path.prototype.traceFromEnd = function(end)
{
    this.path = [];

    var node = end;
    
    path.push([end.x, end.y]);

    while (node.parent)
    {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    
    return path.reverse();
};
    
//module.exports = Path;
