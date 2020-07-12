class MinHeap
{
    constructor()
    {
        this.elements = [];
    }

    insert(f, x, y)
    {
        this.elements.push({f : f, coord : [x,y]});

        if(this.elements.length > 1)
        {
            var current = this.elements.length - 1,
                temp = this.elements[current];
            while(current >= 0)
            {
                var parentIdx = Math.floor((current - 1) / 2.0);
                if(temp.f < this.elements[parentIdx].f)
                {
                    this.elements[current] = this.elements[parentIdx];
                    this.elements[parentIdx] = temp;
                    current = parentIdx;
                }
                else
                {
                    break;
                }
            }
        }
    }

    getMin()
    {
        return(this.elements[0]);
    }

    popMin()
    {
        var min = this.elements[0],
            l = this.elements.length,
            i = 0,
            j = 1;

        this.elements[0] = this.elements[l - 1];

        while(j < l - 1)
        {
            if(this.elements[j].f > this.elements[j + 1].f)
            {
                j++;
            }
            
            if(this.elements[i].f > this.elements[j].f)
            {
                var temp = this.elements[i];
                this.elements[i] = this.elements[j];
                this.elements[j] = temp;
                i = j;
                j = 2 * j + 1;
            }
            else
            {
                break;
            }
        }

        return(this.elements.pop());
    }

    isEmpty()
    {
        return(this.elements.length === 0);
    }

    decreaseKey(fNew, x, y)
    {
        var i;
        
        for(i = 0; i < this.elements.length; i++)
        {
            if(this.elements[i].coord[0] === x && 
               this.elements[i].coord[1] === y &&
               this.elements[i].f > fNew)
            {
                this.elements[i].f = fNew;
                break;
            }
        }

        if(this.elements.length > 1)
        {
            var current = i,
                temp = this.elements[current];
            while(current >= 0)
            {
                var parentIdx = Math.floor((current - 1) / 2.0);
                if(temp.f < this.elements[parentIdx].f)
                {
                    this.elements[current] = this.elements[parentIdx];
                    this.elements[parentIdx] = temp;
                    current = parentIdx;
                }
                else
                {
                    break;
                }
            }
        }
    }
};

//module.exports = MinHeap;