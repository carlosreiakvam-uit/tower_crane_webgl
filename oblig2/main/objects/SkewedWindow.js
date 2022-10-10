// 'use strict';
import {BaseShape} from "../../../base/shapes/BaseShape.js";
import {ImageLoader} from "../../../base/helpers/ImageLoader.js";
import {isPowerOfTwo1} from "../../../base/lib/utility-functions.js";

/**
 * Setter this.positions, this.colors for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class SkewedWindow extends BaseShape {
    constructor(app, skew, textureUrls,
                textureMinMax = {xMin: 0, xMax: 1, yMin: 0, yMax: 1}) {
        super(app)
        this.skew = skew
        this.textureUrls = textureUrls
        this.textureMinMax = textureMinMax
    }

    catPos(posVecs) {
        for (const i in posVecs) {
            this.positions = this.positions.concat(posVecs[i])
        }
    }

    setNormals() {
        //Forsiden:
        this.normals =[
            //Bunn:
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

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


            //Forsiden:
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            //Topp
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,




            //Venstre side:
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,

        ];
    }

    setPositions() {
        let x = 1
        let y = 1
        let z = 1

        let s = this.skew
        let a = [-x, 0, z]
        let b = [-x, 0, -z]
        let c = [x, 0, z]
        let d = [x, 0, -z]
        let e = [-x - s, y, z]
        let f = [-x - s, y, -z]
        let g = [x - s, y, z]
        let h = [x - s, y, -z]

        this.catPos([a, b, c, b, d, c]) // bottom
        this.catPos([c, g, d, g, h, d]) // right wall
        this.catPos([b, f, d, f, h, d]) // back wall
        this.catPos([a, e, c, e, g, c]) // front wall
        this.catPos([e, f, g, f, h, g]) // top
        this.catPos([a, e, b, e, f, b]) // skewed wall
    }

    setTextureCoordinates() {
        let tl = [this.textureMinMax.xMin, this.textureMinMax.yMax];
        let bl = [this.textureMinMax.xMin, this.textureMinMax.yMin];
        let tr = [this.textureMinMax.xMax, this.textureMinMax.yMax];
        let br = [this.textureMinMax.xMax, this.textureMinMax.yMin];
        this.textureCoordinates = []
        //Bottom:
        for (let i = 0; i < 6; i++) {
            this.textureCoordinates = this.textureCoordinates.concat(bl, tl, br, tl, tr, br);
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
