import { useRef } from "react";
import "../styles/App.css";
import Nav from "./Nav";
import Footer from "./Footer";
import * as d3 from "d3";

const r = 20;
const net = [];
const links = [];
var ref, nodeRef, linkRef;
var width = 800;
var height = 500;
var simulation;
var op = 0;
var prevNode = null;
var nodes, edges, labels;

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

function clearCircles() {
	net.length = 0;
	clearSVG();
}

function clearSVG() {
	const n = d3.select(nodeRef.current);
	n.selectChildren().remove();
	const l = d3.select(linkRef.current);
	l.selectChildren().remove();
}

function drawNet() {
	clearSVG();

	edges = d3
		.select(linkRef.current)
		.append("g")
		.attr("id", "weights")
		.selectAll("line")
		.data(links)
		.enter()
		.append("line");

	edges.style("stroke", "black");

	nodes = d3
		.select(nodeRef.current)
		.append("g")
		.attr("id", "circles")
		.selectAll("circle")
		.data(net)
		.enter()
		.append("circle")
		.attr("r", r);

	nodes
		.style("fill", "pink")
		.style("fill-opacity", "0.9")
		.style("stroke", "#424242")
		.style("stroke-width", "1px");

	labels = d3
		.select(nodeRef.current)
		.append("g")
		.attr("id", "labels")
		.selectAll("text")
		.data(net)
		.enter()
		.append("text")
		.text(function (d) {
			return d.id;
		})
		.attr("class", "label");

	labels.style("text-anchor", "middle").style("font-size", "10px");
}

function changeOp(e) {
	prevNode = null;
	op = e.target.value;
}

function handleLinks(event) {
	const text = document.getElementById("edgeInput");
	if (text.value.length === 0) {
		alert("Can't have empty edge input");
		return;
	}
	const [x, y] = d3.pointer(event);

	if (prevNode == null) {
		prevNode = simulation.find(x, y, r);
	} else {
		const currNode = simulation.find(x, y, r);
		if (currNode == null) {
			prevNode = null;
		} else {
			links.push(new Edge(prevNode, currNode, text.value));
			prevNode = null;
			simulation.nodes(net);
			simulation.alpha(1).restart();
			drawNet();
		}
	}
}

function handleNodes(event) {
	const text = document.getElementById("nodeInput");
	if (text.value.length === 0) {
		alert("Can't have empty node input");
		return;
	}

	const [x, y] = d3.pointer(event);
	const n = new Node(text.value, x, y);
	net.push(n);

	simulation.nodes(net).on("tick", update);
	simulation.alpha(1).restart();
	drawNet();
}

function handleClick(event) {
	if (op === 0) {
		alert("Can't create Graph without Selecting Node radio button");
		return;
	}
	if (op === "1") {
		handleNodes(event);
		return;
	}
	if (op === "2") {
		handleLinks(event);
		return;
	}

	alert("a lot happend");
}

function update() {
	edges
		.attr("x1", function (d) {
			return d.source.x;
		})
		.attr("y1", function (d) {
			return d.source.y;
		})
		.attr("x2", function (d) {
			return d.target.x;
		})
		.attr("y2", function (d) {
			return d.target.y;
		});
	nodes
		.attr("cx", function (d) {
			return d.x;
		})
		.attr("cy", function (d) {
			return d.y - 4;
		});

	labels
		.attr("x", function (d) {
			return d.x;
		})
		.attr("y", function (d) {
			return d.y;
		});
}

function Graph() {
	ref = useRef();
	nodeRef = useRef();
	linkRef = useRef();
	drawNet();
	d3.select(ref.current).on("click", handleClick);
	simulation = d3
		.forceSimulation()
		.force("x", d3.forceX(width / 2))
		.force("y", d3.forceY(height / 2))
		.force("collide", d3.forceCollide(r + 10))
		//.force("charge", d3.forceManyBody().strength(-1000))
		.force(
			"link",
			d3.forceLink(links).distance((link) => {
				return link.weight * 20;
			})
		);

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
				>
					<g id="links" ref={linkRef}></g>
					<g id="nodes" ref={nodeRef}></g>
				</svg>

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
}

export default Graph;
