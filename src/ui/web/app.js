const myWorker = new Worker("./worker.js");
myWorker.postMessage("Hello")
myWorker.onmessage = function(e) {
  console.log(e.data)
}
