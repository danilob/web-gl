function Quaternion(thetaX = 0, thetaY = 0, thetaZ = 0) {
    if (thetaX != 0 || thetaY != 0 || thetaZ != 0) {
        this.toEuler(thetaX, thetaY, thetaZ);
    } else {
        this.s = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }



}

Quaternion.prototype.normalize = function() {
    var q = new Quaternion();
    m = Math.sqrt(this.s * this.s + dotVecQuat(this, this));
    //console.log("module " + m);
    //console.log("quaternion ori:");
    //console.log(this);
    q.s = this.s / m;
    q.x = this.x / m;
    q.y = this.y / m;
    q.z = this.z / m;
    //console.log("Normalized: ");
    //console.log(q);
    return q;
}

Quaternion.prototype.toEuler = function(thetaX, thetaY, thetaZ) {
    //q = fromEuler(thetaX, thetaY, thetaZ);
    thetaX = (thetaX / 2.0) * (Math.PI / 180.0);
    thetaY = (thetaY / 2.0) * (Math.PI / 180.0);
    thetaZ = (thetaZ / 2.0) * (Math.PI / 180.0);

    Q = new Quaternion();
    var qThetaX = Q.set(Math.cos(thetaX), Math.sin(thetaX), 0.0, 0.0);
    var qThetaY = Q.set(Math.cos(thetaY), 0.0, Math.sin(thetaY), 0.0);
    var qThetaZ = Q.set(Math.cos(thetaZ), 0.0, 0.0, Math.sin(thetaZ));

    //console.log(qThetaZ);

    q = Q.multQuat(qThetaZ, qThetaY);
    q = Q.multQuat(q, qThetaX);
    q = q.normalize();
    this.s = q.s;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
}

function fromEuler(thetaX, thetaY, thetaZ) {

    //QuaternionQ norm = q;

    return q;
    // this.s = q.s;
    // this.x = q.x;
    // this.y = q.y;
    // this.z = q.z;
}

Quaternion.prototype.set = function(s, x, y, z) {

    qr = new Quaternion();
    qr.s = s;
    qr.x = x;
    qr.y = y;
    qr.z = z;
    return qr;
}

Quaternion.prototype.multQuat = function(q1, q2) {

    qr = new Quaternion();
    qr.s = (q1.s * q2.s - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z);
    qr.x = (q1.s * q2.x + q2.s * q1.x + q1.y * q2.z - q1.z * q2.y);
    qr.y = (q1.s * q2.y + q2.s * q1.y + q1.z * q2.x - q1.x * q2.z);
    qr.z = (q1.s * q2.z + q2.s * q1.z + q1.x * q2.y - q1.y * q2.x);
    return qr;
}

Quaternion.prototype.normal = function() {
    return Math.sqrt(this.s * this.s + dotVecQuat(this, this));
}

Quaternion.prototype.dot = function(p, q) {
    return p.s * q.s + dotVecQuat(p, q);
}

Quaternion.prototype.conjugate = function() {
    var q = new Quaternion();
    q.s = this.s;
    q.x = -this.x;
    q.y = -this.y;
    q.z = -this.z;
    return q;
}

Quaternion.prototype.mult = function(k) {
    quat = new Quaternion();
    quat.s = this.s * k;
    quat.x = this.x * k;
    quat.y = this.y * k;
    quat.z = this.z * k;

    return quat;
}

Quaternion.prototype.minus = function(q) {

    quat = new Quaternion();
    quat.s = this.s - q.s;
    quat.x = this.x - q.x;
    quat.y = this.y - q.y;
    quat.z = this.z - q.z;

    return quat;
}

Quaternion.prototype.minusQ = function(p, q) {
    quat = new Quaternion();
    quat.s = p.s - q.s;
    quat.x = p.x - q.x;
    quat.y = p.y - q.y;
    quat.z = p.z - q.z;

    return quat;
}

Quaternion.prototype.plusQ = function(p, q) {
    quat = new Quaternion();
    quat.s = p.s + q.s;
    quat.x = p.x + q.x;
    quat.y = p.y + q.y;
    quat.z = p.z + q.z;

    return quat;
}

Quaternion.prototype.plus = function(q) {
    quat = new Quaternion();
    quat.s = this.s + q.s;
    quat.x = this.x + q.x;
    quat.y = this.y + q.y;
    quat.z = this.z + q.z;
    return this;
}

Quaternion.prototype.inverse = function() {
    var q = new Quaternion();
    var mod = this.s * this.s + this.x * this.x + this.y * this.y * this.z * this.z;
    q.s = this.s / mod;
    q.x = -this.x / mod;
    q.y = -this.y / mod;
    q.z = -this.z / mod;
    return q;
}

function multQuat(q1, q2) {
    var q = new Quaternion();
    q.s = q1.s * q2.s - dotVecQuat(q1, q2);
    var vec = prodVecQuat(q1, q2);
    q.x = q1.s * q2.x + q2.s * q1.x + vec[0];
    q.y = q1.s * q2.y + q2.s * q1.y + vec[1];
    q.z = q1.s * q2.z + q2.s * q1.z + vec[2];
    return q;
}

function dotVecQuat(q1, q2) {
    //q1 e q2 sao quaternions
    return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
}

function prodVecQuat(q1, q2) {
    return [q1.y * q2.z - q1.z * q2.y, -(q1.x * q2.z - q1.z + q2.x), q1.x * q2.y - q1.y * q2.x];
}

function angleBetweenQuat(q1, q2) {
    return Math.acos(q1.s * q2.s + dotVecQuat(q1, q2));
}

function glRotateFromQuaternion(q) { //theta em graus
    var qw = q.s;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;
    var out = new glMatrix.ARRAY_TYPE(16);
    out[0] = 1 - 2 * qy * qy - 2 * qz * qz;
    out[1] = 2 * qx * qy + 2 * qz * qw;
    out[2] = 2 * qx * qz - 2 * qy * qw;
    out[3] = 0;
    out[4] = 2 * qx * qy - 2 * qz * qw;
    out[5] = 1 - qx * qx - 2 * qz * qz;
    out[6] = 2 * qy * qz + 2 * qx * qw;
    out[7] = 0;
    out[8] = 2 * qx * qz + 2 * qy * qw;
    out[9] = 2 * qy * qz - 2 * qx * qw;
    out[10] = 1 - 2 * qx * qx - 2 * qy * qy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}