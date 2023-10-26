import * as PIXI from 'pixi.js';
import { checkSymbolsOnPayline } from './win';
const app: any = new PIXI.Application({ background: '#1099bb', resizeTo: window });
const symbolsToMatch = [1, 2, 3, 4, 5, 6];
document.body.appendChild(app.view);
const betToken = [1, 2, 3, 5, 10, 20, 30, 50, 60, 80, 100];
let betIndex = 0;
let paySymbolArr = [];
const panelSymbol = [];
// const paylines = [
//     [1, 4, 7, 10, 13], //payline 1
//     [0, 3, 6, 9, 12],  //payline 2
//     [2, 5, 8, 11, 14], //payline 3
//     [0, 4, 8, 10, 12], //payline 4
//     [2, 4, 6, 10, 14], //payline 5
//     [1, 3, 6, 9, 13], //payline 6
//     [1, 5, 8, 11, 13], //payline 7
//     [0, 3, 7, 11, 14], //payline 8
//     [2, 5, 7, 9, 12], //payline 9
//     [1, 5, 7, 9, 13], //payline 10
//     [1, 3, 7, 11, 13], //payline 11
//     [0, 4, 7, 10, 12], //payline 12
//     [2, 4, 7, 10, 14], //payline 13
//     [0, 4, 6, 10, 12], //payline 14
//     [2, 4, 8, 10, 14], //payline 15
//     [1, 4, 6, 10, 13], //payline 16
//     [1, 4, 8, 10, 13], //payline 17
//     [0, 3, 8, 9, 12], //payline 18
//     [2, 5, 6, 11, 14], //payline 19
//     [0, 5, 8, 11, 12], //payline 20
//     [2, 3, 6, 9, 14], //payline 21
//     [1, 5, 6, 11, 13], //payline 22
//     [1, 3, 8, 9, 13], //payline 23
//     [0, 5, 6, 11, 12], //payline 24
//     [2, 3, 8, 9, 14], //payline 25
// ];
let paySymbol;
for (let sym = 1; sym < 7; sym++) {
    panelSymbol.push(PIXI.Texture.from(`images/M${sym}.png`));
    const symbol1 = new PIXI.Sprite(PIXI.Texture.from(`images/M${sym}.png`));
    paySymbolArr.push(symbol1);
}
const slotSymbols = [
    { id: 1, texture: PIXI.Texture.from('images/M1.png') },
    { id: 2, texture: PIXI.Texture.from('images/M2.png') },
    { id: 3, texture: PIXI.Texture.from('images/M3.png') },
    { id: 4, texture: PIXI.Texture.from('images/M4.png') },
    { id: 5, texture: PIXI.Texture.from('images/M5.png') },
    { id: 6, texture: PIXI.Texture.from('images/M6.png') },
];
const betContainer = new PIXI.Container();
const spinContainer = new PIXI.Container();
const prereel = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,]
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * slotSymbols.length);
    return panelSymbol[randomIndex];
}

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

