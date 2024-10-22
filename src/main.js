// // Heart Rate Monitor Code
// document.querySelector("#record").addEventListener("click", onRecord);

// let video, c_tmp, ctx_tmp; // video from rear-facing-camera and tmp canvas
// let frameCount = 0; // count number of video frames processed
// let delay = 0; // delay = 100; should give us 10 fps, estimated around 7
// let xMean = 0;
// let nFrame = 0;
// const WINDOW_LENGTH = 300; // 300 frames = 5s @ 60 FPS
// let acdc = Array(WINDOW_LENGTH).fill(0.5);
// let heartBeats = 0;
// let lastBeatTime = null;
// const PEAK_THRESHOLD = 0.05; // Threshold for peak detection

// let constraintsObj = {
//   audio: false,
//   video: {
//     width: { ideal: 1280 },
//     height: { ideal: 720 },
//     frameRate: { ideal: 60 },
//     facingMode: "environment", // rear-facing-camera
//   },
// };

// function init() {
//   c_tmp = document.getElementById("output-canvas");
//   ctx_tmp = c_tmp.getContext("2d");
// }

// // Detrend to remove DC component
// function detrend(y) {
//   const n = y.length;
//   const mean = y.reduce((a, b) => a + b, 0) / n;
//   return y.map((val) => val - mean);
// }

// // Detect peaks in the AC signal
// function detectPeaks(signal, threshold) {
//   let peaks = [];
//   for (let i = 1; i < signal.length - 1; i++) {
//     if (
//       signal[i] > signal[i - 1] &&
//       signal[i] > signal[i + 1] &&
//       signal[i] > threshold
//     ) {
//       peaks.push(i);
//     }
//   }
//   return peaks;
// }

// // Real-time frame processing
// function computeFrame() {
//   requestAnimationFrame(() => {
//     ctx_tmp.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
//     let frame = ctx_tmp.getImageData(0, 0, video.videoWidth, video.videoHeight);

//     const count = frame.data.length / 4;
//     let rgbRed = 0;
//     for (let i = 0; i < count; i++) {
//       rgbRed += frame.data[i * 4];
//     }

//     xMean = 1 - rgbRed / (count * 255);
//     acdc[nFrame % WINDOW_LENGTH] = xMean;

//     if (nFrame % WINDOW_LENGTH === 0) {
//       // Detrend the signal
//       const ac = detrend(acdc);

//       // Detect peaks to count heartbeats
//       const peaks = detectPeaks(ac, PEAK_THRESHOLD);
//       const currentTime = new Date();
//       if (peaks.length > 0) {
//         if (lastBeatTime === null || currentTime - lastBeatTime > 600) {
//           // At least 600ms between beats
//           heartBeats++;
//           lastBeatTime = currentTime;
//           document.getElementById(
//             "heart-beats"
//           ).innerHTML = `Heart Beats Counted: ${heartBeats}`;
//         }
//       }
//     }

//     document.getElementById("signal").innerHTML = `X: ${xMean.toFixed(2)}`;
//     nFrame++;
//     computeFrame(); // Continuously call for real-time processing
//   });
// }

// function onRecord() {
//   this.disabled = true;
//   navigator.mediaDevices
//     .getUserMedia(constraintsObj)
//     .then((mediaStreamObj) => {
//       video = document.getElementById("video");
//       video.srcObject = mediaStreamObj;

//       video.onloadedmetadata = function (ev) {
//         video.play();
//         init();
//         video.addEventListener("play", computeFrame);
//       };

//       // Hide the video element to not display the feed
//       video.style.display = "none";
//     })
//     .catch((error) => {
//       console.error("Error accessing media devices.", error);
//     });
// }

// // Real-Time Line Chart Code
// function realTimeLineChart() {
//   var margin = { top: 20, right: 20, bottom: 50, left: 50 },
//     width = 600,
//     height = 400,
//     duration = 500,
//     color = ["#006400", "#4682b4", "#dc143c"];

