/* global eventProperties */

(() => {
	const component = 'CUSTOM-ELEMENT';

	/////////////////////////////////////////////////////////////////////////////
	// SHARED CODE
	/////////////////////////////////////////////////////////////////////////////

	let counter = 0;

	function clickHandler(event) {
		const newElement = document.createElement(component);
		newElement.appendChild(document.createTextNode(`${component}-${counter}`));
		counter = counter + 1;

		const currentNode = event.target;
		const parentNode = currentNode.parentNode;
		const siblingNode = currentNode.nextSibling;

		if (siblingNode) {
			parentNode.insertBefore(newElement, siblingNode);
		} else {
			parentNode.appendChild(newElement);
		}
	}

	/////////////////////////////////////////////////////////////////////////////
	// ELEMENT PROPERTIES
	/////////////////////////////////////////////////////////////////////////////

	const elementProperties = {
		appendedCallback: {
			value: function() {
				console.log(`${component} APPENDED`);
			}
		},

		attributeChangeCallback: {
			value: function(attributeName) {
				console.log(`${component} ATTRIBUTE CHANGED`, attributeName);
			}
		},

		createCallback: {
			value: function() {
				console.log(`${component} CREATED`);

				this.addEventListener('click', clickHandler);
			}
		},

		component: {
			value: component
		},

		removedCallback: {
			value: function() {
				console.log('REMOVED');
			}
		},
	};

	/////////////////////////////////////////////////////////////////////////////
	// GLOBAL STYLES
	/////////////////////////////////////////////////////////////////////////////

	const style = document.head.appendChild(document.createElement('style'));
	style.appendChild(document.createTextNode('')); // WebKit hack :(

	const sheet = style.sheet;
	sheet.insertRule(`
		${component} {
			color: red;
			display: block;
		}
	`);

	/////////////////////////////////////////////////////////////////////////////
	// GLOBAL EVENT HANDLER
	/////////////////////////////////////////////////////////////////////////////

	function setup(element) {
		if (!element.hasOwnProperty('component')) {
			Object.defineProperties(element, Object.assign({}, elementProperties, eventProperties));
			element.createCallback();
		}

		return element;
	}

	window.on(`elementcreated:${component}`, (element) => setup(element));
	window.on(`elementadded:${component}`, (element) => setup(element).appendedCallback());
	window.on(`elementattributechange:${component}`, (element, attributeName) => setup(element).attributeChangeCallback(attributeName));
	window.on(`elementremoved:${component}`, (element) => setup(element).removedCallback());

	document.querySelectorAll(component).forEach((element) => {
		setup(element);
	});
})();
