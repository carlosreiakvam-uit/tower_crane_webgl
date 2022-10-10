import {BaseShape} from "./BaseShape.js";


export class Sphere extends BaseShape {
    constructor(app, color = {red: 0.8, green: 0.1, blue: 0.6, alpha: 1}) {
        super(app);
        this.color = color;
        this.indices = [];
    }

    setPositions() {
        // Basert på kode fra: http://learningwebgl.com/blog/?p=1253
        let radius = 5;
        let latitudeBands = 30;     //latitude: parallellt med ekvator.
        let longitudeBands = 30;    //longitude: går fra nord- til sydpolen.

        //Genererer vertekser:
        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            let theta = latNumber * Math.PI / latitudeBands;
            let sinTheta = Math.sin(theta);
            let cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                let phi = longNumber * 2 * Math.PI / longitudeBands;
                let sinPhi = Math.sin(phi);
                let cosPhi = Math.cos(phi);

                let x = cosPhi * sinTheta;
                let y = cosTheta;
                let z = sinPhi * sinTheta;

                this.positions.push(radius * x);
                this.positions.push(radius * y);
                this.positions.push(radius * z);

                this.colors.push(this.color.red);
                this.colors.push(this.color.green);
                this.colors.push(this.color.blue);
                this.colors.push(this.color.alpha);
            }
        }

        //Genererer indeksdata for å knytte sammen verteksene:
        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                let first = (latNumber * (longitudeBands + 1)) + longNumber;
                let second = first + longitudeBands + 1;
                this.indices.push(first);
                this.indices.push(second);
                this.indices.push(first + 1);

                this.indices.push(second);
                this.indices.push(second + 1);
                this.indices.push(first + 1);
            }
        }
        this.bindIndexBuffer()
    }

    bindIndexBuffer() {
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    }

    // Overstyres for å ikke nulle ut colors arrayet
    setColors() {
    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);

        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }
}