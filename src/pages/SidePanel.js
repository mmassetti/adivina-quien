import React from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

export default function SidePanel({ playerCharacterUrl }) {
  return (
    <div className="flex w-1/4 mt-16 flex-col md:ml-auto md:mr-0 mx-auto items-center flex-shrink-0">
      <div className="text-center flex flex-col space-y-2 ">
        <div className="font-bold leading-snug tracking-tight mb-1 mt-2">
          Te tocó:
        </div>
        <img
          src={playerCharacterUrl}
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
    </div>
  );
}
