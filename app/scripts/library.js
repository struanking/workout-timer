var WRK = WRK || {};

WRK.library = (function () {
	function Library(type) {
        this.collection = [];
        this.type = type || '';
        this.node = document.createElement('fieldset');
        this.node.dataset.js = this.type + '-collection-list';
    }

    Library.prototype.add = function (obj) {
        var collection = this.collection;
        obj.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.collection.push(obj);
        amplify.publish('workout-collection-updated');
    }

    Library.prototype.delete = function (id) {
        var index = this.collection.findByProperty('id', +id);
        console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', this.collection);
        this.collection.splice(index, 1);
        amplify.publish(this.type + '-collection-updated');
    }

    Library.prototype.render = function () {
        // This needs to be a template call
        var obj,
            html = '',
            max = this.collection.length;
			console.log('collection', this.collection);
        if (max > 0) {
            html = '<ul>';
            for (var i = 0; i < max; i += 1) {
                obj = this.collection[i];
                console.log('obj = ', obj);
                html += '<li><a href="#" data-js="' + this.type + '-detail" data-id="' + obj.get('id') + '">' + obj.get('name') + '</a></li>';
            }
            html += '</ul>';
        } else {
            html = '<p>No workouts</p>';
        }

        this.node.innerHTML = html;
        return true;
    }

    Library.prototype.refresh = function () {
        var container = document.querySelector('[data-js="' + this.type + '-collection"]');
        this.render();
        container && container.appendChild(this.node);
    }

    function createLibrary (type) {
        switch (type) {
        case 'exercise':
        	break;
        case 'workout':
        	WRK.workouts = new Library(type);
        	break;
        }
    }

    return {
    	createLibrary: createLibrary 
    }
}());