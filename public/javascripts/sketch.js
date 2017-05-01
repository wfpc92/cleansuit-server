 var socket;

function setup() {
    createCanvas(600,400);
    background(51);
    socket = io.connect("http://localhost:20987");

    socket.on("dibujar", function(data) {
        dibujar(data);
    });
}

function dibujar(data) {
    noStroke();
    fill(255,0,100);
    ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
    var data = {
        x: mouseX,
        y: mouseY
    };

    socket.emit("dibujar", data);
    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 36, 36);
}

function draw() {
        
}
