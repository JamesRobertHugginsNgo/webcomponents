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
					window.trigger([[[
						'nodeadded',
						`nodeadded:${node.nodeName.toUpperCase()}`
					].join(' '), node], [[
						'childnodeadded',
						`childnodeadded:${targetNode.nodeName.toUpperCase()}`,
						`childnodeadded:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
					].join(' '), targetNode, node]]);

					if (node.nodeType === Node.ELEMENT_NODE) {
						window.trigger([[[
							'elementadded',
							`elementadded:${node.nodeName.toUpperCase()}`
						].join(' '), node], [[
							'childelementadded',
							`childelementadded:${targetNode.nodeName.toUpperCase()}`,
							`childelementadded:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
						].join(' '), targetNode, node]]);

						const attributeIs = node.getAttribute('is');
						if (attributeIs != null && attributeIs != '') {
							window.trigger([[[
								`nodeadded:${attributeIs.toUpperCase()}`,
								`elementadded:${attributeIs.toUpperCase()}`
							].join(' '), node], [[
								`childnodeadded:${targetNode.nodeName.toUpperCase()}:${attributeIs.toUpperCase()}`,
								`childelementadded:${targetNode.nodeName.toUpperCase()}:${attributeIs.toUpperCase()}`
							].join(' '), targetNode, node]]);
						}

						if (targetNode.nodeType === Node.ELEMENT_NODE) {
							const targetNodeAttributeIs = targetNode.getAttribute('is');
							if (targetNodeAttributeIs != null && targetNodeAttributeIs != '') {
								window.trigger([
									`childnodeadded:${targetNodeAttributeIs.toUpperCase()}`,
									`childnodeadded:${targetNodeAttributeIs.toUpperCase()}:${node.nodeName.toUpperCase()}`,
									`childelementadded:${targetNodeAttributeIs.toUpperCase()}`,
									`childelementadded:${targetNodeAttributeIs.toUpperCase()}:${node.nodeName.toUpperCase()}`
								].join(' '), targetNode, node);

								const nodeAttributeIs = node.getAttribute('is');
								if (nodeAttributeIs != null && nodeAttributeIs != '') {
									window.trigger([
										`childnodeadded:${targetNodeAttributeIs.toUpperCase()}:${nodeAttributeIs.toUpperCase()}`,
										`childelementadded:${targetNodeAttributeIs.toUpperCase()}:${nodeAttributeIs.toUpperCase()}`
									].join(' '), targetNode, node);
								}
							}
						}
					}
				}));

				mutationRecord.removedNodes.forEach(((node) => {
					window.trigger([[[
						'noderemoved',
						`noderemoved:${node.nodeName.toUpperCase()}`
					].join(' '), node], [[
						'childnoderemoved',
						`childnoderemoved:${targetNode.nodeName.toUpperCase()}`,
						`childnoderemoved:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
					].join(' '), targetNode, node]]);

					if (node.nodeType === Node.ELEMENT_NODE) {
						window.trigger([[[
							'elementremoved',
							`elementremoved:${node.nodeName.toUpperCase()}`
						].join(' '), node], [[
							'childelementremoved',
							`childelementremoved:${targetNode.nodeName.toUpperCase()}`,
							`childelementremoved:${targetNode.nodeName.toUpperCase()}:${node.nodeName.toUpperCase()}`
						].join(' '), targetNode, node]]);

						const attributeIs = node.getAttribute('is');
						if (attributeIs != null && attributeIs != '') {
							window.trigger([[[
								`noderemoved:${attributeIs.toUpperCase()}`,
								`elementremoved:${attributeIs.toUpperCase()}`
							].join(' '), node], [[
								`childnoderemoved:${targetNode.nodeName.toUpperCase()}:${attributeIs.toUpperCase()}`,
								`childelementremoved:${targetNode.nodeName.toUpperCase()}:${attributeIs.toUpperCase()}`
							].join(' '), targetNode, node]]);
						}

						if (targetNode.nodeType === Node.ELEMENT_NODE) {
							const targetNodeAttributeIs = targetNode.getAttribute('is');
							if (targetNodeAttributeIs != null && targetNodeAttributeIs != '') {
								window.trigger([
									`childnoderemoved:${targetNodeAttributeIs.toUpperCase()}`,
									`childnoderemoved:${targetNodeAttributeIs.toUpperCase()}:${node.nodeName.toUpperCase()}`,
									`childelementremoved:${targetNodeAttributeIs.toUpperCase()}`,
									`childelementremoved:${targetNodeAttributeIs.toUpperCase()}:${node.nodeName.toUpperCase()}`
								].join(' '), targetNode, node);

								const nodeAttributeIs = node.getAttribute('is');
								if (nodeAttributeIs != null && nodeAttributeIs != '') {
									window.trigger([
										`childnoderemoved:${targetNodeAttributeIs.toUpperCase()}:${nodeAttributeIs.toUpperCase()}`,
										`childelementremoved:${targetNodeAttributeIs.toUpperCase()}:${nodeAttributeIs.toUpperCase()}`
									].join(' '), targetNode, node);
								}
							}
						}
					}
				}));
			} else if (mutationRecord.type === 'attributes') {
				window.trigger([
					'nodeattributechange',
					`nodeattributechange:${targetNode.nodeName.toUpperCase()}`,
					`nodeattributechange:${targetNode.nodeName.toUpperCase()}:${mutationRecord.attributeName}`
				].join(' '), targetNode, mutationRecord.attributeName);

				if (targetNode.nodeType === Node.ELEMENT_NODE) {
					window.trigger([
						'elementattributechange',
						`elementattributechange:${targetNode.nodeName.toUpperCase()}`,
						`elementattributechange:${targetNode.nodeName.toUpperCase()}:${mutationRecord.attributeName}`
					].join(' '), targetNode, mutationRecord.attributeName);

					const attributeIs = targetNode.getAttribute('is');
					if (attributeIs != null && attributeIs != '') {
						window.trigger([[[
							`nodeattributechange:${attributeIs.toUpperCase()}`,
							`nodeattributechange:${attributeIs.toUpperCase()}:${mutationRecord.attributeName}`,
							`elementattributechange:${attributeIs.toUpperCase()}`,
							`elementattributechange:${attributeIs.toUpperCase()}:${mutationRecord.attributeName}`
						].join(' '), targetNode, mutationRecord.attributeName]]);
					}
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

		const attributeIs = element.getAttribute('is');
		if (attributeIs != null && attributeIs != '') {
			window.trigger(`elementcreated:${attributeIs.toUpperCase()}`, element);
		}

		return element;
	}
})(document.createElement);
