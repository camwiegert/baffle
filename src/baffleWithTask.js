import baffle from './baffle';
import taskQueue from './taskQueue';
class BaffleWithTask {
	constructor(elements, options) {
		this.baffle = baffle(elements, options);
		this.task = taskQueue();	

		console.log(this.task);
		const tbaffle = this.baffle;
		const ttask = this.task;
		// bind baffle methods to *this*
		this.baffleOnce = tbaffle.once.bind(tbaffle);
		// this.await = ttask.addDelayToQueue;
		this.baffleStart = tbaffle.start.bind(tbaffle);
		this.baffleReveal = tbaffle.reveal.bind(tbaffle);
		this.baffleSet = tbaffle.set.bind(tbaffle);
		this.baffleText = tbaffle.text.bind(tbaffle);
		this.baffleStop = tbaffle.stop.bind(tbaffle);
	}

	await(delay) {
		this.task.addDelayToQueue(delay);
		return this;
	}
	once() {
		this.task.addTaskToQueue(this.baffleOnce);
		return this;
	}
	start() {
		this.task.addTaskToQueue(this.baffleStart);
		return this;
	}
	reveal(duration, delay) {
		if (delay) {
			this.task.addDelayToQueue(delay);
		}
		if (duration) {
			// the reveal function in baffle use another *setInterval*, so need to add
			// a delay in task
			this.task.addTaskToQueue(_ => this.baffleReveal(duration));
			this.task.addDelayToQueue(duration * 1.2);
		} else {
			this.task.addTaskToQueue(this.baffleReveal);
		}
		return this;
	}
	stop() {
		this.task.addTaskToQueue(this.baffleStop);
		return this;
	}
	set(options) {
		this.task.addTaskToQueue(_ => this.baffleSet(options));
		return this;
	}
	text(fn) {
		this.task.addTaskToQueue(_ => this.baffleText(fn));
		return this;
	}
}

export default (elements, options) => new BaffleWithTask(elements, options);