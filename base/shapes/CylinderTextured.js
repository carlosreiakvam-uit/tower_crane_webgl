// 'use strict';
import {BaseShape} from "./BaseShape.js";
import {ImageLoader} from "../helpers/ImageLoader.js";
import {isPowerOfTwo1} from "../lib/utility-functions.js";
import {Cylinder} from "./Cylinder.js";

/**
 * Setter this.positions, this.colors for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class CylinderTextured extends Cylinder {
    constructor(app,
                textureUrls,
                topTextureMinMax = {xMin: 0, xMax: 1, yMin: 0, yMax: 1},
                wallTextureMinMax = {xMin: 0, xMax: 1, yMin: 0, yMax: 1}
    ) {
        super(app);
        this.textureUrls = textureUrls;
        this.topTextureMinMax = topTextureMinMax;
        this.wallTextureMinMax = wallTextureMinMax;
    }


    setTextureCoordinates() {
        let sectorWidth = (this.wallTextureMinMax.xMax - this.wallTextureMinMax.xMin) / (this.unitCircleVertices.length * 2);

        let halfX = (this.topTextureMinMax.xMax - this.topTextureMinMax.xMin) / 2;
        let halfY = (this.topTextureMinMax.yMax - this.topTextureMinMax.yMin) / 2;

        let centerTop = [halfX, halfY]

        this.textureCoordinates = []
        let cos, sin, nextCos, nextSin, nextI;
        for (let i = 0; i < this.unitCircleVertices.length; i += 2) {
            cos = this.unitCircleVertices[i];
            sin = this.unitCircleVertices[i + 1];
            if (i + 1 < this.unitCircleVertices.length) {
                nextCos = this.unitCircleVertices[i + 2];
                nextSin = this.unitCircleVertices[i + 3];
            } else {
                nextCos = this.unitCircleVertices[0];
                nextSin = this.unitCircleVertices[1];
            }

            // Top triangle
            this.textureCoordinates = this.textureCoordinates.concat(centerTop);
            this.textureCoordinates = this.textureCoordinates.concat(halfX + (halfX * sin), halfY + (halfY * cos))
            this.textureCoordinates = this.textureCoordinates.concat(halfX + (halfX * nextSin), halfY + (halfY * nextCos))

            // First half of the wall
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i), this.wallTextureMinMax.yMax);
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i), this.wallTextureMinMax.yMin);
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i + 2), this.wallTextureMinMax.yMax);

            // second half of the wall
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i), this.wallTextureMinMax.yMax);
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i), this.wallTextureMinMax.yMin);
            this.textureCoordinates = this.textureCoordinates.concat(
                this.wallTextureMinMax.xMin + (sectorWidth * i + 2), this.wallTextureMinMax.yMin);

            // Bottom triangle
            this.textureCoordinates = this.textureCoordinates.concat(centerTop);
            this.textureCoordinates = this.textureCoordinates.concat(halfX + (halfX * sin), halfY + (halfY * cos))
            this.textureCoordinates = this.textureCoordinates.concat(halfX + (halfX * nextSin), halfY + (halfY * nextCos))

        }
    }

    setNormals() {
        this.normals = [];

        for (let i = 0; i < this.textureCoordinates.length * 3; i += 1) {
            this.normals = this.normals.concat([0,1,0])
        }
    }

    /**
     * Denne kalles fra initBuffers() i BaseShape.
     */
    initTextures() {

        if (this.textureCoordinates.length > 0) {
            //Laster textureUrls...
            let imageLoader = new ImageLoader();
            imageLoader.load((textureImages) => {
                    const textureImage = textureImages[0];
                    if (isPowerOfTwo1(textureImage.width) && isPowerOfTwo1(textureImage.height)) {
                        this.texture = this.gl.createTexture();
                        //Teksturbildet er nå lastet fra server, send til GPU:
                        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

                        //Unngaa at bildet kommer opp-ned:
                        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);   //NB! FOR GJENNOMSIKTIG BAKGRUNN!! Sett også this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

                        //Laster teksturbildet til GPU/shader:
                        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureImage);

                        //Teksturparametre:
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

                        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

                        this.buffers.texture = this.gl.createBuffer();
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
                        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), this.gl.STATIC_DRAW);
                    }
                },
                this.textureUrls);
        }
    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
    }
}
