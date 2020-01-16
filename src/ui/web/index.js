const React = require("react")
const ReactDOM = require("react-dom")
const App = require("./App")

const config = Object.freeze({
  appContainer: document.getElementById("app"),
  workerUrl: "./worker.js",
})

const worker = new Worker(config.workerUrl);

ReactDOM.render(<App worker={worker} />, config.appContainer)
