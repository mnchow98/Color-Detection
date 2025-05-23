let video = document.querySelector("#videoElement");
let canvas = document.querySelector("#indicator");
let colorResult = document.querySelector("#color-result");
let ctx = canvas.getContext("2d");


if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(function (stream) {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            drawImg();
            setInterval(getAveragePixelColor, 2000);
        }
    })
    .catch (function (error) {
        console.log("Something went wrong!");
    })
} else {
    console.log("getUserMedia not supported!");
}


function drawImg() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);


    let pX = Math.floor(canvas.width/2);
    let pY = Math.floor(canvas.height/2);


    ctx.beginPath();
    ctx.arc(pX, pY, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = "white";
    ctx.stroke();


    setTimeout(drawImg, 0);
}


function getAveragePixelColor() {
    let pX = Math.floor(canvas.width/2);
    let pY = Math.floor(canvas.height/2);


    const pixelData = ctx.getImageData(pX - 1, pY - 1, 2, 2).data;
    let totalR = 0, totalG = 0, totalB = 0, totalA = 0;


    for (let i = 0; i < pixelData.length; i += 4) {
        totalR += pixelData[i];
        totalG += pixelData[i + 1];
        totalB += pixelData[i + 2];
        totalA += pixelData[i + 3];
    }


    let pixelCount = pixelData.length / 4;
    let avgR = Math.round(totalR / pixelCount);
    let avgG = Math.round(totalG / pixelCount);
    let avgB = Math.round(totalB / pixelCount);
    let avgA = Math.round(totalA / pixelCount);


    let rgba = `rgba(${avgR}, ${avgG}, ${avgB}, ${avgA})`;
    let hexcode = rgbToHex(avgR, avgG, avgB);


    document.getElementById("rgba-result").innerHTML = rgba;
    document.getElementById("hexcode-result").innerHTML = hexcode;
    colorResult.style.transition = 'background-color .25s ease-in';
    colorResult.style.backgroundColor = rgba;


    //document.body.style.transition = 'background-color .25s ease-in';
    //document.body.style.backgroundColor = rgba;


    colorResult.addEventListener('click', () => {
        navigator.clipboard.writeText(`${rgba} ${hexcode}`);
    })
}


function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
