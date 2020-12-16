/* eslint-disable require-jsdoc */
var notificationAudio = new Audio();
var DEFAULT_SOUND = "https://soundbible.com/grab.php?id=2218&type=mp3";
alert("bitesdf");
var prevNumClaims;
window.onload = function () {
    setTimeout(init, 2000);
};
function init() {
    enableHyperlinks();
    enableSound();
}
function enableHyperlinks() {
    if (localStorage.getItem("hyperlinks") === null) {
        alert("rip");
        return;
    }
    alert("yo");
    var tBody = document.getElementsByTagName("tbody").item(0);
    var rows = tBody.childNodes;
    rows.forEach(function (row) {
        try {
            var cols = row.childNodes;
            var netIdCol = cols[2];
            var netId = netIdCol.innerHTML;
            netIdCol.innerHTML = "<a href=\u2018mailto:" + netId + "@princeton.edu\u2019>" + netId + "</a>";
        }
        catch (_a) { }
    });
}
function enableSound() {
    document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
    notificationAudio.src =
        localStorage.getItem("default") === null
            ? DEFAULT_SOUND
            : localStorage.getItem("src");
    var observer = new MutationObserver(function (mutations) {
        for (var _i = 0, mutations_1 = mutations; _i < mutations_1.length; _i++) {
            var mutation = mutations_1[_i];
            if (mutation.type === "childList" &&
                mutation.addedNodes[0].nodeName == "TBODY") {
                var curNumClaims = document.querySelector("tbody").outerHTML.split("CLAIM").length - 1;
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
        subtree: false
    });
}
// helpers
function activateNotifications() {
    if (localStorage.getItem("soundEnabled") === null) {
        notificationAudio.play();
    }
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    else {
        var notification = new Notification("New student on the queue", {
            icon: "hotel-bell.png",
            body: "Click to open the queue"
        });
        notification.onclick = function () {
            window.focus();
            this.close();
        };
    }
}