'use strict';

/**
 * Basis for alle shape-klassene.
 */
export class BaseShape {

    constructor(app) {
        this.app = app;
        this.gl = app.gl;
        this.camera = app.camera;

        this.vertexCount = 0;

        // Vertex info arrays:
        this.positions = [];
        this.colors = [];
        this.textureCoordinates = [];
        this.normals = [];

        // Referanser til alle buffer:
        this.buffers = {
            position: undefined,
            color: undefined,
            texture: undefined,
            normals: undefined
        };

        // Brukes i connectPositionAttribute() m.fl.:
        this.numComponents = -1;
        this.type = this.gl.FLOAT;
        this.normalize = false;
        this.stride = 0;
        this.offset = 0;

        this.textureAttribute = 0;
        this.texture = undefined;
    }



    /**
     * Oppretter posisjon-, fargebuffer m.m.
     */
    initBuffers() {
        // Kaller på ev. overstyrt funksjon i subklasser:
        this.createVertices();

        // Posisjon:
        if (this.positions.length > 0) {
            this.buffers.position = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
        }

        // Farge:
        if (this.colors.length > 0) {
            this.buffers.color = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }

        //NB!
        this.initTextures();
        if (this.normals.length > 0) {
            this.buffers.normals = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normals);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }

        this.vertexCount = this.positions.length / 3;
    }

    //NB! Denne overstyres av subklasser dersom tekstur er aktuelt.
    initTextures() {
        // Gjør ingenting. Må overstyres dersom aktuelt.
    }

    /**
     * Kan overstyres av subklasser.
     */
    createVertices() {
        this.setPositions();
        this.setColors();
        this.setTextureCoordinates();
        this.setNormals();
    }

    setNormals() {
        this.normals = [];
    }

    /**
     * Kan overstyres av subklasser.
     */
    setPositions() {
        this.positions = [];
    }

    /**
     * Kan overstyres av subklasser.
     */
    setColors() {
        this.colors = [];
    }

    setTextureCoordinates() {
        this.textureCoordinates = [];
    }

    /**
     * Kopler til og aktiverer position-bufferet.
     */
    connectPositionAttribute(shaderInfo) {
        if (!this.buffers.position)
            return;

        this.numComponents = 3;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexPosition,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);
    }

    connectNormalAttribute(shaderInfo) {
        const numComponents = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,  this.buffers.normals);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexNormal,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexNormal);
    }

    /**
     * Kopler til og aktiverer color-bufferet.
     */
    connectColorAttribute(shaderInfo) {
        if (!this.buffers.color || !shaderInfo.attribLocations.vertexColor)
            return;

        this.numComponents = 4;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexColor,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);
    }

    /**
     * Kopler til og aktiverer teksturkoordinat-bufferet.
     */
    connectTextureAttribute(shaderInfo) {
        if (!this.buffers.texture || !shaderInfo.attribLocations.vertexTextureCoordinate)
            return;

        this.numComponents = 2;    //NB!
        //Bind til teksturkoordinatparameter i shader:
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
        this.gl.vertexAttribPointer(
            shaderInfo.attribLocations.vertexTextureCoordinate,
            this.numComponents,
            this.type,
            this.normalize,
            this.stride,
            this.offset);
        this.gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexTextureCoordinate);

        // let samplerLoc;
        // Aktiver teksturenhet (0):
        this.gl.activeTexture(this.gl.TEXTURE0);

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        //Send inn verdi som indikerer hvilken teksturenhet som skal brukes (her 0):
        let samplerLoc = this.gl.getUniformLocation(shaderInfo.program, shaderInfo.uniformLocations.sampler);
        this.gl.uniform1i(samplerLoc, this.textureAttribute);

    }

    setCameraMatrices(shaderInfo, modelMatrix) {
        this.camera.set();  //NB!
        let modelviewMatrix = this.camera.getModelViewMatrix(modelMatrix);
        if (shaderInfo.uniformLocations.modelViewMatrix)
            this.gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelviewMatrix.elements);
        if (shaderInfo.uniformLocations.projectionMatrix)
            this.gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, this.camera.projectionMatrix.elements);
    }

    draw(shaderInfo, elapsed, modelMatrix) {
        if (!shaderInfo)
            return;
        // Anngi shaderprogram som skal brukes:
        this.gl.useProgram(shaderInfo.program);

        // Kople til buffer og send verdier til shaderne:
        this.connectPositionAttribute(shaderInfo);
        if(this.colors.length > 0) {
            this.connectColorAttribute(shaderInfo);
        }

        if(this.textureCoordinates.length > 0) {
            this.connectTextureAttribute(shaderInfo);
        }

        if(this.normals.length > 0) {
            this.connectNormalAttribute(shaderInfo);

            const normalMatrix = mat4.create();
            //mat4.invert(normalMatrix, modelMatrix);
            //mat4.transpose(normalMatrix, normalMatrix);
            this.gl.uniformMatrix4fv(shaderInfo.uniformLocations.normalMatrix, true, normalMatrix);
        }

        // Send matriser til shaderen:
        this.setCameraMatrices(shaderInfo, modelMatrix);
    }
}
