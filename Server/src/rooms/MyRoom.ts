import { Room,Delayed, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";

const TURN_TIMEOUT: number = 30;
const BOARD_WIDTH : number = 3; 

export class MyRoom extends Room<MyRoomState> {
   maxClients : number = 2;
   public randomMoveTimeout: Delayed;
   

  onCreate (options: any) {
    this.setState(new MyRoomState());
    this.autoDispose=true;
    this.maxClients= 2;
    this.onMessage("action", (client, message) => this.playerAction(client, message));


    console.log("oncreated==",options);
    console.log("roomId==",this.roomId);
    
    this.onMessage("UpdateSession", (client, data) => {
      console.log("client=",client.sessionId,"data=",data);
      this.broadcast("broadCastMessage","Hi");
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, true); 

    if(this.state.players.size == 2)
    {
      this.state.currentTurn = client.sessionId;
      this.setAutoMoveTimeout();    
      this.lock();
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  setAutoMoveTimeout() {
   
    this.randomMoveTimeout?.reset();
    this.randomMoveTimeout = this.clock.setTimeout(() => this.doRandomMove(), TURN_TIMEOUT * 1000);
  }

  checkWin(x : number, y : number, player : number) {
    // Check horizontal line
    if (this.state.board[y * BOARD_WIDTH] === player &&
        this.state.board[y * BOARD_WIDTH + 1] === player &&
        this.state.board[y * BOARD_WIDTH + 2] === player) {
        return this.state.currentTurn;
    }

    // Check vertical line
    if (this.state.board[x] === player &&
        this.state.board[x + BOARD_WIDTH] === player &&
        this.state.board[x + BOARD_WIDTH * 2] === player) {
        return this.state.currentTurn;
    }

    // Check main diagonal
    if (x === y && this.state.board[0] === player &&
        this.state.board[4] === player &&
        this.state.board[8] === player) {
        return this.state.currentTurn;
    }

    // Check reverse diagonal
    if (x + y === BOARD_WIDTH - 1 && this.state.board[2] === player &&
        this.state.board[4] === player &&
        this.state.board[6] === player) {
        return this.state.currentTurn;
    }

    return null; // No winner yet
}
  checkDraw() {
    let totalMoves = this.state.board.filter(element => element !== 0).length;  
    return totalMoves === this.state.board.length;
}

printBoard() {
  for (let row = 0; row < BOARD_WIDTH; row++) {
      let rowStr = "";
      for (let col = 0; col < BOARD_WIDTH; col++) {
          rowStr += this.state.board[row * BOARD_WIDTH + col] + " ";
      }
      console.log(rowStr);
  }
}

  playerAction (client: Client, data: any) {
    if (this.state.winner || this.state.draw) {
      return false;
    }
    console.log( data.x +',' +data.y );
    if (client.sessionId == this.state.currentTurn) {
      var keysArray = Array.from(this.state.players.keys()); 
      var index = data.x+ BOARD_WIDTH * data.y; 
      var move=  client.sessionId == keysArray[0] ? 1 : 2;
      this.state.board[index] = move;
      console.log("Updated Board:");
      this.printBoard();
      var winner = this.checkWin(data.x,data.y,move);
      if(winner != null)
      {
        this.state.winner = winner;
        this.randomMoveTimeout?.reset();  
        return; 
      }
      if(this.checkDraw())
      {
        this.state.draw = true;
        this.randomMoveTimeout?.reset();  
        return;
      }
      this.state.currentTurn = (this.state.currentTurn === keysArray[0]) ? keysArray[1] : keysArray[0];
      console.log('Player Turn Switched to ' + this.state.currentTurn); 
      this.setAutoMoveTimeout();
    }
  }
  
  doRandomMove() {
    const sessionId = this.state.currentTurn;
    for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let y = 0; y < BOARD_WIDTH; y++) {
            const index = x + y * BOARD_WIDTH;
            if (this.state.board[index] === 0) {
                console.log("x=", x, "y=", y, "index=", index, "sessionId=", sessionId);
                this.playerAction({ sessionId } as Client, { x, y });
                return;
            }
        }
    }
}
}
