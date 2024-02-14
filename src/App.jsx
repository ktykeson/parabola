import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";
import Popup from "./Popup";

const graphRange = 20; // Increased range for better visibility of parabolas

function App() {
  const [parabolaParams, setParabolaParams] = useState({ a: 1, h: 0, k: 0 });
  const [equation, setEquation] = useState("");
  const [targetEquation, setTargetEquation] = useState({ a: 0, h: 0, k: 0 });
  const [showEquation, setShowEquation] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const moveParabola = (direction) => {
    setParabolaParams((prevParams) => {
      let { a, h, k } = prevParams;
      switch (direction) {
        case "up":
          k += 1;
          break;
        case "down":
          k -= 1;
          break;
        case "wider":
          a -= 0.1;
          break;
        case "narrower":
          a += 0.1;
          break;
        case "left":
          h -= 1;
          break;
        case "right":
          h += 1;
          break;
        default:
          break;
      }
      return { ...prevParams, a, h, k };
    });
  };

  // Prepare data for the chart
  const data = {
    labels: Array.from({ length: graphRange * 2 + 1 }, (_, i) => i - graphRange),
    datasets: [
      {
        label: "Parabola",
        data: Array.from({ length: graphRange * 2 + 1 }, (_, i) => {
          const x = i - graphRange;
          return parabolaParams.a * Math.pow(x - parabolaParams.h, 2) + parabolaParams.k;
        }),
        borderColor: "purple",
        borderWidth: 2,
      },
    ],
  };

  // Prepare options for the chart
  const options = {
    scales: {
      y: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
			color: "rgba(255, 255, 255, 0.1)", // Lighter grid lines
			borderColor: "rgba(255, 255, 255, 0.25)", // Lighter axis border
			borderWidth: 2,
			display: true,
			drawBorder: true,
			drawOnChartArea: true,
			drawTicks: true,
		  },
		  ticks: {
			color: "rgba(255, 255, 255, 0.75)", // Lighter tick labels
			stepSize: 1,
		  },
      },
      x: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
			color: "rgba(255, 255, 255, 0.1)", // Lighter grid lines
			borderColor: "rgba(255, 255, 255, 0.25)", // Lighter axis border
			borderWidth: 2,
			display: true,
			drawBorder: true,
			drawOnChartArea: true,
			drawTicks: true,
		  },
		  ticks: {
			color: "rgba(255, 255, 255, 0.75)", // Lighter tick labels
			stepSize: 1,
		  },
      },
    },
    elements: {
      point: {
        radius: 0, // Hide points
      },
      line: {
        tension: 0, // Straight lines for the parabola's curve
      },
    },
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: false,
      },
    },
  };

  	// Utility function to format numbers, enclosing negative values in parentheses
	const formatValue = (value) => {
	return value < 0 ? `(${value})` : value.toString();
  };
  
  useEffect(() => {
	// Update the equation string whenever parabolaParams changes, formatting negative values
	const a = parabolaParams.a.toFixed(2);
	const h = formatValue(parabolaParams.h.toFixed(2));
	const k = formatValue(parabolaParams.k.toFixed(2));
	setEquation(`y = ${a}(x - ${h})^2 + ${k}`);
  }, [parabolaParams]);

  const generateRandomEquation = () => {
    const newA = Math.round((Math.random() * 4 - 2) * 10) / 10; // Generate a value, then round it to make it divisible by 0.10
    const newH = Math.round(Math.random() * 10 - 5); // Randomize h within a range
    const newK = Math.round(Math.random() * 10 - 5); // Randomize k within a range
    setTargetEquation({ a: newA, h: newH, k: newK });
  };

  const checkAnswer = () => {
    if (
      Math.abs(targetEquation.a - parabolaParams.a) < 0.1 &&
      Math.abs(targetEquation.h - parabolaParams.h) < 1 &&
      Math.abs(targetEquation.k - parabolaParams.k) < 1
    ) {
      setPopupMessage("Correct, try again?");
    } else {
      setPopupMessage("Incorrect, try again.");
    }
    setShowPopup(true);
  };

  const confirmAnswer = () => {
    setShowPopup(false);
    window.location.reload();
  };

  const toggleEquation = () => {
    setShowEquation((prev) => !prev);
  };

  useEffect(() => {
    generateRandomEquation();
  }, []);

  return (
    <div className="App">
      {showPopup && <Popup message={popupMessage} confirm={confirmAnswer} />}

      <div className="graph_box">
        <div className="line_graph" style={{ width: "50%" }}>
          <Line data={data} options={options} />
        </div>
        <div style={{ width: "20%" }}>
          <div className="question_container">
            Match the parabola on the graph as the equation shown below:
            <div className="target_equation">
			y = {formatValue(targetEquation.a.toFixed(2))}(x - {formatValue(targetEquation.h.toFixed(2))})^2 + {formatValue(targetEquation.k.toFixed(2))}
            </div>
          </div>

          <div className="arrow_box">
		  <button type="button" onClick={() => moveParabola("left")}>Left</button>
            <button type="button" onClick={() => moveParabola("right")}>Right</button>
          </div>
          <div className="arrow_box">
            <button type="button" onClick={() => moveParabola("up")}>Up</button>
            <button type="button" onClick={() => moveParabola("down")}>Down</button>
          </div>
          <div className="arrow_box">
            <button type="button" onClick={() => moveParabola("wider")}>Wider</button>
            <button type="button" onClick={() => moveParabola("narrower")}>Narrower</button>
          </div>
          <div className="arrow_box">
            <button onClick={toggleEquation} type="button">Toggle Equation</button>
          </div>
          {showEquation && (
            <div id="help_equation" className="equation_display">
              {equation}
            </div>
          )}
          <div className="arrow_box">
            <button type="button" onClick={checkAnswer} className="submit_button">Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
