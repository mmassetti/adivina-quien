import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

function WaitingOpponent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
              <h2 className="h2 mb-4">Esperando rival...</h2>
              <p className="text-xl text-gray-600">
                La partida comenzará una vez que tu rival ingrese el código de
                la sala
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WaitingOpponent;
