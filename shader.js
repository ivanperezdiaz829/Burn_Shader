// Configuración
const PHOTO_URL = 'textures/unnamed.jpg'; 
const NOISE_URL = 'textures/unnamed.jpg';
//const NOISE_URL = 'textures/burnNoises/textura-granulada-abstracta.jpg'; 
const BURN_SPEED = 0.0001;

// Función principal asíncrona
(async function main() {
    const canvas = document.getElementById('gl-canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) { alert('WebGl no soportado'); return; }

    try {
        // 1. CARGA ASÍNCRONA DE SHADERS
        const [vsSource, fsSource] = await Promise.all([
            fetch('shaders/basic.vert').then(res => res.text()),
            fetch('shaders/burn_effect1.frag').then(res => res.text())
            // fetch('shaders/burn_effect2.frag').then(res => res.text())
            // fetch('shaders/burn_effect3.frag').then(res => res.text())
        ]);

        // 2. Compilar programa
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        if (!shaderProgram) return;

        // 3. Info del programa
        const programInfo = {
            program: shaderProgram,
            attribLocations: {
                position: gl.getAttribLocation(shaderProgram, 'a_position'),
                texCoord: gl.getAttribLocation(shaderProgram, 'a_texCoord'),
            },
            uniformLocations: {
                texture: gl.getUniformLocation(shaderProgram, 'u_texture'),
                noiseTexture: gl.getUniformLocation(shaderProgram, 'u_noiseTexture'),
                burnThreshold: gl.getUniformLocation(shaderProgram, 'u_burnThreshold'),
            },
        };

        // 4. Buffers y Texturas
        const buffers = initBuffers(gl);
        
        // Cargar imágenes
        const [photoTexture, noiseTexture] = await Promise.all([
            loadTexture(gl, PHOTO_URL),
            loadTexture(gl, NOISE_URL)
        ]);

        console.log("Todo listo. Iniciando render.");
        
        // 5. Loop de renderizado
        const startTime = Date.now();
        function render() {
            drawScene(gl, programInfo, buffers, [photoTexture, noiseTexture], startTime);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

    } catch (err) {
        console.error("Error fatal:", err);
    }
})();

// --- FUNCIONES DE DIBUJO ---
function drawScene(gl, programInfo, buffers, textures, startTime) {
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.texCoord);

    gl.useProgram(programInfo.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.uniform1i(programInfo.uniformLocations.texture, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.uniform1i(programInfo.uniformLocations.noiseTexture, 1);

    const elapsedTime = Date.now() - startTime;
    const burnAmount = (elapsedTime * BURN_SPEED) % 1.5;
    gl.uniform1f(programInfo.uniformLocations.burnThreshold, burnAmount);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initBuffers(gl) {
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const texCoords = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]);
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    return { position: positionBuffer, texCoord: texCoordBuffer };
}

// --- UTILIDADES (Carga de Texturas y Shaders) ---
function loadTexture(gl, url) {
    return new Promise((resolve, reject) => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const pixel = new Uint8Array([0, 0, 0, 0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

        const image = new Image();
        image.crossOrigin = "anonymous"; // Vital para texturas externas
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            
            // Configuración para imágenes que no son potencia de 2 (NPOT)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            resolve(texture);
        };
        image.onerror = () => reject(new Error(`Error cargando textura: ${url}`));
        image.src = url;
    });
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Error linkeando programa:', gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        return true;
    }
    return false;
}