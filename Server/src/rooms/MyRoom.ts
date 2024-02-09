import { Room,Delayed, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";

const TURN_TIMEOUT: number = 5;
const BOARD_WIDTH : number = 3; 

export class MyRoom extends Room<MyRoomState> {
   maxClients : number = 2;
   randomMoveTimeout: Delayed;
   

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
    this.randomMoveTimeout.reset();
    
    this.randomMoveTimeout = this.clock.setTimeout(() => this.doRandomMove(), TURN_TIMEOUT * 1000);
  }

  checkWin(x : number, y : number, player : number)    
  {
    
    // check horizontal 
    for (let y = 0; y < BOARD_WIDTH; y++) {
      if (this.state.board[y] == player && this.state.board[y + 1] == player && this.state.board[y + 2] == player) {
        this.state.winner = this.state.currentTurn;
        return this.state.winner;
      }

      // check vertical
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if(this.state.board[x] == player && this.state.board[x + 3] == player && this.state.board[x + 6] == player) {
          this.state.winner = this.state.currentTurn;
          return this.state.winner;
        } 

        // check diagonal 
        if(x == y && this.state.board[0] == player && this.state.board[4] == player && this.state.board[8] == player) {
          this.state.winner = this.state.currentTurn;
          return this.state.winner; 
        }

        //check backdiagonal
        if (x + y === BOARD_WIDTH - 1 && this.state.board[2] === player && this.state.board[4] === player && this.state.board[6] === player) {
          this.state.winner = this.state.currentTurn;
          return this.state.winner;
        } 
        
      }
      
    }
  }

  checkDraw()
  {
     var space = this.state.board.find(element => element == 0);
     return !space;
  }

  playerAction (client: Client, data: any) {
    if (this.state.winner || this.state.draw) {
      return false;
    }

    if (client.sessionId == this.state.currentTurn) {
      var keysArray = Array.from(this.state.players.keys()); 
      var index = data;
      var move =  client.sessionId == keysArray[0] ? 1 : 2;
      this.state.board[index] = move;
      // check win 
      var winner = this.checkWin(x,y,move);
      if(this.checkDraw)
      {
        this.state.draw = true;
      }
      this.state.currentTurn == keysArray[0] ? keysArray[1] : keysArray[0];
      this.setAutoMoveTimeout();
    }
  }
  
  doRandomMove() {
    const sessionId = this.state.currentTurn;
    for(let x: number = 0 ; x< BOARD_WIDTH; x++)
  {
    for(let y: number = 0 ; y< BOARD_WIDTH; y++)
    {
      if(this.state.board[x*BOARD_WIDTH+y] == 0)
      {
        var index = x+ BOARD_WIDTH * y; 
        
        this.playerAction({ sessionId } as Client, { x, y });
        return;
      }
  }
  }
}
}
