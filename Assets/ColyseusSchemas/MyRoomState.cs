// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.26
// 

using Colyseus.Schema;
using Action = System.Action;

namespace ColyseusTicTacToe.ColyseusStates {
	public partial class MyRoomState : Schema {
		[Type(0, "string")]
		public string currentTurn = default(string);

		[Type(1, "map", typeof(MapSchema<bool>), "boolean")]
		public MapSchema<bool> players = new MapSchema<bool>();

		[Type(2, "array", typeof(ArraySchema<float>), "number")]
		public ArraySchema<float> board = new ArraySchema<float>();

		[Type(3, "string")]
		public string winner = default(string);

		[Type(4, "boolean")]
		public bool draw = default(bool);

		/*
		 * Support for individual property change callbacks below...
		 */

		protected event PropertyChangeHandler<string> __currentTurnChange;
		public Action OnCurrentTurnChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.currentTurn));
			__currentTurnChange += __handler;
			if (__immediate && this.currentTurn != default(string)) { __handler(this.currentTurn, default(string)); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(currentTurn));
				__currentTurnChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<MapSchema<bool>> __playersChange;
		public Action OnPlayersChange(PropertyChangeHandler<MapSchema<bool>> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.players));
			__playersChange += __handler;
			if (__immediate && this.players != null) { __handler(this.players, null); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(players));
				__playersChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<ArraySchema<float>> __boardChange;
		public Action OnBoardChange(PropertyChangeHandler<ArraySchema<float>> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.board));
			__boardChange += __handler;
			if (__immediate && this.board != null) { __handler(this.board, null); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(board));
				__boardChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<string> __winnerChange;
		public Action OnWinnerChange(PropertyChangeHandler<string> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.winner));
			__winnerChange += __handler;
			if (__immediate && this.winner != default(string)) { __handler(this.winner, default(string)); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(winner));
				__winnerChange -= __handler;
			};
		}

		protected event PropertyChangeHandler<bool> __drawChange;
		public Action OnDrawChange(PropertyChangeHandler<bool> __handler, bool __immediate = true) {
			if (__callbacks == null) { __callbacks = new SchemaCallbacks(); }
			__callbacks.AddPropertyCallback(nameof(this.draw));
			__drawChange += __handler;
			if (__immediate && this.draw != default(bool)) { __handler(this.draw, default(bool)); }
			return () => {
				__callbacks.RemovePropertyCallback(nameof(draw));
				__drawChange -= __handler;
			};
		}

		protected override void TriggerFieldChange(DataChange change) {
			switch (change.Field) {
				case nameof(currentTurn): __currentTurnChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
				case nameof(players): __playersChange?.Invoke((MapSchema<bool>) change.Value, (MapSchema<bool>) change.PreviousValue); break;
				case nameof(board): __boardChange?.Invoke((ArraySchema<float>) change.Value, (ArraySchema<float>) change.PreviousValue); break;
				case nameof(winner): __winnerChange?.Invoke((string) change.Value, (string) change.PreviousValue); break;
				case nameof(draw): __drawChange?.Invoke((bool) change.Value, (bool) change.PreviousValue); break;
				default: break;
			}
		}
	}
}
