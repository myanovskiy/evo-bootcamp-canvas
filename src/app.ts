// HOMETASK: add "bilal_goregen.mp4" video to the background

const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d")!;

const video = document.createElement("video");

video.autoplay = true;
video.src = new URL("videos/catvibing.mp4", import.meta.url).toString();
video.muted = true;
video.loop = true;
video.play();

video.addEventListener("play", () => {
    requestAnimationFrame(drawFrame);
});

function drawFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const referenceColor = [43, 215, 28];
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i];
        const g = data.data[i + 1];
        const b = data.data[i + 2];

        const distance = (r - referenceColor[0]) ** 2 + (g - referenceColor[1]) ** 2 + (b - referenceColor[2])**2;
        if (distance < 140**2) {
            data.data[i + 3] = 0;
        }
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
    requestAnimationFrame(drawFrame);
}

const secondCanvas = document.createElement("canvas");
secondCanvas.width = 800;
secondCanvas.height = 500;
const secondCtx = secondCanvas.getContext("2d")!;

const secondVideo = document.createElement("video");

secondVideo.autoplay = true;
secondVideo.src = new URL("videos/bilal_goregen.mp4", import.meta.url).toString();
secondVideo.muted = true;
secondVideo.play();

const stream = secondCanvas.captureStream();
const recorder = new MediaRecorder(stream);

secondVideo.addEventListener("play", () => {
    requestAnimationFrame(drawSecondFrame);
    recorder.start();
});

secondVideo.addEventListener("ended", () => {
    recorder.stop();
    video.pause();
});

function drawSecondFrame() {
    secondCtx.drawImage(secondVideo, 0, 0, canvas.width, canvas.height);
    secondCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);

    requestAnimationFrame(drawSecondFrame);
}

const chunks: Blob[] = [];
recorder.addEventListener("dataavailable", (event) => {
    chunks.push(event.data);
});
recorder.addEventListener("stop", () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(chunks, { type: "video/webm" }));
    link.download = "video.webm";
    link.textContent = "Download Video";
    document.body.appendChild(link);
});

document.body.appendChild(secondCanvas);
