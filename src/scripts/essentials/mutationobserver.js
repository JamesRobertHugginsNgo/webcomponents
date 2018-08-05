/* global eventProperties */

/* exported mutationObserver */
const mutationObserver = new MutationObserver((mutationsList) => {
	if (!window.hasOwnProperty('trigger')) {
		Object.defineProperties(window, eventProperties);
	}

	window.trigger('domchanges', mutationsList);

	mutationsList.forEach((mutationRecord) => {
		window.trigger([
			['domchange', mutationRecord, mutationsList],
			[`domchange:${mutationRecord.type}`, mutationRecord, mutationsList]
		]);

		if (mutationRecord.type === 'childList') {
			mutationRecord.addedNodes.forEach(((node) => {
				window.trigger(`domchange:childList:addNode`, node, mutationRecord, mutationsList);

				if (node.nodeType === Node.ELEMENT_NODE) {
					window.trigger([
						[`domchange:childList:addElement`, node, mutationRecord, mutationsList],
						[`domchange:childList:addElement:${node.tagName}`, node, mutationRecord, mutationsList]
					]);
				}
			}));

			mutationRecord.removedNodes.forEach(((node) => {
				window.trigger(`domchange:childList:removedNode`, node, mutationRecord, mutationsList);

				if (node.nodeType === Node.ELEMENT_NODE) {
					window.trigger([
						[`domchange:childList:removedElement`, node, mutationRecord, mutationsList],
						[`domchange:childList:removedElement:${node.tagName}`, node, mutationRecord, mutationsList]
					]);
				}
			}));
		} else if (mutationRecord.type === 'attributes') {
			// TO DO
		}
	});
});

mutationObserver.observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true
});
