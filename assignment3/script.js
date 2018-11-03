var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var code = textarea.value;

var scale = 1;

var points_curveH = [] //armazena os pontos da curva de hermite
var points_curveB = []
var np = 30;

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    eval(textarea.value);
}

function drawCircle(M, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

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

function drawArrow(context, fromx, fromy, tox, toy) {
    var headlen = 8; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.lineWidth = 2;
    //context.setLineDash([1, 2]);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    //context.setLineDash([]);
}

function setSizePoints(v) {
    np = v;
}

function showPoints() {
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    for (var i = 1; i < points_curveH.length - 1; i++) {
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#6a0000");
    }

    for (var i = 1; i < points_curveB.length - 1; i++) {
        pa = multVec(mult(M, translate(points_curveB[i][0][0], points_curveB[i][0][1])), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#573697aa");
        ctx.font = "12px Arial";
        ctx.fillText("u=" + (i / (points_curveB.length - 1)).toFixed(2), pa[0] - 15, pa[1] - 15);
    }
}


function setHermite(p0, p1, p0l, p1l) {
    points_curveH = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos0l = multVec(mult(M, translate(p0[0] + p0l[0] / 10., p0[1] + p0l[1] / 10.)), [0, 0, 1]);
    pos1l = multVec(mult(M, translate(p1[0] + p1l[0] / 10., p1[1] + p1l[1] / 10.)), [0, 0, 1]);
    calculatePointsCurveHermite(p0, p1, p0l, p1l);
    ctx.lineWidth = 1.5;
    drawCurveHermite();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    drawArrow(ctx, pos0[0], pos0[1], pos0l[0], pos0l[1]);
    drawArrow(ctx, pos1[0], pos1[1], pos1l[0], pos1l[1]);
    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");

}

function drawCurveHermite() {
    ctx.fillStyle = "#6bd5e1";
    ctx.strokeStyle = "#6bd5e1";

    for (var i = 0; i < points_curveH.length - 1; i++) {
        ctx.beginPath();
        //
        //alert(points_curve[i]);
        //alert(mult(M,translate(parseFloat(points_curve[i][0][0]),parseFloat(points_curve[i][0][1]))));
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveH[i + 1][0][0], points_curveH[i + 1][0][1])), [0, 0, 1]);
        //alert(pa);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}

function calculatePointsCurveHermite(p0, p1, p0l, p1l) {
    //p0l = versor(p0l);
    //p1l = versor(p1l);
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];
    for (var i = 0; i <= np; i++) {
        u = (1. * (i)) / np;
        p = mult(getMatrixBuhermite(u), q);
        //alert(p);
        points_curveH.push([p[0], p[1]]);
    }
}

function getMatrixBuhermite(u) {
    return [
        [2 * u * u * u - 3 * u * u + 1, -2 * u * u * u + 3 * u * u, u * u * u - 2 * u * u + u, u * u * u - u * u]
    ];
    //Mh = [[1,0,0,0],[0,0,1,0],[-3,3,-2,-1],[2,-2,1,1]];
    //uT = [[1,u,u*u,u*u*u]];
    //return mult(uT,Mh);
}

function buildEquilatero(p0, p1) {
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    ctx.fillStyle = "#494949";
    ctx.fillText("A", pos0[0] - 7, pos0[1] - 7);
    ctx.fillText("B", pos1[0] + 7, pos1[1] - 7);

    vecu = [p1[0] - p0[0], p1[1] - p0[1]];
    vecv = [-(p1[1] - p0[1]), p1[0] - p0[0]];
    vecv_u = versor(vecv);

    l = module(vecu[0], vecu[1]);
    h = (l / 2.) * Math.sqrt(3);
    C = [(p1[0] + p0[0]) / 2., (p1[1] + p0[1]) / 2.];
    p3 = [vecv_u[0] * h + C[0], vecv_u[1] * h + C[1]];
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    ctx.fillText("C", pos3[0] - 7, pos3[1] - 7);
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "#6a000044";
    ctx.strokeStyle = "#6a000044";
    ctx.beginPath();
    ctx.moveTo(pos0[0], pos0[1]);
    ctx.lineTo(pos1[0], pos1[1]);
    ctx.lineTo(pos3[0], pos3[1]);
    ctx.lineTo(pos0[0], pos0[1]);
    ctx.stroke();
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#fb9a40");
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#fb9a40");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#fb9a40");
}

