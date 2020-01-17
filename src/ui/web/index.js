const React = require("react")
const ReactDOM = require("react-dom")
const App = require("./App")

const config = Object.freeze({
  appContainer: document.getElementById("app"),
  workerUrl: "./worker.js",
})

ReactDOM.render(<App workerUrl={config.workerUrl} />, config.appContainer)
