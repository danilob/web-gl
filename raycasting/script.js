var gl;
var near = 0.1;
var far = 100.;
var aspect;
var angle = 35;
var stop = false;
var objects = [];
var camera = new Camera();
s1 = new Shape(1);
s1.name = "chao";
s1.setTranslate(0, 0, 0);
s1.setScale(10, 0.1, 10);
//material Jade
s1.setAmbient(0.135, 0.2225, 0.1575);
s1.setDifuse(0.54, 0.89, 0.63);
s1.setSpecular(0.316228, 0.316228, 0.316228);
s1.setShine(12.8);


s2 = new Shape(0);
s2.name = "esfera";

s2.setTranslate(4, 4, 4);
s2.setScale(0.5, 0.5, 0.5);
//material gold
s2.setAmbient(0.24705, 0.2, 0.0666);
s2.setDifuse(0.7490, 0.6078, 0.2274);
s2.setSpecular(0.6274, 0.6470, 0.3686);
s2.setShine(51.2);

s3 = new Shape(2);
s3.name = "cilindro";

s3.setTranslate(0, 0.5, 0);
s3.setScale(0.5, 1, 0.5);
//material Jade
s3.setAmbient(0.0215, 0.1745, 0.0215);
s3.setDifuse(0.07568, 0.61424, 0.07568);
s3.setSpecular(0.633, 0.727811, 0.633);
s3.setShine(16.8);

s4 = new Shape(3);
s4.name = "cone";

s4.setTranslate(1, 0.5, 5);
s4.setScale(0.5, 1, 0.5);
//material gold
s4.setAmbient(0.24705, 0.2, 0.0666);
s4.setDifuse(0.7490, 0.6078, 0.2274);
s4.setSpecular(0.6274, 0.6470, 0.3686);
s4.setShine(51.2);

objects.push(s3);
objects.push(s2);

objects.push(s4);
objects.push(s1);
point_intersection = null;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        aspect = gl.viewportWidth / gl.viewportHeight;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
}


function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
}


var moonTexture;

function initTexture() {
    moonTexture = gl.createTexture();
    moonTexture.image = new Image();
    moonTexture.image.onload = function() {
        handleLoadedTexture(moonTexture)
    }

    moonTexture.image.src = "moon.gif";

    cubeTexture = gl.createTexture();
    cubeTexture.image = new Image();
    cubeTexture.image.onload = function() {
        handleLoadedTexture(cubeTexture)
    }

    cubeTexture.image.src = "moon.gif";

}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var moonRotationMatrix = mat4.create();
mat4.identity(moonRotationMatrix);

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {
    mouseDown = false;
}


function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX
    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, moonRotationMatrix, moonRotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}




var moonVertexPositionBuffer;
var moonVertexNormalBuffer;
var moonVertexTextureCoordBuffer;
var moonVertexIndexBuffer;

var cubeVertexPositionBuffer;
var cubeVertexNormalBuffer;
var cubeVertexTextureCoordBuffer;
var cubeVertexIndexBuffer;

function initBuffersCube() {

    // Create a buffer for the cube's vertex positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    const positions = [
        // Front face
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5, -0.5, 0.5, 0.5,

        // Back face
        -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,

        // Top face
        -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,

        // Bottom face
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5, -0.5, -0.5, 0.5,

        // Right face
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, -0.5, 0.5,

        // Left face
        -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    cubeVertexPositionBuffer = positionBuffer;
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = positions.length / 3;
    // Set up the normals for the vertices, so that we can compute lighting.

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);


    const vertexNormals = [
        // Front
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,

        // Back
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,
        0.0, 0.0, -1.0,

        // Top
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,

        // Bottom
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, -1.0, 0.0,

        // Right
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        // Left
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
        gl.STATIC_DRAW);

    // Now set up the texture coordinates for the faces.
    cubeVertexNormalBuffer = normalBuffer;
    cubeVertexNormalBuffer.itemSize = 3;
    cubeVertexNormalBuffer.numItems = vertexNormals.length / 3;

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
        gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.
    cubeVertexTextureCoordBuffer = textureCoordBuffer;
    cubeVertexTextureCoordBuffer.itemSize = 2;
    cubeVertexTextureCoordBuffer.numItems = textureCoordinates.length / 2;

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
        0, 1, 2, 0, 2, 3, // front
        4, 5, 6, 4, 6, 7, // back
        8, 9, 10, 8, 10, 11, // top
        12, 13, 14, 12, 14, 15, // bottom
        16, 17, 18, 16, 18, 19, // right
        20, 21, 22, 20, 22, 23, // left
    ];

    // Now send the element array to GL

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    cubeVertexIndexBuffer = indexBuffer;
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = indices.length;
    // return {
    //   position: positionBuffer,
    //   normal: normalBuffer,
    //   textureCoord: textureCoordBuffer,
    //   indices: indexBuffer,
    // };
}

