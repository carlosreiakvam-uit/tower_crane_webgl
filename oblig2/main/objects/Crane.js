import {Stack} from "../../../base/helpers/Stack.js";
import {Cube} from "../../../base/shapes/Cube.js";
import {Cylinder} from "../../../base/shapes/Cylinder.js";
import {Tower} from "./Tower.js"
import {SkewedFloor} from "./SkewedFloor.js";
import {SkewedWindow} from "./SkewedWindow.js";
import {Line} from "../../../base/shapes/Line.js";
import {CubeTextured} from "../../../base/shapes/CubeTextured.js";
import {CylinderTextured} from "../../../base/shapes/CylinderTextured.js";
import {Sphere} from "../../../base/shapes/Sphere.js";

export class Crane {
    constructor(app) {
        this.app = app;

        this.stack = new Stack();
        this.dims = {
            carBodyHeight: 1,
            craneFloorSkew: 1,
            craneWindowSkew: 10,
            wheelWidth: 1,
            wheelBase: 10
        }
        this.vertTowerDims = {
            wSpacing: 1.4,
            nStoreys: 10
        }
        this.horTowerDims = {
            wSpacing: 1,
            nStoreys: 8
        }
        this.frontAngledTowerDims = {
            wSpacing: 1,
            nStoreys: 8
        }
        this.backAngledTowerDims = {
            wSpacing: 1,
            nStoreys: 4
        }


        this.carBody = new CubeTextured(app, ['../../base/textures/metal1.png'])
        this.carBody.initBuffers()
        this.belt = new CubeTextured(
            app,
            ['../../base/textures/wheelTexture-1.png'],
            {xMin: 0, xMax: 1, yMin: 0.73633, yMax: 1}
        )
        this.belt.initBuffers()
        this.belt.textureAttribute = 1;

        this.wheel = new CylinderTextured(
            app,
            ['../../base/textures/wheelTexture-1.png'],
            {xMin: 0, xMax: 0.52734, yMin: 0, yMax: 0.52734},
            {xMin: 0, xMax: 1, yMin: 0.73633, yMax: 1})
        this.wheel.initBuffers()

        // Towers
        this.towerCylinder = new Cylinder(app, {red: 0.2627, blue: 0.2745, green: 0.2941, alpha: 1})
        this.towerCylinder.initBuffers()
        this.sphere = new Sphere(app, {red: 0.2627, blue: 0.2745, green: 0.2941, alpha: 1});
        this.sphere.initBuffers();

        this.vertTower = new Tower(app, this.vertTowerDims, this.towerCylinder, this.sphere)
        this.horTower = new Tower(app, this.horTowerDims, this.towerCylinder, this.sphere)

        // tower winch
        this.towerWinch = new Cylinder(app, {red: 0, blue: 0, green: 0, alpha: 1}, 100)
        this.towerWinch.initBuffers()

        // crane house base
        this.craneHouseBase = new CylinderTextured(app, ['../../base/textures/metal1.png'])
        this.craneHouseBase.initBuffers()

        // Crane House
        this.skewedFloor = new SkewedFloor(app, this.dims.craneFloorSkew, ['../../base/textures/metal1.png'], {
            xMin: 0,
            xMax: 1,
            yMin: 0.835,
            yMax: 1
        })
        this.skewedFloor.initBuffers()

        this.skewedWindow = new SkewedWindow(app, this.dims.craneWindowSkew, ['../../base/textures/metal1.png'], {
            xMin: 0,
            xMax: 1,
            yMin: 0.165,
            yMax: 0.835
        })
        this.skewedWindow.initBuffers()

        this.topWindow = new CubeTextured(app, ['../../base/textures/metal1.png'], {
            xMin: 0,
            xMax: 1,
            yMin: 0.165,
            yMax: 0.835
        })
        this.topWindow.initBuffers()

        this.craneRoof = new CubeTextured(app, ['../../base/textures/metal1.png'], {
            xMin: 0,
            xMax: 1,
            yMin: 0.835,
            yMax: 1
        })
        this.craneRoof.initBuffers()

        this.craneBackWall = new CubeTextured(app, ['../../base/textures/metal1.png'], {
            xMin: 0,
            xMax: 1,
            yMin: 0.165,
            yMax: 0.835
        })
        this.craneBackWall.initBuffers()

        this.wire = new Line(app, {red: 0.2627, blue: 0.2745, green: 0.2941, alpha: 1})
        this.wire.initBuffers()

        this.magnet = new Cylinder(app, {red: 0.52, green: 0.8, blue: 0.92, alpha: 1})
        this.magnet.initBuffers()

        this.translationX = 0
        this.translationZ = 0
        this.rotationY = 0
        this.craneAngle = 45
        this.magnetHeigth = 10;
        this.driveSpeed = 40
        this.rotationAmount = 100

        this.totalAngle = 0
        this.totalScale = 1
    }

