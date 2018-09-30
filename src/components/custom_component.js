/* exported CustomComponent */
class CustomComponent extends HTMLElement {
	static get observedAttributes() {
		return [];
	}

	constructor() {
		super();

		const style = document.createElement('style');
		style.textContent = `{{> custom_component.template.css }}`;

		const wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'wrapper'	);

		const header = document.createElement('header');
		wrapper.appendChild(header);

		const slot_header = document.createElement('slot');
		slot_header.setAttribute('name', 'header');
		header.appendChild(slot_header);

		const slot_body = document.createElement('slot');
		slot_body.appendChild(document.createTextNode('PLACEHOLDER'));
		wrapper.appendChild(slot_body);

		var shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(style);
		shadow.appendChild(wrapper);
	}

	// WEB COMPONENT LIFE CYCLE

	connectedCallback() { }

	disconnectedCallback() { }

	adoptedCallback() { }

	attributeChangedCallback() { }
}

// REGISTER WEB COMPONENT
customElements.define('custom-component', CustomComponent);
