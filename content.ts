/* eslint-disable require-jsdoc */
const notificationAudio = new Audio();
const DEFAULT_SOUND = "https://soundbible.com/grab.php?id=2218&type=mp3";

let prevNumClaims: number;
window.onload = () => {
  setTimeout(init, 2000);
};

function init() {
  enableHyperlinks();
  enableSound();
}

function enableHyperlinks() {
  chrome.storage.sync.get("hyperlinks", (value) => {
    if (value.hyperlinks === undefined) {
      return;
    }
    const tBody = document.getElementsByTagName("tbody").item(0);
    const rows = tBody.childNodes;
    rows.forEach((row) => {
      try {
        const cols = row.childNodes;
        const netIdCol = cols[2] as HTMLTableColElement;
        const netId = netIdCol.innerHTML;
        netIdCol.innerHTML = `<a href=‘mailto:${netId}@princeton.edu’>${netId}</a>`;
      } catch {}
    });
  });
}
function enableSound() {
  document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
  chrome.storage.sync.get("default", (value) => {
    notificationAudio.src =
      value.default === undefined ? DEFAULT_SOUND : value.default;
  });
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "childList" &&
        mutation.addedNodes[0].nodeName == "TBODY"
      ) {
        const curNumClaims =
          document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
        if (curNumClaims > prevNumClaims) {
          activateNotifications();
        }
        prevNumClaims = curNumClaims;
      }
    }
  });
  observer.observe(document.querySelector("table"), {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false,
  });
}
// helpers
function activateNotifications() {
  chrome.storage.sync.get("soundEnabled", (value) => {
    if (value.soundEnabled === undefined) {
      notificationAudio.play();
    }
  });
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  } else {
    const notification = new Notification("New student on the queue", {
      icon: "hotel-bell.png",
      body: "Click to open the queue",
    });

    notification.onclick = function () {
      window.focus();
      this.close();
    };
  }
}
