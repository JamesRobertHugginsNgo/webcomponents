/* global eventProperties */

(() => {
	const component = 'CUSTOM-ELEMENT';

	/////////////////////////////////////////////////////////////////////////////
	// SHARED CODE
	/////////////////////////////////////////////////////////////////////////////

	let counter = 0;

	function clickHandler(event) {
		const newElement = document.createElement(this.nodeName);

		const attributeIs = this.getAttribute('is');
		if (attributeIs) {
			newElement.setAttribute('is', attributeIs);
		}

		setup(newElement);

		newElement.appendChild(document.createTextNode(`${component.toUpperCase()}-${counter}`));
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

	function setup(element) {
		if (!element.hasOwnProperty('component')) {
			Object.defineProperties(element, Object.assign({}, elementProperties, eventProperties));
			element.createCallback();
		}

		return element;
	}

	/////////////////////////////////////////////////////////////////////////////
	// ELEMENT PROPERTIES
	/////////////////////////////////////////////////////////////////////////////

	const elementProperties = {
		appendedCallback: {
			value: function() {
				console.log(`${component.toUpperCase()} APPENDED`);
			}
		},

		attributeChangeCallback: {
			value: function(attributeName) {
				console.log(`${component.toUpperCase()} ATTRIBUTE CHANGED`, attributeName);
			}
		},

		createCallback: {
			value: function() {
				console.log(`${component.toUpperCase()} CREATED`);

				this.addEventListener('click', clickHandler);
			}
		},

		component: {
			value: component.toUpperCase()
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
		${component},
		[is="${component.toUpperCase()}" i] {
			color: red;
			display: block;
		}
	`);

	/////////////////////////////////////////////////////////////////////////////
	// GLOBAL EVENT HANDLER
	/////////////////////////////////////////////////////////////////////////////

	window.on(`elementcreated:${component.toUpperCase()}`, (element) => setup(element));
	window.on(`elementadded:${component.toUpperCase()}`, (element) => setup(element).appendedCallback());
	window.on(`elementattributechange:${component.toUpperCase()}`, (element, attributeName) => setup(element).attributeChangeCallback(attributeName));
	window.on(`elementremoved:${component.toUpperCase()}`, (element) => setup(element).removedCallback());

	document.querySelectorAll([
		`${component.toUpperCase()}`,
		`[is="${component.toUpperCase()}" i]`,
		`[is="${component.toUpperCase()}"]`
	].join(',')).forEach((element) => {
		setup(element);
	});
})();
