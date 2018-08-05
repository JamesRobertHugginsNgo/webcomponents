/* exported eventProperties */
const eventProperties = {
	eventHandlers: {
		writable: true
	},

	off: {
		value: function(eventName, eventHandler) {
			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(' ').forEach((eventName) => {
						if (eventName && this.eventHandlers && this.eventHandlers[eventName]) {
							if (eventHandler) {
								const index = this.eventHandlers[eventName].indexOf(eventHandler);
								if (index !== -1) {
									this.eventHandlers[eventName].splice(index, 1);
								}
								if (this.eventHandlers[eventName].length === 0) {
									delete this.eventHandlers[eventName];
								}
							} else {
								delete this.eventHandlers[eventName];
							}
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach((args) => {
						this.off(...args);
					});
				}
			}
		}
	},

	on: {
		value: function(eventName, eventHandler) {
			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(/\s+/).forEach((eventName) => {
						if (eventHandler) {
							if (!this.eventHandlers) {
								this.eventHandlers = {};
							}
							if (!this.eventHandlers[eventName]) {
								this.eventHandlers[eventName] = [];
							}
							this.eventHandlers[eventName].push(eventHandler);
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach((args) => {
						this.on(...args);
					});
				}
			}
		}
	},

	trigger: {
		value: function(eventName, ...args) {
			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(/\s+/).forEach((eventName) => {
						if (this.eventHandlers && this.eventHandlers[eventName]) {
							this.eventHandlers[eventName].forEach((eventHandler) => {
								eventHandler.call(this, ...args);
							});
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach((args) => {
						this.trigger(...args);
					});
				}
			}
		}
	}
};
