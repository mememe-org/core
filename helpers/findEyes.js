"use strict";
exports.__esModule = true;

const path = require('path')
const faceapi = require('face-api.js');
const commons = require('./commons');
const { canvas, faceDetectionNet, faceDetectionOptions } = commons;

let is_init = false;
async function init() {
    if (!is_init) {
        is_init = true;
        await faceDetectionNet.loadFromDisk(path.join(__dirname, './weights'))
        await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, './weights'))
    }
}

async function run(img) {
    await init();
    const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
        .withFaceLandmarks()

    return results.map((res) => {
        const epsilon = 0.000001;
        const left_dist = Math.abs(res.landmarks._positions[36]._x - res.landmarks._shift._x) + epsilon;
        const right_dist = Math.abs(res.landmarks._shift._x + res.landmarks._imgDims._width - res.landmarks._positions[45]._x) + epsilon;
        
        const threshold = 0.70;
        const orientation = (left_dist/right_dist < threshold) ? 1 : (left_dist/right_dist > 1/threshold) ? -1 : 0;
        return ({
            face: {
                width: res.landmarks._imgDims._width,
                height: res.landmarks._imgDims._height,
                shift_x: res.landmarks._shift._x,
                shift_y: res.landmarks._shift._y
            },
            orientation: orientation, // -1 left, 0 middle, 1 right
            left_eyes: res.landmarks._positions.slice(36, 42).reduce((acc, it) => {
                return [acc[0] + it._x, acc[1] + it._y];
            }, [0, 0]).map((it) => it / 6),
            right_eyes: res.landmarks._positions.slice(42, 48).reduce((acc, it) => {
                return [acc[0] + it._x, acc[1] + it._y];
            }, [0, 0]).map((it) => it / 6),
            chin: [
                res.landmarks._positions[8]._x,
                res.landmarks._positions[8]._y
            ],
            nose: [
                res.landmarks._positions[33]._x,
                res.landmarks._positions[33]._y
            ]
        })
    });
}

async function run_test() {
    const img = await canvas.loadImage('./helpers/test.JPEG')
    return await run(img);
};

exports.run_test = run_test;
exports.run = run;