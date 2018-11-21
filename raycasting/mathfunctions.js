function Ray(o, d) {
    this.o = o; //origem
    this.d = d; //direção do raio
}

Ray.prototype.show = function() {
    console.log("O" + "(" + this.o.x + "," + this.o.y + "," + this.o.z + "," + this.o.w + ")" + ", d = " + "(" + this.d.x + "," + this.d.y + "," + this.d.z + "," + this.d.w + ")")
}

Ray.prototype.get = function(t) {
    return new Vec3().sum(this.o, this.d.prod(this.d, t));
}


function Vec3() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
}

function Vec3(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vec3.prototype.set = function(v) {
    this.x = v;
    this.y = v;
    this.z = v;
}

Vec3.prototype.set = function(x, y, z, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}
Vec3.prototype.sum = function(p1, p2) {
    return new Vec3(p1.x + p2.x, p1.y + p2.y, p1.z + p2.z);
}
Vec3.prototype.minus = function(p1, p2) {
    return new Vec3(p1.x - p2.x, p1.y - p2.y, p1.z - p2.z);
}
Vec3.prototype.dot = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
}
Vec3.prototype.cross = function(p1, p2) {
    return new Vec3(p1.y * p2.z - p1.z * p2.y, -(p1.x * p2.z - p1.z * p2.x), p1.x * p2.y - p1.y * p2.x);
}
Vec3.prototype.module = function(p) {
    return Math.sqrt(this.dot(p, p));
}
Vec3.prototype.div = function(p, k) {
    return new Vec3(p.x / k, p.y / k, p.z / k);
}
Vec3.prototype.prod = function(p, k) {
    return new Vec3(p.x * k, p.y * k, p.z * k);
}
Vec3.prototype.compond = function(p, p0) {
    return new Vec3(p.x * p0.x, p.y * p0.y, p.z * p0.z);
}
Vec3.prototype.unitary = function(p) {
    var m = this.module(p);
    return new Vec3(p.x / m, p.y / m, p.z / m);
}

Vec3.prototype.show = function() {
    console.log("x: " + this.x + ", y: " + this.y + ", z: " + this.z);
}

