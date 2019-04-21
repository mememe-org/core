"use strict";
exports.__esModule = true;
const commons = require('./commons');
const { canvas } = commons;
const { Canvas, Image } = canvas;
const fs = require('fs')

const MockResult = async (timeout) => (
    new Promise((res) => {
        setTimeout(() => {
            res([{
                face:
                {
                    width: 109,
                    height: 147,
                    shift_x: 355.3043603897095,
                    shift_y: 136.69468760490417
                },
                orientation: -1,
                left_eyes: [397.523576254646, 192.83797244727612],
                right_eyes: [443.58971536159515, 200.39060734212399]
            }])
        }, timeout)
    })
);

function resize_image(image, scale_down_factor) {
    const resized_image = new Canvas(image.width / scale_down_factor, image.height / scale_down_factor);
    const context = resized_image.getContext('2d');
    context.drawImage(image, 0, 0, image.width / scale_down_factor, image.height / scale_down_factor);
    return resized_image;
}

async function sunGlassesTest() {
    // Load image
    const result = (await MockResult(500))[0];
    const img = await canvas.loadImage('./helpers/test.JPEG');
    let glasses = null;
    let eye_glasses_loc = [[-1, -1], [-1, -1]]
    if(result.orientation === -1) {
        glasses = await canvas.loadImage('./helpers/assets/glasses_left.png');
        // 350, 53
        eye_glasses_loc = [[158, 30], [292, 30]]
    } else if(result.orientation === 0) {
        // 834, 160
        glasses = await canvas.loadImage('./helpers/assets/glasses_mid.png');
        eye_glasses_loc = [[205, 80], [634, 80]]
    } else {
        // 250, 53
        glasses = await canvas.loadImage('./helpers/assets/glasses_right.png');
        eye_glasses_loc = [[192, 30], [58, 80]]
    }

    // Resize sunglasses to match eyes distance
    const eye_dist = ((result.left_eyes[0] - result.right_eyes[0]) ** 2 + (result.left_eyes[1] - result.right_eyes[1])**2)**0.5;
    const eye_glasses_dist = ((eye_glasses_loc[0][0] - eye_glasses_loc[1][0])**2 + (eye_glasses_loc[0][1] - eye_glasses_loc[1][1])**2)**0.5;

    // Relative to (normalize size)
    const scale_down_factor = eye_glasses_dist/eye_dist;
    // console.log(scale_down_factor)
    const scale_glasses = resize_image(glasses, scale_down_factor);

    // Rotate sunglassed to match face orientation
    // Find Angle using Math.atan
    let angle = Math.atan(-1*(result.right_eyes[1] - result.left_eyes[1])/(result.right_eyes[0] - result.left_eyes[0]));
    // if(angle < 0) angle += Math.PI;

    // Just make sure the template has enough size is okay
    const rotated_glasses = new Canvas(img.width, img.height);
    const context = rotated_glasses.getContext('2d');
    // Rotate around template center
    const [cx, cy] = [img.width/2, img.height/2];
    context.translate(cx, cy);
    context.rotate(-1*angle);
    context.drawImage(scale_glasses, -scale_glasses.width/2, -scale_glasses.height/2);
    context.rotate(angle);
    context.translate(-1*cx, -1*cy);

    // Calculate eyes center
    const eyes_center = [(result.right_eyes[0] + result.left_eyes[0])/2, (result.right_eyes[1] + result.left_eyes[1])/2]
    const new_img = new Canvas(img.width, img.height);
    const new_context = new_img.getContext('2d');
    new_context.drawImage(img, 0, 0);
    new_context.translate(eyes_center[0], eyes_center[1]);
    new_context.drawImage(rotated_glasses, -img.width/2 + result.orientation*17, -img.height/2);

    fs.writeFileSync('out_test_2.png', new_img.toBuffer());
}

async function addEyeObject(results, img, glasses, eye_glasses_loc) {
    const new_img = new Canvas(img.width, img.height);
    const new_context = new_img.getContext('2d');
    new_context.drawImage(img, 0, 0);

    results.forEach((result) => {
        // Resize sunglasses to match eyes distance
        const eye_dist = ((result.left_eyes[0] - result.right_eyes[0]) ** 2 + (result.left_eyes[1] - result.right_eyes[1]) ** 2) ** 0.5;
        const eye_glasses_dist = ((eye_glasses_loc[0][0] - eye_glasses_loc[1][0]) ** 2 + (eye_glasses_loc[0][1] - eye_glasses_loc[1][1]) ** 2) ** 0.5;

        // Relative to (normalize size)
        const scale_down_factor = eye_glasses_dist / eye_dist;
        // console.log(scale_down_factor)
        const scale_glasses = resize_image(glasses, scale_down_factor);

        // Rotate sunglassed to match face orientation
        // Find Angle using Math.atan
        let angle = Math.atan(-1 * (result.right_eyes[1] - result.left_eyes[1]) / (result.right_eyes[0] - result.left_eyes[0]));
        // if(angle < 0) angle += Math.PI;

        // Just make sure the template has enough size is okay
        const rotated_glasses = new Canvas(img.width, img.height);
        const context = rotated_glasses.getContext('2d');
        // Rotate around template center
        const [cx, cy] = [img.width / 2, img.height / 2];
        context.translate(cx, cy);
        context.rotate(-1 * angle);
        context.drawImage(scale_glasses, -scale_glasses.width / 2, -scale_glasses.height / 2);
        context.rotate(angle);
        context.translate(-1 * cx, -1 * cy);

        // Calculate eyes center
        const eyes_center = [(result.right_eyes[0] + result.left_eyes[0]) / 2, (result.right_eyes[1] + result.left_eyes[1]) / 2]
        new_context.translate(eyes_center[0], eyes_center[1]);
        new_context.drawImage(rotated_glasses, -img.width / 2, -img.height / 2);
        new_context.translate(-1 * eyes_center[0], -1 * eyes_center[1]);
    })
    // fs.writeFileSync('out_test_2.png', new_img.toBuffer());

    const final_image = new Image()
    final_image.src = new_img.toDataURL('image/png');
    return final_image;
}

