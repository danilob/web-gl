function Frame(objs, angles, time) {
    this.objects = objs;
    this.angles = angles;
    this.time = time;
}

//interpolação
function getAnglesFrame(f1, f2, t) {
    if (f1.length != f2.length) return [];
    var angles = [];
    for (var i = 0; i < f1.length; i++) {
        angles.push(f1[i] * (1 - t) + f2[i] * t);
    }
    return angles;
}

//lista de frames
function goAnimateFrames(lista, time_c) { //esta função retorna o quaternion correspondente à interpolação
    if (lista.length <= 1) return new Quaternion();
    var time_s = 0;
    var i = 1;
    time_s = 0;
    time_a = 0; //tempo acumulado previamente
    for (i = 1; i < lista.length; i++) {
        time_s += lista[i].time;
        if (time_c <= time_s) {
            return getAnglesFrame(lista[i - 1].angles, lista[i].angles, (time_c - (time_a)) / lista[i].time);
        }
        time_a += lista[i].time;

    }
    return lista[i - 1].angles;
}