import {BaseApp} from "../../base/BaseApp.js";
import {WebGLShader} from '../../base/helpers/WebGLShader.js';
import {Crane} from "./objects/Crane.js";
import {TiledPlane} from "./objects/TiledPlane.js";
import {Coord} from "../../base/shapes/Coord.js";

export class CraneApp extends BaseApp {

    constructor() {
        super(false)
        this.crane = new Crane(this)
        this.ground = new TiledPlane(this, '../../base/textures/beach.png')
        this.sky = new TiledPlane(this, '../../base/textures/skies.png', {xMin: 0, xMax: 1, yMin: 0, yMax: 1})
        this.coord = new Coord(this)
    }

    initShaders() {
        super.initShaders();    //NB!

        // Texture shader:
        let vertexShaderSource = document.getElementById('texture-vertex-shader').innerHTML;
        let fragmentShaderSource = document.getElementById('texture-fragment-shader').innerHTML;
        // Initialiserer  & kompilerer shader-programmene;
        const glslTextureShader = new WebGLShader(this.gl, vertexShaderSource, fragmentShaderSource);
        // Samler all texture-shader-info i et JS-objekt.
        this.textureShaderInfo = {
            program: glslTextureShader.shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexPosition'),
                vertexColor: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexColor'),
                vertexTextureCoordinate: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aTextureCoord'),
                vertexNormal: this.gl.getAttribLocation(glslTextureShader.shaderProgram, 'aVertexNormal'),
            },
            uniformLocations: {
                sampler: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uSampler'),
                projectionMatrix: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uProjectionMatrix'),
                modelViewMatrix: this.gl.getUniformLocation(glslTextureShader.shaderProgram, 'uModelViewMatrix'),
                normalMatrix: this.gl.getUniformLocation(glslTextureShader.shaderProgram, "uNormalMatrix"),
            },
        };
    }

    /**
     * Håndterer brukerinput.
     */
    handleKeys(elapsed) {
        super.handleKeys(elapsed);
        this.crane.handleKeys(elapsed);
    }

    draw(elapsed, modelMatrix = new Matrix4()) {
        super.draw(elapsed)
        this.crane.draw(this.baseShaderInfo, this.textureShaderInfo, elapsed, modelMatrix);

        let groundMM = new Matrix4()
        groundMM.setIdentity();
        groundMM.translate(0, -3, 0)
        groundMM.scale(200, 1, 200)
        this.ground.draw(this.textureShaderInfo, elapsed, groundMM)

        let skyMM = new Matrix4()
        skyMM.setIdentity();
        skyMM.translate(0, 100, -200)
        skyMM.rotate(-90, 1, 0, 0)
        skyMM.scale(200, -30, 100)
        this.sky.draw(this.textureShaderInfo, elapsed, skyMM)

        this.coord.draw(this.baseShaderInfo, elapsed)
    }
}