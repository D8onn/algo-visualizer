import "../styles/App.css";
import { Link } from "react-router-dom";

function Nav() {
	return (
		<ul className="text-l font-semibold items-center top-0 sticky flex scrollable-content bg-fuchsia-200 mb-2 border-b-2 border-black">
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/"> Home </Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/graph"> Graph Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
			<li className="pr-3 pl-3 pb-1 hover:bg-purple-100 transition">
				<Link to="/sort"> Sorting Algorithms</Link>
			</li>
		</ul>
	);
}

export default Nav;
