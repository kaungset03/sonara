import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";

type CheckForAppUpdatesProps = {
  showNoUpdate?: boolean;
};

export async function checkForAppUpdates({
  showNoUpdate = false,
}: CheckForAppUpdatesProps = {}) {
  const update = await check();

  if (!update) {
    console.log("No update available");
    if (showNoUpdate) {
      // Handle no update available logic here
      await message("You are on the latest version.", {
        title: "No Update Available",
        kind: "info",
        okLabel: "OK",
      });
    }
    return;
  }

  const yes = await ask(`Version ${update.version} is available!`, {
    title: "Update Available",
    kind: "info",
    okLabel: "Update",
    cancelLabel: "Later",
  });

  if (!yes) {
    return;
  }

  await update.downloadAndInstall();
  await relaunch();
}
