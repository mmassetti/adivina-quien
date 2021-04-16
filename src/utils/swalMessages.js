export const onPressJoinConfig = () => {
  return {
    position: "top",
    input: "text",
    allowOutsideClick: false,
    inputPlaceholder: "Ingresá el ID de la sala",
    showCancelButton: true,
    confirmButtonColor: "#0070F4",
    confirmButtonText: "OK",
    width: 275,
    padding: "0.7em",
    customClass: {
      heightAuto: false,
      popup: "popup-class",
      confirmButton: "join-button-class ",
      cancelButton: "join-button-class",
    },
    cancelButtonText: "Cancelar",
  };
};

export const shareIdConfig = (roomId) => {
  return {
    position: "top",
    allowOutsideClick: false,
    title: "Compartí este ID con tu rival",
    text: roomId,
    width: 275,
    padding: "0.7em",
    // Custom CSS
    customClass: {
      heightAuto: false,
      title: "title-class",
      popup: "popup-class",
      confirmButton: "button-class",
    },
  };
};

export const gameInProgress = () => {
  return {
    position: "top",
    allowOutsideClick: false,
    title: "Error",
    text: "El juego ya arrancó. Probá en otra sala.",
    width: 275,
    padding: "0.7em",
    customClass: {
      heightAuto: false,
      title: "title-class",
      popup: "popup-class",
      confirmButton: "button-class",
    },
  };
};
