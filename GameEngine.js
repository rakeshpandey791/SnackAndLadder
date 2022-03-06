class Logger {
    constructor(){
       this.gLogContainer = document.querySelector("#gLogContainer");
    }

    addLog(type, msg){
        const child = document.createElement('li'); 
        child.innerText = msg;
        switch(type){
            case 'won':
                child.style.color = '#0c6e0c';
                break;
            case 'snack':
                child.style.color = 'orange';
                break;
            case 'ladder':
                child.style.color = '#04afe7';
                break;
            case 'lose':
                child.style.color = '#9d0606';
                break;
        }
        this.gLogContainer.appendChild(child);
    }
}

const lg = new Logger();


class Player {
    constructor(){
        this.players = [
            {id: 1, name: 'Rakesh', curPos: 1},
            {id: 2, name: 'Ankur', curPos: 1},
            {id: 3, name: 'Jay', curPos: 1},
            {id: 4, name: 'Manoj', curPos: 1},
            {id: 5, name: 'Rahul', curPos: 1},
            {id: 6, name: 'Jitendra', curPos: 1},
        ];
        this.winners = [];
        this.loser = {};
    }

    announceWinnerLoser() {
        const winners = document.querySelector("#winners");
        let winnersStr = '';
        this.winners.forEach((el, index)=>{
            winnersStr += `${el.name}${index !== this.winners.length -1 ? ',': ''} `;
        })
        winners.innerText = `Winners in order: ${winnersStr}`;
        winners.style.color = '#0c6e0c';
        const loser = document.querySelector("#loser");
        loser.innerText = `Loser: ${this.loser.name}`;
        loser.style.color = '#9d0606';
    }
}

class Dice {
    constructor(){
        this.diceStart = 1;
        this.diceEnd = 6;
    }

    rollDice(){
        return Math.floor(Math.random() * (this.diceEnd - this.diceStart + 1) + this.diceStart)
    }
}

class SnackLadder {
    constructor(){
        this.snack = [
            {pos: 40, newPos: 3},
            {pos: 43, newPos: 18},
            {pos: 76, newPos: 58},
            {pos: 99, newPos: 41},
        ];
        this.ladder = [
            {pos: 4, newPos: 25},
            {pos: 13, newPos: 46},
            {pos: 50, newPos: 69},
            {pos: 62, newPos: 81},
        ];
    }
}

class GameEngine {
    constructor(){
        this.SL = new SnackLadder();
        this.dice = new Dice();
        this.Player = new Player();
        this.playerQueue = this.Player.players;
        this.winners = this.Player.winners;
        this.loser = this.Player.loser;
        this.logger = new Logger();
    }

    startGame(){
        while(this.playerQueue.length > 1){
            const rollNum = this.dice.rollDice();
            const player = this.playerQueue.shift();
            const newPos = player.curPos + rollNum;
            if(newPos <= 100){
                player.curPos = newPos;
            } else {
                this.playerQueue.push(player);
                continue;
            }
            
            let isContinue = false;
            if(player.curPos === 100){
                this.winners.push(player);
                this.logger.addLog('won', `${player.name}: Won the Game`);
                if(this.playerQueue.length === 1){
                    this.logger.addLog('lose', `${this.playerQueue[0].name}: Lose the Game`);
                    this.Player.loser = this.playerQueue[0];
                    this.Player.announceWinnerLoser();
                }
                continue;
            } else{
                this.SL.snack.forEach((el)=>{
                    if(el.pos === player.curPos){
                        player.curPos = el.newPos;
                        this.logger.addLog('snack', `${player.name}: Snack bite at position ${el.pos}`);
                        isContinue = true;
                    }
                });
                if(isContinue){
                    this.playerQueue.push(player);
                    continue;
                }

                this.SL.ladder.forEach((el)=>{
                    if(el.pos === player.curPos){
                        player.curPos = el.newPos;
                        this.logger.addLog('ladder', `${player.name}: Ladder at position ${el.pos}`);
                    }
                });
                this.playerQueue.push(player);
            }
            
        }
    }
}

const gEngine = new GameEngine();
gEngine.startGame();