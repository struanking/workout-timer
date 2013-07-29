/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
	amplify: true, console: true
*/

/*_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};*/

var WRK = WRK || {},
	doc = document;

// Create a main or core sub-module and put everything from here in there?

/*
 * Workout subscriptions
 */

amplify.subscribe('workout-new', function () {
	'use strict';
	doc.querySelector('#workout-name').focus(); // Activate workout name field
});

amplify.subscribe('workout-create', function (name) {
	'use strict';
	WRK.workout.config(name);
});

amplify.subscribe('workout-collection-updated', function (workoutId) {
	'use strict';
	console.log('heard that workouts collection has been updated with workout ' + workoutId);
	WRK.workouts.refresh();
	WRK.workout.detail(workoutId);

});

amplify.subscribe('workout-exercises-updated', function (workoutId) {
	'use strict';
	console.log('Heard workout-exercises-updated');
	// trigger refresh of exercise list in workout
	WRK.workout.detail(workoutId);
});

/*
 * Exercise subscriptions
 */
amplify.subscribe('exercise-new', function (workoutId) {
	'use strict';
	WRK.exercise.config(workoutId);
});

// Exercise: collection updated
amplify.subscribe('exercise-collection-updated', function () {
	'use strict';
	//WRK.exercise.detail();
	//WRK.exercise.library.refresh();
	console.log('Heard exercise collection updated');
});
// End exercise subscriptions

/*
 * Window event listeners and handlers
 */
WRK.util.addListener(window, 'click', function(ev) {
	'use strict';

	//console.log('Window click heard');
	var data,
		elem = ev.target,
		eventType = elem.getAttribute('data-js'),
		id,
		name,
		workoutId;

	console.log('eventType = ' + eventType);

	if (eventType) {
		ev.preventDefault();
	}

	switch (eventType) {
	case 'workout-detail':
		WRK.workout.detail(elem.dataset.id);
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
		id = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		WRK.workout.update(id);
		amplify.publish('workout-collection-updated', id); // may only need to update if name changed
		break;
	case 'workout-delete':
		id = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		WRK.workouts.delete(id);
		break;
	case 'workout-start':
		id = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		console.log('Create timer for workout id ' + id);
		var index = WRK.workouts.collection.findByProperty('id', +id || 0),
            obj = WRK.workouts.collection[index];
        console.log('obj', obj);
		WRK.timer.create(obj);
		break;
	case 'exercise-new':
		workoutId = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		amplify.publish(eventType, workoutId);
		break;
	case 'exercise-add-ready':
		WRK.exercise.create();
		break;
	case 'exercise-update-ready':
		workoutId = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		id = doc.querySelector('[data-js="exercise-id"]').dataset.exId; // or, use getId on object
		WRK.exercise.update(workoutId, id);
		break;
	case 'exercise-delete':
		workoutId = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		id = doc.querySelector('[data-js="exercise-id"]').dataset.exId; // or, use getId on object
		WRK.exercise.delete(workoutId, id);
		break;
	case 'exercise-detail':
		workoutId = doc.querySelector('[data-js="workout-id"]').dataset.id; // or, use getId on object
		WRK.exercise.detail(workoutId, elem.dataset.exId);
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
	WRK.workouts = WRK.library.create('workout');

	amplify.publish('workout-collection-updated');

	//var localData = window.localStorage.WorkoutTimer;

	/*
	if (localData) {
		localData = JSON.parse(localData);
		console.log('local data exists:', localData);

		// For each workout in local data add to WRK.workouts
		// Will child workout data be in json now?

		// For each exercise in local data add to WRK.exercises
	}
	*/
}());


/*
 * To Do list
 * ----------
 *
 * Store active workout in a variable so it's easier to access e.g. WRK.activeWorkout
 * countdown clock to be a namespace variable e.g. WRK.timer.clock to avoid undefined error in log
 * Change Object.create back to new ??
 * Underscore template or dust?
 * Timer markup
 * Add more properties
 * Review pub/sub setup
 * Setup sass
 * Setup template compile in grunt
 * Merge detail and config functions for Workout and Exercise
 * Update only changed properties
 * Refresh only changed elements
 */