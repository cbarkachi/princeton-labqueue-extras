// ==UserScript==
// @name         LQSound
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Audio/browser notification when student joins queue on labqueue.io
// @author       Chris Barkachi
// @match        https://www.labqueue.io/queue/
// @grant        none
// ==/UserScript==

let notificationAudio = new Audio();
let prevNumClaims = document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
initialize();
window.setTimeout(enableSound, 1000);
let DEFAULT_SOUND = "http://soundbible.com/grab.php?id=2218&type=mp3";

function initialize() {
    // HTML element that will contain the relevant functional elements of the script
    let cardBox = document.querySelector(".last-row");

    // Add sound button
    let btnEnable = document.createElement("button");
    btnEnable.style.width = "auto";
    btnEnable.style.display = "none";
    btnEnable.style.margin = "0px auto 20px";
    btnEnable.textContent = "Enable sound notifications";
    btnEnable.onclick = function () {
        notificationAudio.muted = false;
        btnEnable.style.display = "none";
        btnDisable.style.display = "block";
    };
    cardBox.appendChild(btnEnable);

    // Remove sound button
    let btnDisable = btnEnable.cloneNode(true);
    btnDisable.style.display = "block";
    btnDisable.textContent = "Disable sound notifications";
    btnDisable.onclick = function () {
        notificationAudio.muted = true;
        btnDisable.style.display = "none";
        btnEnable.style.display = "block";
    };
    cardBox.appendChild(btnDisable);

    // Request permission for browser notifications on page load
    let permissionBtn = btnEnable.cloneNode(true);
    permissionBtn.innerHTML = "Enable browser notifications";
    permissionBtn.onclick = function () {
        if (!Notification) {
            alert('Desktop notifications not available in your browser.');
            return;
        }
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        permissionBtn.style.display = "none";
    };
    if (Notification.permission === "granted") {
        permissionBtn.style.display = "none";
    }
    if (!Notification) {
        cardBox.appendChild(permissionBtn);
    }

    // Change sound functions
    let div = changeSoundInitializer(btnEnable);
    cardBox.appendChild(div);
}

function changeSoundInitializer(btnEnable) {
    let dashboardDiv = document.createElement("div");
    dashboardDiv.style.cssText = "display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center";

    let changeSound = function () {
        let url = soundInp.value.replace(/&amp;/g, "&");
        if (btnEnable.style.display === "block") {
            failureEnableMessage.style.display = "block";
            setTimeout(function () { failureEnableMessage.style.display = "none"; }, 2000);
        }
        else {
            // Weak audio file validation. Have tried different combinations of try/excepts that don't work. If someone else knows JS feel free to improve this!
            let startPos = url.length - 3;
            let mp3 = url.indexOf("mp3", startPos) !== -1,
                ogg = url.indexOf("ogg", startPos) !== -1,
                wav = url.indexOf("wav", startPos) !== -1;
            if (mp3 || ogg || wav) {
                notificationAudio.src = url;
                notificationAudio.load();
                successMessage.style.display = "block";
                setTimeout(function () { successMessage.style.display = "none"; }, 2000);
                soundInp.value = "";
            }
            else {
                failureLinkMessage.style.display = "block";
                setTimeout(function () { failureLinkMessage.style.display = "none"; }, 5000);
            }
        }
    };

    // Message that explains how to change sound
    let label = document.createElement("label");
    label.for = "sound-inp";
    label.innerHTML = "To change the sound that's played, link a sound file URL (for example from <a href='http://soundbible.com/free-sound-effects-1.html' target='_blank'>here</a>)";
    dashboardDiv.appendChild(label);

    // Text input to allow user to enter URL for new sound
    let soundInp = document.createElement("input");
    soundInp.type = "text";
    soundInp.id = "sound-inp";
    soundInp.style.minWidth = "300px";
    soundInp.style.maxWidth = "75vw";
    soundInp.style.backgroundColor = "white";
    soundInp.style.border = "solid 1px black";
    soundInp.style.padding = "1px 4px";
    soundInp.addEventListener("keypress", function (event) {
        if (event.which === 13) {
            event.preventDefault();
            changeSound();
        }
    });
    dashboardDiv.appendChild(soundInp);

    // Change sound button
    let changeSoundBtn = document.createElement("button");
    changeSoundBtn.innerHTML = "Change sound";
    changeSoundBtn.style.width = "auto";
    changeSoundBtn.style.margin = "10px 0 10px";
    changeSoundBtn.onclick = changeSound;
    dashboardDiv.appendChild(changeSoundBtn);

    // Sound successfully changed message
    let successMessage = document.createElement("h6");
    successMessage.style.color = "green";
    successMessage.textContent = "Sound successfully changed";
    successMessage.style.display = "none";
    dashboardDiv.appendChild(successMessage);

    // Sound changed to default message
    let defaultMessage = document.createElement("h6");
    defaultMessage.style.color = "green";
    defaultMessage.textContent = "Sound changed to default";
    defaultMessage.style.display = "none";
    dashboardDiv.appendChild(defaultMessage);

    // Failure 1 message: enable notifications
    let failureEnableMessage = successMessage.cloneNode(true);
    failureEnableMessage.textContent = "Please enable sound notifications first";
    failureEnableMessage.style.color = "red";
    dashboardDiv.appendChild(failureEnableMessage);

    // Failure 2 message: invalid URL
    let failureLinkMessage = failureEnableMessage.cloneNode(true);
    failureLinkMessage.textContent = "Invalid URL (audio file must be mp3, wav, or ogg)";
    dashboardDiv.appendChild(failureLinkMessage);

    // Default sound button
    let defaultBtn = changeSoundBtn.cloneNode(true);
    defaultBtn.innerHTML = "Default sound";
    defaultBtn.onclick = function () {
        notificationAudio.src = DEFAULT_SOUND;
        defaultMessage.style.display = "block";
        setTimeout(function () { defaultMessage.style.display = "none"; }, 2000);
    };
    dashboardDiv.appendChild(defaultBtn);


    return dashboardDiv;
}

function enableSound() {
    notificationAudio.src = DEFAULT_SOUND;
    var observer = new MutationObserver(function (mutations) {
        for (let mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes[0].nodeName == "TBODY") {
                let curNumClaims = document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
                if (curNumClaims > prevNumClaims) {
                    activateNotifications();
                }
                prevNumClaims = curNumClaims;
            }
        }
    });
    observer.observe(document.querySelector("table"), { attributes: false, childList: true, characterData: false, subtree: false });
}

function activateNotifications() {
    notificationAudio.play();
    notifyMe();
}
function notifyMe() {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    else {
        var notification = new Notification('New student on the queue', {
            icon: 'https://www.washingtonpost.com/resizer/uwlkeOwC_3JqSUXeH8ZP81cHx3I=/arc-anglerfish-washpost-prod-washpost/public/HB4AT3D3IMI6TMPTWIZ74WAR54.jpg',
            body: 'Click to open the queue',
        });

        notification.onclick = function () {
            window.focus();
            this.close();
        };
    }
}
