using Colyseus;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    private ColyseusRoom<MyRoomState> room;

    async void Start()
    {
        ColyseusClient client = new ColyseusClient("ws://192.168.0.183:2567");
        room = await client.JoinOrCreate<MyRoomState>("my_room");
        Debug.Log("Connected to room: " + room.Id);

        room.OnMessage<string>("broadCastMessage", message =>
        {
            Debug.Log(message);
        });
        room.State.OnTotalConnetedChange(OnTotalChange);    
        room.Send("UpdateSession" , "myname = " + room.SessionId);
    }

    private void OnTotalChange(float currentValue, float previousValue)
    {
        Debug.Log("Current Value: " + currentValue);
    }
}
