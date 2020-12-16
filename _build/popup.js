/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
function brieflyShowMessage(msg) {
    msg.style.display = "block";
    setTimeout(function () {
        msg.style.display = "none";
    }, 2000);
}
function addListeners() {
    // Messages
    var msgEnableNotifications = document.getElementById("msg-enable-notifications");
    var msgInvalidURL = document.getElementById("msg-invalid-url");
    // Toggles
    var toggleSoundNotifications = document.getElementById("sound-notifications");
    toggleSoundNotifications.checked = localStorage.getItem("muted") === null;
    toggleSoundNotifications.onchange = function () {
        if (toggleSoundNotifications.checked) {
            localStorage.removeItem("muted");
        }
        else {
            localStorage.setItem("muted", "false");
        }
    };
    var toggleDefaultSound = document.getElementById("default-sound");
    toggleDefaultSound.checked = localStorage.getItem("src") === null;
    toggleDefaultSound.onchange = function () {
        if (toggleDefaultSound.checked) {
            localStorage.removeItem("src");
        }
        else {
            localStorage.setItem("src", "false");
        }
    };
    // Alternate sound form
    var formAlternateSound = document.getElementById("alternate-sound-form");
    var fieldAlternateSound = document.getElementById("alternate-sound-url");
    formAlternateSound.onsubmit = function (event) {
        event.preventDefault();
        var url = fieldAlternateSound.value.replace(/&amp;/g, "&");
        if (!toggleSoundNotifications.checked) {
            brieflyShowMessage(msgEnableNotifications);
        }
        else {
            // Weak audio file validation
            var startPos = url.length - 3;
            var mp3 = url.indexOf("mp3", startPos) !== -1;
            var ogg = url.indexOf("ogg", startPos) !== -1;
            var wav = url.indexOf("wav", startPos) !== -1;
            if (mp3 || ogg || wav) {
                localStorage.setItem("src", url);
                fieldAlternateSound.value = "";
            }
            else {
                brieflyShowMessage(msgInvalidURL);
            }
        }
    };
}
addListeners();
