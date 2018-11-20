function Frame() {
    this.q = new Quaternion();
    this.time = 0;
}

function Frame(q, t) {
    this.q = q;
    this.time = t;
}

function getTimeTotal(lista) {
    var total = 0;
    for (var i = 0; i < lista.length; i++) {
        total += lista[i].time;
    }
    return total;
}

function LerpQ(p, q, t) {
    Q = new Quaternion();
    //var result = new Quaternion();
    var result = Q.plusQ(p.mult(1 - t), q.mult(t));
    //console.log(result);
    result = result.normalize();
    console.log(result);
    return result;
}

function SlerpQ(p, q, t) {

    console.log(t);

    Q = new Quaternion();
    var cosomega;
    var sinomega;
    var omega;
    var s1, s2;

    if ((Q.minusQ(p, q)).normal() > (Q.plusQ(p, q)).normal()) q = q.mult(-1);
    cosomega = Q.dot(p, q);

    if ((1.0 - cosomega) < 0.000001) {
        return LerpQ(p, q, t);
    }
    if ((1.0 + cosomega) < 0.000001) {
        q2a = new Quaternion();
        q2a.s = (-q.x);
        q2a.x = (q.s);
        q2a.y = (-q.z);
        q2a.z = (q.y);
        s1 = Math.sin((1.0 - t) * Math.PI / 2);
        s2 = Math.sin(t * Math.PI / 2);
        q2a = q2a.normalize();
        result = Q.plusQ(p.mult(s1), q2a.mult(s2));
        result = result.normalize();
        //console.log(result);
        return result;

    }
    omega = Math.acos(cosomega);
    sinomega = Math.sin(omega);
    s1 = Math.sin((1.0 - t) * omega) / sinomega;
    s2 = Math.sin(t * omega) / sinomega;

    pm = p.mult(s1);
    qm = q.mult(s2);

    result = Q.plusQ(pm, qm);
    result = result.normalize();

    console.log(result);
    return result;
}

function goAnimateFrames(lista, time_c) { //esta função retorna o quaternion correspondente à interpolação
    if (lista.length <= 1) return new Quaternion();
    var time_s = 0;
    var i = 1;
    time_s = 0;
    time_a = 0; //tempo acumulado previamente
    for (i = 1; i < lista.length; i++) {
        time_s += lista[i].time;
        if (time_c <= time_s) {
            return SlerpQ(lista[i - 1].q, lista[i].q, (time_c - (time_a)) / lista[i].time);
        }
        time_a += lista[i].time;

    }
    return lista[i - 1].q;

}