function onAssetsLoaded() {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: ['#ffffff', '#00ff99'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });
    //Variable::
    let winamt = 0;
    let betNo = betToken[betIndex];
    let totalBal = 10000;
    let winAmtText = new PIXI.Text("$" + winamt, style);
    let balText = new PIXI.Text("$" + totalBal, style);
    // Build the reels
    const reels = [];
    const reelContainer = new PIXI.Container();

    for (let i = 0; i < 5; i++) {
        const rc = new PIXI.Container();

        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

        const reel = {
            container: rc,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };

        reel.blur.blurX = 0;
        reel.blur.blurY = 0;
        rc.filters = [reel.blur];

        // Build the symbols
        for (let j = 0; j < 4; j++) {
            const randomSymbol = getRandomSymbol();
            const symbol = new PIXI.Sprite(randomSymbol);
            const symbolID = panelSymbol.indexOf(randomSymbol);
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            reel.symbols.push({ symbol, id: symbolID });
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) / 2;
    const top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(0, 0, app.screen.width, margin);
    const bottom: any = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin);
    winAmtText.x = Math.round((top.width + 800) / 2);
    winAmtText.y = Math.round((margin - winAmtText.height + 50) / 2);
    top.addChild(winAmtText);
    balText.x = Math.round((top.width + 800) / 2);
    balText.y = Math.round((margin - balText.height - 36) / 2);
    top.addChild(balText);

    //add TotalBalance
    const TotalBalLabel = new PIXI.Text('Balance:', style);
    const winLabelText = new PIXI.Text('TotalWin:', style);
    const playText = new PIXI.Text('Spin!', style);
    const btntes = PIXI.Texture.from('images/sbutton.png');
    const mintex = PIXI.Texture.from('images/min.jpg');
    const headerText = new PIXI.Text('SLOT GAME!', style);
    const plustex = PIXI.Texture.from('images/plus.jpg');
    const btn: any = new PIXI.Sprite(btntes);
    const minus: any = new PIXI.Sprite(mintex);
    const plus: any = new PIXI.Sprite(plustex);
    const bet = new PIXI.Text("$" + betNo, style);

    minus.x = (betContainer.width / 2);
    minus.y = (betContainer.height / 2);

    plus.x = (betContainer.width / 2) + 150;
    plus.y = (betContainer.height / 2);
    plus.scale.set(0.2);
    minus.scale.set(0.2);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    TotalBalLabel.x = Math.round((top.width + 400) / 2);
    TotalBalLabel.y = Math.round((margin - TotalBalLabel.height - 30) / 2);
    winLabelText.x = Math.round((top.width + 400) / 2);
    winLabelText.y = Math.round((margin - winLabelText.height + 60) / 2);
    playText.x = Math.round((spinContainer.width) / 2);
    playText.y = spinContainer.height / 2;
    betContainer.x = Math.round((bottom.width - playText.width) / 2 - 280);
    betContainer.y = app.screen.height - margin - 15 + Math.round((margin - playText.height) / 2);
    spinContainer.x = Math.round((bottom.width - playText.width) / 2);
    spinContainer.y = app.screen.height - margin - 15 + Math.round((margin - playText.height) / 2);
    bet.x = betContainer.width / 2 + 50;
    bet.y = betContainer.height / 2;
    btn.x = spinContainer.width / 2 - 50;
    btn.y = spinContainer.height / 2 + 5;

    betContainer.addChild(bet, minus, plus);
    spinContainer.addChild(btn, playText);
    top.addChild(TotalBalLabel);
    top.addChild(winLabelText);
    bottom.addChild(betContainer);
    bottom.addChild(spinContainer);
    top.addChild(headerText);
    app.stage.addChild(bottom);
    app.stage.addChild(top);



    minus.interactive = true;
    minus.cursor = 'pointer';
    minus.on('pointerdown', () => {
        subBetIndex();
    });
    plus.interactive = true;
    plus.cursor = 'pointer';
    plus.on('pointerdown', () => {
        addBetIndex();
    });
    // Set the interactivity.
    btn.interactive = true;
    btn.cursor = 'pointer';
    btn.on('pointerdown', () => {
        startPlay();
    });



    function addBetIndex() {
        if (running) return;
        if (betIndex < betToken.length - 1)
            betIndex++;
        updateBet();
    }

    let running = false;

    function subBetIndex() {
        if (running) return;
        if (betIndex > 0)
            betIndex--;
        updateBet();
    }
    function updateBet() {
        betNo = betToken[betIndex];
        bet.text = "$" + betNo;
    }


    // Function to start playing.
    function startPlay() {

        if (running) return;
        running = true;

        headerText.text = 'SLOT GAME!';
        winamt = 0
        totalBal = Math.floor(totalBal - betNo);
        winAmtText.text = "$" + winamt;
        balText.text = "$" + totalBal;

        for (let index = 0; index < paySymbolArr.length; index++) {
            paySymbolArr[index].alpha = 0;
        }

        if (headerText.x !== Math.round((top.width - headerText.width) / 2)) {
            headerText.x = Math.round((top.width - headerText.width) / 2);
            headerText.y = Math.round((margin - headerText.height) / 2);
        }


        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];

            const extra = Math.floor(Math.random() * 2);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0), null, i === reels.length - 1 ? reelsComplete : null);
        }
    }
    // Reels done handler.
    async function reelsComplete() {

        const visibleSymbols = [];
        const visibleSym = [];

        for (let i = 0; i < reels.length; i++) {
            const reel = reels[i];
            const visibleReelSymbols = [];
            const visible = [];

            for (let j = 0; j < reel.symbols.length; j++) {
                const symbol = reel.symbols[j].symbol;
                const symbolY = symbol.y + reel.container.y;
                let pos = Math.floor(symbolY);

                if (pos >= -10 && pos < 340) {
                    if (pos === 0 || pos === -1) {
                        visible[0] = reel.symbols[j].symbol;
                        visibleReelSymbols[0] = (reel.symbols[j].id);
                    } else if (pos === 150 || pos === 149) {
                        visible[1] = reel.symbols[j].symbol;
                        visibleReelSymbols[1] = (reel.symbols[j].id);
                    } else if (pos === 300 || pos === 299) {
                        visible[2] = reel.symbols[j].symbol;
                        visibleReelSymbols[2] = (reel.symbols[j].id);
                    }
                }
            }

            visibleSymbols.push(visibleReelSymbols);
            visibleSym.push(visible);
        }
        const numberToAdd = 1;
        let resultArray = visibleSymbols.map(subarray =>
            subarray.map(element => element + numberToAdd)
        );
        console.log(resultArray);
        const oneDArray = [];

        for (let i = 0; i < resultArray.length; i++) {
            for (let j = 0; j < resultArray[i].length; j++) {
                oneDArray.push(resultArray[i][j]);
            }
        }
        const add = checkSymbolsOnPayline(oneDArray, symbolsToMatch);
        console.log(add);
        let sum = 0;
        for (let i = 0; i < add.length; i++) {
            sum += add[i].win;
        }
        const winnings = sum;
        winamt = Math.floor(winnings * betNo);
        totalBal = Math.floor(totalBal + winamt);
        winAmtText.text = "$" + winamt;
        balText.text = "$" + totalBal;

        if (add.length > 0) {
            headerText.x = Math.round((top.width - headerText.width) / 2) - 100;
            headerText.y = Math.round((margin - headerText.height) / 2);
            for (let index = 0; index < add.length; index++) {
                setTimeout(() => {
                    headerText.text = '';
                    setTimeout(() => {
                        paySymbol = paySymbolArr[add[index].symol - 1];
                        paySymbol.scale.set(0.3, 0.3);
                        paySymbol.alpha = 1;
                        paySymbol.x = Math.round((top.width - paySymbol.width) / 2) - 250;
                        paySymbol.y = Math.round((margin - paySymbol.height) / 2 - 5);
                        top.addChild(paySymbol);
                        headerText.text = `X ${add[index].kind} wins:$${add[index].win}   payline:${add[index].payline}`;
                        if (index === add.length - 1) {
                            running = false;
                        }
                    }, 50 * index);
                }, 1800 * (index));
            }
        } else {
            running = false;
        }
    }


    // Listen for animate update.
    app.ticker.add((delta) => {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.

            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on the reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.symbol.y;

                s.symbol.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.symbol.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in a proper product be determined from some logical reel.
                    const randomSymbol = getRandomSymbol();
                    s.symbol.texture = randomSymbol;
                    s.id = panelSymbol.indexOf(randomSymbol)
                    s.symbol.scale.x = s.symbol.scale.y = Math.min(SYMBOL_SIZE / s.symbol.texture.width, SYMBOL_SIZE / s.symbol.texture.height);
                    s.symbol.x = Math.round((SYMBOL_SIZE - s.symbol.width) / 2);
                }
            }
        }
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);

    return tween;
}

// Listen for animate update.
app.ticker.add((delta) => {
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp function.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
function backout(amount) {
    return (t) => (--t * t * ((amount + 1) * t + amount) + 1);
}

// Start the game by loading assets and setting up the Pixi.js application.
PIXI.Assets.load([
    'images/M1.png',
    'images/M2.png',
    'images/M3.png',
    'images/M4.png',
    'images/M5.png',
    'images/M6.png',
]).then(onAssetsLoaded);