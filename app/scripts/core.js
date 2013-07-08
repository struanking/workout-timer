var WRK = WRK || {},
	doc = document;

/*
 * Workouts
 */

amplify.subscribe('workout-new', function () {
    doc.querySelector('#workout-name').focus(); // Activate workout name field
});

amplify.subscribe('workout-create', function (name) {
	// Activate workout config
    doc.querySelector('[data-js="workout-config"]').focus();
    doc.querySelector('[data-js="workout-config"]').style.borderColor = '#C00';
    doc.querySelector('[data-js="workout-config"] #workout-name').value = name;
});

amplify.subscribe('workout-collection-updated', function () {
    WRK.library.refresh();
});

/*
 * Exercises
 */
amplify.subscribe('exercise-new', function (name) {
	// Activate exercise config
    doc.querySelector('[data-js="exercise-config"]').focus();
    doc.querySelector('[data-js="exercise-config"]').style.borderColor = '#C00';

    var //select = doc.documentFragment('exercise-name'),
    	titles = WRK.exercise.titles,
    	html = '';

    for (var key in titles) {
    	html += '<option value="' + key + '">' + titles[key] + '</select>';
    }

    doc.querySelector('#exercise-name').innerHTML = html;
});

// Exercise: collection updated
amplify.subscribe('exercise-collection-updated', function () {
	WRK.exercise.detail();
	WRK.exercise.library.refresh();
});
// End exercises

WRK.util.addListener(window, 'click', function(ev) {
	//console.log('Window click heard');
	var elem = ev.target,
		eventType = elem.getAttribute('data-js');

	if (eventType) {
		ev.preventDefault();
	}

	switch (eventType) {
	case 'workout-new':
		amplify.publish(eventType);
		break;
	case 'workout-create':
		var name = doc.querySelector('#workout-name').value;
		console.log('wrk name = ' + name);
		amplify.publish(eventType, name);
		break;
	case 'workout-add-ready':
		WRK.workout.create();
		break;
	case 'exercise-new':
		amplify.publish(eventType);
		break;
	case 'exercise-add-ready':
		WRK.exercise.create();
		break;
	case 'exercise-update-ready':
		var id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		WRK.exercise.update(id);
		break;
	case 'exercise-delete':
		var id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		WRK.exercise.library.delete(id);
		break;
	case 'exercise-detail':
		WRK.exercise.detail(elem.getAttribute('data-id'));
		break;
	}
});

WRK.main = (function () {
	function Library(type) {
        this.collection = [];
        this.type = type || '';
        this.node = document.createElement('fieldset');
        this.node.dataset.js = 'workout-collection-list';
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
        amplify.publish('workout-collection-updated');
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
                html += '<li><a href="#" data-js="workout-detail" data-id="' + obj.get('id') + '">' + obj.get('name') + '</a></li>';
            }
            html += '</ul>';
        } else {
            html = '<p>No workouts</p>';
        }

        this.node.innerHTML = html;
        return true;
    }

    Library.prototype.refresh = function () {
        var container = document.querySelector('[data-js="workout-collection"]');
		//container = document.querySelector('[data-js="exercise-collection-list"]'),
        this.render();
        //container.innerHTML = html;
        container.appendChild(this.node);
    }

    function createLibrary () {
        //this.library = new Library();
        //this.create(true);
        //this.library.refresh();
        WRK.library = new Library();
    }

    return {
    	createLibrary: createLibrary 
    }
}());

WRK.main.createLibrary('Workout');