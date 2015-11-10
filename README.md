[![Stories in Ready](https://badge.waffle.io/Johnhhorton/queued-up.svg?label=ready&title=Ready)](http://waffle.io/Johnhhorton/queued-up)

# queued-up
Simple asynchronous task queuing system.

Pardon my dust. Currently working on it.

## Install

`npm install queued-up`

## Usage

### Input

The queued-up object returns a new instance of a queue.  The primary input is the action function.
This function, defined by you, will operate on each item in the queue.  When the function is
considered complete.  Simply call this.done() within the function. Data may also be sent back to
the queue for later retrieval by passing it into the done() function. See examples below.

### Methods

* .queue()       - Seturns the queue array
* .queue(\[,...\]) - Sets queue array to the input
* .add(input)    - Adds the input to the end of the queue array
* .remove(number)- removes the queue item at the given index
* .index         - returns the current iteration point of the queue
* .index(number) - sets the index manually
* .next()        - processes the next item in the queue.
* .reset()       - sets the index to 0
* .run()         - begins processing queue
* .run(index)    - begins processing queue at given index
* .pause()       - pauses the queue run after current task complete.
* .resume()      - resumes the queue run. Do not call this in the 'paused' event!


### Events

* 'complete' - Entire queue run has completed. Returns array of results
* 'paused'   - Queue run has been paused
* 'resumed'  - Queue run has been resumed
* 'taskdone' - A task has been completed.  Returns {index: 0, data: thedata}.  Not required to pull data from here.

## Examples

```javascript
var qup = require('./queued-up');

//This funtion will receive each queued item.
function action(queueItem) {
	var _self = this; //maintain a reference to 'this'
	
	//This will show the progress through the queue.
	console.log(_self.index());
	
	//perform a simulated async call
	setTimeout(function(){
		//This line passes the queue item straight into the results array.
		//_self.done() notifies queued-up that this is complete.
		_self.done(queueItem);
	}, 1000);
};

//q will be our queue instance.
var q = qup({action: action});

//adding an array of string objects to the queue.
q.add(["obj 0", "obj 1", "obj 2", "obj 3", "obj 4", "obj 5", "obj 6"]);

//Event called when the queue run has finished.
q.on('complete', function (data) {
	console.log("complete data:  " + data);
});

//start the queue processing.
q.run();

```



