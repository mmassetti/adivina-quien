import React from "react";
import Square from "./Square";
import Gallery from "react-grid-gallery";

function Board({ squares, onClick }) {
  // Create the 3 x 3 board
  // function createBoard(row, col) {
  //   const board = [];
  //   let cellCounter = 0;

  //   for (let i = 0; i < row; i += 1) {
  //     const columns = [];
  //     for (let j = 0; j < col; j += 1) {
  //       columns.push(renderSquare(cellCounter++));
  //     }
  //     board.push(
  //       <div key={i} className="board-row">
  //         {columns}
  //       </div>
  //     );
  //   }

  //   return board;
  // }

  // function renderSquare(i) {
  //   return <Square key={i} value={squares[i]} onClick={() => onClick(i)} />;
  // }

  // return <div>{createBoard(6, 4)}</div>;
  // return <Gallery images={IMAGES} />;

  function disableImage(index) {}

  return (
    <div class="container mx-auto px-4">
      <section class="py-8 px-4">
        <div class="flex flex-wrap -mx-4 -mb-8">
          {squares.map((square, index) => {
            return (
              <div class="md:w-1/4 px-4 mb-8">
                <img
                  style={{ cursor: "pointer" }}
                  className="rounded shadow-md"
                  src={square.url}
                  alt=""
                  onClick={() => onClick(index)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Board;