    degToRad(deg) {
        return deg * (Math.PI / 180)
    }

    radToDeg(rad) {
        return rad * 180 / Math.PI
    }

    handleKeys(elapsed) {
        // Dersom ev. del-figur skal animeres håndterer den det selv.
        //this.cone.handleKeys(elapsed);
        // Flytter hele figuren:
        //37 39
        if (this.app.currentlyPressedKeys[40]) {    // arrow down
            this.translationX -= this.driveSpeed * Math.cos(this.degToRad(this.totalAngle)) * elapsed;
            this.translationZ -= this.driveSpeed * Math.sin(this.degToRad(this.totalAngle)) * elapsed * -1;
        }

        if (this.app.currentlyPressedKeys[38]) {    // arrow up
            this.translationX += this.driveSpeed * Math.cos(this.degToRad(this.totalAngle)) * elapsed;
            this.translationZ += this.driveSpeed * Math.sin(this.degToRad(this.totalAngle)) * elapsed * -1;
        }

        // Roterer hele figuren
        if (this.app.currentlyPressedKeys[37]) {    //arrow right
            this.totalAngle += this.rotationAmount * elapsed
        }
        if (this.app.currentlyPressedKeys[39]) {    //arrow left
            this.totalAngle -= this.rotationAmount * elapsed
        }

        // Roterer kran
        if (this.app.currentlyPressedKeys[69]) {    //E
            this.rotationY = this.rotationY - 30 * elapsed;
        }
        if (this.app.currentlyPressedKeys[81]) {    //Q
            this.rotationY = this.rotationY + 30 * elapsed;
        }
        if (this.app.currentlyPressedKeys[82]) {    // R
            if (this.craneAngle > 25) {
                this.craneAngle = this.craneAngle - 30 * elapsed;
            } else {
                this.craneAngle = 25
            }
        }
        if (this.app.currentlyPressedKeys[70]) {    // F
            if (this.craneAngle < 90) {
                this.craneAngle = this.craneAngle + 30 * elapsed;
            } else {
                this.craneAngle = 90
            }
        }
        if (this.app.currentlyPressedKeys[71]) {    //T
            if (this.magnetHeigth < 17) {
                this.magnetHeigth += 0.1;
            }
        }
        if (this.app.currentlyPressedKeys[84]) {    //G
            if (this.magnetHeigth > 1.5) {
                this.magnetHeigth -= 0.1;
            }
        }

        if (this.app.currentlyPressedKeys[73]) {    //I
            if (this.totalScale >= 20) {
                this.totalScale = 20
            } else {
                this.totalScale += 0.1
            }
        }

        if (this.app.currentlyPressedKeys[75]) {    //K
            if (this.totalScale <= 0.1) {
                this.totalScale = 0.1
            } else {
                this.totalScale -= 0.1
            }

        }


    }

    draw(shaderInfo, textureShaderInfo, elapsed, modelMatrix = new Matrix4()) {
        modelMatrix.setIdentity();
        modelMatrix.translate(this.translationX, 0, this.translationZ); // kjøre bil
        modelMatrix.rotate(180, 0, 1, 0)
        modelMatrix.rotate(this.totalAngle, 0, 1, 0)
        modelMatrix.scale(this.totalScale, this.totalScale, this.totalScale)
        this.stack.pushMatrix(modelMatrix);	 	//Legges på toppen av stacken.

        // draw objects
        this.drawCarBody(textureShaderInfo, elapsed, this.stack)
        this.drawWheels(textureShaderInfo, elapsed, this.stack)
        this.drawBelts(textureShaderInfo, elapsed, this.stack)
        this.drawVerticalTower(shaderInfo, elapsed, this.stack)
        this.drawCraneHouseBase(textureShaderInfo, elapsed, this.stack)
        this.drawCraneHouse(textureShaderInfo, elapsed, this.stack)
        this.drawHorizontalTower(shaderInfo, elapsed, this.stack)
        this.drawFrontAngledTower(shaderInfo, elapsed, this.stack)
        this.drawBackAngledTower(shaderInfo, elapsed, this.stack)
        this.drawTowerWinch(shaderInfo, elapsed, this.stack)
        this.drawWires(shaderInfo, elapsed, this.stack)
        this.drawMagnet(shaderInfo, elapsed, this.stack)
        // empty stack at end
        this.stack.empty()

    }

