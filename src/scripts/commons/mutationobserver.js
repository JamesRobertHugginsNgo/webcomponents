/* global eventProperties */

/* exported mutationObserver */
const mutationObserver = new MutationObserver((mutationsList) => {
	if (!window.hasOwnProperty('trigger') && eventProperties) {
		Object.defineProperties(window, eventProperties);
	}

	if (window.hasOwnProperty('trigger')) {
		mutationsList.forEach((mutationRecord) => {
			var targetNode = mutationRecord.target;
			if (mutationRecord.type === 'childList') {
				mutationRecord.addedNodes.forEach(((node) => {
					window.trigger([
						[[
							'nodeadded',
							`nodeadded:${node.nodeName.toUpperCase()}`
						].join(' '), node],
						[[
							'childnodeadded',
							`childnodeadded:${targetNode.nodeName.toUpperCase()}`,
							`childnodeadded:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
						].join(' '), targetNode, node]
					]);

					if (node.nodeType === Node.ELEMENT_NODE) {
						window.trigger([
							[[
								'elementadded',
								`elementadded:${node.nodeName.toUpperCase()}`
							].join(' '), node],
							[[
								'childelementadded',
								`childelementadded:${targetNode.nodeName.toUpperCase()}`,
								`childelementadded:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
							].join(' '), targetNode, node]
						]);
					}
				}));

				mutationRecord.removedNodes.forEach(((node) => {
					window.trigger([
						[[
							'noderemoved',
							`noderemoved:${node.nodeName.toUpperCase()}`
						].join(' '), node],
						[[
							'childnoderemoved',
							`childnoderemoved:${targetNode.nodeName.toUpperCase()}`,
							`childnoderemoved:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
						].join(' '), targetNode, node]
					]);

					if (node.nodeType === Node.ELEMENT_NODE) {
						window.trigger([
							[[
								'elementremoved',
								`elementremoved:${node.nodeName.toUpperCase()}`
							].join(' '), node],
							[[
								'childelementremoved',
								`childelementremoved:${targetNode.nodeName.toUpperCase()}`,
								`childelementremoved:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
							].join(' '), targetNode, node]
						]);
					}
				}));
			} else if (mutationRecord.type === 'attributes') {
				window.trigger([
					'nodeattributechange',
					`nodeattributechange:*:${mutationRecord.attributeName}`,
					`nodeattributechange:${targetNode.nodeName.toUpperCase()}`,
					`nodeattributechange:${targetNode.nodeName.toUpperCase()}:${mutationRecord.attributeName}`
				].join(' '), targetNode, mutationRecord.attributeName);

				if (targetNode.nodeType === Node.ELEMENT_NODE) {
					window.trigger([
						'elementattributechange',
						`elementattributechange:*:${mutationRecord.attributeName}`,
						`elementattributechange:${targetNode.nodeName.toUpperCase()}`,
						`elementattributechange:${targetNode.nodeName.toUpperCase()}:${mutationRecord.attributeName}`
					].join(' '), targetNode, mutationRecord.attributeName);
				}
			}
		});
	}
});

mutationObserver.observe(document.body, {
	attributes: true,
	childList: true,
	subtree: true
});

document.createElement = ((createElement) => {
	return function(tagName, options) {
		const element = createElement.call(this, tagName, options);
		window.trigger([
			'elementcreated',
			`elementcreated:${element.nodeName.toUpperCase()}`
		].join(' '), element);
		const isAttribute = element.getAttribute('is');
		if (isAttribute != null && isAttribute != '') {
			window.trigger(`elementcreated:${isAttribute}`, element);
		}
		return element;
	}
})(document.createElement);
