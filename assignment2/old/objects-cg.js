function Vec2(){
    this.x = 0;
    this.y = 0;
}

Vec2.prototype.set = function(x,y) {
    this.x = x;
    this.y = y;
};

function Polygon() {
    this.points = []
}

Polygon.prototype.add = function(vec) {
    this.points.push(vec);
};


function Line() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
}

Line.prototype.set = function(x1,y1,x2,y2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
};

Line.prototype.show = function() {
    console.log("x1: "+this.x1+", y1: "+this.y1+", x2: "+this.x2+", y2: "+this.y2);
};

function Clipping(){
    this.ymin = 0;
    this.xmin = 0;
    this.ymax = 0;
    this.xmax = 0;
}

Clipping.prototype.show = function() {
    alert("("+this.xmin+" , "+this.ymin+"),("+this.xmax+" , "+this.ymax+")");
};

Clipping.prototype.width = function() {
    return (this.xmax-this.xmin);
};

Clipping.prototype.height = function() {
    return (this.ymax-this.ymin);
};

Clipping.prototype.center = function() {
    return [(this.xmax+this.xmin)/2.,(this.ymax+this.ymin)/2.];
};