    drawCarBody(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix();
        modelMatrix.translate(0, 1, 0);
        // stack.pushMatrix(modelMatrix)
        modelMatrix.scale(8, this.dims.carBodyHeight, 4);
        this.carBody.draw(shaderInfo, elapsed, modelMatrix)
    }

    drawWheels(shaderInfo, elapsed, stack) {
        let wbh = this.dims.wheelBase / 2 // wheelbase half
        let rotation = -this.translationX * 10;

        this.drawWheel(shaderInfo, elapsed, stack, wbh, 4.5, rotation)
        this.drawWheel(shaderInfo, elapsed, stack, -wbh, -4.5, rotation)
        this.drawWheel(shaderInfo, elapsed, stack, wbh, -4.5, rotation)
        this.drawWheel(shaderInfo, elapsed, stack, -wbh, 4.5, rotation)
    }

    drawWheel(shaderInfo, elapsed, stack, wbh, z, rotation) {
        let modelMatrix = stack.peekMatrix();
        modelMatrix.translate(wbh, 0, z);
        modelMatrix.rotate(90, 1, 0, 0)
        modelMatrix.rotate(rotation, 0, 1, 0)
        modelMatrix.scale(2, 1, 2)
        this.wheel.draw(shaderInfo, elapsed, modelMatrix)
    }

    drawBelts(shaderInfo, elapsed, stack) {
        let wbh = this.dims.wheelBase / 2
        this.drawBelt(shaderInfo, elapsed, stack, wbh, 2, 4.5)
        this.drawBelt(shaderInfo, elapsed, stack, wbh, -2, 4.5)
        this.drawBelt(shaderInfo, elapsed, stack, wbh, -2, -4.5)
        this.drawBelt(shaderInfo, elapsed, stack, wbh, 2, -4.5)
    }

    drawBelt(shaderInfo, elapsed, stack, wbh, y, z) {
        let modelMatrix = stack.peekMatrix()
        modelMatrix.translate(0, y, z)
        modelMatrix.scale(wbh, 0.01, this.dims.wheelWidth / 2)
        this.belt.draw(shaderInfo, elapsed, modelMatrix)
    }

    drawVerticalTower(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix();
        modelMatrix.translate(0, 4, 0); // place tower on top of carbody
        stack.pushMatrix(modelMatrix)
        for (let i = 0; i < this.vertTowerDims.nStoreys; i++) {
            this.vertTower.draw(shaderInfo, elapsed, modelMatrix)
            modelMatrix = this.vertTower.translateUp(modelMatrix) // get modelMatrix from last local stack of tower
        }

        // adjust height
        modelMatrix.translate(0, -0.5, 0)
        stack.pushMatrix(modelMatrix)
    }

    drawHorizontalTower(shaderInfo, elapsed, stack) {
        stack.popMatrix()
        let modelMatrix = stack.peekMatrix()
        modelMatrix.translate(this.horTowerDims.nStoreys * 3, 0, 0)
        modelMatrix.rotate(90, 0, 0, 1)
        for (let i = 0; i < this.horTowerDims.nStoreys; i++) {
            this.horTower.draw(shaderInfo, elapsed, modelMatrix)
            modelMatrix = this.horTower.translateUp(modelMatrix) // get modelMatrix from last local stack of tower
        }
    }

    drawFrontAngledTower(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()
        modelMatrix.translate(-4, 1, 0)
        modelMatrix.rotate(this.craneAngle, 0, 0, 1)
        modelMatrix.translate(0, 1, 0)
        for (let i = 0; i < this.frontAngledTowerDims.nStoreys; i++) {
            this.horTower.draw(shaderInfo, elapsed, modelMatrix)
            modelMatrix = this.horTower.translateUp(modelMatrix) // get modelMatrix from last local stack of tower
        }
    }

    drawBackAngledTower(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()
        modelMatrix.translate(4, 1, 0)
        modelMatrix.rotate(50, 0, 0, -1)
        for (let i = 0; i < this.backAngledTowerDims.nStoreys; i++) {
            this.horTower.draw(shaderInfo, elapsed, modelMatrix)
            modelMatrix = this.horTower.translateUp(modelMatrix) // get modelMatrix from last local stack of tower
        }
        stack.pushMatrix(modelMatrix)
    }

    drawTowerWinch(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()
        modelMatrix.rotate(50, 0, 0, 1)
        modelMatrix.scale(2.2, 2.2, 2.2)
        modelMatrix.translate(-0.8, -0.1, 0)
        this.towerWinch.draw(shaderInfo, elapsed, modelMatrix)
        stack.popMatrix()
    }


