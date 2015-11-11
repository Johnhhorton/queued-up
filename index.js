var events = require('events');

var Queue = function (inputOptions) {
	
	if(typeof inputOptions === "function"){
		inputOptions = {action:inputOptions};
	}
	
	var Queue = function () {
		var self = this,
			_runAll = false,
			_shiftRun = false,
			_shift = false,
			_next = false,
			_paused = false,
			_pausedOn = null,
			_count = 1,
		    _options = inputOptions,
		    _queue = [],
		    _runResults = [],
		    _index = 0;
		self.options = _options;
		self.action = _options.action;
		
		self.action.prototype.pause = self.pause;
		self.action.prototype.index = self.index;
		self.action.prototype.done = self.done;
		
		self.done = function(data){
			
			if(typeof data === "undefined"){
				self.emit('taskcomplete',{index: this.index()});
			}else{
				self.emit('taskcomplete', {index : this.index(),
			taskData: data});
			}
			return data;
		};
		
		self.on('taskcomplete', function(data){
			_count--;
			if(_shift){
				
				if(typeof data.taskData !== "undefined"){
					_runResults.push(data.taskData);
					}
				if(_shiftRun){
					if(_queue.length === 0){
						_shiftRun = false;
						_shift = false;
						self.complete();
					}else{
						_count = 1;
						if(!_paused) self.shift();
					}
				}else if(!_shiftRun && !_paused){
					if(_count > 0){
						
						self.shift(_count);
					}else{
					 _shift = false
					 _count = 1;	
					}
					
				}
			}else if(_next === true){
				
				_index++;
				if(typeof data.taskData !== "undefined"){
					_runResults[data.index] = data.taskData;
				}
				
				
				if(_index >= _queue.length){
					_runAll = false;
					
					_index = 0;
					self.complete();
				}
				if(_runAll){
					_next = true;
					if(!_paused) self.next();
				}else if(!_runAll && !_paused){
					
					if(_count > 0){
						
						self.next(_count);
					}else{
					 _next = false;
					 _count = 1;	
					}
				} 
			}
		
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
		self.next = function (count) {
			if(typeof count === "number"){
				_count = count;
				_paused = false;
			}else{
				_count = 1;
				_paused = false;
			}
			_next = true;
			return self.action(_queue[_index]);
		};

		self.run = function (index) {
			if(typeof index === "number"){
				_index = index;
			}else{
			_index = 0;
			}
			_runAll = true;
			_runResults = [];
			self.next();
		};


		self.shift = function (count){
			if(typeof count === "number"){
				_count = count;
				_paused = false;
			}else{
				_count = 1;
				_paused = false;
			}
			
			_shift = true;
			return self.action(_queue.shift());
		};
		
		self.shiftRun = function(){
			_shiftRun = true;
			self.shift();
		};
		
		self.shiftResults = function(){
			return _runResults.shift();
		}
		
		self.results = function(){
			return _runResults;
		}

		self.pause = function () {
			if(_shift === true){
				_pausedOn = 'shift';
			}else if(_next === true){
				_pausedOn = 'next';
			}
			_runAll = false;
			_shiftRun = false;
			_paused = true;
			self.emit('paused', _runResults);
		};

		self.resume = function () {
			_paused = false;
			if(_shift === true || _pausedOn === 'shift'){
				self.emit('resumed');
				_shiftRun = true;
				_pausedOn = null;
				self.shiftRun();
			}else if(_next === true || _pausedOn === 'next'){
				self.emit('resumed');
				_runAll = true;
				_pausedOn = null;
				self.next();
			}
		};
		
		self.complete = function () {
			self.emit('complete', _runResults);
		};
		
		self.reset = function () {
			_index = 0;
			_queue = [];
			_runResults = [];
		};
		
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
	};
	Queue.prototype = new events.EventEmitter;
	return new Queue();
}

module.exports = Queue;