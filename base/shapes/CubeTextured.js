'use strict';
import {BaseShape} from './BaseShape.js';
import {ImageLoader} from "../helpers/ImageLoader.js";
import {isPowerOfTwo1} from "../lib/utility-functions.js";
import {Cube} from "./Cube.js";

/**
 * Setter this.positions, this.colors og this.textureCoordinates for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class CubeTextured extends Cube {
    constructor(app,
                textureUrls,
                textureMinMax = {xMin: 0, xMax: 1, yMin: 0, yMax: 1}) {
        super(app);
        this.textureUrls = textureUrls;
        this.textureMinMax = textureMinMax;
    }

    setTextureCoordinates() {
        let tl = [this.textureMinMax.xMin, this.textureMinMax.yMax];
        let bl = [this.textureMinMax.xMin, this.textureMinMax.yMin];
        let tr = [this.textureMinMax.xMax, this.textureMinMax.yMax];
        let br = [this.textureMinMax.xMax, this.textureMinMax.yMin];
        this.textureCoordinates = []
        //Forsiden:
        this.textureCoordinates = this.textureCoordinates.concat(tl, bl, br, tl, br, tr);
        //Høyre side:
        this.textureCoordinates = this.textureCoordinates.concat(tl, bl, br, tl, br, tr);
        //Baksiden:
        this.textureCoordinates = this.textureCoordinates.concat(bl, br, tl, br, tr, tl);
        //Venstre side:
        this.textureCoordinates = this.textureCoordinates.concat(bl, tr, tl, br, tr, bl);
        //Topp
        this.textureCoordinates = this.textureCoordinates.concat(bl, br, tl, tl, br, tr);
        //Bunn:
        this.textureCoordinates = this.textureCoordinates.concat(tr, bl, br,tr,tl, bl);
    }

    setNormals() {
        //Forsiden:
        this.normals = [];

        this.normals =
            //Forside
            [0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                //H�yre side:
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                //Baksiden:
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                //Venstre side:
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,

                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,

                //Topp
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                //Bunn:
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,

                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0
            ];
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

    handleKeys(elapsed) {
        // implementeres ved behov
    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
        if (this.wireFrame) {
            this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.vertexCount);
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
        }
    }
}
