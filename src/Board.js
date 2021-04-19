import React from "react";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

function Board({ squares, onClick }) {
  return (
    <ImageList cols={6} rowHeight={350}>
      {squares.map((square, index) => {
        let squareImg = "";
        if (square.show) {
          squareImg = square.url;
        } else {
          squareImg = square.hideImageUrl;
        }

        return (
          <ImageListItem key={square.url} onClick={() => onClick(index)}>
            {/* TODO: Cambiar ancho */}
            <img
              srcSet={`${squareImg}?w=164&h=164&fit=crop&auto=format 1x,
              ${square.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={square.url}
              loading="lazy"
              style={{ cursor: "pointer" }}
              className="rounded shadow-md"
            />
            <ImageListItemBar
              title={square.title}
              position="below"
              style={{
                textAlign: "center",
                textDecoration: square.show ? null : "line-through",
              }}
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}

export default Board;
