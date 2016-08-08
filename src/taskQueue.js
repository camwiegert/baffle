/* 
	it's used to store tasks in a queue;

	add a task 
		- addTaskToQueue(fn)
	add some delay 
		- addDelayToQueue(delay)
	execute task after delay
		- addTaskWithDelay(fn, delay)
*/
class taskQueue {
	// checkDelay is in *ms*
	constructor(checkDelay = 50) {
		// bindings
		this.executeTask = this.executeTask.bind(this);
		this.isTaskQueueEmpty = this.isTaskQueueEmpty.bind(this);
		this.getTaskInQueue = this.getTaskInQueue.bind(this);
		this.addDelayToQueue = this.addDelayToQueue.bind(this);
		this.addTaskToQueue = this.addTaskToQueue.bind(this);
		// set executeTask every 'checkDelay'ms
		this.interval = setInterval(this.executeTask, checkDelay);
		// store checkDelay
		this.checkDelay = checkDelay;
		// used to store tasks;
		this.queue = [];
	}

	executeTask() {
		// if there is a delayTime 
		if (this.timeDelayTo) {
			if ((new Date()).getTime() < this.timeDelayTo) {
				return;
			}
			else {
				// current time is bigger than timeDelayTo
				// clear delay time
				this.timeDelayTo = null;
			}
		}
		// task is empty, return
		let task = this.getTaskInQueue();
		if (!task) {
			return;
		}

		// task is delay
		if (task.type === 'delay') {
			// set timeDalayTo according to current time
			this.timeDelayTo = (new Date()).getTime() + task.delayTime;
			return;
		}

		// if is task, execute it;
		if (task.type === 'task') {
			task.taskFunc();	
		}

	}

    isTaskQueueEmpty() {
        return !this.queue.length;
    }

    getTaskInQueue() {
        return this.queue.shift() || null;
    }

		clearTasksInQueue() {
			this.timeDelayTo = null;
			this.queue = [];
		}

    addDelayToQueue(delay) {
    	this.queue.push({
    		type: 'delay',
    		delayTime: delay
    	});
    	return this;
    }

    addTaskToQueue(task) {
    	this.queue.push({
    		type: 'task',
    		taskFunc: task,
    	});
    	return this;
    } 

		addTaskWithDelay(task, delay) {
			this.addDelayToQueue(delay);
			this.addTaskToQueue(task);
		}

}

/*
	let t = new taskQueue(10);
	function log() {console.log((new Date()).toString())}
	t.addTaskToQueue(log).addDelayToQueue(1000).addTaskToQueue(log).addDelayToQueue(2000).addTaskToQueue(log);
*/