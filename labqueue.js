// ==UserScript==
// @name         Princeton LabQueue Extras
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Audio/browser notification when student joins queue on labqueue.io
// @author       Chris Barkachi
// @match        https://www.labqueue.io/queue/
// @grant        none
// ==/UserScript==

const DEFAULT_SOUND = "https://soundbible.com/grab.php?id=2218&type=mp3";
let notificationAudio = new Audio();
let prevNumClaims;
window.onload(initialize);

function initialize() {
    prevNumClaims = document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
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
    enableSound();
}

function changeSoundInitializer(btnEnable) {
    let dashboardDiv = document.createElement("div");
    dashboardDiv.style.cssText = "display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center";

    let changeSound = function () {
        let url = soundInp.value.replace(/&amp;/g, "&");
        if (btnEnable.style.display === "block") {
            failureNotifMsg.style.display = "block";
            setTimeout(function () { failureNotifMsg.style.display = "none"; }, 2000);
        }
        else {
            // Weak audio file validation
            let startPos = url.length - 3;
            let mp3 = url.indexOf("mp3", startPos) !== -1,
                ogg = url.indexOf("ogg", startPos) !== -1,
                wav = url.indexOf("wav", startPos) !== -1;
            if (mp3 || ogg || wav) {
                notificationAudio.src = url;
                notificationAudio.load();
                successMsg.style.display = "block";
                setTimeout(function () { successMsg.style.display = "none"; }, 2000);
                soundInp.value = "";
            }
            else {
                failureURLMsg.style.display = "block";
                setTimeout(function () { failureURLMsg.style.display = "none"; }, 5000);
            }
        }
    };
    const instructionElement = addInstructionElement();
    const soundInp = addSoundInputElement();
    const changeSoundBtn = addChangeSoundButtonElement();
    const successMsg = addSuccessMessageElement();
    const defaultBtn = addDefaultBtnElement(changeSoundBtn);
    const defaultMsg = addDefaultMessageElement();
    const failureNotifMsg = addFailureNotificationsElement(successMsg);
    const failureURLMsg = addFailureInvalidURLElement(failureNotifMsg);

    defaultBtn.onclick = function () {
        notificationAudio.src = DEFAULT_SOUND;
        defaultMsg.style.display = "block";
        setTimeout(function () { defaultMsg.style.display = "none"; }, 2000);
    };
    soundInp.addEventListener("keypress", function (event) {
        if (event.which === 13) {
            event.preventDefault();
            changeSound();
        }
    });
    changeSoundBtn.onclick = changeSound;
    const children = [instructionElement, soundInp, changeSoundBtn, successMsg, defaultBtn, defaultMsg, failureNotifMsg, failureURLMsg];
    buildDivFromChildren(dashboardDiv, children);
    return dashboardDiv;
}

// Message that explains how to change sound
function addInstructionElement() {
    let instructionElement = document.createElement("label");
    instructionElement.for = "sound-inp";
    instructionElement.innerHTML = "To change the sound that's played, link a sound file URL (for example from <a href='http://soundbible.com/free-sound-effects-1.html' target='_blank'>here</a>)";
    return instructionElement;
}
// Text input to allow user to enter URL for new sound
function addSoundInputElement() {
    let soundInp = document.createElement("input");
    soundInp.type = "text";
    soundInp.id = "sound-inp";
    soundInp.style.minWidth = "300px";
    soundInp.style.maxWidth = "75vw";
    soundInp.style.backgroundColor = "white";
    soundInp.style.border = "solid 1px black";
    soundInp.style.padding = "1px 4px";
    return soundInp;
}
// Change sound button
function addChangeSoundButtonElement() {
    let changeSoundBtn = document.createElement("button");
    changeSoundBtn.innerHTML = "Change sound";
    changeSoundBtn.style.width = "auto";
    changeSoundBtn.style.margin = "10px 0 10px";
    return changeSoundBtn;
}
// Sound successfully changed message
function addSuccessMessageElement() {
    let successMsg = document.createElement("h6");
    successMsg.style.color = "green";
    successMsg.textContent = "Sound successfully changed";
    successMsg.style.display = "none";
    return successMsg;
}

function addDefaultBtnElement(changeSoundBtn) {
    // Default sound button
    let defaultBtn = changeSoundBtn.cloneNode(true);
    defaultBtn.innerHTML = "Default sound";
    return defaultBtn;
}

// Sound changed to default message
function addDefaultMessageElement() {
    let defaultMsg = document.createElement("h6");
    defaultMsg.style.color = "green";
    defaultMsg.textContent = "Sound changed to default";
    defaultMsg.style.display = "none";
    return defaultMsg;
}
// Failure 1 message: enable notifications
function addFailureNotificationsElement(successMsg) {
    let failureNotifMsg = successMsg.cloneNode(true);
    failureNotifMsg.textContent = "Please enable sound notifications first";
    failureNotifMsg.style.color = "red";
    return failureNotifMsg;
}

// Failure 2 message: invalid URL
function addFailureInvalidURLElement(failureNotifMsg) {
    let failureURLMsg = failureNotifMsg.cloneNode(true);
    failureURLMsg.textContent = "Invalid URL (audio file must be mp3, wav, or ogg)";
    return failureURLMsg;
}

function buildDivFromChildren(dashboardDiv, children) {
    for (let childElement of children) {
        dashboardDiv.appendChild(childElement);
    }
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
            icon: 'hotel-bell.png',
            body: 'Click to open the queue',
        });

        notification.onclick = function () {
            window.focus();
            this.close();
        };
    }
}
