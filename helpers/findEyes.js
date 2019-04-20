"use strict";
exports.__esModule = true;

const faceapi = require('face-api.js');
const commons = require('./commons');
const { canvas, faceDetectionNet, faceDetectionOptions } = commons;

let is_init = false;
async function init() {
    if (!is_init) {
        is_init = true;
        await faceDetectionNet.loadFromDisk('./helpers/weights')
        await faceapi.nets.faceLandmark68Net.loadFromDisk('./helpers/weights')
    }
}

async function run(img) {
    await init();
    const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
        .withFaceLandmarks()

    return results.map((res) => {
        return ({
            face: {
                width: res.landmarks._imgDims._width,
                height: res.landmarks._imgDims._height,
                shift_x: res.landmarks._shift._x,
                shift_y: res.landmarks._shift._y
            },
            left_eyes: res.landmarks._positions.slice(36, 42).reduce((acc, it) => {
                return [acc[0] + it._x, acc[1] + it._y];
            }, [0, 0]).map((it) => it / 6),
            right_eyes: res.landmarks._positions.slice(42, 48).reduce((acc, it) => {
                return [acc[0] + it._x, acc[1] + it._y];
            }, [0, 0]).map((it) => it / 6)
        })
    });
}

async function run_test() {
    const img = await canvas.loadImage('./helpers/test.JPEG')
    return await run(img);
};

exports.run_test = run_test;
exports.run = run;