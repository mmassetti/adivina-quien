import React from "react";

import Header from "../partials/Header";
import HeroHome from "../partials/HeroHome";
import Footer from "../partials/Footer";

function Home({ onPressJoin }) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <HeroHome onPlayerJoined={onPressJoin} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
