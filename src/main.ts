import * as VIAM from "@viamrobotics/sdk";
import Cookies from "js-cookie";

let apiKeyId = "";
let apiKeySecret = "";
let host = "";
let machineId = "";

async function main() {
  const opts: VIAM.ViamClientOptions = {
    serviceHost: "https://app.viam.com",
    credentials: {
      type: "api-key",
      payload: apiKeySecret,
      authEntity: apiKeyId,
    },
  };

  const client = await VIAM.createViamClient(opts);
  const machine = await client.appClient.getRobot(machineId);

  if (machine) {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div>Hello, ${machine.name}!</div>
      <img id="camera-feed" style="max-width: 100%;" />
    ` 
  }

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
    const img = document.getElementById("camera-feed") as HTMLImageElement;
    const cameraClient = new VIAM.CameraClient(robotClient, "overhead-webcam");

    let prevUrl: string | null = null;
    
    while (true) {
      const images = await cameraClient.getImages();

      if (images.images.length > 0) {
        const image = images.images[0];
        const blob = new Blob([image.image as Uint8Array<ArrayBuffer>], { type: image.mimeType });
        const url = URL.createObjectURL(blob);

        img.src = url;

        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }

        prevUrl = url;

        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  let machineCookieKey = window.location.pathname.split("/")[2];
 
  ({
    apiKey: { id: apiKeyId, key: apiKeySecret },
    machineId: machineId,
    hostname: host,
  } = JSON.parse(Cookies.get(machineCookieKey)!));

  main().catch((error) => {
    console.error("encountered an error:", error);
  });
});
