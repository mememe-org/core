"use strict";
exports.__esModule = true;
const commons = require('./commons');
const { canvas } = commons;
const { Canvas, Image } = canvas;
const fs = require('fs')
const path = require('path')

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
                left_eyes: [397.523576254646, 192.83797244727612],
                right_eyes: [443.58971536159515, 200.39060734212399]
            }])
        }, timeout)
    })
);

/**
 * 
 * @param {Image object} image 
 * @param {Scale down factor} scale_down_factor 
 * 
 * Return resized canvas
 */
function resize_image(image, scale_down_factor) {
    const resized_image = new Canvas(image.width / scale_down_factor, image.height / scale_down_factor);
    const context = resized_image.getContext('2d');
    context.drawImage(image, 0, 0, image.width / scale_down_factor, image.height / scale_down_factor);
    return resized_image;
}

async function flareEyesTest() {
    try {
        const result = (await MockResult(500))[0];

        const img = await canvas.loadImage('./helpers/test.JPEG');
        const flare = await canvas.loadImage('./helpers/assets/glow2.png');

        // Scale down factor
        const scale_factor = Math.max(flare.width/img.width, flare.height/img.height)*1.5;
        
        // Convert to canvas
        const resized_flare = resize_image(flare, scale_factor);
        const img_canvas = resize_image(img, 1);
        const [width, height] = [flare.width / scale_factor, flare.height / scale_factor];

        // [Operation]
        // Create new canvas
        const new_img = new Canvas(img.width, img.height);
        const context = new_img.getContext('2d');

        // Draw background image
        context.drawImage(img_canvas, 0, 0);

        // Recolored image
        context.globalCompositeOperation = "multiply";
        context.fillStyle = "#FF000088";
        context.fillRect(0, 0, img.width, img.height);

        // Revert blend mode
        context.globalCompositeOperation = "source-over"
        
        // Draw flare on left eyes
        context.drawImage(
            resized_flare,
            result.left_eyes[0] - width / 2, result.left_eyes[1] - height/2
        );
        context.globalCompositeOperation = 'lighter';

        // Draw flare on right eyes
        context.drawImage(
            resized_flare,
            result.right_eyes[0] - width / 2, result.right_eyes[1] - height / 2
        );

        fs.writeFileSync('out_test.png', new_img.toBuffer());
    } catch(e) {
        console.error(e);
    }
}

async function flareEyes(results, img) {
    try {
        // image is from canvas.loadImage
        const img_canvas = resize_image(img, 1);
        const flare = await canvas.loadImage(path.join(__dirname, './assets/glow2.png'));

        // Scale down factor
        const scale_factor = Math.max(flare.width / img.width, flare.height / img.height) * 1.5;
        const [width, height] = [flare.width / scale_factor, flare.height / scale_factor];
        const resized_flare = resize_image(flare, scale_factor);

        const new_img = new Canvas(img.width, img.height);
        const context = new_img.getContext('2d');
        // Draw background image
        context.drawImage(img_canvas, 0, 0);

        if(results.length > 0) {
            // Recolored image
            context.globalCompositeOperation = "multiply";
            context.fillStyle = "#FF000088";
            context.fillRect(0, 0, img.width, img.height);
            // Revert blend mode
            context.globalCompositeOperation = "source-over"
    
            results.forEach((result) => {
                // Draw flare on left eyes
                context.drawImage(
                    resized_flare,
                    result.left_eyes[0] - width / 2, result.left_eyes[1] - height / 2
                );
                context.globalCompositeOperation = 'lighter';
    
                // Draw flare on right eyes
                context.drawImage(
                    resized_flare,
                    result.right_eyes[0] - width / 2, result.right_eyes[1] - height / 2
                );
            })
        }

        // fs.writeFileSync('out_test.png', new_img.toBuffer());

        const final_image = new Image()
        final_image.src = new_img.toDataURL('image/png');
        return final_image;
    } catch(e) {
        console.error(e);
    }
}

exports.flareEyesTest = flareEyesTest;
exports.flareEyes = flareEyes;