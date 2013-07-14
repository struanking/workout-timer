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
    WRK.workouts.refresh();
});

amplify.subscribe('workout-exercises-updated', function () {
    console.log('Heard workout-exercises-updated');
    // refresh workout
});

/*
 * Exercises
 */
amplify.subscribe('exercise-new', function (parentId) {
	// Activate exercise config
	var exConfig = doc.querySelector('[data-js="exercise-config"]');

	exConfig.dataset.parentId = parentId;
    exConfig.focus();
    exConfig.style.borderColor = '#C00';

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
	case 'workout-detail':
		WRK.workout.detail(elem.getAttribute('data-id'));
		break;
	case 'workout-new':
		amplify.publish(eventType);
		break;
	case 'workout-create':
		var name = doc.querySelector('#workout-name').value;
		amplify.publish(eventType, name);
		break;
	case 'workout-add-ready':
		WRK.workout.create();
		break;
	case 'workout-update-ready':
		var id = doc.querySelector('[data-js="workout-config"]').dataset.id; // or, use getId on object
		WRK.workout.update(id);
        amplify.publish('workout-collection-updated'); // may only need to update if name changed
		break;
	case 'exercise-new':
		var parentId = doc.querySelector('[data-js="workout-config"]').dataset.id; // or, use getId on object
		amplify.publish(eventType, parentId);
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