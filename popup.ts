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
  const msgSoundChanged = document.getElementById("msg-sound-change");
  const msgDefaultSoundEnabled = document.getElementById(
    "msg-default-sound-enabled"
  );
  const msgEnableNotifications = document.getElementById(
    "msg-enable-notifications"
  );
  const msgInvalidURL = document.getElementById("msg-invalid-url");

  // Toggles
  const toggleSoundNotifications = document.getElementById(
    "sound-notifications"
  ) as HTMLInputElement;
  toggleSoundNotifications.checked =
    localStorage.getItem("soundEnabled") === null;
  toggleSoundNotifications.onchange = () => {
    if (toggleSoundNotifications.checked) {
      localStorage.removeItem("soundEnabled");
      defaultGroup.style.display = "flex";
      formAlternateSound.style.display = toggleDefaultSound.checked
        ? "none"
        : "flex";
    } else {
      localStorage.setItem("soundEnabled", "false");
      defaultGroup.style.display = "none";
      formAlternateSound.style.display = "none";
    }
  };

  const toggleDefaultSound = document.getElementById(
    "default-sound"
  ) as HTMLInputElement;
  const defaultGroup = document.getElementById("default-group");
  defaultGroup.style.display = toggleSoundNotifications.checked
    ? "flex"
    : "none";
  toggleDefaultSound.checked = localStorage.getItem("default") === null;
  toggleDefaultSound.onchange = () => {
    if (toggleDefaultSound.checked) {
      localStorage.removeItem("default");
      formAlternateSound.style.display = "none";
    } else {
      localStorage.setItem("default", "false");
      formAlternateSound.style.display = "flex";
    }
  };

  // Alternate sound form
  const formAlternateSound = document.getElementById("alternate-sound-form");
  formAlternateSound.style.display =
    toggleSoundNotifications.checked && !toggleDefaultSound.checked
      ? "flex"
      : "none";
  const fieldAlternateSound = document.getElementById(
    "alternate-sound-url"
  ) as HTMLInputElement;
  formAlternateSound.onsubmit = (event) => {
    event.preventDefault();
    const url = fieldAlternateSound.value.replace(/&amp;/g, "&");
    if (!toggleSoundNotifications.checked) {
      brieflyShowMessage(msgEnableNotifications);
    } else if (toggleDefaultSound.checked) {
      brieflyShowMessage(msgDefaultSoundEnabled);
    } else {
      // Weak audio file validation
      const startPos = url.length - 3;
      const mp3 = url.indexOf("mp3", startPos) !== -1;
      const ogg = url.indexOf("ogg", startPos) !== -1;
      const wav = url.indexOf("wav", startPos) !== -1;
      if (mp3 || ogg || wav) {
        localStorage.setItem("src", url);
        fieldAlternateSound.value = "";
        brieflyShowMessage(msgSoundChanged);
      } else {
        brieflyShowMessage(msgInvalidURL);
      }
    }
  };

  // mail:to hyperlinks
  const toggleHyperlinks = document.getElementById(
    "email-hyperlinks"
  ) as HTMLInputElement;
  toggleHyperlinks.checked = localStorage.getItem("hyperlinks") !== null;
  toggleHyperlinks.onchange = () => {
    if (toggleHyperlinks.checked) {
      localStorage.setItem("hyperlinks", "true");
    } else {
      localStorage.removeItem("hyperlinks");
    }
  };
}

addListeners();
