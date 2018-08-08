'use strict';

(function () {
	// GLOBAL STYLES
	var style = document.createElement('style');
	style.appendChild(document.createTextNode('')); // WebKit hack :(
	document.head.appendChild(style);
	style.sheet.insertRule('\n\t\tCUSTOM-ELEMENT {\n\t\t\tcolor: red;\n\t\t\tdisplay: block;\n\t\t}\n\t');

	// SHARED RESOURCES
	var counter = 0;

	function clickHandler(event) {
		var newElement = document.createElement('CUSTOM-ELEMENT');
		newElement.appendChild(document.createTextNode('CUSTOM-ELEMENT-' + counter));
		counter = counter + 1;

		var currentNode = event.target;
		var parentNode = currentNode.parentNode;
		var siblingNode = currentNode.nextSibling;

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
	document.querySelectorAll('CUSTOM-ELEMENT').forEach(function (element) {
		appended(element);
	});
})();