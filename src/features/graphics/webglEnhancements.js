class WebGLEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupWebGLScene();
    }

    setupWebGLScene() {
        const canvas = document.querySelector("#webgl-canvas");
        const gl = canvas.getContext("webgl");

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        // Set clear color to black, fully opaque
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Create a buffer for the square's positions.
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Set up the positions for a square
        const positions = [
            -0.5, -0.5,
             0.5, -0.5,
            -0.5,  0.5,
             0.5,  0.5,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create a vertex shader
        const vertexShaderSource = `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `;
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

        // Create a fragment shader
        const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(0, 1, 0, 1); // Green color
            }
        `;
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        // Link the two shaders into a program
        const program = this.createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        // Look up where the vertex data needs to go.
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const size = 2;          // 2 components per iteration
        const type = gl.FLOAT;   // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        const offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // Draw the square
        const primitiveType = gl.TRIANGLE_STRIP;
        const count = 4;
        gl.drawArrays(primitiveType, offset, count);
    }

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
}

new WebGLEnhancements(); 