 var socket;

function setup() {
    createCanvas(600,400);
    background(51);
<<<<<<< HEAD
    // socket = io.connect("http://localhost:20987");
    socket = io.connect("http://api.cleansuit.co:20987");
=======
    socket = io.connect("http://api.cleansuit.co:20987");

>>>>>>> 84baa7332b4819b5a97913aba0db595a9ec4d7ff
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
