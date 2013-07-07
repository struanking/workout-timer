var doc = document;

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
    doc.querySelector('[data-js="workout-config"] #name').value = name;
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
    	html += '<option>' + titles[key] + '</select>';
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