// 'use strict';
import {BaseShape} from "./BaseShape.js";

export class Line extends BaseShape {
    constructor(app, color = {red: 0.8, green: 0.0, blue: 0.6, alpha: 1}) {
        super(app);
        this.color = color;
    }

    setPositions() {
        this.positions = [
            -1, 0, 0,
            1, 0, 0
        ];
    }

    setColors() {
        this.colors.push(this.color.red, this.color.green, this.color.blue, this.color.alpha);
        this.colors.push(this.color.red, this.color.green, this.color.blue, this.color.alpha);
    }


    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);

        this.gl.drawArrays(this.gl.LINES, 0, this.vertexCount);
    }
}
