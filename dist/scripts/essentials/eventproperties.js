'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* exported eventProperties */
var eventProperties = {
	eventHandlers: {
		writable: true
	},

	off: {
		value: function value(eventName, eventHandler) {
			var _this = this;

			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(' ').forEach(function (eventName) {
						if (eventName && _this.eventHandlers && _this.eventHandlers[eventName]) {
							if (eventHandler) {
								if (!Array.isArray(eventHandler)) {
									eventHandler = [eventHandler];
								}

								eventHandler.forEach(function (eventHandler) {
									var index = _this.eventHandlers[eventName].indexOf(eventHandler);
									if (index !== -1) {
										_this.eventHandlers[eventName].splice(index, 1);
									}
									if (_this.eventHandlers[eventName].length === 0) {
										delete _this.eventHandlers[eventName];
									}
								});
							} else {
								delete _this.eventHandlers[eventName];
							}
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach(function (args) {
						_this.off.apply(_this, _toConsumableArray(args));
					});
				}
			}

			return this;
		}
	},

	on: {
		value: function value(eventName, eventHandler) {
			var _this2 = this;

			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(' ').forEach(function (eventName) {
						if (eventName && eventHandler) {
							if (!Array.isArray(eventHandler)) {
								eventHandler = [eventHandler];
							}
							eventHandler.forEach(function (eventHandler) {
								if (!_this2.eventHandlers) {
									_this2.eventHandlers = {};
								}
								if (!_this2.eventHandlers[eventName]) {
									_this2.eventHandlers[eventName] = [];
								}
								_this2.eventHandlers[eventName].push(eventHandler);
							});
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach(function (args) {
						_this2.on.apply(_this2, _toConsumableArray(args));
					});
				}
			}

			return this;
		}
	},

	trigger: {
		value: function value(eventName) {
			var _this3 = this;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (eventName) {
				if (typeof eventName === 'string') {
					eventName.split(' ').forEach(function (eventName) {
						if (eventName && _this3.eventHandlers && _this3.eventHandlers[eventName]) {
							_this3.eventHandlers[eventName].forEach(function (eventHandler) {
								eventHandler.call.apply(eventHandler, [_this3].concat(args));
							});
						}
					});
				} else if (Array.isArray(eventName)) {
					eventName.forEach(function (args) {
						_this3.trigger.apply(_this3, _toConsumableArray(args));
					});
				}
			}

			return this;
		}
	}
};