// ==UserScript==
// @name         LQSound
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Audio/browser notification when student joins queue on labqueue.io
// @author       Chris Barkachi
// @match        https://www.labqueue.io/queue/
// @grant        none
// ==/UserScript==

let audio = new Audio();
let prevNumClaims, curNumClaims = 0;
initialize();
window.setTimeout(enableSound, 1000);


function initialize() {
    // Add/remove sound buttons
    let btn, btnDisable;
    btn = document.createElement("button");
    btn.style.width = "auto";
    btn.style.display = "block";
    btn.style.margin = "0px auto 20px";
    btnDisable = btn.cloneNode(true);

    btnDisable.style.display = "none";
    let cardBox = document.querySelector(".last-row");
    btn.textContent = "Enable sound notifications";
    btn.onclick = function() {
        audio.muted = false;
        btn.style.display = "none";
        btnDisable.style.display = "block";
    };

    btnDisable.textContent = "Disable sound notifications";
    btnDisable.onclick = function() {
        audio.muted = true;
        btnDisable.style.display = "none";
        btn.style.display = "block";
    };

    // request permission on page load
    let permissionBtn = btn.cloneNode(true);
    permissionBtn.innerHTML = "Enable browser notifications";
    permissionBtn.onclick = function() {
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

    // Change sound
    let inp = document.createElement("input");
    inp.type = "text";
    inp.id = "sound-inp";
    inp.style.minWidth = "300px";
    inp.style.maxWidth = "75vw";
    inp.style.backgroundColor = "white";
    inp.style.border = "solid 1px black";
    inp.style.padding = "1px 4px";

    let successMessage = document.createElement("h6");
    successMessage.style.color = "green";
    successMessage.textContent = "Sound successfully changed";
    successMessage.style.display = "none";

    let defaultMessage = document.createElement("h6");
    defaultMessage.style.color = "green";
    defaultMessage.textContent = "Sound changed to default";
    defaultMessage.style.display = "none";

    let failureEnableMessage = successMessage.cloneNode(true);
    failureEnableMessage.textContent = "Please enable sound notifications first";
    failureEnableMessage.style.color = "red";

    let failureLinkMessage = failureEnableMessage.cloneNode(true);
    failureLinkMessage.textContent = "Invalid URL (audio file must be mp3, wav, or ogg)";

    let changeSound = function() {
        let url = inp.value.replace(/&amp;/g, "&");
        if (btn.style.display === "block") {
            failureEnableMessage.style.display = "block";
            setTimeout(function() {failureEnableMessage.style.display = "none";}, 2000);
        }
        else {
            // Weak audio file validation. Have tried all different combinations of try/excepts but for some reason nothing will work. If someone else knows JS feel free to improve this!
            let startPos = url.length - 3;
            let mp3 = url.indexOf("mp3", startPos) !== -1,
                ogg = url.indexOf("ogg", startPos) !== -1,
                wav = url.indexOf("wav", startPos) !== -1 ;
            if (mp3 || ogg || wav) {
                audio.src = url;
                audio.load();
                successMessage.style.display = "block";
                setTimeout(function() {successMessage.style.display = "none";}, 2000);
                inp.value = "";
            }
            else {
                failureLinkMessage.style.display = "block";
                setTimeout(function() {failureLinkMessage.style.display = "none";}, 5000);
            }
        }
    };
    inp.addEventListener("keypress", function(event) {
        if (event.which === 13) {
            event.preventDefault();
            changeSound();
        }
    });

    let soundBtn = document.createElement("button");
    soundBtn.innerHTML = "Change sound";
    soundBtn.style.width = "auto";
    soundBtn.style.margin = "10px 0 10px";
    soundBtn.onclick = changeSound;
    let defaultBtn = soundBtn.cloneNode(true);
    defaultBtn.innerHTML = "Default sound";
    defaultBtn.onclick = function() {
        audio.src = 'http://soundbible.com/grab.php?id=2218&type=mp3';
        defaultMessage.style.display = "block";
        setTimeout(function() {defaultMessage.style.display = "none";}, 2000);
    };



    let label = document.createElement("label");
    label.for = "sound-inp";
    label.innerHTML = "To change default alert, link a sound file URL (for example from <a href='http://soundbible.com/free-sound-effects-1.html' target='_blank'>here</a>)";

    let div = document.createElement("div");
    div.style.cssText = "display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center";
    div.appendChild(label);
    div.appendChild(inp);
    div.appendChild(soundBtn);
    div.appendChild(defaultBtn);
    div.appendChild(successMessage);
    div.appendChild(defaultMessage);
    div.appendChild(failureEnableMessage);
    div.appendChild(failureLinkMessage);
    cardBox.appendChild(btn);
    cardBox.appendChild(btnDisable);
    cardBox.appendChild(permissionBtn);
    cardBox.appendChild(div);
}

function enableSound() {
    let prevNumStudents = document.querySelector("tbody").children.length;
    let curNumStudents = prevNumStudents;
    audio.src = 'http://soundbible.com/grab.php?id=2218&type=mp3';
    audio.muted = true;

    var observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes[0].nodeName == "TBODY") {
                prevNumClaims = curNumClaims;
                curNumClaims = document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
                if (curNumClaims > prevNumClaims) {
                    activateNotifications();
                }
            }
        }
    });
    // change this if performance is negatively affected
    observer.observe(document.querySelector("table"), {attributes: false, childList: true, characterData: false, subtree:false});
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
        // Nothing seems to change the link for the notification.. feel free to improve this!
        notification.onclick = function() {
            window.focus();
            this.close();
        };
    }
}

function activateNotifications() {
    audio.play();
    notifyMe();
}