// 'use strict';
import {Stack} from "../../../base/helpers/Stack.js";

export class Tower {
    constructor(app, td, cylinder, sphere) {
        this.app = app
        this.td = td // tower dimensions
        this.nStoreys = td.nStoreys
        this.localStack = new Stack()
        this.cylinder = cylinder;
        this.sphere = sphere;

        this.cyl_r = 0.1
        this.cyl_h = 3
        this.sphere_size = this.cyl_r / 2;
        this.sphere_pos = this.cyl_h / 2;
        this.angledHeight = Math.sqrt(Math.pow(this.cyl_h, 2) + Math.pow(this.cyl_h, 2)) - this.cyl_r * 2
    }

    drawVerticalCylinder(shaderInfo, elapsed, modelMatrix, x, z) {
        modelMatrix = this.localStack.peekMatrix()
        modelMatrix.translate(x * this.td.wSpacing, 0, z * this.td.wSpacing)
        this.localStack.pushMatrix(modelMatrix)
        modelMatrix.scale(this.cyl_r, this.cyl_h, this.cyl_r)
        this.cylinder.draw(shaderInfo, elapsed, modelMatrix)

        modelMatrix = this.localStack.peekMatrix();
        this.localStack.popMatrix()
        modelMatrix.translate(0, this.sphere_pos, 0)
        modelMatrix.scale(this.sphere_size, this.sphere_size, this.sphere_size)
        this.sphere.draw(shaderInfo, elapsed, modelMatrix)
    }

    drawSlantedCylinder(shaderInfo, elapsed, modelMatrix, x, z, rotate) {
        modelMatrix = this.localStack.peekMatrix()
        modelMatrix.translate(x * this.td.wSpacing, 0, z * this.td.wSpacing)
        modelMatrix.rotate(90, 0, rotate, 0)
        modelMatrix.rotate(45, 1, 0, 0)
        modelMatrix.scale(this.cyl_r, this.angledHeight, this.cyl_r)
        this.cylinder.draw(shaderInfo, elapsed, modelMatrix)
    }

    drawHorizontalCylinder(shaderInfo, elapsed, modelMatrix, x, z, rotate) {
        modelMatrix = this.localStack.peekMatrix()
        modelMatrix.translate(x * this.td.wSpacing, 0, z * this.td.wSpacing)
        modelMatrix.rotate(90, 1, 0, 0)
        if (rotate) {
            modelMatrix.rotate(90, 0, 0, 1)
        }
        modelMatrix.scale(this.cyl_r, this.td.wSpacing * 2, this.cyl_r)
        this.cylinder.draw(shaderInfo, elapsed, modelMatrix)
    }

    translateUp(modelMatrix) {
        // translate up y
        modelMatrix = this.localStack.peekMatrix()
        modelMatrix.translate(0, this.cyl_h / 2, 0)
        this.localStack.pushMatrix(modelMatrix)
        return this.localStack.peekMatrix()
    }

    draw(shaderInfo, elapsed, modelMatrix) {
        this.localStack.pushMatrix(modelMatrix)

        this.drawVerticalCylinder(shaderInfo, elapsed, modelMatrix, -1, -1)
        this.drawVerticalCylinder(shaderInfo, elapsed, modelMatrix, -1, 1)
        this.drawVerticalCylinder(shaderInfo, elapsed, modelMatrix, 1, 1)
        this.drawVerticalCylinder(shaderInfo, elapsed, modelMatrix, 1, -1)

        // right side angled
        this.drawSlantedCylinder(shaderInfo, elapsed, modelMatrix, 1, 0, 0)
        // left side angled
        this.drawSlantedCylinder(shaderInfo, elapsed, modelMatrix, -1, 0, 0)
        // front facing angled
        this.drawSlantedCylinder(shaderInfo, elapsed, modelMatrix, 0, 1, 1)
        // far facing angled
        this.drawSlantedCylinder(shaderInfo, elapsed, modelMatrix, 0, -1, 1)

        // translate up y
        modelMatrix = this.localStack.peekMatrix()
        modelMatrix.translate(0, this.cyl_h / 2, 0)
        this.localStack.pushMatrix(modelMatrix)

        // left horizontal
        this.drawHorizontalCylinder(shaderInfo, elapsed, modelMatrix, -1, 0, false)
        // right horizontal
        this.drawHorizontalCylinder(shaderInfo, elapsed, modelMatrix, 1, 0, false)
        // back horizontal
        this.drawHorizontalCylinder(shaderInfo, elapsed, modelMatrix, 0, -1, true)
        // front horizontal
        this.drawHorizontalCylinder(shaderInfo, elapsed, modelMatrix, 0, 1, true)
    }
}



