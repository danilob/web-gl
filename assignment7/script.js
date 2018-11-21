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
slow = 0.01;
M = transformCanvas(canvas.width, canvas.height);

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
    this.effector = [0, 0, 1];
    this.name;
    this.T = identity();
    this.R = identity();
    this.parent = null;
    this.child = null;
}

function Link(name) {
    this.geometry = [0, 0, 1];
    this.name = name;
    this.T = identity();
    this.R = identity();
    this.effector = [0, 0, 1];
    this.parent = null;
    this.child = null;
}

Link.prototype.setEffector = function(x, y) {
    //alert(translate(x,y));
    this.effector = [x, y, 1]; //matriz de translação
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

Link.prototype.getTGlobal = function() { //retorna o frame global
    if (this.parent != null) {
        return mult(this.parent.T, this.T);
    }
    return this.T;
}

Link.prototype.getRGlobal = function() { //retorna o frame global
    if (this.parent != null) {
        return mult(this.parent.R, this.R);
    }
    return this.R;
}

Link.prototype.getFrameGlobal = function() { //retorna o frame global
    if (this.parent != null) {
        return mult(this.parent.getFrameGlobal(), this.getFrameLocal());
    }
    return this.getFrameLocal();
}

Link.prototype.getEffector = function() {
    return multVec(this.getFrameGlobal(), this.effector);
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

function getAngles(l0, l1, l2, xl, yl, v = -1) {
    var interaction = 0;
    do {
        eff = l2.getEffector();
        eff0 = l0.getEffector();
        eff1 = l1.getEffector();
        goal = [xl, yl, 1];
        drawCircleVec(multVec(M, goal), ctx, "#ff1f5a");
        dir = [goal[0] - eff[0], goal[1] - eff[1], 0];
        cp0 = crossProd2d([0, 0, 1], [eff[0], eff[1], 0]);
        cp1 = crossProd2d([0, 0, 1], [eff[0] - eff0[0], eff[1] - eff0[1], 0]);
        cp2 = crossProd2d([0, 0, 1], [eff[0] - eff1[0], eff[0] - eff1[1], 0]);

        J = [
            [cp0[0], cp1[0], cp2[0]],
            [cp0[1], cp1[1], cp2[1]],
            [cp0[2], cp1[2], cp2[2]]
        ];
        r0 = multVec(mult(transpose(J), matrix_invert(sum(mult(J, transpose(J)), identity()))), dir);

        l0.R = mult(l0.R, rotate(180 * r0[0] / Math.PI));
        l1.R = mult(l1.R, rotate(180 * r0[1] / Math.PI));
        l2.R = mult(l2.R, rotate(180 * r0[2] / Math.PI));
        interaction += 1;
        eff = l2.getEffector();
        l0.drawGlobal();
        l1.drawGlobal();
        l2.drawGlobal();
        dir = [goal[0] - eff[0], goal[1] - eff[1], 0];
        if (v != -1 && interaction == v) break;
    } while ((module(dir[0], dir[1]) > 1.0));
    alert(interaction);
    eff = l2.getEffector();
    drawCircleVec(multVec(M, eff), ctx, "#cb9b42");
    //    drawCircleVec(multVec(M,eff0),ctx,"#cb9b42");
    //    drawCircleVec(multVec(M,eff1),ctx,"#cb9b42");
    // //    
    //    console.log("Fim!");



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

function drawCircleVec(c, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    //c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

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
        l0.drawGlobal();
        l1.drawGlobal();
        l2.drawGlobal();
        if (!(module(dir[0], dir[1]) > 5.0)) {
            running = false;
            drawCircleVec(multVec(M, goal), ctx, "#132238");
        } else {
            drawCircleVec(multVec(M, goal), ctx, "#ff1f5a");
        }

        return;
    }
    now = (new Date()).getTime();
    delta = now - then;
    if (delta > interval) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        eff = l2.getEffector();
        eff0 = l0.getEffector();
        eff1 = l1.getEffector();
        //goal = [xl, yl, 1];
        //drawCircleVec(multVec(M, goal), ctx, "#ffa952");
        dir = [goal[0] - eff[0], goal[1] - eff[1], 0];
        cp0 = crossProd2d([0, 0, 1], [eff[0], eff[1], 0]);
        cp1 = crossProd2d([0, 0, 1], [eff[0] - eff0[0], eff[1] - eff0[1], 0]);
        cp2 = crossProd2d([0, 0, 1], [eff[0] - eff1[0], eff[0] - eff1[1], 0]);

        J = [
            [cp0[0], cp1[0], cp2[0]],
            [cp0[1], cp1[1], cp2[1]],
            [cp0[2], cp1[2], cp2[2]]
        ];
        r0 = multVec(mult(transpose(J), matrix_invert(sum(mult(J, transpose(J)), identity()))), dir);

        l0.R = mult(l0.R, rotate(180 * r0[0] * slow / Math.PI));
        l1.R = mult(l1.R, rotate(180 * r0[1] * slow / Math.PI));
        l2.R = mult(l2.R, rotate(180 * r0[2] * slow / Math.PI));

        eff = l2.getEffector();
        l0.drawGlobal();
        l1.drawGlobal();
        l2.drawGlobal();
        dir = [goal[0] - eff[0], goal[1] - eff[1], 0];


        if (!(module(dir[0], dir[1]) > 5.0)) {
            running = false;
            drawCircleVec(multVec(M, goal), ctx, "#132238");
        } else {
            drawCircleVec(multVec(M, goal), ctx, "#ff1f5a");
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
    l0.setRotate(0);
    l1.setRotate(0);
    l2.setRotate(0);
    var startTime = (new Date()).getTime();
    animate(canvas, ctx, startTime);
});

// function setTime() {
//     timeTotal = parseInt(document.getElementById("time").value) * 30; //em milisegundos
// }