function setBezier(p0, p1, p2, p3) {
    points_curveB = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos2 = multVec(mult(M, translate(p2[0], p2[1])), [0, 0, 1]);
    pos3 = multVec(mult(M, translate(p3[0], p3[1])), [0, 0, 1]);
    calculatePointsCurveBezier(p0, p1, p2, p3);
    ctx.lineWidth = 1.5;
    drawCurveBezier();
    //ctx.fillStyle = "#ff836444";
    //ctx.strokeStyle = "#ff836444";
    //drawArrow(ctx,pos0[0],pos0[1],pos0l[0],pos0l[1]);
    //drawArrow(ctx,pos1[0],pos1[1],pos1l[0],pos1l[1]);
    ctx.fillStyle = "#fbd341";
    ctx.strokeStyle = "#fbd341";
    ctx.beginPath();
    ctx.moveTo(pos0[0], pos0[1]);
    ctx.lineTo(pos1[0], pos1[1]);
    ctx.lineTo(pos2[0], pos2[1]);
    ctx.lineTo(pos3[0], pos3[1]);
    ctx.stroke();

    ctx.fillStyle = "#494949";
    ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
    ctx.fillText("p3", pos3[0] + 7, pos3[1] - 7);
    drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#fb9a40");
    drawCircle(mult(M, translate(p3[0], p3[1])), ctx, "#fb9a40");
    ctx.fillStyle = "#494949";
    ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
    ctx.fillText("p2", pos2[0] + 7, pos2[1] - 7);
    drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#fb9a40");
    drawCircle(mult(M, translate(p2[0], p2[1])), ctx, "#fb9a40");


}

function calculatePointsCurveBezier(p0, p1, p2, p3) {
    //p0l = versor(p0l);
    //p1l = versor(p1l);
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p2[0], p2[1]],
        [p3[0], p3[1]]
    ];
    for (var i = 0; i <= np; i++) {
        u = (1. * (i)) / np;
        p = mult(getMatrixBuBezier(u), q);
        points_curveB.push([p[0], p[1]]);
    }
}

function getMatrixBuBezier(u) {
    return [
        [-1 * u * u * u + 3 * u * u - 3 * u + 1, 3 * u * u * u - 6 * u * u + 3 * u, -3 * u * u * u + 3 * u * u, u * u * u]
    ];
    //Mh = [[1,0,0,0],[0,0,1,0],[-3,3,-2,-1],[2,-2,1,1]];
    //uT = [[1,u,u*u,u*u*u]];
    //return mult(uT,Mh);
}

function drawCurveBezier() {
    ctx.fillStyle = "#20716a";
    ctx.strokeStyle = "#20716a";

    for (var i = 0; i < points_curveB.length - 1; i++) {
        ctx.beginPath();
        //
        //alert(points_curve[i]);
        //alert(mult(M,translate(parseFloat(points_curve[i][0][0]),parseFloat(points_curve[i][0][1]))));
        pa = multVec(mult(M, translate(points_curveB[i][0][0], points_curveB[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveB[i + 1][0][0], points_curveB[i + 1][0][1])), [0, 0, 1]);
        //alert(pa);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}



function tests(p0, p1, p2, p3) {
    exampleOfUse()
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.setTransform(1, 0, 0, 1, 0, 0);
    M = transformCanvas(canvas.width, canvas.height);
    p0 = new Vec2(p0[0], p0[1]);
    p1 = new Vec2(p1[0], p1[1]);
    p2 = new Vec2(p2[0], p2[1]);
    p3 = new Vec2(p3[0], p3[1]);
    curve = new CurveBezier(p0, p1, p2, p3);
    arc = new ArcLength();
    arc.adaptive_integration(curve, 0.0, 1.0, 0.0000001);
    //alert(arc.table.length);
    //alert(arc.length);
    //arc.showTable();
    nc = np - 1;
    points_curveB = [];
    for (var i = 0; i <= nc; i++) {
        //console.log(arc.length*(1.0*i/(points_curveB.length-1)));
        //console.log(1.0*i*arc.length/nc);
        tp = arc.getVec4S(curve, 1.0 * i * arc.length / nc);
        points_curveB.push([tp.x, tp.y]);
        pa = multVec(mult(M, translate(tp.x, tp.y)), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#2c2828aa");
        ctx.font = "12px Arial";
        ctx.fillText("u=" + (arc.getValueU(1.0 * i * arc.length / nc)).toFixed(2), pa[0] - 15, pa[1] - 15);

    }

    // ctx.fillStyle = "#20716a";
    // ctx.strokeStyle = "#20716a";

    // for (var i = 0; i < points_curveB.length - 1; i++) {
    //     ctx.beginPath();
    //     //
    //     //alert(points_curveB[i]);
    //     //alert(mult(M,translate(parseFloat(points_curve[i][0][0]),parseFloat(points_curve[i][0][1]))));
    //     pa = multVec(mult(M, translate(points_curveB[i][0], points_curveB[i][1])), [0, 0, 1]);
    //     pb = multVec(mult(M, translate(points_curveB[i + 1][0], points_curveB[i + 1][1])), [0, 0, 1]);
    //     //alert(pa);
    //     ctx.moveTo(pa[0], pa[1]);
    //     ctx.lineTo(pb[0], pb[1]);
    //     ctx.stroke();
    // }
}

textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);