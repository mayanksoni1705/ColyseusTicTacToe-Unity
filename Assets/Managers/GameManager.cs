using Colyseus;
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using ColyseusTicTacToe.ColyseusStates;
using UnityEngine.UI;
using TMPro;

public class GameManager : MonoBehaviour
{
    private ColyseusRoom<MyRoomState> room;
    private Dictionary<string, bool> players = new Dictionary<string, bool>();

    [SerializeField] private List<Button> board = new List<Button>();
    [SerializeField] private TextMeshProUGUI turnText;
    [SerializeField] private GameObject waitingForPlayersText;


    async void Start()
    {
        ColyseusClient client = new ColyseusClient("ws://localhost:2567");
        room = await client.JoinOrCreate<MyRoomState>("my_room");
        Debug.Log("Connected to room: " + room.Id);

        room.OnMessage<string>("broadCastMessage", message =>
        {
            Debug.Log(message);
        });
        room.State.players.OnAdd((key, value) =>
        {
            if (!players.ContainsKey(key))
            {
                Debug.Log("Player joined: " + key);
                players.Add(key, value);
            }
            else
            {
                Debug.Log("Player already exists: " + key);
            }
        });
        room.State.players.OnRemove((key, value) =>
        {
            if (players.ContainsKey(key))
            {
                Debug.Log("Player left: " + key);
                players.Remove(key);
            }
            else
            {
                Debug.Log("Player already removed" + key);
            }
        });
        room.State.board.OnChange((key, value) =>
        {
            board[key].GetComponentInChildren<TextMeshProUGUI>().text = value.ToString();
        });
        room.State.OnCurrentTurnChange(OnCurrentTurnChange);
        room.State.OnDrawChange(OnDrawChanged);
        room.State.OnWinnerChange(OnWinnerChanged);

        room.Send("UpdateSession", "myname = " + room.SessionId);
    }

    private void OnWinnerChanged(string currentValue, string previousValue)
    {
        waitingForPlayersText.SetActive(true);
        if (currentValue == room.SessionId)
        {
            waitingForPlayersText.GetComponent<TextMeshProUGUI>().text = "You won";
        }
        else
        {
            waitingForPlayersText.GetComponent<TextMeshProUGUI>().text = "You lost";   
        }
    }

    private void OnDrawChanged(bool currentValue, bool previousValue)
    {
        if (currentValue == true)
        {
            waitingForPlayersText.SetActive(true);
            waitingForPlayersText.GetComponent<TextMeshProUGUI>().text = "Draw";
        }
    }

    private void OnCurrentTurnChange(string currentValue, string previousValue)
    {
        if (currentValue == room.SessionId)
        {
            waitingForPlayersText.SetActive(false);
            Debug.Log("It's my turn");
        }
        else
        {
            waitingForPlayersText.SetActive(true);
            waitingForPlayersText.GetComponent<TextMeshProUGUI>().text = "Waiting for opponent's turn";
            Debug.Log("It's not my turn");
        }
    }
}
