import * as VIAM from "@viamrobotics/sdk";
import Cookies from "js-cookie";

let apiKeyId = "";
let apiKeySecret = "";
let host = "";

async function main() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const video = document.createElement("video");

  video.id = "stream";
  video.autoplay = true;
  video.playsInline = true;
  video.style.maxWidth = "100%";

  app.appendChild(video);    

  const robotClient = await VIAM.createRobotClient({
    host: host,
    credentials: {
      type: "api-key",
      payload: apiKeySecret,
      authEntity: apiKeyId,
    },
    signalingAddress: "https://app.viam.com",
  })

  if (robotClient) {
    const streamClient = new VIAM.StreamClient(robotClient);
    const mediaStream = await streamClient.getStream("overhead-webcam");

    video.srcObject = mediaStream;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let machineCookieKey = window.location.pathname.split("/")[2];
 
  ({
    apiKey: { id: apiKeyId, key: apiKeySecret },
    hostname: host,
  } = JSON.parse(Cookies.get(machineCookieKey)!));

  main().catch((error) => {
    console.error("encountered an error:", error);
  });
});
