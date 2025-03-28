let trump;
let objetos = [];
let pontos = 0;
let imgTrump, imgDinheiro, imgBandeiraMexico, imgBandeiraBrasil, imgBandeiraCuba;

function preload() {
  imgTrump = loadImage('images/trump.png');
  imgDinheiro = loadImage('images/dinheiro.png');
  imgBandeiraMexico = loadImage('images/bandeiraMexico.png');
  imgBandeiraBrasil = loadImage('images/bandeiraBrasil.png');
  imgBandeiraCuba = loadImage('images/bandeiraCuba.png');
}

function setup() {
  createCanvas(800, 600);
  trump = new Trump(width / 1.5 , height - 80);
}

function draw() {
  background(200);
  displayScore();
  trump.show();
  trump.move();
  handleObjects();
}

function displayScore() {
  textSize(24);
  fill(0);
  text('Pontos: ' + pontos, 350, 30);
}

function handleObjects() {
  if (frameCount % 30 === 0) {
    let tipoObjeto = random(["dinheiro", "bandeira_mexico", "bandeira_brasil", "bandeira_cuba"]);
    objetos.push(new Objeto(tipoObjeto));
  }

  for (let i = objetos.length - 1; i >= 0; i--) {
    objetos[i].fall();
    objetos[i].show();

    if (objetos[i].hits(trump)) {
      updateScore(objetos[i].tipo);
      objetos.splice(i, 1);
      continue;
    }

    if (objetos[i].y > height) {
      objetos.splice(i, 1);
    }
  }
}

function updateScore(tipo) {
  if (tipo === "dinheiro") {
    pontos += 10;
  } else {
    pontos -= 5;
  }
}

class Trump {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
    this.speed = 7;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x = max(0, this.x - this.speed);
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x = min(width - this.size, this.x + this.speed);
    }
  }

  show() {
    if (imgTrump) {
      image(imgTrump, this.x, this.y, this.size, this.size);
    } else {
      fill(255, 0, 0);
      rect(this.x, this.y, this.size, this.size);
    }
  }
}

class Objeto {
  constructor(tipo) {
    this.tipo = tipo;
    this.x = random(0, width - 50);
    this.y = 0;
    this.size = 45;
    this.speed = 5;
  }

  fall() {
    this.y += this.speed;
  }

  show() {
    let img = this.getImage();
    if (img) {
      image(img, this.x, this.y, this.size, this.size);
    } else {
      fill(0, 255, 0);
      rect(this.x, this.y, this.size, this.size);
    }
  }

  getImage() {
    switch (this.tipo) {
      case "dinheiro":
        return imgDinheiro;
      case "bandeira_mexico":
        return imgBandeiraMexico;
      case "bandeira_brasil":
        return imgBandeiraBrasil;
      case "bandeira_cuba":
        return imgBandeiraCuba;
      default:
        return null;
    }
  }

  hits(trump) {
    let d = dist(this.x + this.size / 2, this.y + this.size / 2, trump.x + trump.size / 2, trump.y + trump.size / 2);
    return d < (this.size / 2 + trump.size / 2);
  }
}