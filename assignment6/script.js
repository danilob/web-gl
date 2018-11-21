var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var play = document.getElementById("play");
var pause = document.getElementById("pause");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");
var code = textarea.value;
running = false;
param = 0;
timeTotal = 5 * 30;
sTotal = 0;
var scale = 1;
var animaframes = []

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawAxis();
    eval(textarea.value);
}

function drawAxis() {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function Link() {
    this.geometry = [];
    this.name;
    this.T = identity();
    this.R = identity();
    this.parent = null;
    this.child = null;
}

function Link(name) {
    this.geometry = [];
    this.name = name;
    this.T = identity();
    this.R = identity();
    this.parent = null;
    this.child = null;
}

Link.prototype.setTranslate = function(x, y) {
    //alert(translate(x,y));
    this.T = translate(x, y); //matriz de translação
}

Link.prototype.setRotate = function(theta) {
    //alert(translate(x,y));
    this.R = rotate(theta); //matriz de translação
}

Link.prototype.setParent = function(r) {
    this.parent = r;
}

Link.prototype.setChild = function(c) {
    this.child = c;
}

Link.prototype.getHierarchy = function() {

}

Link.prototype.setGeometry = function(g) {
    this.geometry = g;
}

Link.prototype.getParentName = function() {
    if (this.parent == null) {
        console.log("none");
    } else {
        console.log(this.parent.name);
    }
}

Link.prototype.getChildName = function() {
    if (this.child == null) {
        console.log("none");
    } else {
        console.log(this.child.name);
    }

}

Link.prototype.getFrameLocal = function() { //retorna o frame local
    return mult(this.T, this.R);
}

Link.prototype.getFrameGlobal = function() { //retorna o frame global
    if (this.parent != null) {
        return mult(this.parent.getFrameGlobal(), this.getFrameLocal());
    }
    return this.getFrameLocal();
}

Link.prototype.drawGlobal = function() { //desenha retangulo considerando as juntas pai e filho
    if (this.geometry.length == 0) return;
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    var pi = this.geometry[0];
    pi = multVec(M, multVec(this.getFrameGlobal(), pi));
    ctx.moveTo(pi[0], pi[1]);
    for (var i = 1; i < this.geometry.length; i++) {
        var pk = this.geometry[i];
        pk = multVec(M, multVec(this.getFrameGlobal(), pk));
        ctx.lineTo(pk[0], pk[1]);
    }
    ctx.lineTo(pi[0], pi[1]);
    var color = '#005792';
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = '#a3f3eb';
    ctx.fill();
}

Link.prototype.draw = function() { //desenha retangulo considerando a configuração local
    if (this.geometry.length == 0) return;
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    var pi = this.geometry[0];
    pi = multVec(M, pi);
    ctx.moveTo(pi[0], pi[1]);
    for (var i = 1; i < this.geometry.length; i++) {
        var pk = this.geometry[i];
        pk = multVec(M, pk);
        ctx.lineTo(pk[0], pk[1]);
    }
    ctx.lineTo(pi[0], pi[1]);
    var color = '#005792';
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = '#a3f3eb';
    ctx.fill();
}

Link.prototype.drawLocal = function() { //desenha retangulo considerando a configuração local
    if (this.geometry.length == 0) return;
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    var pi = this.geometry[0];
    pi = multVec(M, multVec(this.getFrameLocal(), pi));
    ctx.moveTo(pi[0], pi[1]);
    for (var i = 1; i < this.geometry.length; i++) {
        var pk = this.geometry[i];
        pk = multVec(M, multVec(this.getFrameLocal(), pk));
        ctx.lineTo(pk[0], pk[1]);
    }
    ctx.lineTo(pi[0], pi[1]);
    var color = '#005792';
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = '#a3f3eb';
    ctx.fill();
}


//parte da animação

var fps = 30;
var now = Date.now();
var then;
var interval = 1000. / fps;
var delta;
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, interval);
        };
})();

textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);

function goAnimate(lista) {
    timeTotal = 0;
    animaframes = []
    angles = []
        //console.log(lista[0]);
    for (var i = 0; i < lista[0].objects.length; i++) {
        angles.push(0);
    }
    animaframes.push(new Frame(lista[0].objects, angles, 0));
    for (var i = 0; i < lista.length; i++) {
        animaframes.push(new Frame(lista[i].objects, lista[i].angles, lista[i].time * 30));
        timeTotal += lista[i].time * 30;
    }
    console.log(animaframes.length);
}

function animate(canvas, context, startTime) {
    if (!running) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        angles = goAnimateFrames(animaframes, param);
        for (var i = 0; i < angles.length; i++) {
            animaframes[0].objects[i].setRotate(angles[i]);
        }
        for (var i = 0; i < angles.length; i++) {
            animaframes[0].objects[i].drawGlobal();
        }
        return;
    }
    now = (new Date()).getTime();
    delta = now - then;
    if (delta > interval) {
        if ((param < timeTotal)) {
            param++;
        } else {
            if (param == timeTotal) {
                running = false;
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        angles = goAnimateFrames(animaframes, param);
        for (var i = 0; i < angles.length; i++) {
            animaframes[0].objects[i].setRotate(angles[i]);
        }
        for (var i = 0; i < angles.length; i++) {
            animaframes[0].objects[i].drawGlobal();
        }

        then = now - (delta % interval);



    }

    requestAnimFrame(function() {
        animate(canvas, ctx, startTime);
    });




}
setTimeout(function() {
    then = (new Date()).getTime();
    var startTime = (new Date()).getTime();
    animate(canvas, ctx, startTime);
}, 1000);

play.addEventListener("click", function() {
    now = Date.now();
    running = true;
    if (param == timeTotal) {
        param = 0;
    }
    var startTime = (new Date()).getTime();
    animate(canvas, ctx, startTime);

});

pause.addEventListener("click", function() {
    running = false;
});

reset.addEventListener("click", function() {
    param = 0;
    running = true;
    var startTime = (new Date()).getTime();
    animate(canvas, ctx, startTime);
});

// function setTime() {
//     timeTotal = parseInt(document.getElementById("time").value) * 30; //em milisegundos
// }