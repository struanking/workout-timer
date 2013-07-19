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
			this.type = type;
			this.node = document.createElement('fieldset');
			this.node.dataset.js = type + '-collection-list';
		},

		add: function (obj) {
			var collection = this.collection;
			obj.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
			this.collection.push(obj);
			amplify.publish('workout-collection-updated');
		},

		delete: function (id) {
			var index = this.collection.findByProperty('id', +id);
			console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', this.collection);
			this.collection.splice(index, 1);
			amplify.publish(this.type + '-collection-updated');
		},

		render: function () {
			// This needs to be a template render
			console.time('render template in app');
			var collection = this.collection,
				obj,
				html = '',
				max = collection.length;
			
			console.log('collection', this.collection);
			
			if (max > 0) {
				html = '<ul>';
				for (var i = 0; i < max; i += 1) {
					obj = collection[i];
					html += '<li><a href="#" data-js="' + this.type + '-detail" data-id="' + obj.get('id') + '">' + obj.get('name') + '</a></li>';
				}
				html += '</ul>';
			} else {
				html = '<p>No workouts</p>';
			}

			this.node.innerHTML = html;
			console.timeEnd('render template in app');

			console.time('render template');
			var testData = this.collection;

			dust.render("wrk-templates", testData, function(err, out) {
				var elem = document.createElement('div');
				elem.innerHTML = out;
				document.querySelector('body').appendChild(elem);
			});
			console.timeEnd('render template');

			return true;
		},

		refresh: function () {
			var container = document.querySelector('[data-js="' + this.type + '-collection"]');
			this.render();
			if (container) {
				container.appendChild(this.node);
			}
		}
	};

	function create () {
		// Create and return a new Library object
		return Object.create(Library);
	}

	return {
		create: create
	};

}());