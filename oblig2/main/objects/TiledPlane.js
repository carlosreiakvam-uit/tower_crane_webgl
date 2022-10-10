import {CubeTextured} from "../../../base/shapes/CubeTextured.js";

export class TiledPlane {
    constructor(app, url, textureMinMax = {xMin: 0, xMax: 10, yMin: 0, yMax: 10}) {
        this.app = app;

        this.ground = new CubeTextured(app, [url], textureMinMax
        )
        this.ground.initBuffers()
    }

    draw(textureShaderInfo, elapsed, modelMatrix) {
        this.ground.draw(textureShaderInfo, elapsed, modelMatrix)
    }
}