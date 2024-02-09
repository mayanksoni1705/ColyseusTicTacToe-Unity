import { Schema, MapSchema, ArraySchema, Context, type } from "@colyseus/schema";

export class MyRoomState extends Schema {
    @type("string") currentTurn: string;
    @type({ map: "boolean" }) players = new MapSchema<boolean>();
    @type(["number"]) board: number[] = new ArraySchema<number>(0, 0, 0, 0, 0, 0, 0, 0, 0);
    @type("string") winner: string;
    @type("boolean") draw: boolean;
}
