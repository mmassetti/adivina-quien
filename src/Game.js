import React from "react";
import Board from "./Board";
import Swal from "sweetalert2";
import Footer from "./partials/Footer";
import { Link } from "react-router-dom";
import { getTvSeries } from "./utils/getImagesUrls";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import classNames from "classnames";

class Game extends React.Component {
  constructor(props) {
    super(props);

    let imagesUrls = getTvSeries();

    this.state = {
      squaresPlayer1: imagesUrls,
      squaresPlayer2: imagesUrls,
      whosTurn: this.props.myTurn,
    };

    this.turn = "player1";
    this.gameOver = false;
    this.playerCharacterImg = {
      url:
        "https://res.cloudinary.com/sebanoe/image/upload/v1618704842/AdivinaQuien/series/friends_ji6gdq.jpg",
      title: "TEST",
    };
  }

  componentDidMount() {
    let imagesUrls = getTvSeries();

    this.props.pubnub.getMessage(this.props.gameChannel, (msg) => {
      // Publish move to the opponent's board
      if (msg.message.turn === this.props.currentPlayer) {
        this.publishMove(msg.message.currentPlayer);
      }

      // Start a new round
      else if (msg.message.reset) {
        this.setState({
          squaresPlayer1: imagesUrls,
          squaresPlayer2: imagesUrls,
          whosTurn: this.props.myTurn,
        });

        this.turn = "player1";
        this.gameOver = false;
        Swal.close();
      }

      // End the game and go back to the lobby
      else if (msg.message.endGame) {
        Swal.close();
        this.props.endGame();
      }
    });
  }

  // Opponent's move is published to the board
  publishMove = (currentPlayer) => {
    this.turn = currentPlayer === "player1" ? "player2" : "player1";

    this.setState({
      whosTurn: !this.state.whosTurn,
    });
  };

  onMakeMovePlayer1 = (index) => {
    const squares = this.state.squaresPlayer1;

    // Check if it's the player's turn to make a move
    if (this.turn === this.props.currentPlayer) {
      const square = squares[index];
      square.show = !square.show;

      this.setState({
        squaresPlayer1: squares,
      });
    }
  };

  onMakeMovePlayer2 = (index) => {
    const squares = this.state.squaresPlayer2;

    // Check if it's the player's turn to make a move
    // if (!squares[index] && this.turn === this.props.currentPlayer) {
    if (this.turn === this.props.currentPlayer) {
      const square = squares[index];
      square.show = !square.show;

      this.setState({
        squaresPlayer2: squares,
      });
    }
  };

  onFinishMovePlayer = () => {
    this.setState({
      whosTurn: !this.state.whosTurn,
    });

    // Other player's turn to make a move
    this.turn = this.turn === "player1" ? "player2" : "player1";

    // Publish move to the channel
    this.props.pubnub.publish({
      message: {
        // index: index,
        currentPlayer: this.props.currentPlayer,
        turn: this.turn,
      },
      channel: this.props.gameChannel,
    });
  };

  render() {
    let status;
    // Change to current player's turn
    //TODO: Darle color verde y rojo a esto
    status = `${
      this.state.whosTurn
        ? "Te toca preguntar a vos"
        : "Le toca preguntar a tu rival"
    }`;

    return (
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* <Header /> */}

        <main className="flex-grow">
          <section className="relative">
            <>
              <div
                className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
                aria-hidden="true"
              ></div>
              {/* <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div> */}
              <div className="relative max-w-8xl mx-auto px-4 sm:px-6">
                <div className="pt-2 md:pt-6">
                  {/* Section header */}
                  <Link
                    to="/"
                    className="font-medium text-gray-600 hover:text-gray-900 px-5 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    ⬅ Menú principal
                  </Link>

                  <div className="max-w-3xl mx-auto text-center pb-6 md:pb-8">
                    <h1 className="h2 mb-4">¡Adivina quién!</h1>
                  </div>

                  {/* Content */}

                  <div className="flex mx-10 space-x-10">
                    <section className="text-gray-600 body-font">
                      <div className="container mx-auto flex items-center md:flex-row flex-col">
                        <div className="flex flex-col md:mb-0 mb-6 pr-0 w-full md:w-auto md:text-left text-center">
                          <div>
                            <div className="flex justify-center">
                              <h2
                                className={classNames("h2 mb-4", {
                                  " text-green-500": this.state.whosTurn,
                                  "text-red-400": !this.state.whosTurn,
                                })}
                              >
                                {status}
                              </h2>
                            </div>

                            {this.props.isRoomCreator ? (
                              <Board
                                squares={this.state.squaresPlayer1}
                                onClick={(index) =>
                                  this.onMakeMovePlayer1(index)
                                }
                              />
                            ) : (
                              <Board
                                squares={this.state.squaresPlayer2}
                                onClick={(index) =>
                                  this.onMakeMovePlayer2(index)
                                }
                              />
                            )}
                          </div>
                          {this.state.whosTurn ? (
                            <div className="flex justify-center mt-6 mb-6">
                              <button
                                className="btn text-white bg-blue-600 hover:bg-blue-700 shadow"
                                href="#0"
                                onClick={this.onFinishMovePlayer}
                              >
                                Eliminar seleccionadas
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </section>

                    <div className="flex w-1/4 mt-16 flex-col md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0">
                      <div className="text-center flex flex-col space-y-2 ">
                        <div className="font-bold leading-snug tracking-tight mb-1 mt-2">
                          Te tocó:
                        </div>
                        <img
                          src={this.playerCharacterImg.url}
                          alt="this.playerCharacterImg"
                          width={300}
                          height={300}
                        />
                      </div>
                      <div>
                        <div className="mt-4 text-center font-bold leading-snug tracking-tight mb-1">
                          Tomá notas:
                        </div>
                        <TextareaAutosize
                          aria-label="empty textarea"
                          placeholder="Escribí pistas, descartes, etc..."
                          style={{
                            width: "300px",
                            height: "300px",
                            background: "rgb(234,234,234)",
                            padding: "1rem",
                          }}
                        />
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </section>
        </main>

        <Footer />
      </div>
    );
  }
}

export default Game;
