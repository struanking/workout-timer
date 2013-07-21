/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
	amplify: true, dust: true, console: true
*/

var WRK = WRK || {};

WRK.library = (function () {
	'use strict';

	var Library = {
		collection: [],

		init: function (type) {
			console.log('init ' + type);
			this.collection = [];
			this.type = type;
			this.node = document.createElement('fieldset');
			this.node.dataset.js = type + '-collection-list';
			return this;
		},

		add: function (obj) {
			var collection = this.collection;
			// Create a function in utility for this calculation
			obj.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
			this.collection.push(obj);
			amplify.publish(this.type + '-collection-updated');
		},

		delete: function (id) {
			var index = this.collection.findByProperty('id', +id);
			console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', this.collection);
			this.collection.splice(index, 1);
			amplify.publish(this.type + '-collection-updated');
		},

		render: function () {
			var node = this.node;
			dust.render("wrk-templates", this, function(err, output) {
				node.innerHTML = output;
			});

			return true;
		},

		refresh: function () {
			var container = document.querySelector('[data-js="' + this.type + '-collection"]');
			if (container) {
				this.render();
				container.appendChild(this.node);
			}
		}
	};

	function create (type) {
		// Create and return a new Library object
		return Object.create(Library).init(type);
	}

	return {
		create: create
	};

}());