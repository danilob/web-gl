var canvas = document.getElementById('window');
var canvas_clipping = document.getElementById('window-clipping');
recorte = new Clipping();
veclines = []
vecpolygons = []
var veclinesclip = [];
var linesClipId = [];

function initCanvas() {
    document.getElementById("window-right").style.visibility = 'hidden';
}

function openJson() { //carrega json file

    var json_obj = JSON.parse(document.getElementById("link").value);
    //alert("This is the scene: "+json_obj.scene)
    console.log("This is the scene: " + json_obj.scene);
    if (json_obj.hasOwnProperty('clipping')) {
        if (json_obj.clipping.hasOwnProperty('top-right')) {
            console.log(json_obj.clipping['top-right']);
            console.log(json_obj.clipping['bottom-left']);
            recorte.xmin = parseFloat(json_obj.clipping['bottom-left'].x);
            recorte.ymin = parseFloat(json_obj.clipping['bottom-left'].y);
            recorte.xmax = parseFloat(json_obj.clipping['top-right'].x);
            recorte.ymax = parseFloat(json_obj.clipping['top-right'].y);
        }
    }
    if (json_obj.hasOwnProperty('lines')) {
        if (json_obj.lines.hasOwnProperty('line')) {
            lines = json_obj.lines.line;
            //console.log(lines);
            for (var i = 0; i < lines.length; i++) {
                console.log(lines[i]); //carrega o segmento x1,y1,x2,y2
                line = new Line();
                line.set(parseFloat(lines[i].x1), parseFloat(lines[i].y1), parseFloat(lines[i].x2), parseFloat(lines[i].y2));
                veclines.push(line);
            }
        }
    }
    if (json_obj.hasOwnProperty('polygons')) {
        if (json_obj.polygons.hasOwnProperty('polygon')) {
            polygons = json_obj.polygons.polygon;
            console.log(polygons);
            for (var i = 0; i < polygons.length; i++) {
                console.log(polygons[i]); //carrega a lista de vetores do poligono i
                ipoly = new Polygon();
                for (var j = 0; j < polygons[i].length; j++) {
                    console.log(polygons[i][j]); //carrega cada vetor do poligono i
                    vec = new Vec2();
                    vec.set(parseFloat(polygons[i][j].x), parseFloat(polygons[i][j].y));
                    ipoly.add(vec);
                }
                vecpolygons.push(ipoly);
            }
        }
    }
    canvas = document.getElementById('window');
    canvas_clipping = document.getElementById('window-clipping');
    draw();

}
var inside = 0;
var outside = 0;

function draw() {

    canvas.width = recorte.width() * 25;
    canvas.height = recorte.height() * 25;


    canvas_clipping.width = recorte.width() * 25;
    canvas_clipping.height = recorte.height() * 25;

    if (canvas.getContext) {
        document.getElementById("window-right").style.visibility = 'visible';

        Width = canvas.width;
        Height = canvas.height;
        context = canvas.getContext('2d');
        //context.transform().scale(5, 5);
        drawBorder(context, Width, Height);
        M = mult(transformCanvas(Width, Height), mult(scale(15, 15), translate(-recorte.center()[0], -recorte.center()[1])));
        drawClipping(M, recorte, context);
        inside = 0;
        outside = 0;
        for (var i = 0; i < veclines.length; i++) {
            drawLine(M, veclines[i], context);


        }

        for (var i = 0; i < vecpolygons.length; i++) {
            drawPolygon(M, vecpolygons[i], context);
        }

    }
    setClipping();
    context = canvas.getContext('2d');

    if (linesClipId) {
        linesClipId.forEach(drawLineColor);
    }
    linesClipId = [];

}

function drawLineColor(value) {
    drawLine(M, veclines[value], context, '#ff9234');
}