function identity() { // identidade 
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}
//Matriz de escala(sx,sy,sz) com retorno: 4x4
function scaleMatrix(sx, sy, sz) { // identidade 
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function scaleMatrixI(sx, sy, sz) { // identidade 
    return [
        [1. / sx, 0, 0, 0],
        [0, 1. / sy, 0, 0],
        [0, 0, 1. / sz, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

//matriz transposta de uma matriz 4x4
function transpose(T) {
    return [
        [T[0][0], T[1][0], T[2][0], T[3][0]],
        [T[0][1], T[1][1], T[2][1], T[3][1]],
        [T[0][2], T[1][2], T[2][2], T[3][2]],
        [T[0][3], T[1][3], T[2][3], T[3][3]]
    ];
}

//TODO: definir matriz de translação (tx,ty,tz) com retorno: 4x4
function translateMatrix(tx, ty, tz) {
    return [
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function translateMatrixI(tx, ty, tz) {
    return [
        [1, 0, 0, -tx],
        [0, 1, 0, -ty],
        [0, 0, 1, -tz],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

//TODO: definir matriz de rotação no eixo x passando um angulo em graus com retorno: 4x4
function rotateMatrixX(theta) {
    var theta = (theta * Math.PI) / 180.;
    return [
        [1, 0, 0, 0],
        [0, Math.cos(theta), -Math.sin(theta), 0],
        [0, Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function rotateMatrixXI(theta) {
    return transpose(rotateMatrixX(theta));
}

function rotateMatrixY(theta) {
    var theta = (theta * Math.PI) / 180.;
    return [
        [Math.cos(theta), 0, Math.sin(theta), 0],
        [0, 1, 0, 0],
        [-Math.sin(theta), 0, Math.cos(theta), 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function rotateMatrixYI(theta) {
    return transpose(rotateMatrixY(theta));
}

function rotateMatrixZ(theta) {
    var theta = (theta * Math.PI) / 180.;
    return [
        [Math.cos(theta), -Math.sin(theta), 0, 0],
        [Math.sin(theta), Math.cos(theta), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function rotateMatrixZI(theta) {
    return transpose(rotateMatrixZ(theta));
}
//TODO: definir matriz de rotação no eixo y passando um angulo em graus com retorno: 4x4

//TODO: definir matriz de rotação no eixo z passando um angulo em graus com retorno: 4x4

function multMatrix(a, b) {
    var aNumRows = a.length,
        aNumCols = a[0].length,
        bNumRows = b.length,
        bNumCols = b[0].length,
        m = new Array(aNumRows); // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0; // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}

function multVec(A, b) { //multiplicação de uma matriz (4x4) e um vetor 4x1
    var C = [0, 0, 0, 1];
    var i;
    for (i = 0; i < 4; i++) {
        C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2] + +A[i][3] * b[3];
    }
    return new Vec3(C[0], C[1], C[2], C[3]); //retorna um vetor 4x1
}

function multVec4(A, p) { //multiplicação de uma matriz (4x4) e um vetor 4x1
    var b = [p.x, p.y, p.z, 1];
    var C = [0, 0, 0, 1];
    var i;
    for (i = 0; i < 4; i++) {
        C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2] + +A[i][3] * b[3];
    }
    return new Vec3(C[0], C[1], C[2], C[3]); //retorna um vetor 4x1
}

function transformCanvas(Width, Height) {
    return [
        [1, 0, 0, Width / 2.],
        [0, -1, 0, Height / 2.],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

function transformToSystem(Width, Height) {
    return [
        [1, 0, 0, -Width / 2],
        [0, -1, 0, Height / 2],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
}

//definidos
function convertMatrix(M) {
    var b = new glMatrixArrayType(16);
    b[0] = M[0][0];
    b[1] = M[1][0];
    b[2] = M[2][0];
    b[3] = M[3][0];
    b[4] = M[0][1];
    b[5] = M[1][1];
    b[6] = M[2][1];
    b[7] = M[3][1];
    b[8] = M[0][2];
    b[9] = M[1][2];
    b[10] = M[2][2];
    b[11] = M[3][2];
    b[12] = M[0][3];
    b[13] = M[1][3];
    b[14] = M[2][3];
    b[15] = M[3][3];
    return b;
}

function createFromLines(l0, l1, l2, l3) {
    var b = new glMatrixArrayType(16);
    b[0] = l0[0];
    b[1] = l1[0];
    b[2] = l2[0];
    b[3] = l3[0];
    b[4] = l0[1];
    b[5] = l1[1];
    b[6] = l2[1];
    b[7] = l3[1];
    b[8] = l0[2];
    b[9] = l1[2];
    b[10] = l2[2];
    b[11] = l3[2];
    b[12] = l0[3];
    b[13] = l1[3];
    b[14] = l2[3];
    b[15] = l3[3];
    return b;
}
//de câmera para mundo
function lookAtM(eye, at, up) {
    var F = identity();
    Vec = new Vec3();
    zc = Vec.unitary(Vec.minus(eye, at));
    xc = Vec.unitary(Vec.cross(up, zc));
    yc = Vec.unitary(Vec.cross(zc, xc));
    F[0][0] = xc.x;
    F[0][1] = yc.x;
    F[0][2] = zc.x;

    F[1][0] = xc.y;
    F[1][1] = yc.y;
    F[1][2] = zc.y;

    F[2][0] = xc.z;
    F[2][1] = yc.z;
    F[2][2] = zc.z;

    F[0][3] = eye.x;
    F[1][3] = eye.y;
    F[2][3] = eye.z;
    return F;
}

//de mundo para camera
function lookAtInverseM(eye, at, up) {
    var F = identity();
    Vec = new Vec3();
    zc = Vec.unitary(Vec.minus(eye, at));
    xc = Vec.unitary(Vec.cross(up, zc));
    yc = Vec.unitary(Vec.cross(zc, xc));


    F[0][0] = xc.x;
    F[0][1] = xc.y;
    F[0][2] = xc.z;

    F[1][0] = yc.x;
    F[1][1] = yc.y;
    F[1][2] = yc.z;

    F[2][0] = zc.x;
    F[2][1] = zc.y;
    F[2][2] = zc.z;

    F[0][3] = -Vec.dot(eye, xc);
    F[1][3] = -Vec.dot(eye, yc);
    F[2][3] = -Vec.dot(eye, zc);
    return F;
}



function Camera(eye, at, up) {
    this.eye = eye;
    this.at = at;
    this.up = up;
}

Camera.prototype.lookAt = function() {
    return lookAtM(this.eye, this.at, this.up);
}

Camera.prototype.lookAtInverse = function() {
    return lookAtInverseM(this.eye, this.at, this.up);
}

var ambient = 0;
var pontual = 1;

function Light(type = 0) {
    if (type == ambient) {
        this.type = ambient;
        this.ambient = new Vec3(0, 0, 0);
    } else if (type == pontual) {
        this.type = pontual;
        this.position = new Vec3(0, 0, 0);
        this.ambient = new Vec3(0, 0, 0);
        this.specular = new Vec3(0, 0, 0);
        this.difuse = new Vec3(0, 0, 0);
        this.attenuation = new Vec3(0, 0, 0);
    }

}

Light.prototype.setPosition = function(x = 0, y = 0, z = 0) {
    this.position = new Vec3(x, y, z);
}

Light.prototype.setAmbient = function(x = 0, y = 0, z = 0) {
    this.ambient = new Vec3(x, y, z);
}

Light.prototype.setSpecular = function(x = 0, y = 0, z = 0) {
    this.specular = new Vec3(x, y, z);
}

Light.prototype.setDifuse = function(x = 0, y = 0, z = 0) {
    this.difuse = new Vec3(x, y, z);
}

Light.prototype.setAttenuation = function(x = 0, y = 0, z = 0) {
    this.attenuation = new Vec3(x, y, z);
}
Light.prototype.getColorTestShadow = function(shape, p, n, v, objects, hitp) {
    var Vec = new Vec3();
    if (this.type == ambient) {
        return Vec.compond(shape.ambient, this.ambient);
    } else if (this.type == pontual) {
        var amb = Vec.compond(shape.ambient, this.ambient);

        //testar se o ponto está obstruído
        ray_w = new Ray(p, new Vec3(this.position.x, this.position.y, this.position.z));
        //console.log(ray_w);
        //ray_w.o = p;
        //ray_w.d = this.position;
        //ray_w.d = Vec.unitary(ray_w.d);
        // var camera = new Camera();
        // camera.eye = new Vec3(p.x, p.y, p.z);
        // camera.at = new Vec3(this.position.x, this.position.y, -this.position.z);
        // camera.up = new Vec3(0, 1, 0);
        // ray = new Ray(new Vec3(0, 0, 0), multVec4(camera.lookAtInverse(), new Vec3(this.position.x, this.position.y, this.position.z)));



        // var ray_w = new Ray(multVec4(camera.lookAt(), ray.o), multVec4(camera.lookAt(), ray.d));


        //ray_w.d = Vec.unitary(ray_w.d);
        var dlight = Vec.module(Vec.minus(p, this.position));
        var hit = false;
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].name != shape.name) {
                var result = objects[i].testIntersectionRay(ray_w);
                if (result[0]) {
                    if (result[3] > 0 && result < dlight) {
                        //if (Vec.dot(Vec.minus(p, this.position), Vec.minus(p, this.position)) > Vec.dot(Vec.minus(p, result[1]), Vec.minus(p, result[1]))) {
                        hit = true;
                        break;
                    }
                }
            }
        }
        if (hit) {
            return amb;
        }




        var l = Vec.minus(this.position, p);
        var v = Vec.minus(p, v);

        d = Vec.module(Vec.minus(p, this.position));
        var att = 1. / (this.attenuation.x + this.attenuation.y * d + this.attenuation.z * d * d);
        var factor_diff = 0;
        if (Vec.dot(l, n) > 0) {
            factor_diff = Math.max(Vec.dot(l, n) / (Vec.module(l) * Vec.module(n)), 0);
        }
        //material do objeto com a luz -> cor difusa
        var diff = Vec.compond(shape.difuse, this.difuse);
        //aplicando o fator e a atenuação
        diff = Vec.prod(diff, att * factor_diff);

        //parte especular
        l = Vec.unitary(l);
        var r = Vec.minus(Vec.prod(Vec.prod(n, Vec.dot(l, n)), 2), l);
        var h = Vec.unitary(Vec.minus(v, this.position));
        r = Vec.unitary(Vec.sum(r, h));
        factor_spe = 0;
        if (Vec.dot(r, n) > 0) {
            factor_spe = Math.max(Math.pow(Vec.dot(r, n), shape.shine), 0);
        }
        //material do objeto com a luz -> cor especular
        var spe = Vec.compond(shape.specular, this.specular);
        //aplicando o fator e a atenuação
        spe = Vec.prod(spe, att * factor_spe);
        return Vec.sum(amb, Vec.sum(diff, spe));


    }
    return new Vec3(0, 0, 0);
}
Light.prototype.getColor = function(shape, p, n, v) { //p = posição de interseção, n = normal e v=posição do observador
    var Vec = new Vec3();
    if (this.type == ambient) {
        return Vec.compond(shape.ambient, this.ambient);
    } else if (this.type == pontual) {
        var amb = Vec.compond(shape.ambient, this.ambient);
        var l = Vec.minus(this.position, p);
        var v = Vec.minus(p, v);

        d = Vec.module(Vec.minus(p, this.position));
        var att = 1. / (this.attenuation.x + this.attenuation.y * d + this.attenuation.z * d * d);
        var factor_diff = 0;
        if (Vec.dot(l, n) > 0) {
            factor_diff = Math.max(Vec.dot(l, n) / (Vec.module(l) * Vec.module(n)), 0);
        }
        //material do objeto com a luz -> cor difusa
        var diff = Vec.compond(shape.difuse, this.difuse);
        //aplicando o fator e a atenuação
        diff = Vec.prod(diff, att * factor_diff);

        //parte especular
        l = Vec.unitary(l);
        var r = Vec.minus(Vec.prod(Vec.prod(n, Vec.dot(l, n)), 2), l);
        var h = Vec.unitary(Vec.minus(v, this.position));
        r = Vec.unitary(Vec.sum(r, h));
        factor_spe = 0;
        if (Vec.dot(r, n) > 0) {
            factor_spe = Math.max(Math.pow(Vec.dot(r, n), shape.shine), 0);
        }
        //material do objeto com a luz -> cor especular
        var spe = Vec.compond(shape.specular, this.specular);
        //aplicando o fator e a atenuação
        spe = Vec.prod(spe, att * factor_spe);
        return Vec.sum(amb, Vec.sum(diff, spe));


    }
    return new Vec3(0, 0, 0);
}
var sphere = 0;
var cube = 1;
var cylinder = 2;
var cone = 3;

function Shape(type = 0) {
    this.geometry = type;
    this.name = "";
    this.translate = new Vec3(0, 0, 0);
    this.scale = new Vec3(0, 0, 0);
    this.rotate = new Vec3(0, 0, 0);
    this.ambient = new Vec3(0, 0, 0);
    this.specular = new Vec3(0, 0, 0);
    this.difuse = new Vec3(0, 0, 0);
    this.shine = 0;
}



Shape.prototype.setScale = function(x = 0, y = 0, z = 0) {
    this.scale = new Vec3(x, y, z);
}

Shape.prototype.setAmbient = function(x = 0, y = 0, z = 0) {
    this.ambient = new Vec3(x, y, z);
}

Shape.prototype.setSpecular = function(x = 0, y = 0, z = 0) {
    this.specular = new Vec3(x, y, z);
}

Shape.prototype.setDifuse = function(x = 0, y = 0, z = 0) {
    this.difuse = new Vec3(x, y, z);
}

Shape.prototype.setShine = function(x = 0) {
    this.shine = x;
}

Shape.prototype.setTranslate = function(x = 0, y = 0, z = 0) {
    this.translate = new Vec3(x, y, z);
}

Shape.prototype.setRotateX = function(angle) {
    this.rotate.x = angle;
}

Shape.prototype.setRotateY = function(angle) {
    this.rotate.y = angle;
}

Shape.prototype.setRotateZ = function(angle) {
    this.rotate.z = angle;
}

Shape.prototype.transformMatrix = function() {
    var T = translateMatrix(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(T, multMatrix(R, S));
}

Shape.prototype.transformMatrixVec = function() {
    var R = multMatrix(rotateMatrixX(this.rotate.x), multMatrix(rotateMatrixY(this.rotate.y), rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(R, S);
}

Shape.prototype.transformMatrixInverse = function() {
    var Ti = translateMatrixI(this.translate.x, this.translate.y, this.translate.z); //TODO: modificar para receber a matriz de escala
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, multMatrix(Ri, Ti));
}

Shape.prototype.transformMatrixVecInverse = function() {
    var Ri = multMatrix(rotateMatrixXI(this.rotate.z), multMatrix(rotateMatrixYI(this.rotate.y), rotateMatrixZI(this.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    return multMatrix(Si, Ri);
}

Shape.prototype.testIntersectionRay = function(ray, tmax = 0) {
    //salvando raio em coordenadas do mundo para calcular o parâmetro t
    var ray_w = ray;
    var M_i = this.transformMatrixInverse();
    var M_i_v = this.transformMatrixVecInverse();
    var Vec = new Vec3();
    //transformando raio para coordenadas locais do objeto
    ray.d = Vec.minus(ray.d, ray.o);
    ray.d = Vec.unitary(ray.d);
    ray.o = multVec4(M_i, ray.o);
    ray.d = multVec4(M_i_v, ray.d);
    //ray.d.w = 0;
    //!importante
    ray.d = Vec.unitary(ray.d);

    if (this.geometry == sphere) { //testar interseção com a esfera
        //interseção com esfera na origem e raio unitário
        var a = Vec.dot(ray.d, ray.d);
        var b = 2 * (Vec.dot(ray.d, ray.o));
        var c = Vec.dot(ray.o, ray.o) - 1;
        var delta = b * b - 4 * a * c;

        if (delta >= 0) {
            var t1 = (-b + Math.sqrt(delta)) / (2 * a);
            var t2 = (-b - Math.sqrt(delta)) / (2 * a);
            t = Math.min(t1, t2);
            var point = ray.get(t);
            var normal = point;
            var M = this.transformMatrix();
            point = multVec4(M, point);
            M = this.transformMatrixVec();
            normal = multVec4(M, normal);
            normal = Vec.unitary(normal);
            var t_ = Vec.module(Vec.minus(ray_w.o, point));
            // if (t_ > tmax && tmax != 0) {
            //     return [false, null];
            // }
            return [true, point, normal, t_];
        }

    }
    if (this.geometry == cube) {
        var final_normal = null;
        var final_point = null;
        var final_t = null;
        Vec = new Vec3();
        var bound_min = new Vec3(-0.5, -0.5, -0.5);
        var bound_max = new Vec3(0.5, 0.5, 0.5);
        var n;
        var p0;
        var t;
        //plano superior xz
        n = new Vec3(0, 1, 0);
        p0 = new Vec3(0.5, 0.5, 0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.x >= bound_min.x && p.x <= bound_max.x) && (p.z >= bound_min.z && p.z <= bound_max.z)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;

                }

            }
        }
        //plano inferior xz
        n = new Vec3(0, -1, 0);
        p0 = new Vec3(0.5, -0.5, 0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.x >= bound_min.x && p.x <= bound_max.x) && (p.z >= bound_min.z && p.z <= bound_max.z)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                } else if (t_ < final_t) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                }
            }
        }
        //plano lateral positiva xy
        n = new Vec3(1, 0, 0);
        p0 = new Vec3(0.5, 0.5, 0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.y >= bound_min.y && p.y <= bound_max.y) && (p.z >= bound_min.z && p.z <= bound_max.z)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                } else if (t_ < final_t) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                }
            }
        }
        //plano lateral negativa xy
        n = new Vec3(-1, 0, 0);
        p0 = new Vec3(-0.5, 0.5, 0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.y >= bound_min.y && p.y <= bound_max.y) && (p.z >= bound_min.z && p.z <= bound_max.z)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                } else if (t_ < final_t) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                }
            }
        }
        //plano lateral positiva zy
        n = new Vec3(0, 0, 1);
        p0 = new Vec3(0.5, 0.5, 0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.y >= bound_min.y && p.y <= bound_max.y) && (p.x >= bound_min.x && p.x <= bound_max.x)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                } else if (t_ < final_t) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                }
            }
        }
        //plano lateral negativa zy
        n = new Vec3(0, 0, -1);
        p0 = new Vec3(0.5, 0.5, -0.5);
        if (Vec.dot(ray.d, n) != 0) {
            t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
            p = ray.get(t);
            //verificar limites
            if ((p.y >= bound_min.y && p.y <= bound_max.y) && (p.x >= bound_min.x && p.x <= bound_max.x)) {
                var point = ray.get(t);
                var normal = n;
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                normal = Vec.unitary(normal);
                var t_ = Vec.module(Vec.minus(point, ray_w.o));
                if (final_t == null) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                } else if (t_ < final_t) {
                    final_normal = normal;
                    final_point = point;
                    final_t = t_;
                }
            }
        }


        if (final_t != null) {
            // if (final_t > tmax && tmax != 0) {
            //     return [false, null];
            // }
            return [true, final_point, final_normal, final_t];
        }

    }
    if (this.geometry == cylinder) {
        //console.log("testing...");
        var final_normal = null;
        var final_point = null;
        var final_t = null;
        //testar interseção com o cilindro infinito
        va = new Vec3(0, 1, 0);
        pa = new Vec3(0, -0.5, 0);
        dp = Vec.minus(ray.o, pa);
        var r = 1;
        var a = Vec.dot(Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))), Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))));
        var b = 2 * (Vec.dot(Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))), Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va)))));
        var c = Vec.dot(Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va))), Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va)))) - 1;
        var delta = b * b - 4 * a * c;
        if (delta >= 0) {
            var t1 = (-b + Math.sqrt(delta)) / (2 * a);
            var t2 = (-b - Math.sqrt(delta)) / (2 * a);
            t = Math.min(t1, t2);
            var point = ray.get(t);
            if (point.y < 0.5 && point.y > -0.5) {
                var normal = Vec.minus(point, new Vec3(0, point.y, 0));
                normal = Vec.unitary(normal);
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                final_normal = Vec.unitary(normal);
                final_t = Vec.module(Vec.minus(point, ray_w.o));
                final_point = point;
            } else {
                //testando com as capas
                //superior
                n = new Vec3(0, 1, 0);
                p0 = new Vec3(0, 0.5, 0);
                if (Vec.dot(ray.d, n) != 0) {
                    t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
                    p = ray.get(t);
                    //verificar limites
                    if (Vec.dot(Vec.minus(p, p0), Vec.minus(p, p0)) <= 1) {
                        var point = ray.get(t);
                        var normal = n;
                        var M = this.transformMatrix();
                        point = multVec4(M, point);
                        M = this.transformMatrixVec();
                        normal = multVec4(M, normal);
                        normal = Vec.unitary(normal);
                        var t_ = Vec.module(Vec.minus(point, ray_w.o));
                        if (final_t == null) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        } else if (t_ < final_t) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        }
                    }
                }

                n = new Vec3(0, -1, 0);
                p0 = new Vec3(0, -0.5, 0);
                if (Vec.dot(ray.d, n) != 0) {
                    t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
                    p = ray.get(t);
                    //verificar limites
                    if (Vec.dot(Vec.minus(p, p0), Vec.minus(p, p0)) <= 1) {
                        var point = ray.get(t);
                        var normal = n;
                        var M = this.transformMatrix();
                        point = multVec4(M, point);
                        M = this.transformMatrixVec();
                        normal = multVec4(M, normal);
                        normal = Vec.unitary(normal);
                        var t_ = Vec.module(Vec.minus(point, ray_w.o));
                        if (final_t == null) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        } else if (t_ < final_t) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        }
                    }
                }
            }

        }


        if (final_t != null) {
            // if (final_t > tmax && tmax != 0) {
            //     return [false, null];
            // }
            return [true, final_point, final_normal, final_t];
        }


    }

    if (this.geometry == cone) {
        //console.log("testing...");
        var final_normal = null;
        var final_point = null;
        var final_t = null;
        //testar interseção com o cilindro infinito
        va = new Vec3(0, 1, 0);
        pa = new Vec3(0, 1, 0);
        dp = Vec.minus(ray.o, pa);
        var alpha = 45 * (Math.PI / 180);
        var r = 1;
        var term1 = Vec.dot(Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))), Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))));
        var term2 = Vec.dot(ray.d, va) * Vec.dot(ray.d, va);
        var a = Math.cos(alpha) * Math.cos(alpha) * term1 - Math.sin(alpha) * Math.sin(alpha) * term2;
        term1 = Vec.dot(Vec.minus(ray.d, Vec.prod(va, Vec.dot(ray.d, va))), Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va))));
        term2 = Vec.dot(ray.d, va) * Vec.dot(dp, va);
        var b = 2 * Math.cos(alpha) * Math.cos(alpha) * term1 - 2 * Math.sin(alpha) * Math.sin(alpha) * term2;
        term1 = Vec.dot(Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va))), Vec.minus(dp, Vec.prod(va, Vec.dot(dp, va))));
        term2 = Vec.dot(dp, va) * Vec.dot(dp, va);
        var c = Math.cos(alpha) * Math.cos(alpha) * term1 - Math.sin(alpha) * Math.sin(alpha) * term2;
        var delta = b * b - 4 * a * c;
        if (delta >= 0) {
            var t1 = (-b + Math.sqrt(delta)) / (2 * a);
            var t2 = (-b - Math.sqrt(delta)) / (2 * a);
            t = Math.min(t1, t2);
            var point = ray.get(t);
            if (point.y <= 1.0 && point.y > 0) {
                var normal = Vec.minus(point, new Vec3(0, point.y, 0));
                normal = Vec.unitary(normal);
                var M = this.transformMatrix();
                point = multVec4(M, point);
                M = this.transformMatrixVec();
                normal = multVec4(M, normal);
                final_normal = Vec.unitary(normal);
                final_t = Vec.module(Vec.minus(point, ray_w.o));
                final_point = point;
            } else {
                //testando com a capa
                //superior
                n = new Vec3(0, -1, 0);
                p0 = new Vec3(0, 0, 0);
                if (Vec.dot(ray.d, n) != 0) {
                    t = Vec.dot(Vec.minus(p0, ray.o), n) / Vec.dot(ray.d, n);
                    p = ray.get(t);
                    //verificar limites
                    if (Vec.dot(Vec.minus(p, p0), Vec.minus(p, p0)) <= 1) {
                        var point = ray.get(t);
                        var normal = n;
                        var M = this.transformMatrix();
                        point = multVec4(M, point);
                        M = this.transformMatrixVec();
                        normal = multVec4(M, normal);
                        normal = Vec.unitary(normal);
                        var t_ = Vec.module(Vec.minus(point, ray_w.o));
                        if (final_t == null) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        } else if (t_ < final_t) {
                            final_normal = normal;
                            final_point = point;
                            final_t = t_;
                        }
                    }
                }


            }

        } else {
            return [false, null];
        }

        if (final_t != null) {
            return [true, final_point, final_normal, final_t];
        }


    }
    return [false, null];
}