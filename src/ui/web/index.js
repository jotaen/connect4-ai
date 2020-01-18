const React = require("react")
const ReactDOM = require("react-dom")
const App = require("./App")

const config = Object.freeze({
  appContainer: document.getElementById("app"),
  workerUrl: "./worker.js",
})

fetch(config.workerUrl)
  .then(res => res.blob())
  .then(blob => {
    const createWorker = () => new Worker(window.URL.createObjectURL(blob))
    ReactDOM.render(<App createWorker={createWorker} />, config.appContainer)
  })