async function addHatObject(results, img, object, loc, offsetRatio) {
    const new_img = new Canvas(img.width, img.height);
    const new_context = new_img.getContext('2d');
    new_context.drawImage(img, 0, 0);

    results.forEach((result) => {
        // Resize object to match eyes distance
        const eye_dist = ((result.left_eyes[0] - result.right_eyes[0]) ** 2 + (result.left_eyes[1] - result.right_eyes[1]) ** 2) ** 0.5;
        const object_dist = ((loc[0][0] - loc[1][0]) ** 2 + (loc[0][1] - loc[1][1]) ** 2) ** 0.5;

        // Relative to (normalize size)
        const scale_down_factor = object_dist / eye_dist;
        // console.log(scale_down_factor)
        const scale_object = resize_image(object, scale_down_factor);

        // Rotate sunglassed to match face orientation
        // Find Angle using Math.atan
        let angle = Math.atan(-1 * (result.right_eyes[1] - result.left_eyes[1]) / (result.right_eyes[0] - result.left_eyes[0]));
        // if(angle < 0) angle += Math.PI;

        // Just make sure the template has enough size is okay
        const rotated_object = new Canvas(img.width, img.height);
        const context = rotated_object.getContext('2d');
        // Rotate around template center
        const [cx, cy] = [img.width / 2, img.height / 2];
        context.translate(cx, cy);
        context.rotate(-1 * angle);
        context.drawImage(scale_object, -scale_object.width / 2, -scale_object.height / 2);
        context.rotate(angle);
        context.translate(-1 * cx, -1 * cy);

        // Calculate forehead center
        const eyes_center = [(result.right_eyes[0] + result.left_eyes[0]) / 2, (result.right_eyes[1] + result.left_eyes[1]) / 2];
        const nose_center = result.chin;
        const eyes_chin_dist = ((eyes_center[0] - nose_center[0]) ** 2 + (eyes_center[1] - nose_center[1])**2)**0.5;

        const eyes_forehead_dist = eyes_chin_dist;

        const fore_head_center = [
            eyes_center[0] - eyes_forehead_dist*Math.sin(angle)*offsetRatio,
            eyes_center[1] - eyes_forehead_dist*Math.cos(angle)*offsetRatio
        ]
        
        new_context.translate(fore_head_center[0], fore_head_center[1]);
        new_context.drawImage(rotated_object, -img.width / 2, -img.height / 2);
        new_context.translate(-1 * fore_head_center[0], -1 * fore_head_center[1]);
    })
    fs.writeFileSync('out_test_2.png', new_img.toBuffer());

    const final_image = new Image()
    final_image.src = new_img.toDataURL('image/png');
    return final_image;

}

async function sunGlasses(results, img) {
    // Load image
    const glasses = await canvas.loadImage('./helpers/assets/glasses_mid.png');
    const eye_glasses_loc = [[205, 80], [634, 80]]
    return addEyeObject(results, img, glasses, eye_glasses_loc)
}
async function eyeBlock(results, img) {
    const block = await canvas.loadImage('./helpers/assets/blackbox.png');
    const loc = [[205, 80], [634, 80]]
    return addEyeObject(results, img, block, loc);
}

async function addHat(results, img) {
    const hat = await canvas.loadImage('./helpers/assets/hat3.png');
    const loc = [[237, 260], [577 - 237, 260]];
    return addHatObject(results, img, hat, loc, 0.5);
}

async function addStupidHat(results, img) {
    const hat = await canvas.loadImage('./helpers/assets/stupid_hat.png');
    const loc = [[110, 237], [428 - 110, 237]];
    return addHatObject(results, img, hat, loc, 1.0);
}

exports.sunGlassesTest = sunGlassesTest;
exports.sunGlasses = sunGlasses;
exports.eyeBlock = eyeBlock;
exports.addHat = addHat;
exports.addStupidHat = addStupidHat;