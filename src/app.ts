const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 500;
const ctx = canvas.getContext("2d")!;

const video = document.createElement("video");

video.autoplay = true;
video.src = new URL("videos/catvibing.mp4", import.meta.url).toString();
video.muted = true;
video.play();

const stream = canvas.captureStream();
const recorder = new MediaRecorder(stream);

video.addEventListener("play", () => {
    requestAnimationFrame(drawFrame);
    recorder.start();
});

video.addEventListener("ended", () => {
    recorder.stop();
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

document.body.appendChild(canvas);
