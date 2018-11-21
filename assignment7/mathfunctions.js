function adjoint(T){
    return [
        [0, 1, -T[1][2]],
        [-1, 0, T[0][2]],
        [T[1][2], -T[0][2], 0]
    ];
}

function transpose(T){
    return [
        [T[0][0], T[1][0], T[2][0]],
        [T[0][1], T[1][1], T[2][1]],
        [T[0][2], T[1][2], T[2][2]]
    ];
}

function crossProd2d(v1,v2){
    return [v1[1]*v2[2]-v1[2]*v2[1],-(v1[0]*v2[2]-v1[2]*v2[0]),v1[0]*v2[1]-v1[1]*v2[0]];
}

function translate(x, y) { // dado dois pontos, x e y constroi a matriz homogenea de translação 
    return [
        [1, 0, x],
        [0, 1, y],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function identity(v=1) { // identidade
    return [
        [1*v, 0, 0],
        [0, 1*v, 0],
        [0, 0, 1*v]
    ]; //retorna matriz 3x3
}

function sum(A,B){
    return [
        [A[0][0]+B[0][0], A[0][1]+B[0][1], A[0][2]+B[0][2]],
        [A[1][0]+B[1][0], A[1][1]+B[1][1], A[1][2]+B[1][2]],
        [A[2][0]+B[2][0], A[2][1]+B[2][1], A[2][2]+B[2][2]]
    ]; //retorna matriz 3x3 
}

function scale(x, y) { // dado dois pontos, x e y constroi a matriz homogenea de translação 
    return [
        [x, 0, 0],
        [0, y, 0],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function rotate(theta) { // rotaciona theta em graus
    theta = Math.PI * theta / 180.; //transforma theta em ratianos
    return [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function transformCanvas(Width,Height) {
    return [
        [1, 0, Width / 2.],
        [0, -1, Height / 2.],
        [0, 0, 1]
    ];
}

function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    //alert(I);
    return I;
}
// function mult(A, B) { //multiplicação de duas matrizes 3x3
//     var C = [
//         [1, 0, 0],
//         [0, 1, 0],
//         [0, 0, 1]
//     ];
//     var C = [];
//     for(var i=0; i<A.length; i++) {
//         C[i] = new Array(B[0].length);
//     }
//     var i;
//     var j;
//     for (i = 0; i < C.length; i++) {
//         for (j = 0; j < C[0].length; j++) {
//             C[i][j] = A[i][i] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
//         }
//     }
//     return C; //retorna uma matriz 3x3
// }

function mult(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

function multVec(A, b) { //multiplicação de uma matriz (3x3) e um vetor
    var C = [0, 0, 0];
    var i;
    var j;
    for (i = 0; i < 3; i++) {
        C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2];
    }
    return C; //retorna um vetor
}

function versor(v){
    var m = module(v[0],v[1]);
    return [v[0]/m,v[1]/m];
}

function module(a, b) { //calcula modulo do vetor (a,b)
    return Math.sqrt(a * a + b * b);
}
