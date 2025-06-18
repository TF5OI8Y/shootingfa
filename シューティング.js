class Character {
    constructor(x, y, w, h, vx, vy, 自機画像) {        //constructorの意味は、new characterを作ったときにこの中身を実行するというもの
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.vx = vx;
        this.vy = vy;
        this.自機画像 = 自機画像;
    }

    draw() {
        if (this.自機画像) {
            ctx.drawImage(this.自機画像, this.x, this.y, this.w, this.h)
        }
        else {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = "red"
            ctx.fill();
        }
    }

    move() {
        this.x += this.vx * 0.5
        this.y += this.vy * 0.5
        if (this.x < 0 ||
            this.x > ゲーム盤の幅 || // || はorの意味
            this.y < 0 ||
            this.y > ゲーム盤の高さ) {
            this.dead = true;
        }

    }

    hantei(opponent) {
        let l1 = this.x
        let r1 = this.x + this.w
        let t1 = this.y
        let b1 = this.y + this.h;
        let l2 = opponent.x
        let r2 = opponent.x + opponent.w
        let t2 = opponent.y
        let b2 = opponent.y + opponent.h;
        return !(r2 < l1 || r1 < l2) &&
            !(t2 > b1 || t1 > b2)         //|| or の意味　returnは当てはまっていたらtrue,間違っていたらfalseを返す関数
    }


}
let 自機画像 = new Image();
自機画像.src = "image/jiki.jpg";
let 自機 = new Character(200, 500, 40, 80, 0, 0, 自機画像);
let 弾リスト = [];           //弾リストは複数の玉
let ゲーム盤の幅 = 600;
let ゲーム盤の高さ = 600;
let canvasの色 = "red"
let canvas, ctx;
let keylist = {};
let frame = 0;
let 敵リスト = [];
let 弾リスト2 = [];
let 残機 = 3;
let ゲームの状態 = "ゲーム中"
let スコア = 0;
let 最大残機 = 3;


window.onload = function () {
    canvas = document.getElementById("canvas");
    canvas.width = ゲーム盤の幅;
    canvas.height = ゲーム盤の高さ;
    canvas.color = canvasの色;
    ctx = canvas.getContext("2d")

    document.onkeydown = function (evt) {
        keylist[evt.code] = true;
        console.log(keylist)
    }
    document.onkeyup = function (evt) {
        keylist[evt.code] = false;
    }
    animation();
    //初期化();
}

function animation() {
    for (let 弾 of 弾リスト) {
        弾.move()
    }
    for (let 敵 of 敵リスト) {
        敵.move()
    }
    if (keylist["KeyA"] == true) {
        自機.x -= 10
    }
    if (keylist["KeyD"] == true) {
        自機.x += 10
    }
    if (keylist["KeyW"] == true) {
        自機.y -= 10
    }
    if (keylist["KeyS"] == true) {
        自機.y += 10
    }
    if (keylist["KeyX"] == true) {
        初期化()
    }
    if (keylist["Space"] == true) {
        //弾リスト.push(new Character(x = 自機.x + 自機.w / 2 - 2.5, y = 自機.y, w = 5, h = 5, vx = 0, vy = - 10))
        if (!自機.dead) {
            弾リスト.push(new Character(x = 自機.x, y = 自機.y, w = 5, h = 5, vx = 0, vy = - 10))
            弾リスト.push(new Character(自機.x, 自機.y, 5, 5, -10 / Math.sqrt(2), - 10 / Math.sqrt(2)))
            弾リスト.push(new Character(自機.x, 自機.y, 5, 5, 10 / Math.sqrt(2), - 10 / Math.sqrt(2)))
            弾リスト.push(new Character(自機.x, 自機.y, 5, 5, 10, 0))
            弾リスト.push(new Character(自機.x, 自機.y, 5, 5, -10, 0))
        }

    }

    frame++;
    if (frame % 20 == 0) {
        敵リスト.push(new Character(dice(ゲーム盤の幅), 0, 50, 50, 0, 40))//位置、大きさ、速さ
    }
    for (let 弾 of 弾リスト) {
        for (let 敵 of 敵リスト) {
            if (!弾.dead && !敵.dead && 弾.hantei(敵)) {
                弾.dead = true;
                敵.dead = true;
                スコア += 100;
            }
        }
    }

    for (let 敵 of 敵リスト) {
        if (!自機.dead && !敵.dead && 自機.hantei(敵)) {
            自機.dead = true;
            敵.dead = true;
        }
    }

    let 弾リスト2 = [];
    for (let 弾 of 弾リスト) {
        if (!弾.dead) {
            弾リスト2.push(弾);
        }
    }
    弾リスト = 弾リスト2;

    let 敵リスト2 = [];
    for (let 敵 of 敵リスト) {
        if (!敵.dead) {
            敵リスト2.push(敵);
        }
    }
    敵リスト = 敵リスト2;

    if (自機.dead) {
        if (残機 > 0) {
            残機--;
            自機.dead = false;
        }
        else {
            ゲームの状態 = "ゲームオーバー";
        }
    }



    画面描画();
    requestAnimationFrame(animation);
    console.log(弾リスト.length);
    console.log(敵リスト.length);

}
function 画面描画() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (ゲームの状態 != "ゲームオーバー") {

        if (!自機.dead) {
            自機.draw()
        }
        for (let 弾 of 弾リスト) {
            弾.draw()
        }
        for (let 敵 of 敵リスト) {
            敵.draw()
        }
        ctx.drawImage(自機画像, 5, 500, 30, 50)
        ctx.font = "50px 游明朝"
        ctx.fillText("✖" + 残機, 45, 535,)
        ctx.fillText("スコア", 200, 70)
        let mtx = ctx.measureText(スコア);
        ctx.fillText(スコア, 500 - mtx.width, 70)
    }

    if (ゲームの状態 == "ゲームオーバー") {
        ctx.font = "100px 游明朝"
        ctx.fillText("死", 300, 300, 100, 50)
    }

    if (keylist["Key X"] && ゲームの状態 == "ゲームオーバー") {
        初期化();
    }
}
//console.log(自機)
// ctrl + F = 単語の検索

function dice(max) {
    return Math.floor(Math.random() * max); //ランダムな位置から敵が湧くように改良したプログラム
}

function 初期化() {
    if (最大残機 > 0) {
        ゲームの状態 = "ゲーム中";
        スコア = 0;
        敵リスト = [];
        弾リスト = [];
        残機 = 最大残機;
        最大残機 -= 1;
        自機.dead = false;

    }
}