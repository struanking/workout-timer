var doc = document;

/*
 * Exercises
 */
amplify.subscribe('exercise-new', function () {
	// Activate exercise name field
    doc.querySelector('#exercise-name').focus();
});

amplify.subscribe('exercise-create', function (name) {
	// Activate exercise config
    doc.querySelector('[data-js="exercise-config"]').focus();
    doc.querySelector('[data-js="exercise-config"]').style.borderColor = '#C00';
    doc.querySelector('[data-js="exercise-config"] #name').value = name;
});

// Exercise: new
amplify.subscribe('exercise-add-ready', function (data) {
	WRK.exercise.create(data);
});

// Exercise: update
amplify.subscribe('exercise-update-ready', function (data, id) {
	WRK.exercise.update(data, id);
});

// Exercise: collection updated
amplify.subscribe('exercise-collection-updated', function () {
	WRK.exercise.library.refresh();
});

// Exercise: request details
amplify.subscribe('exercise-detail', function (id) {
	WRK.exercise.detail(id);
});

amplify.subscribe('exercise-delete', function (id) {
	WRK.exercise.library.delete(id);
});
// End exercises

/*
WRK.util.addListener(doc.querySelector('[data-js="exercise-collection"]'), 'click', function(ev) {
	console.log('exercise-collection click');
	ev.preventDefault();
	var type = ev.target.getAttribute('data-js');
	switch (type) {
	case 'exercise-add':
		amplify.publish(type);
		break;
	}
});
*/

WRK.util.addListener(window, 'click', function(ev) {
	//console.log('Window click heard');
	var elem = ev.target,
		eventType = elem.getAttribute('data-js');

	if (eventType) {
		ev.preventDefault();
	}

	switch (eventType) {
	case 'exercise-new':
		amplify.publish(eventType);
		break;
	case 'exercise-create':
		var name = doc.querySelector('#exercise-name').value;
		amplify.publish(eventType, name);
		break;
	case 'exercise-add-ready':
		var data = WRK.exercise.formData();
		amplify.publish(eventType, data);		
		break;
	case 'exercise-update-ready':
		var id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		WRK.exercise.update(+id);
		break;
	case 'exercise-delete':
		var id = doc.querySelector('[data-js="exercise-config"]').dataset.id; // or, use getId on object
		amplify.publish(eventType, id);
		break;
	case 'exercise-detail':
		amplify.publish(eventType, elem.getAttribute('data-index'));
		break;
	}
});