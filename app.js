var qup = require('./index');

// function action(data) {
// 	var _self = this;
	
// 	console.log(_self.index());
// 	setTimeout(function(){
// 		_self.done(_self.queue()[_self.index()]);
// 	}, 1000);

// };

// var q = qup({action: action});

// q.add(["obj 0", "obj 1", "obj 2", "obj 3", "obj 4", "obj 5", "obj 6"]);

// q.on('paused', function (data) {
// 	console.log("paused:" + data);
	
// });

// q.on('complete', function (data) {
// 	console.log("complete data:  " + data);
// });

// q.run();


// setTimeout(function(){
// 	q.pause()
// }, 2500);
// setTimeout(function(){
// 	q.resume()
// }, 5000);

//This funtion will receive each queued item.
function action(queueItem) {
	var _self = this; //maintain a reference to 'this'
	
	console.log(_self.index());
	
	//perform a simulated async call
	setTimeout(function(){
		//This line passes the queue item straight into the results array.
		//_self.done() notifies queued-up that this is complete.
		_self.done(queueItem);
	}, 1000);
};

var q = qup({action: action});

q.add(["obj 0", "obj 1", "obj 2", "obj 3", "obj 4", "obj 5", "obj 6"]);

q.on('complete', function (data) {
	console.log("complete data:  " + data);
});

q.run();