function setClipping() {
    if (canvas.getContext) {
        Width = canvas_clipping.width;
        Height = canvas_clipping.height;
        context = canvas_clipping.getContext('2d');
        //context.transform().scale(5, 5);
        drawBorder(context, Width, Height);
        M = mult(transformCanvas(Width, Height), mult(scale(15, 15), translate(-recorte.center()[0], -recorte.center()[1])));
        drawClipping(M, recorte, context);
        veclinesclip = [];
        clippingVecLines(veclines);
        for (var i = 0; i < veclinesclip.length; i++) {
            drawLine(M, veclinesclip[i], context, '#ff9234');
        }
        var logClip = document.getElementById("data-set");
        logClip.innerHTML = "<br>Total de retas: " + veclines.length + ", retas com interseção: " + veclinesclip.length;
        //console.log("inside: " + inside + ", outside: " + outside);

        // for (var i = 0; i < vecpolygons.length; i++) {
        //     drawPolygon(M, vecpolygons[i], context);
        // }
    }
}

function clippingVecLines(lines) {

    for (var i = 0; i < lines.length; i++) {
        var o1 = "";
        var o2 = "";
        x1 = lines[i].x1;
        y1 = lines[i].y1;
        x2 = lines[i].x2;
        y2 = lines[i].y2;
        //calculo o1
        if (y1 > recorte.ymax) {
            o1 += "1";
        } else {
            o1 += "0";
        }
        if (y1 < recorte.ymin) {
            o1 += "1";
        } else {
            o1 += "0";
        }
        if (x1 > recorte.xmax) {
            o1 += "1";
        } else {
            o1 += "0";
        }
        if (x1 < recorte.xmin) {
            o1 += "1";
        } else {
            o1 += "0";
        }

        //calculo outcode 2
        if (y2 > recorte.ymax) {
            o2 += "1";
        } else {
            o2 += "0";
        }
        if (y2 < recorte.ymin) {
            o2 += "1";
        } else {
            o2 += "0";
        }
        if (x2 > recorte.xmax) {
            o2 += "1";
        } else {
            o2 += "0";
        }
        if (x2 < recorte.xmin) {
            o2 += "1";
        } else {
            o2 += "0";
        }
        if (o1 == o2 && o2 == "0000") {
            linesClipId.push(i);
            inside++;
            veclinesclip.push(lines[i]);
        } else if ((o1 != "0000" && o2 == "0000") || (o1 == "0000" && o2 != "0000")) {

            if ((o1 == "0000" && o2 != "0000")) { //(x1,y1) está dentro
                switch (o2) {
                    case "1001":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymax;
                        break;
                    case "0001":
                        var alpha = (recorte.xmin - x1) / (x2 - x1);
                        y2 = (1 - alpha) * y1 + alpha * y2;
                        x2 = recorte.xmin;
                        break;
                    case "0101":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymin;
                        break;
                    case "1000":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymax;
                        break;
                    case "0100":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymin;
                        break;
                    case "1010":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymax;
                        break;
                    case "0010":
                        var alpha = (recorte.xmax - x1) / (x2 - x1);
                        y2 = (1 - alpha) * y1 + alpha * y2;
                        x2 = recorte.xmax;
                        break;
                    case "0110":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x2 = (1 - alpha) * x1 + alpha * x2;
                        y2 = recorte.ymin;
                        break;
                }

            } else {
                switch (o1) {
                    case "1001":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymax;
                        break;
                    case "0001":
                        var alpha = (recorte.xmin - x1) / (x2 - x1);
                        y1 = (1 - alpha) * y1 + alpha * y2;
                        x1 = recorte.xmin;
                        break;
                    case "0101":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymin;
                        break;
                    case "1000":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymax;
                        break;
                    case "0100":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymin;
                        break;
                    case "1010":
                        var alpha = (recorte.ymax - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymax;
                        break;
                    case "0010":
                        var alpha = (recorte.xmax - x1) / (x2 - x1);
                        y1 = (1 - alpha) * y1 + alpha * y2;
                        x1 = recorte.xmax;
                        break;
                    case "0110":
                        var alpha = (recorte.ymin - y1) / (y2 - y1);
                        x1 = (1 - alpha) * x1 + alpha * x2;
                        y1 = recorte.ymin;
                        break;
                }

            }
            linesClipId.push(i);
            inside++;
            //um dos pontos está dentro da area de recorte
            l = new Line();
            l.set(x1, y1, x2, y2);
            veclinesclip.push(l);
        } else if ((o1[0] & o2[0] | o1[1] & o2[1] | o1[2] & o2[2] | o1[3] & o2[3]) == 0) {
            //pode ser que exista uma região que esteja dentro da area de recorte
            var a1, a2, a3, a4;
            a1 = (recorte.ymin - y1) / (y2 - y1);
            a2 = (recorte.xmin - x1) / (x2 - x1);
            a3 = (recorte.ymax - y1) / (y2 - y1);
            a4 = (recorte.xmax - x1) / (x2 - x1);
            hit = false;
            var lx1, lx2, ly1, ly2;
            //console.log("a1: " + a1 + ", a2: " + a2 + ", a3: " + a3 + ", a4: " + a4);
            if (a1 > a2 && a1 < 1) { //acertou ymin primeiro
                lx1 = (1 - a1) * x1 + a1 * x2;
                ly1 = recorte.ymin;
                if (a3 < a4 && a4 < 1) { //acertou xmax primeiro
                    //usar a1 e a3
                    lx2 = (1 - a3) * x1 + a3 * x2;
                    ly2 = recorte.ymax;
                    hit = true;
                } else if (a4 < a3 && a3 < 1) { //acertou ymax primeiro
                    //usar a1 e a4
                    lx2 = recorte.xmax;
                    ly2 = (1 - a4) * y1 + a4 * y2;

                    hit = true;
                } else if (a4 < a3 && a4 < 1) {
                    lx2 = recorte.xmax;
                    ly2 = (1 - a4) * y1 + a4 * y2;

                    hit = true;
                } else if (a4 > a3 && a4 < 1) {
                    lx2 = recorte.xmax;
                    ly2 = (1 - a4) * y1 + a4 * y2;

                    hit = true;
                } else if (a4 > a3 && a3 < 1) {
                    ly2 = recorte.ymax;
                    lx2 = (1 - a3) * x1 + a3 * x2;

                    hit = true;
                }

            } else if (a2 > a1 && a2 < 1) { //acertou xmin primeiro
                lx1 = recorte.xmin;
                ly1 = (1 - a2) * y1 + a2 * y2;
                if (a3 < a4 && a4 < 1) { //acertou xmax primeiro
                    //usar a1 e a3
                    lx2 = (1 - a3) * x1 + a3 * x2;
                    ly2 = recorte.ymax;
                    hit = true;
                } else if (a4 < a3 && a3 < 1) { //acertou ymax primeiro
                    //usar a1 e a4
                    lx2 = recorte.xmax;
                    ly2 = (1 - a4) * y1 + a4 * y2;
                    hit = true;
                } else if (a4 < a3 && a4 < 1) {
                    lx2 = recorte.xmax;
                    ly2 = (1 - a4) * y1 + a4 * y2;

                    hit = true;
                }
            }
            // if(!hit){
            //     if(a2<a3 && a4<1){ //acertou xmax primeiro
            //         //usar a1 e a3
            //         lx2 = (1-a3)*x1+a3*x2;
            //         ly2 = recorte.ymax;
            //         if(a1>a2 && a1<1){
            //             lx1 = (1-a1)*x1+a1*x2;
            //             ly1 = recorte.ymin;
            //         }else{
            //             lx1 = recorte.xmin;
            //             ly1 = (1-a2)*y1+a2*y2;
            //         }
            //         hit = true;
            //     } else if(a4<a3 && a3<1){ //acertou ymax primeiro
            //         //usar a1 e a4
            //         lx2 = recorte.xmax;
            //         ly2 = (1-a4)*y1+a4*y2;
            //         if(a1>a2 && a1<1){
            //             lx1 = (1-a1)*x1+a1*x2;
            //             ly1 = recorte.ymin;
            //         }else{
            //             lx1 = recorte.xmin;
            //             ly1 = (1-a2)*y1+a2*y2;
            //         }
            //         hit = true;
            //     }
            // }
            if (hit) {
                l = new Line();
                l.set(lx1, ly1, lx2, ly2);
                veclinesclip.push(l);
                linesClipId.push(i);
                inside++;

            } else {
                outside++;
            }


        } else {
            //ambos os pontos estão fora da área de recorte
            outside++;
        }
        console.log(linesClipId);
        //lines[i].show();
        //console.log("o1: " + o1 + ", o2: " + o2);
    }
}