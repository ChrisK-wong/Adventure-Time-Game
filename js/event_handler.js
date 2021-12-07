var keysDown = {};
var mouseEvent = true;
var jumpable = true;

addEventListener("keydown", function(e) {
    keysDown[e.code] = true;
}, false);

addEventListener("keyup", function(e) {
    if (e.code == "Space") {
        jumpable = true;
    }
    delete keysDown[e.code];
}, false);

/***
window.addEventListener('focus', function (event) {
    console.log('has focus');
});
***/

addEventListener('blur', function () {
    console.log('lost focus');AudioDestinationNode
    keysDown = {}
});

addEventListener('click', function() {
    mouseEvent = true
});

addEventListener('contextmenu', function() {
    keysDown = {}
});