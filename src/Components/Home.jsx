import React from "react";
import "../styles/App.css";
import Nav from "./Nav";
import Footer from "./Footer";

function Home() {
	return (
		<div>
			<Nav />
			<div id="homePage">Hello from Home</div>
			<Footer />
		</div>
	);
}

export default Home;
