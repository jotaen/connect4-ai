const React = require("react")
const ReactDOM = require("react-dom")
const App = require("./App")

const config = Object.freeze({
  appContainer: document.getElementById("app"),
  workerUrl: "./worker.js",
})

const myWorker = new Worker(config.workerUrl);
myWorker.postMessage("Hello")
myWorker.onmessage = function(e) {
  console.log(e.data)
}

ReactDOM.render(<App/>, config.appContainer)