function initBuffers() {
    var latitudeBands = 30;
    var longitudeBands = 30;
    var radius = 1;

    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);

            normalData.push(x);
            normalData.push(y);
            normalData.push(z);
            textureCoordData.push(u);
            textureCoordData.push(v);

            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    moonVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    moonVertexNormalBuffer.itemSize = 3;
    moonVertexNormalBuffer.numItems = normalData.length / 3;

    moonVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    moonVertexTextureCoordBuffer.itemSize = 2;
    moonVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

    moonVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    moonVertexPositionBuffer.itemSize = 3;
    moonVertexPositionBuffer.numItems = vertexPositionData.length / 3;

    moonVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    moonVertexIndexBuffer.itemSize = 1;
    moonVertexIndexBuffer.numItems = indexData.length;
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //mat4.perspective(angle, aspect, near, far, pMatrix);
    h = 2 * near * Math.tan(angle * Math.PI / 360);
    w = aspect * h;
    l0 = [2 * near / w, 0, 0, 0];
    l1 = [0, 2 * near / h, 0, 0];
    l2 = [0, 0, -(far + near) / (far - near), -2 * far * near / (far - near)];
    l3 = [0, 0, -1, 0];
    //alert(createFromLines(l0,l1,l2,l3));
    pMatrix = createFromLines(l0, l1, l2, l3);
    //TODO(2): Crie a matriz de Perspectiva (pMatrix) a partir dos conceitos vistos em sala de aula
    // Defina cada linha da matriz como um vetor de 4 posições e sete a matriz do seguinte modo:
    // pMatrix = createFromLines(l0,l1,l2,l3); (onde l0,l1,l2 e l3) são as linhas da matriz de projeção.

    var cameraPosition = [
        parseFloat(document.getElementById("eyeX").value),
        parseFloat(document.getElementById("eyeY").value),
        parseFloat(document.getElementById("eyeZ").value)
    ];
    var fPosition = [parseFloat(document.getElementById("atX").value),
        parseFloat(document.getElementById("atY").value),
        parseFloat(document.getElementById("atZ").value)
    ];
    var up = [parseFloat(document.getElementById("upX").value),
        parseFloat(document.getElementById("upY").value),
        parseFloat(document.getElementById("upZ").value)
    ];
    // Compute the camera's matrix using look at.
    //var cameraMatrix = mat4.lookAt(cameraPosition, fPosition, up);
    //TODO(1): Crie a matriz cameraMatrix a partir dos conceitos vistos em sala de aula 
    //Use a função convertMatrix(M) para converter a matriz para o formato compativel para o cameraMatrix
    // Make a view matrix from the camera matrix.

    camera.eye = new Vec3(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    camera.at = new Vec3(fPosition[0], fPosition[1], fPosition[2]);
    camera.up = new Vec3(up[0], up[1], up[2]);

    var viewMatrix = convertMatrix(camera.lookAtInverse());


    var lighting = document.getElementById("lighting").checked;
    gl.uniform1i(shaderProgram.useLightingUniform, lighting);
    if (lighting) {
        gl.uniform3f(
            shaderProgram.ambientColorUniform,
            parseFloat(document.getElementById("ambientR").value),
            parseFloat(document.getElementById("ambientG").value),
            parseFloat(document.getElementById("ambientB").value)
        );

        var lightingDirection = [
            parseFloat(document.getElementById("lightDirectionX").value),
            parseFloat(document.getElementById("lightDirectionY").value),
            parseFloat(document.getElementById("lightDirectionZ").value)
        ];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

        gl.uniform3f(
            shaderProgram.directionalColorUniform,
            parseFloat(document.getElementById("directionalR").value),
            parseFloat(document.getElementById("directionalG").value),
            parseFloat(document.getElementById("directionalB").value)
        );
    }

    mat4.identity(mvMatrix);
    mvMatrix = viewMatrix;
    for (var i = 0; i < objects.length; i++) {
        mvPushMatrix();
        moonRotationMatrix = convertMatrix(objects[i].transformMatrix());
        mat4.multiply(mvMatrix, moonRotationMatrix);
        if (objects[i].geometry == 1) {
            drawCube();
        } else if (objects[i].geometry == 0) {
            drawSphere();
        }
        mvPopMatrix();
    }
    // //determinar matrizes de transformação na esfera 1
    // var T = translateMatrix(-2, 0, 5);
    // var R = multMatrix(rotateMatrixX(0), multMatrix(rotateMatrixY(0), rotateMatrixZ(40)));
    // var S = scaleMatrix(1, 1, 1);
    // var C = multMatrix(T, multMatrix(R, S));

    // mvPushMatrix();
    // moonRotationMatrix = convertMatrix(C);
    // mat4.multiply(mvMatrix, moonRotationMatrix);
    // drawSphere();
    // mvPopMatrix();

    // mvPushMatrix();
    // mat4.identity(moonRotationMatrix);
    // mat4.translate(moonRotationMatrix, [3, 3, -5]);
    // mat4.multiply(mvMatrix, moonRotationMatrix);
    // drawSphere();
    // mvPopMatrix();
    if (point_intersection) {
        console.log("ponto de insersecao show");
        setPoint(point_intersection.x, point_intersection.y, point_intersection.z, 0.1); //desenha um ponto na posição (0,0,7)
    }


}

