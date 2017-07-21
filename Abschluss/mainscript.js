/*Abschlussaufgabe
Name: Jade
Matrikelnummer: 254887
Datum: 21.07.2017
Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe.
Er wurde nicht kopiert und nicht diktiert.*/
var L4_Canvas;
(function (L4_Canvas) {
    window.addEventListener("load", init);
    let ctx;
    let canvas;
    let flappy;
    let balken = [];
    let imgData;
    let score;
    let gameovercard;
    let gameover;
    gameover = 0;
    let upvalue;
    let downvalue;
    downvalue = 0;
    upvalue = 0;
    let points;
    points = 0;
    class FlappyBird {
        constructor(_y) {
            this.img = document.getElementsByTagName("img")[0];
            this.height = this.img.height;
            this.width = this.img.width;
            this.y = _y;
            this.x = canvas.width / 2 - this.img.width / 2;
        }
        draw() {
            if (this.y - this.height / 2 < 0) {
                this.y = this.height / 2;
            }
            let img;
            img = document.getElementsByTagName("img")[0];
            ctx.drawImage(img, this.x, this.y - img.height / 2);
        }
        goup() {
            this.y -= upvalue / 2;
            upvalue -= 1;
            this.draw();
        }
        gravity() {
            downvalue += 0.1;
            this.y += downvalue;
            this.draw();
        }
        dead() {
            this.y += 20;
            this.draw();
        }
        newpos(_pos) {
            this.y = _pos;
        }
    }
    L4_Canvas.FlappyBird = FlappyBird;
    class Balken {
        constructor() {
            this.pos = Math.random() * (canvas.height / 10 * 9 - 100 - 100) + 100;
            this.left = canvas.width;
        }
        draw() {
            ctx.fillStyle = "green";
            ctx.fillRect(this.left, 0, 100, this.pos - 100);
            ctx.fillRect(this.left, this.pos + 100, 100, canvas.height - this.pos - 100 - canvas.height / 10);
        }
        move() {
            this.left -= 2;
            this.draw();
        }
    }
    L4_Canvas.Balken = Balken;
    class Score {
        constructor() {
            this.score = 0;
        }
        draw() {
            ctx.font = '68px flappybirds';
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top';
            ctx.fillText("" + this.score + "", canvas.width / 2 - 20, canvas.height / 3);
        }
    }
    L4_Canvas.Score = Score;
    class Gameover {
        constructor(_score) {
            this.score = _score;
        }
        draw() {
            ctx.font = '68px flappybirds';
            ctx.fillStyle = 'orangered';
            ctx.textBaseline = 'top';
            ctx.fillText("GAME OVER", canvas.width / 2 - 190, canvas.height / 3);
            ctx.fillStyle = 'white';
            ctx.fillText("Score: " + this.score, canvas.width / 2 - 190, canvas.height / 3 + 70);
        }
    }
    L4_Canvas.Gameover = Gameover;
    function init(_event) {
        document.getElementsByTagName("canvas")[0].addEventListener("click", gethigh);
        canvas = document.getElementsByTagName("canvas")[0];
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#70C5CE";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#DED895";
        ctx.fillRect(0, canvas.height / 10 * 9, canvas.width, canvas.height / 10);
        ctx.fillStyle = "#D7A84C";
        ctx.fillRect(0, canvas.height / 10 * 9, canvas.width, canvas.height / 200);
        flappy = new FlappyBird(canvas.height / 2);
        score = new Score();
        imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        flappy.draw();
        animate();
        setInterval(function () { balken[balken.length] = new Balken(); }, 3000);
    }
    function gethigh() {
        if (gameover == 0) {
            document.getElementsByTagName("audio")[0].play();
            upvalue = 20;
            downvalue = 1;
        }
        else {
            balken = [];
            score.score = 0;
            flappy.y = canvas.height / 2;
            gameover = 0;
            downvalue = 1;
            animate();
        }
    }
    function animate() {
        ctx.putImageData(imgData, 0, 0);
        for (let i = 0; i < balken.length; i++) {
            let s = balken[i];
            s.move();
        }
        score.draw();
        if (upvalue != 0) {
            flappy.goup();
        }
        else {
            flappy.gravity();
        }
        checkdead();
        checkpoints();
        if (gameover == 0) {
            window.setTimeout(animate, 1);
        }
    }
    function absturz() {
        ctx.putImageData(imgData, 0, 0);
        for (let i = 0; i < balken.length; i++) {
            let s = balken[i];
            s.draw();
        }
        flappy.dead();
        gameovercard.draw();
        if (flappy.y + flappy.height / 2 < canvas.height * 0.89) {
            window.setTimeout(absturz, 1);
        }
    }
    function checkdead() {
        if (flappy.y + flappy.height / 2 >= canvas.height * 0.89) {
            document.getElementsByTagName("audio")[1].play();
            gameover = 1;
            ctx.putImageData(imgData, 0, 0);
            for (let i = 0; i < balken.length; i++) {
                let s = balken[i];
                s.draw();
            }
            flappy.draw();
            gameovercard = new Gameover(points);
            gameovercard.draw();
        }
        for (let i = 0; i < balken.length; i++) {
            let s = balken[i];
            if (s.left < canvas.width / 2 + flappy.width / 2 && s.left + 100 > canvas.width / 2 - flappy.width / 2) {
                if (s.pos - 100 >= flappy.y - flappy.height / 2 || s.pos + 100 <= flappy.y + flappy.height / 2) {
                    document.getElementsByTagName("audio")[1].play();
                    document.getElementsByTagName("audio")[2].play();
                    gameover = 1;
                    gameovercard = new Gameover(points);
                    gameovercard.draw();
                    absturz();
                }
            }
        }
    }
    function checkpoints() {
        let aktuellepoints;
        aktuellepoints = 0;
        for (let i = 0; i < balken.length; i++) {
            let s = balken[i];
            if (s.left + 100 < canvas.width / 2 - flappy.width / 2) {
                aktuellepoints++;
            }
        }
        if (aktuellepoints > points) {
            points = aktuellepoints;
            document.getElementsByTagName("audio")[3].play();
        }
        score.score = aktuellepoints;
    }
})(L4_Canvas || (L4_Canvas = {}));
//# sourceMappingURL=mainscript.js.map