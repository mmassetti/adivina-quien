import React, { useState } from "react";

import Header from "../partials/Header";
import HeroHome from "../partials/HeroHome";
import FeaturesHome from "../partials/Features";
import FeaturesBlocks from "../partials/FeaturesBlocks";
import Testimonials from "../partials/Testimonials";
import Newsletter from "../partials/Newsletter";
import Footer from "../partials/Footer";

function Home() {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showHeroHome, setShowHeroHome] = useState(true);
  const [showGame, setShowGame] = useState(false);

  function hideHeroHome() {
    setShowHeroHome(false);
    setShowCreateRoom(true);
  }

  function showGameOnly() {
    setShowHeroHome(false);
    setShowCreateRoom(false);
    setShowGame(true);
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        {/*  Page sections */}
        {showHeroHome ? <HeroHome onCreateRoom={hideHeroHome} /> : null}
        {showCreateRoom ? <FeaturesHome onRoomCreated={showGameOnly} /> : null}
        {showGame ? <FeaturesBlocks /> : null}
        {/*  <Testimonials />
        <Newsletter /> */}
      </main>

      {/*  Site footer */}
      <Footer />
    </div>
  );
}

export default Home;
