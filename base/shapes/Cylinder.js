// 'use strict';
import {BaseShape} from "./BaseShape.js";

/**
 * Setter this.positions, this.colors for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class Cylinder extends BaseShape {
    constructor(app, color = {red: 0.8, green: 0.0, blue: 0.6, alpha: 1}, sectorCount = 100, wireFrame = false) {
        super(app);
        this.radius = 1
        this.color = color;
        this.wireFrame = wireFrame;
        this.unitCircleVertices = this.buildUnitCircleVertices(sectorCount)
    }


    setPositions() {
        let height = 1
        
        this.positions = new Float32Array(this.unitCircleVertices.length * 18);
        let positions = this.positions
        this.halfHeight = height / 2;

        for (let i = 0; i < this.unitCircleVertices.length; i += 2) {
            this.cos = this.unitCircleVertices[i];
            this.sin = this.unitCircleVertices[i + 1];
            if (i + 1 < this.unitCircleVertices.length) {
                this.nextCos = this.unitCircleVertices[i + 2];
                this.nextSin = this.unitCircleVertices[i + 3];
            } else {
                this.nextCos = this.unitCircleVertices[0];
                this.nextSin = this.unitCircleVertices[1];
            }

            let j = i * 18

            // Top triangle
            this.addVertex(positions, j, 0, this.halfHeight, 0) // Center of the circle
            this.addVertex(positions, j + 3, this.radius * this.sin, this.halfHeight, this.radius * this.cos);
            this.addVertex(positions, j + 6, this.radius * this.nextSin, this.halfHeight, this.radius * this.nextCos);

            // First half of the wall
            this.addVertex(positions, j + 9, this.radius * this.sin, this.halfHeight, this.radius * this.cos);
            this.addVertex(positions, j + 12, this.radius * this.sin, -this.halfHeight, this.radius * this.cos);
            this.addVertex(positions, j + 15, this.radius * this.nextSin, this.halfHeight, this.radius * this.nextCos);

            // second half of the wall
            this.addVertex(positions, j + 18, this.radius * this.nextSin, this.halfHeight, this.radius * this.nextCos);
            this.addVertex(positions, j + 21, this.radius * this.sin, -this.halfHeight, this.radius * this.cos);
            this.addVertex(positions, j + 24, this.radius * this.nextSin, -this.halfHeight, this.radius * this.nextCos)

            // Bottom triangle
            this.addVertex(positions, j + 27, 0, -this.halfHeight, 0) // Center of the circle
            this.addVertex(positions, j + 30, this.radius * this.sin, -this.halfHeight, this.radius * this.cos);
            this.addVertex(positions, j + 33, this.radius * this.nextSin, -this.halfHeight, this.radius * this.nextCos);

        }


    }

    addVertex(vertices, index, x, y, z) {
        vertices[index] = x;
        vertices[index + 1] = y;
        vertices[index + 2] = z;
    }

    buildUnitCircleVertices(sectorCount) {
        let sectorStep = 2 * Math.PI / sectorCount;
        let sectorAngle = 0;
        let vertices = new Float32Array((sectorCount + 1) * 2);

        for (let i = 0, j = 0; i <= sectorCount; ++i, j += 2) {
            sectorAngle = i * sectorStep;
            vertices[j] = Math.cos(sectorAngle);
            vertices[j + 1] = Math.sin(sectorAngle);

        }
        return vertices;
    }


    setColors() {
        for (let i = 0; i < this.positions.length / 9; i++) {
            this.colors = this.colors.concat(this.color.red, this.color.green, this.color.blue, this.color.alpha);
            this.colors = this.colors.concat(this.color.red, this.color.green, this.color.blue, this.color.alpha);
            this.colors = this.colors.concat(this.color.red, this.color.green, this.color.blue, this.color.alpha);
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
