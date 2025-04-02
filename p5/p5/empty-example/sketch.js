let trump;
let objetos = [];
let bolas = [];
let pontos = 0;
let bandeirasBrasilColetadas = 0;
let inimigoApareceu = false;
let gameOver = false;
let imgTrump, imgDinheiro, imgBandeiraMexico, imgBandeiraBrasil, imgBandeiraCuba, imgLula, imgPicanha;

function preload() {
  imgTrump = loadImage('images/trump.png');
  imgDinheiro = loadImage('images/dinheiro.png');
  imgBandeiraMexico = loadImage('images/bandeiraMexico.png');
  imgBandeiraBrasil = loadImage('images/bandeiraBrasil.png');
  imgBandeiraCuba = loadImage('images/bandeiraCuba.png');
  imgLula = loadImage('images/lula.png');  // Carregando a imagem do Lula
  imgPicanha = loadImage('images/picanha.png');  // Carregando a imagem da picanha
}

function setup() {
  createCanvas(800, 600);
  trump = new Trump(width / 1.5 , height - 80);
}

function draw() {
  if (gameOver) {
    background(0);
    textSize(50);
    fill(255, 0, 0); text("VOCE FEZ O L !", width / 3.2, height / 2);
    return;
  }

  background(200);
  displayScore();
  trump.show();
  trump.move();
  
  if (!inimigoApareceu) {
    handleObjects();
  } else {
    inimigo.show();
    inimigo.shoot();
  }

  handleBolas();
}

function displayScore() {
  textSize(24);
  fill(0);
  text('Pontos: ' + pontos, 350, 30);
}

function handleObjects() {
  if (bandeirasBrasilColetadas < 13 && frameCount % 30 === 0) {
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

  // Se atingiu 2 bandeiras do Brasil, aparece o inimigo
  if (bandeirasBrasilColetadas >= 5 && !inimigoApareceu) {
    inimigoApareceu = true;
    inimigo = new Inimigo();
  }
}

function handleBolas() {
  for (let i = bolas.length - 1; i >= 0; i--) {
    bolas[i].fall();
    bolas[i].show();

    if (bolas[i].hits(trump)) {
      gameOver = true;
    }

    if (bolas[i].y > height) {
      bolas.splice(i, 1);
    }
  }
}

function updateScore(tipo) {
  if (tipo === "dinheiro") {
    pontos += 10;
  } else if (tipo === "bandeira_brasil") {
    bandeirasBrasilColetadas += 1;
    pontos -= 5;
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

class Inimigo {
  constructor() {
    this.x = width/2.33;
    this.y = 25;
    this.size = 120;
  }

  show() {
    if (imgLula) {
      image(imgLula, this.x, this.y, this.size, this.size);  // Exibindo a imagem do Lula
    } else {
      fill(255, 0, 0);
      ellipse(this.x, this.y, this.size);
    }
  }

  shoot() {
    if (frameCount % 60 === 0) {
      bolas.push(new Bola(this.x, this.y));
    }
  }
}

class Bola {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 75;  // Tamanho da picanha ajustado
    this.speed = 6;
  }

  fall() {
    this.y += this.speed;
  }

  show() {
    if (imgPicanha) {
      image(imgPicanha, this.x, this.y, this.size, this.size);  // Exibindo a imagem de picanha como projétil
    } else {
      fill(255, 0, 0);
      ellipse(this.x, this.y, this.size);
    }
  }

  hits(trump) {
    let d = dist(this.x, this.y, trump.x + trump.size / 2, trump.y + trump.size / 2);
    return d < (this.size / 2 + trump.size / 2);
  }
}

function resetGame() {
  pontos = 0;
  bandeirasBrasilColetadas = 0;
  objetos = [];
  bolas = [];
  inimigoApareceu = false;
  gameOver = false;
}
