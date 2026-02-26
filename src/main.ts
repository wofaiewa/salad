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

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>Hello, World!</div>
  `
}

document.addEventListener("DOMContentLoaded", async () => {
  // Extract the machine identifier from the URL
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
