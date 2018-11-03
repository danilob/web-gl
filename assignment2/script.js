var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");

var code = textarea.value;

var scale = 1;

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    eval(textarea.value);
}

function setScale(v) {
    scale = v;
}

function drawLine(x1, y1, x2, y2) {
    x1 = parseInt(x1);
    y1 = parseInt(y1);
    x2 = parseInt(x2);
    y2 = parseInt(y2);
    dX = x2 - x1; //delta x
    dY = y2 - y1; //delta y
    canvas.width = (Math.abs(dX)) * scale;
    canvas.height = (Math.abs(dY)) * scale;
    xM = (x1 + x2) / 2.; //encontra o ponto médio no eixo x
    yM = (y1 + y2) / 2.; //encontra o ponto médio no eixo y
    M = mult(transformCanvas(canvas.width / scale, canvas.height / scale), translate(-xM, -yM)); // transforma para coordenadas do canvas
    p0 = multVec(M, [x1, y1, 1]); //encontra o ponto (x1,y1) no canvas
    p1 = multVec(M, [x2, y2, 1]); //encontra o ponto (x2,y2) no canvas




    //constroi a grid de "pixels"
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.lineWidth = 1. / scale;
    for (var i = 0; i <= Math.abs(dX); i++) {
        for (var j = 0; j <= Math.abs(dY); j++) {
            ctx.strokeRect(i, j, 1, 1);
        }
    }

    console.log(p0);
    console.log(p1);

    var X = p0[0];
    var Y = p0[1];
    if (X > 0) X = X - 1;
    if (Y > 0) Y = Y - 1;
    var dX = p1[0] - p0[0];
    var dY = p1[1] - p0[1];
    var Xincr;
    if (dX > 0) {
        Xincr = 1;
    } else {
        Xincr = -1;
        dX = Math.abs(dX);
    }



    var Yincr;
    if (dY > 0) {
        Yincr = 1;
    } else {
        Yincr = -1;
        dY = Math.abs(dY);
    }

    console.log("dX: " + dX + ", dY: " + dY);

    if (dX > dY) {
        var P = 2 * dY - dX;
        for (var K = 0; K < Math.abs(dX); K++) {
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = "#f57665";
            console.log("dX>dY => X: " + X + ", Y:" + Y);
            ctx.fillRect(X, Y, 1, 1);
            ctx.strokeRect(X, Y, 1, 1);
            if (P > 0) {
                Y = Y + Yincr;
                P = P - 2 * dX;
            }
            X = X + Xincr;
            P = P + 2 * dY;
            if (X >= dX) X = X - 1;
            if (Y >= dY) Y = Y - 1;
            if (X < 0) X = 0;
            if (Y < 0) Y = 0;
        }

    } else {
        var P = 2 * dX - dY;
        for (var K = 0; K < Math.abs(dY); K++) {
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = "#f57665";

            console.log("dY>dX => X: " + X + ", Y:" + Y);
            ctx.fillRect(X, Y, 1, 1);
            ctx.strokeRect(X, Y, 1, 1);
            if (P > 0) {
                X = X + Xincr;
                P = P - 2 * dY;
            }
            Y = Y + Yincr;
            P = P + 2 * dX;
            if (X >= dX) X = X - 1;
            if (Y >= dY) Y = Y - 1;
            if (X < 0) X = 0;
            if (Y < 0) Y = 0;
        }
    }

    // console.log("dX: " + dX + ", dY:" + dY);
    //ctx.fillRect(dX - 1, dY - 1, 1, 1);
    //ctx.strokeRect(dX - 1, dY - 1, 1, 1);

    ctx.strokeStyle = "#373640";
    ctx.fillStyle = "#373640";
    ctx.beginPath();
    ctx.moveTo((p0[0]), p0[1]);
    ctx.lineTo((p1[0]), p1[1]);
    ctx.stroke();






}



textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);