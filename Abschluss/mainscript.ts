/*Abschlussaufgabe
Name: Jade
Matrikelnummer: 254887
Datum: 21.07.2017
Hiermit versichere ich, dass ich diesen Code selbst geschrieben habe.
Er wurde nicht kopiert und nicht diktiert.*/
namespace L4_Canvas {
    window.addEventListener("load", init);
    let ctx: CanvasRenderingContext2D;
    let canvas: HTMLCanvasElement;
    let flappy: FlappyBird;
    let balken: Balken[] = [];
    let imgData: ImageData;
    let score: Score;
    let gameovercard: Gameover;
    let gameover: number;
    gameover = 0;
    let upvalue: number;
    let downvalue: number;
    downvalue = 0;
    upvalue = 0;
    let points: number;
    points = 0;
    
    export class FlappyBird {
        height: number;
        width: number;
        x: number;
        y: number;
        img: HTMLImageElement;
        
        constructor(_y: number) {
            this.img = document.getElementsByTagName("img")[0];
            this.height = this.img.height;
            this.width = this.img.width;
            this.y = _y;
            this.x = canvas.width/2-this.img.width/2;
        }
        
        draw(): void {
            if (this.y-this.height/2 < 0) {
                this.y = this.height/2;
            }
            let img: HTMLImageElement;
            img = document.getElementsByTagName("img")[0];
            ctx.drawImage(img,this.x,this.y-img.height/2);
        }
        
        goup(): void {
            this.y -= upvalue/2;
            upvalue -= 1;
            this.draw();
        }
        
        gravity(): void {
            downvalue += 0.1;
            this.y += downvalue;
            this.draw();
        }
        
        dead(): void {
            this.y += 20;
            this.draw();
        }
        
        newpos(_pos: number) {
            this.y = _pos;
        }
    }
    
    export class Balken {
        pos: number;
        left: number;
        
        constructor() {
            this.pos = Math.random() * (canvas.height/10*9-100 - 100) + 100;
            this.left = canvas.width;
        }
        
        draw(): void {
            ctx.fillStyle = "green";
            ctx.fillRect(this.left, 0, 100, this.pos-100);
            ctx.fillRect(this.left, this.pos+100, 100, canvas.height-this.pos-100-canvas.height/10);
        }
        
        move(): void {
            this.left -= 2;
            this.draw();
        }
        
    }
    
    export class Score {
        score: number;
        
        constructor() {
            this.score = 0;
        }
        
        draw(): void {
            ctx.font         = '68px flappybirds';
            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'top';
            ctx.fillText  (""+this.score+"", canvas.width/2-20, canvas.height/3);
        }
    }
    
    export class Gameover {
        score: number;
        
        constructor(_score: number) {
            this.score = _score;
        }
        
        draw(): void {
            ctx.font         = '68px flappybirds';
            ctx.fillStyle = 'orangered';
            ctx.textBaseline = 'top';
            ctx.fillText  ("GAME OVER", canvas.width/2-190, canvas.height/3);
            ctx.fillStyle = 'white';
            ctx.fillText  ("Score: "+this.score, canvas.width/2-190, canvas.height/3+70);
        }
    }
    
    function init(_event: Event): void {
        document.getElementsByTagName("canvas")[0].addEventListener("click", gethigh);
        canvas = document.getElementsByTagName("canvas")[0];
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "#70C5CE";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#DED895";
        ctx.fillRect(0, canvas.height/10*9, canvas.width, canvas.height/10);
        ctx.fillStyle = "#D7A84C";
        ctx.fillRect(0, canvas.height/10*9, canvas.width, canvas.height/200);
        flappy = new FlappyBird(canvas.height/2);
        score = new Score();
        imgData = ctx.getImageData(0 , 0 , canvas.width , canvas.height );
        flappy.draw();
        animate();
        setInterval(function(){  balken[balken.length] = new Balken(); }, 3000);

    }
    
    function gethigh (): void {
        if(gameover == 0) {
            document.getElementsByTagName("audio")[0].play();
            upvalue = 20;
            downvalue = 1;
        } else {
            balken = [];
            score.score = 0;
            flappy.y = canvas.height/2;
            gameover = 0;
            downvalue = 1;
            animate();
        }
    }
    
    function animate(): void {
        ctx.putImageData(imgData, 0, 0);
        for (let i: number = 0; i < balken.length; i++) {
            let s: Balken = balken[i];
            s.move();
        }
        score.draw();
        if (upvalue != 0) {
            flappy.goup();
        } else {
            flappy.gravity();
        }
        checkdead();
        checkpoints();
        if(gameover == 0) {
            window.setTimeout(animate, 1);
        }
    }
    
    function absturz (): void {
        ctx.putImageData(imgData, 0, 0);
        for (let i: number = 0; i < balken.length; i++) {
            let s: Balken = balken[i];
            s.draw();
        }
        flappy.dead();
        gameovercard.draw();
        if (flappy.y + flappy.height/2 < canvas.height*0.89) {
            window.setTimeout(absturz, 1);
        }
    }
    
    function checkdead (): void {
        if (flappy.y + flappy.height/2 >= canvas.height*0.89) {
            document.getElementsByTagName("audio")[1].play();
            gameover = 1;
            ctx.putImageData(imgData, 0, 0);
            for (let i: number = 0; i < balken.length; i++) {
                let s: Balken = balken[i];
                s.draw();
            }
            flappy.draw();
            gameovercard = new Gameover(points);
            gameovercard.draw();
        }
        for (let i: number = 0; i < balken.length; i++) {
            let s: Balken = balken[i];
            if (s.left < canvas.width/2+flappy.width/2 && s.left+100 > canvas.width/2-flappy.width/2) {
                if(s.pos-100 >= flappy.y-flappy.height/2 || s.pos+100 <= flappy.y+flappy.height/2) {
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
    
    function checkpoints (): void {
        let aktuellepoints: number;
        aktuellepoints = 0;
        for (let i: number = 0; i < balken.length; i++) {
            let s: Balken = balken[i];
            if (s.left+100 < canvas.width/2-flappy.width/2) {
                    aktuellepoints++;
            }
        }
        if (aktuellepoints > points) {
            points = aktuellepoints;
            document.getElementsByTagName("audio")[3].play();
        }
        score.score = aktuellepoints;
    }
  }