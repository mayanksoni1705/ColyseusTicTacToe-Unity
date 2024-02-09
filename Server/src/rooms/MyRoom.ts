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
    if (this.randomMoveTimeout) {
      this.randomMoveTimeout.clear();
    }

    this.randomMoveTimeout = this.clock.setTimeout(() => this.doRandomMove(), TURN_TIMEOUT * 1000);
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
    }
    
    if(this.randomMoveTimeout != null)
    {
      this.randomMoveTimeout.clear();
    }
    
    this.state.currentTurn == keysArray[0] ? keysArray[1] : keysArray[0];
    this.setAutoMoveTimeout();
  }
  
  doRandomMove() {
    for(let x: number = 0 ; x< BOARD_WIDTH; x++)
  {
    for(let y: number = 0 ; y< BOARD_WIDTH; y++)
    {
      if(this.state.board[x*BOARD_WIDTH+y] == 0)
      {
        var index = x+ BOARD_WIDTH * y; 
        this.playerAction(currentTurn, index);
        return;
      }
  }
  }
}
}