    drawWires(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()
        let backLeaningTowerX = 12;
        let backLeaningTowerY = 8;
        let armLength = this.frontAngledTowerDims.nStoreys * 3;
        let angleRadians = ((this.craneAngle + 90) * Math.PI) / 180.0
        let armEndX = (armLength * Math.cos(angleRadians)) - 4;
        let armEndY = (armLength * Math.sin(angleRadians)) + 1;

        let wireLength = Math.sqrt(Math.pow(armEndX - backLeaningTowerX, 2) + Math.pow(armEndY - backLeaningTowerY, 2));

        let angle = Math.atan2(backLeaningTowerY - armEndY, backLeaningTowerX - armEndX) * (180 / Math.PI)

        modelMatrix.translate(backLeaningTowerX, backLeaningTowerY, 0)
        stack.pushMatrix(modelMatrix)

        modelMatrix.rotate(90, 0, 0, 1);
        modelMatrix.translate(-backLeaningTowerY / 2, 0, 0);
        modelMatrix.scale(backLeaningTowerY / 2, 0, 0);
        this.wire.draw(shaderInfo, elapsed, modelMatrix);

        modelMatrix = stack.peekMatrix();
        modelMatrix.rotate(angle + 180, 0, 0, 1);
        modelMatrix.translate(wireLength / 2, 0, 0)
        modelMatrix.scale(wireLength / 2, 0, 0);
        this.wire.draw(shaderInfo, elapsed, modelMatrix);
        stack.popMatrix();

        modelMatrix = stack.peekMatrix()
        wireLength = (armEndY / 2) + this.magnetHeigth;

        modelMatrix.translate(armEndX, armEndY, 0);
        modelMatrix.rotate(90, 0, 0, 1);
        modelMatrix.translate(-wireLength, 0, 0)
        stack.pushMatrix(modelMatrix);
        modelMatrix.scale(wireLength, 0, 0);
        this.wire.draw(shaderInfo, elapsed, modelMatrix)
        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(-wireLength, 0, 0)
        modelMatrix.rotate(-90, 0, 0, 1)
        stack.pushMatrix(modelMatrix)
    }

    drawMagnet(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()

        modelMatrix.scale(5, 2, 5)
        this.magnet.draw(shaderInfo, elapsed, modelMatrix)
    }


    drawCraneHouseBase(shaderInfo, elapsed, stack) {
        let modelMatrix = stack.peekMatrix()
        modelMatrix.rotate(this.rotationY * 4, 0, 1, 0);
        stack.pushMatrix(modelMatrix)

        modelMatrix.scale(2, 1.5, 2)
        this.craneHouseBase.draw(shaderInfo, elapsed, modelMatrix)

        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(0, 2, 0)
        stack.pushMatrix(modelMatrix)
    }

    drawCraneHouse(shaderInfo, elapsed, stack) {
        let floorX = 1.4
        let floorY = 0.5
        let windowHeight = 1

        // Skewed floor
        let modelMatrix = stack.peekMatrix()
        modelMatrix.translate(this.vertTowerDims.wSpacing / 2, -1, 0)
        stack.pushMatrix(modelMatrix)
        modelMatrix.scale(floorX, floorY, 1.5)
        this.skewedFloor.draw(shaderInfo, elapsed, modelMatrix)


        // Bottom window
        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(-floorX * 2, floorY, 0)
        stack.pushMatrix(modelMatrix)
        modelMatrix.scale(0.1, windowHeight, this.vertTowerDims.wSpacing)
        this.skewedWindow.draw(shaderInfo, elapsed, modelMatrix)

        // Top window
        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(-1.1, floorY * 2 + windowHeight, 0)
        modelMatrix.scale(0.1, windowHeight, this.vertTowerDims.wSpacing)
        this.topWindow.draw(shaderInfo, elapsed, modelMatrix)

        stack.popMatrix()
        stack.popMatrix()

        // Back wall
        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(floorX, 1, 0)
        modelMatrix.scale(0.7, windowHeight + windowHeight / 2, this.vertTowerDims.wSpacing)
        this.craneBackWall.draw(shaderInfo, elapsed, modelMatrix)


        // roof
        modelMatrix = stack.peekMatrix()
        modelMatrix.translate(-floorX / 2 + 0.1, windowHeight * 2 + windowHeight / 2, 0)
        modelMatrix.scale(floorX + 1.3, 0.1, this.vertTowerDims.wSpacing)
        this.craneRoof.draw(shaderInfo, elapsed, modelMatrix)

        stack.pushMatrix(modelMatrix)
    }
}