function setPoint(tx, ty, tz, size = 0.1) {
    mvPushMatrix();
    var T = translateMatrix(tx, ty, tz);
    var S = scaleMatrix(size, size, size);
    var C = multMatrix(T, S);
    moonRotationMatrix = convertMatrix(C);
    mat4.multiply(mvMatrix, moonRotationMatrix);
    drawPoint();
    mvPopMatrix();
}

function tick() {
    if (!stop) {
        requestAnimFrame(tick);
        drawScene();
    }
}

function drawSphere() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, moonTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, moonVertexPositionBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, moonVertexTextureCoordBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, moonVertexNormalBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, moonVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function drawCube() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

function drawPoint(color = new Vec3(1, 0, 0)) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, moonTexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, moonVertexPositionBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.disableVertexAttribArray(shaderProgram.textureCoordAttribute);
    gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    gl.uniform3f(
        shaderProgram.ambientColorUniform,
        parseFloat(color.x),
        parseFloat(color.y),
        parseFloat(color.z)
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, moonVertexTextureCoordBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, moonVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, moonVertexNormalBuffer.itemSize, gl.FLOAT,
        false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, moonVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, moonVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function webGLStart() {
    var canvas = document.getElementById("lesson11-canvas");
    initGL(canvas);
    initShaders();
    initBuffersCube();
    initBuffers();
    initTexture();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    tick();
}

function onClickMouse(event) {
    console.log("ok");
    var x = event.offsetX;
    var y = event.offsetY;
    hl = 2 * near * Math.tan(angle * Math.PI / 360.);
    wl = hl * aspect;
    deltaY = hl / gl.viewportHeight;
    deltaX = wl / gl.viewportWidth;
    var xc = -wl / 2 + deltaX / 2 + x * deltaX;
    var yc = -(-hl / 2 + deltaY / 2 + y * deltaY);
    var point = new Vec3(xc, yc, -near);
    var Vec = new Vec3();
    var o = new Vec3(0, 0, 0); //origem de câmera
    var d = new Vec3().minus(point, o);
    ray = new Ray(o, d);
    ray.show();
    for (var i = 0; i < objects.length; i++) {
        var shape = objects[i];
        //raio transformado em coordenadas do mundo
        var ray_w = new Ray(multVec4(camera.lookAt(), ray.o), multVec4(camera.lookAt(), ray.d));
        //ray_w.d = ray.d.unitary(Vec.minus(ray_w.o,ray_w.d));
        console.log("Direcao mundo");
        //ray_w.show();
        //testar interseção do raio com o objeto i
        var result = shape.testIntersectionRay(ray_w);
        if (result[0]) {
            point_intersection = result[1];
            console.log("Interceptou!");
        } else {
            console.log("Nao interceptou!");
        }
    }


}


//colorir pixel
function renderCanvas() {
    stop = true;
    var canvas2 = document.getElementById("render-canvas");
    var ctx = canvas2.getContext("2d");
    ctx.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.beginPath();
    hl = 2 * near * Math.tan(angle * Math.PI / 360.);
    wl = hl * aspect;
    deltaY = hl / gl.viewportHeight;
    deltaX = wl / gl.viewportWidth;
    total = 0;
    inter = 0;
    lights = [];
    l0 = new Light(0); //luz ambiente
    l0.setAmbient(1, 1, 1);
    l1 = new Light(1); //luz pontual
    l1.setAmbient(1, 1, 1);
    l1.setSpecular(0.5, 0.5, 0.5);
    l1.setDifuse(0.8, 0.8, 0.8);
    l1.setPosition(5, 5, 5);
    l1.setAttenuation(1, 0, 0);
    lights.push(l0);
    lights.push(l1);
    for (var i = 0; i < gl.viewportWidth; i++) {
        for (var j = 0; j < gl.viewportHeight; j++) {
            var r = 0;
            var g = 0;
            var b = 0;
            var xc = -wl / 2 + deltaX / 2 + i * deltaX;
            var yc = -(-hl / 2 + deltaY / 2 + j * deltaY);
            var point = new Vec3(xc, yc, -near);

            var o = new Vec3(0, 0, 0); //origem de câmera
            var d = new Vec3(point.x, point.y, point.z);
            ray = new Ray(o, d);
            var intercept = false;
            var params = null;
            for (var k = 0; k < objects.length; k++) {
                var shape = objects[k];
                //raio transformado em coordenadas do mundo
                var ray_w = new Ray(multVec4(camera.lookAt(), ray.o), multVec4(camera.lookAt(), ray.d));
                var result = shape.testIntersectionRay(ray_w);
                if (result[0]) {
                    if (params == null || params[3] > result[3]) {
                        params = result;
                        params.push(shape);
                    }
                    //params = result;
                    intercept = true;

                }
            }
            if (intercept) {
                var position = params[1];
                //console.log("Object: " + params[4].name);
                //console.log(position);
                var normal = params[2];
                var viewer = camera.eye;
                var colorF = new Vec3(0, 0, 0);
                for (var l = 0; l < lights.length; l++) {
                    //get color with shadow
                    var color = lights[l].getColorTestShadow(params[4], position, normal, viewer, objects);
                    colorF = Vec.sum(colorF, color);
                }
                ctx.fillStyle = "rgb(" + Math.min(colorF.x, 1) * 255 + "," + Math.min(colorF.y, 1) * 255 + "," + Math.min(colorF.z, 1) * 255 + ")";
                ctx.fillRect(i, j, 1, 1);
                inter++;
            }
            if (!intercept) {
                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                ctx.fillRect(i, j, 1, 1);
            }
            total++;

        }
    }
    stop = false;
    alert("End rendering! total: " + total + ", intersections: " + inter);

}