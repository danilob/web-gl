function drawBoxFill(M, canv) { //desenha um cubo passando a matriz de transformação e o canvas para desenho
    a = multVec(M, [0.5, 0.5, 1]);
    b = multVec(M, [0.5, -0.5, 1]);
    c = multVec(M, [-0.5, -0.5, 1]);
    d = multVec(M, [-0.5, 0.5, 1]);
    canv.beginPath();
    canv.moveTo(a[0], a[1]);
    canv.lineTo(b[0], b[1]);
    canv.lineTo(c[0], c[1]);
    canv.lineTo(d[0], d[1]);
    canv.fill();
}

function drawBorder(border, Width, Height) {
    border.beginPath();
    border.setLineDash([]);
    border.moveTo(0, 0);
    border.lineTo(Width, 0);
    border.lineTo(Width, Height);
    border.lineTo(0, Height);
    border.lineTo(0, 0);
    border.stroke();
}


function drawClipping(M, recorte, context) {
    a = multVec(M, [recorte.xmin, recorte.ymin, 1]);
    b = multVec(M, [recorte.xmax, recorte.ymin, 1]);
    c = multVec(M, [recorte.xmax, recorte.ymax, 1]);
    d = multVec(M, [recorte.xmin, recorte.ymax, 1]);
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.lineTo(c[0], c[1]);
    context.lineTo(d[0], d[1]);
    context.lineTo(a[0], a[1]);
    context.stroke();
}


function drawLine(M, line, context, color = "#000000") {

    a = multVec(M, [line.x1, line.y1, 1]);
    b = multVec(M, [line.x2, line.y2, 1]);
    context.beginPath();
    context.moveTo(a[0], a[1]);
    context.lineTo(b[0], b[1]);
    context.strokeStyle = color;
    context.stroke();
    context.strokeStyle = "#000000";
}

function drawPolygon(M, polygon, context) {
    context.beginPath();
    for (var j = 0; j < polygon.points.length; j++) {
        a = multVec(M, [polygon.points[j].x, polygon.points[j].y, 1]);
        if (j == 0) {
            context.moveTo(a[0], a[1]);
        } else {
            context.lineTo(a[0], a[1]);
        }
    }
    context.fill();

}