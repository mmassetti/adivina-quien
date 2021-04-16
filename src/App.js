import React, { Component } from "react";
import Game from "./Game";
import PubNubReact from "pubnub-react";
import Swal from "sweetalert2";
import shortid from "shortid";
import "./Game.css";

import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";

import "./css/style.scss";

import AOS from "aos";
import { focusHandling } from "cruip-js-toolkit";

import Home from "./pages/Home";
import {
  gameInProgress,
  onPressJoinConfig,
  shareIdConfig,
} from "./utils/swalMessages";
import CreateRoom from "./pages/CreateRoom";
import WaitingOpponent from "./partials/WaitingOpponent.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.pubnub = new PubNubReact({
      publishKey: "pub-c-d0e08685-6b09-4d80-bdf3-098711f000e8",
      subscribeKey: "sub-c-584482d0-942f-11eb-9adf-f2e9c1644994",
    });

    this.state = {
      currentPlayer: "",
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    };

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;
    this.pubnub.init(this);
  }

  componentDidMount() {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });

    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
    focusHandling("outline");
  }

  componentDidUpdate() {
    // Check that the player is connected to a channel
    if (this.lobbyChannel != null) {
      this.pubnub.getMessage(this.lobbyChannel, (msg) => {
        // Start the game once an opponent joins the channel
        if (msg.message.notRoomCreator) {
          // Create a different channel for the game
          this.gameChannel = "guesswhogame--" + this.roomId;

          this.pubnub.subscribe({
            channels: [this.gameChannel],
          });

          this.setState({
            isPlaying: true,
          });

          // Close the modals if they are opened
          Swal.close();
        }
      });
    }
  }

  // Create a room channel
  onPressCreate = (e) => {
    // Create a random name for the channel
    this.roomId = shortid.generate().substring(0, 5);
    this.lobbyChannel = "guesswholobby--" + this.roomId;

    this.pubnub.subscribe({
      channels: [this.lobbyChannel],
      withPresence: true,
    });

    // Open the modal
    Swal.fire(shareIdConfig(this.roomId));

    this.setState({
      currentPlayer: "player1",
      isRoomCreator: true,
      isDisabled: true, // Disable the 'Create' button
      myTurn: true, // Room creator makes the 1st move
    });

    this.props.history.push("/");
  };

  // The 'Join' button was pressed
  onPressJoin = (e) => {
    Swal.fire(onPressJoinConfig()).then((result) => {
      // Check if the user typed a value in the input field
      if (result.value) {
        this.joinRoom(result.value);
      }
    });
  };

  // Join a room channel
  joinRoom = (value) => {
    this.roomId = value;
    this.lobbyChannel = "guesswholobby--" + this.roomId;

    // Check the number of people in the channel
    this.pubnub
      .hereNow({
        channels: [this.lobbyChannel],
      })
      .then((response) => {
        if (response.totalOccupancy < 2) {
          this.pubnub.subscribe({
            channels: [this.lobbyChannel],
            withPresence: true,
          });

          this.setState({
            currentPlayer: "player2",
          });

          this.pubnub.publish({
            message: {
              notRoomCreator: true,
            },
            channel: this.lobbyChannel,
          });
        } else {
          // Game in progress
          Swal.fire(gameInProgress());
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Reset everything
  endGame = () => {
    this.setState({
      currentPlayer: "",
      isPlaying: false,
      isRoomCreator: false,
      isDisabled: false,
      myTurn: false,
    });

    this.lobbyChannel = null;
    this.gameChannel = null;
    this.roomId = null;

    this.pubnub.unsubscribe({
      channels: [this.lobbyChannel, this.gameChannel],
    });
  };

  render() {
    return (
      //TODO: Mandarle a home lo que requiere Game, Crear y Unirse, y pasarle "onPressCreate" y "onPressJoin"
      <Switch>
        <Route exact path="/">
          {!this.state.isPlaying && !this.roomId && (
            <Home onPressJoin={() => this.onPressJoin()} />
          )}
          {!this.state.isPlaying && this.roomId && <WaitingOpponent />}
          {this.state.isPlaying && (
            <Game
              pubnub={this.pubnub}
              gameChannel={this.gameChannel}
              currentPlayer={this.state.currentPlayer}
              isRoomCreator={this.state.isRoomCreator}
              myTurn={this.state.myTurn}
              // player1Username={this.state.xUsername}
              // player2Username={this.state.oUsername}
              endGame={this.endGame}
            />
          )}
        </Route>
        <Route path="/crear-sala">
          <CreateRoom onPressCreate={() => this.onPressCreate()} />
        </Route>
      </Switch>
    );
  }
}

export default withRouter(App);
