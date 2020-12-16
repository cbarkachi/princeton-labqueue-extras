/* eslint-disable require-jsdoc */
/* eslint-disable max-len */

function brieflyShowMessage(msg) {
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}
function addListeners() {
  // Messages
  const msgEnableNotifications = document.getElementById(
    "msg-enable-notifications"
  );
  const msgInvalidURL = document.getElementById("msg-invalid-url");

  // Toggles
  const toggleSoundNotifications = document.getElementById(
    "sound-notifications"
  ) as HTMLInputElement;
  toggleSoundNotifications.checked = localStorage.getItem("muted") === null;
  toggleSoundNotifications.onchange = () => {
    if (toggleSoundNotifications.checked) {
      localStorage.removeItem("muted");
    } else {
      localStorage.setItem("muted", "false");
    }
  };

  const toggleDefaultSound = document.getElementById(
    "default-sound"
  ) as HTMLInputElement;
  toggleDefaultSound.checked = localStorage.getItem("src") === null;
  toggleDefaultSound.onchange = () => {
    if (toggleDefaultSound.checked) {
      localStorage.removeItem("default");
    } else {
      localStorage.setItem("default", "false");
    }
  };

  // Alternate sound form
  const formAlternateSound = document.getElementById("alternate-sound-form");
  const fieldAlternateSound = document.getElementById(
    "alternate-sound-url"
  ) as HTMLInputElement;
  formAlternateSound.onsubmit = (event) => {
    event.preventDefault();
    const url = fieldAlternateSound.value.replace(/&amp;/g, "&");
    if (!toggleSoundNotifications.checked) {
      brieflyShowMessage(msgEnableNotifications);
    } else {
      // Weak audio file validation
      const startPos = url.length - 3;
      const mp3 = url.indexOf("mp3", startPos) !== -1;
      const ogg = url.indexOf("ogg", startPos) !== -1;
      const wav = url.indexOf("wav", startPos) !== -1;
      if (mp3 || ogg || wav) {
        localStorage.setItem("src", url);
        fieldAlternateSound.value = "";
      } else {
        brieflyShowMessage(msgInvalidURL);
      }
    }
  };
}

addListeners();
