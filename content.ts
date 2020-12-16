/* eslint-disable require-jsdoc */
const notificationAudio = new Audio();
const DEFAULT_SOUND = "https://soundbible.com/grab.php?id=2218&type=mp3";

let prevNumClaims: number;
window.onload = () => {
  setTimeout(init, 2000);
};

function init() {
  document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
  const curSound = localStorage.getItem("src");
  notificationAudio.src = curSound === null ? DEFAULT_SOUND : curSound;
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
  if (localStorage.getItem("muted") === null) {
    notificationAudio.play();
  }
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
