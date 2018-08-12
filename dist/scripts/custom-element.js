(() => {
	// GLOBAL STYLES
	const style = document.createElement('style');
	style.appendChild(document.createTextNode('')); // WebKit hack :(
	document.head.appendChild(style);
	style.sheet.insertRule(`
		CUSTOM-ELEMENT {
			color: red;
			display: block;
		}
	`);

	// SHARED RESOURCES
	let counter = 0;

	function clickHandler(event) {
		const newElement = document.createElement('CUSTOM-ELEMENT');
		newElement.appendChild(document.createTextNode('CUSTOM-ELEMENT-' + counter));
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

	// CREATE ELEMENT THROUGH DOCUMENT.CREATEELEMENT
	function created(element) {
		if (!element.ready) {
			element.ready = true;
			element.addEventListener('click', clickHandler);
		}
	}

	// APPEND ELEMENT
	function appended(element) {
		created(element);
	}

	// OBSERVER
	window.on('elementcreated:CUSTOM-ELEMENT', created);
	window.on('elementadded:CUSTOM-ELEMENT', appended);

	// INITIALIZE EXISTING ELEMENTS
	document.querySelectorAll('CUSTOM-ELEMENT').forEach((element) => {
		appended(element);
	});
})();
