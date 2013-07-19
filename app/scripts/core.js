/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
	amplify: true, console: true
*/

var WRK = WRK || {},
	doc = document;

/*
 * Workout subscriptions
 */

amplify.subscribe('workout-new', function () {
	'use strict';
	doc.querySelector('#workout-name').focus(); // Activate workout name field
});

amplify.subscribe('workout-create', function (name) {
	'use strict';
	// Activate workout config
	doc.querySelector('[data-js="workout-config"]').focus();
	doc.querySelector('[data-js="workout-config"]').style.borderColor = '#C00';
	doc.querySelector('[data-js="workout-config"] #workout-name').value = name;
});

amplify.subscribe('workout-collection-updated', function () {
	'use strict';
	WRK.workouts.refresh();
});

amplify.subscribe('workout-exercises-updated', function () {
	'use strict';
	console.log('Heard workout-exercises-updated');
	// refresh workout
});

/*
 * Exercise subscriptions
 */
amplify.subscribe('exercise-new', function (parentId) {
	'use strict';

	// Activate exercise config
	var exConfig = doc.querySelector('[data-js="exercise-config"]');

	exConfig.dataset.parentId = parentId;
	exConfig.focus();
	exConfig.style.borderColor = '#C00';

	var //select = doc.documentFragment('exercise-name'),
		titles = WRK.exercise.titles,
		html = '';

	for (var key in titles) {
		if (titles.hasOwnProperty(key)) {
			html += '<option value="' + key + '">' + titles[key] + '</select>';
		}
	}

	doc.querySelector('#exercise-name').innerHTML = html;
});

// Exercise: collection updated
amplify.subscribe('exercise-collection-updated', function () {
	'use strict';
	WRK.exercise.detail();
	WRK.exercise.library.refresh();
});
// End exercise subscriptions

/*
 * Window event listeners and handlers
 */
WRK.util.addListener(window, 'click', function(ev) {
	'use strict';

	//console.log('Window click heard');
	var elem = ev.target,
		eventType = elem.getAttribute('data-js'),
		id,
		name,
		parentId;

	if (eventType) {
		ev.preventDefault();
	}

	switch (eventType) {
	case 'workout-detail':
		WRK.workout.detail(elem.getAttribute('data-id'));
		break;
	case 'workout-new':
		amplify.publish(eventType);
		break;
	case 'workout-create':
		name = doc.querySelector('#workout-name').value;
		amplify.publish(eventType, name);
		break;
	case 'workout-add-ready':
		WRK.workout.create();
		break;
	case 'workout-update-ready':
		id = doc.querySelector('[data-js="workout-config"]').dataset.id; // or, use getId on object
		WRK.workout.update(id);
		amplify.publish('workout-collection-updated'); // may only need to update if name changed
		break;
	case 'exercise-new':
		parentId = doc.querySelector('[data-js="workout-config"]').dataset.id; // or, use getId on object
		amplify.publish(eventType, parentId);
		break;
	case 'exercise-add-ready':
		WRK.exercise.create();
		break;
	case 'exercise-update-ready':
		id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		WRK.exercise.update(id);
		break;
	case 'exercise-delete':
		id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		WRK.exercise.library.delete(id);
		break;
	case 'exercise-detail':
		WRK.exercise.detail(elem.getAttribute('data-id'));
		break;
	}
});


/*
 * Initialise the app
 * - Check for local storage
 * - Create workouts library
 * - Create exercise library for each workout in local storage
 */

(function () {
	// Initialise the global libraries and populate with local storage data if it exists
	var WRK.workouts = WRK.library.create();

	var WRK.exercises = WRK.library.create();

	var localData = window.localStorage('WorkoutTimer');

	if (localData) {
		localData = JSON.parse(localData);
		console.log('local data exists:', localData);

		// For each workout in local data add to WRK.workouts
		// Will child workout data be in json now?

		// For each exercise in local data add to WRK.exercises
	}

}());
