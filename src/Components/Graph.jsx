import { useRef } from "react";
import "../styles/App.css";
import Nav from "./Nav";
import Footer from "./Footer";
import * as d3 from "d3";

const r = 20;
const net = [];
const links = [];
var ref;
var width = 800;
var height = 500;
var simulation;
var on = false;
var op = 0;
var prevNode;

class Edge {
	constructor(from, to, weight) {
		this.source = from;
		this.target = to;
		this.weight = weight;
	}
}

class Node {
	constructor(name, x, y) {
		this.id = name;
		this.x = x;
		this.y = y;
	}
}

function getMousePosition(e) {
	let rect = document.getElementById("myArea").getBoundingClientRect();
	let x = Math.round(e.clientX - rect.left);
	let y = Math.round(e.clientY - rect.top);
	return { x: x, y: y };
}

function clearCircles() {
	net.length = 0;
	const svg = d3.select(ref.current);
	svg.selectChildren().remove();
}

function clearSVG() {
	const svg = d3.select(ref.current);
	svg.selectChildren().remove();
}

function drawNet() {
	clearSVG();
	const svg = d3.select(ref.current);
	links.forEach((val) => {
		svg.insert("line")
			.attr("x1", val.source.x)
			.attr("y1", val.source.y)
			.attr("x2", val.target.x)
			.attr("y2", val.target.y)
			.attr("stroke", "black")
			.attr("stroke-width", 3);
	});
	net.forEach((val) => {
		svg.insert("circle")
			.attr("cx", val.x)
			.attr("cy", val.y)
			.attr("r", r)
			.attr("fill", "pink")
			.attr("stroke", "black")
			.attr("stroke-width", 2);

		svg.insert("text")
			.attr("x", val.x - 5 * val.id.length)
			.attr("y", val.y + 5)
			.text(val.id);
	});
}

function changeOp(e) {
	prevNode = null;
	op = e.target.value;
}

function addLinks(e) {
	const text = document.getElementById("edgeInput");
	if (text.value.length === 0) {
		alert("Can't enter edge without weight");
		return;
	}
	const pos = getMousePosition(e);

	net.forEach((val) => {
		if (
			// tests to see if mouse selection is inside of a node
			Math.sqrt(Math.pow(val.x - pos.x, 2) + Math.pow(val.y - pos.y, 2)) <
			r + 4
		) {
			// first node in the edge pair
			if (prevNode === null) {
				prevNode = val;
				return;
			} else {
				// if a node is already selected for edge creation
				const edge = new Edge(prevNode, val, text.value);
				links.push(edge);
				prevNode = null;
				simulation = d3
					.forceSimulation()
					//.force("x", d3.forceX(width / 2))
					//.force("y", d3.forceY(height / 2))
					.force("collide", d3.forceCollide(r + 5))
					.force(
						"link",
						d3.forceLink(links).distance((link) => {
							return link.weight * 10;
						})
					)
					.on("tick", drawNet);
				simulation.nodes(net);
				return;
			}
		}
	});
}

function addCircle(e) {
	if (op === 0) {
		alert("Can't create Graph without Selecting Node radio button");
		return;
	}
	if (op === "1") {
		// if node is selected
		const text = document.getElementById("nodeInput");
		if (text.value.length === 0) {
			alert("Can't enter Node with empty name");
			return;
		}
		const pos = getMousePosition(e);
		net.push(new Node(text.value, pos.x, pos.y));

		if (!on) {
			// turn the simulation on
			on = true;

			simulation = d3
				.forceSimulation()
				//.force("x", d3.forceX(width / 2))
				//.force("y", d3.forceY(height / 2))
				.force("collide", d3.forceCollide(r + 10))
				.force(
					"link",
					d3.forceLink(links).distance((link) => {
						return link.weight * 20;
					})
				)
				.on("tick", drawNet);
			simulation.nodes(net);
		} else {
			// restart the simulation with the new node
			simulation.nodes(net);
			simulation.alpha(1).restart();
		}
	} // if edge is selected
	else {
		addLinks(e);
	}
}

const Graph = () => {
	ref = useRef();

	return (
		<div className=" relative min-h-screen">
			<Nav />
			<div id="graphPage" className="text-center pb-10 overflow-hidden">
				<div className="font-semibold">Hello from Graph</div>
				<div className="flex m-1 justify-center items-center	">
					<div className="m-1">Value of Node: </div>
					<input
						maxLength={3}
						id="nodeInput"
						placeholder="Max Length 3"
						className="border-2  border-black m-1 max-w-auto scrollable-content px-2 rounded-lg overflow-auto"
					></input>
					<div className="m-1">Value of Edge: </div>
					<input
						maxLength={3}
						id="edgeInput"
						placeholder="Edge Value: 0 - 999"
						className="border-2  border-black m-1 max-w-auto scrollable-content px-2 rounded-lg overflow-auto"
					></input>
					<span>
						<input
							type="radio"
							value={1}
							name="selector"
							id="radioNode"
							onClick={changeOp}
						/>
						<label>Node</label>
						<br />
						<input
							type="radio"
							value={2}
							name="selector"
							id="radioEdge"
							onClick={changeOp}
						/>
						<label>Edge</label>
					</span>
				</div>
				<svg
					ref={ref}
					width={width}
					height={height}
					id="myArea"
					className="border-4 m-auto"
					onClick={addCircle}
				></svg>

				<button className="bg-cyan-200 border-2 border-black rounded-full w-auto font-medium mt-4 ml-2 mr-2 pl-2 pr-2">
					Dijkstra
				</button>
				<button className="bg-cyan-200 border-2 border-black rounded-full w-auto font-medium mt-4 ml-2 mr-2 pl-2 pr-2">
					Bellman Ford
				</button>
				<button
					className="bg-cyan-200 border-2 border-black rounded-full w-auto font-medium mt-4 ml-2 mr-2 pl-2 pr-2"
					onClick={clearCircles}
				>
					Clear
				</button>
			</div>
			<Footer />
		</div>
	);
};

export default Graph;
