import "./styles/App.css";
import Graph from "./Components/Graph";
import Sort from "./Components/Sort";
import Home from "./Components/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/Graph" element={<Graph />} />
					<Route path="/Sort" element={<Sort />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
