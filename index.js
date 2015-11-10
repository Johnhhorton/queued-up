var events = require('events');

var Queue = function (inputOptions) {

	var Queue = function () {
		var self = this,
			_runAll = false,
		    _options = inputOptions,
		    _queue = [],
		    _runResults = [],
		    _index = 0;

		self.action = _options.action;
		
		self.action.prototype.pause = self.pause;
		self.action.prototype.index = self.index;
		self.action.prototype.done = self.done;
		
		self.queue = function(input){
			
			if(Array.isArray(input)){
			_queue = input;
			}
			return _queue;
		};
		
		self.index = function (inputIndex) {
			if (typeof (inputIndex) === "number") {
				_index = inputIndex;
			}
			return _index;
		};
		
		self.done = function(data){
			self.emit('taskdone', {index : this.index(),
			taskData: data});
		};
		
		self.on('taskdone', function(data){
			_index++;
			
			_runResults[data.index] = data.taskData;
			
			if(_index >= _queue.length){
				_runAll = false;
				_index = 0;
				self.runComplete();
			}
			if(_runAll === true) self.next();
		});
		
		//add item to the queue
		self.add = function (input) {
			_queue = _queue.concat(input);
			return _queue;
		};
		
		self.remove = function(input){
			_queue.splice(input, 1);
			return _queue;
		}
		
		//perform the next iteration in the _queue
		self.next = function () {
			self.action(_queue[_index]);
		};

		self.reset = function () {
			_index = 0;
		};

		self.run = function (startIndex) {
			_index = 0;
			_runAll = true;
			self.next();
		};

		self.pause = function () {
			_runAll = false;
			self.emit('paused', _runResults);
		};

		self.resume = function () {
			console.log("resume called");
			self.emit('resumed');
			_runAll = true;
			self.next();
		};

		self.runComplete = function () {
			self.emit('complete', _runResults);
		};

	};
	Queue.prototype = new events.EventEmitter;
	return new Queue();
}

module.exports = Queue;