//   function chart(selection) {
//     selection.each(function (data) {
//       data = ["x"].map(function (c) {
//         return {
//           label: c,
//           values: data.map(function (d) {
//             return { time: +d.time, value: d[c], signal: +d.signal };
//           }),
//         };
//       });

//       var t = d3.transition().duration(duration).ease(d3.easeLinear),
//         x = d3.scaleTime().rangeRound([0, width - margin.left - margin.right]),
//         y = d3
//           .scaleLinear()
//           .rangeRound([height - margin.top - margin.bottom, 0]),
//         z = d3.scaleOrdinal(color);

//       var xMin = d3.min(data, function (c) {
//         return d3.min(c.values, function (d) {
//           return d.time;
//         });
//       });
//       var xMax = new Date(
//         new Date(
//           d3.max(data, function (c) {
//             return d3.max(c.values, function (d) {
//               return d.time;
//             });
//           })
//         ).getTime() -
//           duration * 2
//       );

//       x.domain([xMin, xMax]);
//       y.domain([
//         d3.min(data, function (c) {
//           return d3.min(c.values, function (d) {
//             return d.value;
//           });
//         }),
//         d3.max(data, function (c) {
//           return d3.max(c.values, function (d) {
//             return d.value;
//           });
//         }),
//       ]);
//       z.domain(
//         data.map(function (c) {
//           return c.label;
//         })
//       );

//       var line = d3
//         .line()
//         .curve(d3.curveBasis)
//         .x(function (d) {
//           return x(d.time);
//         })
//         .y(function (d) {
//           return y(d.value);
//         });

//       var svg = d3.select(this).selectAll("svg").data([data]);
//       var gEnter = svg.enter().append("svg").append("g");
//       gEnter.append("g").attr("class", "axis x");
//       gEnter.append("g").attr("class", "axis y");
//       gEnter
//         .append("defs")
//         .append("clipPath")
//         .attr("id", "clip")
//         .append("rect")
//         .attr("width", width - margin.left - margin.right)
//         .attr("height", height - margin.top - margin.bottom);
//       gEnter
//         .append("g")
//         .attr("class", "lines")
//         .attr("clip-path", "url(#clip)")
//         .selectAll(".data")
//         .data(data)
//         .enter()
//         .append("path")
//         .attr("class", "data");

//       var svg = selection.select("svg");
//       svg.attr("width", width).attr("height", height);
//       var g = svg
//         .select("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//       g.select("defs clipPath rect")
//         .transition(t)
//         .attr("width", width - margin.left - margin.right)
//         .attr("height", height - margin.top - margin.right);

//       g.selectAll("g path.data")
//         .data(data)
//         .style("stroke", color[1])
//         .style("stroke-width", 3)
//         .style("fill", "none")
//         .transition()
//         .duration(duration)
//         .ease(d3.easeLinear)
//         .on("start", tick);

//       function tick() {
//         d3.select(this)
//           .attr("d", function (d) {
//             return line(d.values);
//           })
//           .attr("transform", null);

//         var xMinLess = new Date(new Date(xMin).getTime() - duration);
//         d3.active(this)
//           .attr("transform", "translate(" + x(xMinLess) + ",0)")
//           .transition()
//           .on("start", tick);
//       }
//     });
//   }

//   chart.margin = function (_) {
//     if (!arguments.length) return margin;
//     margin = _;
//     return chart;
//   };

//   chart.width = function (_) {
//     if (!arguments.length) return width;
//     width = _;
//     return chart;
//   };

//   chart.height = function (_) {
//     if (!arguments.length) return height;
//     height = _;
//     return chart;
//   };

//   chart.color = function (_) {
//     if (!arguments.length) return color;
//     color = _;
//     return chart;
//   };

//   chart.duration = function (_) {
//     if (!arguments.length) return duration;
//     duration = _;
//     return chart;
//   };

//   return chart;
// }
