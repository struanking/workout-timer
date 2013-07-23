/*

Test
----

-init checks ("no workouts")
-create workout1 with a name etc
-create workout2 with a name etc
-check size of library
-check name of workout1
-check name of workout2
check other props of workout1
-update workout1
-check new values
-add exercise1 to workout1
-add exercise2 to workout1
-add exercise3 to workout1
-check size of exercise collection in workout1
-delete exercise2 from workout1
-check size of exercise collection in workout1
check exercises left are 1 and 3
update exercise1
check for new values

*/

/*global
    $: false,           jasmine: false,         expect: false,      it: false,      spyOn: false,
    afterEach: false,   beforeEach: false,      describe: false,    BW: true,      window: true,
    navigator: true,
*/

describe('Workouts', function() {
    'use strict';

    beforeEach(function() {
    	$('body').append('<a href="#" id="mylink">My Link</a>');
    });

    afterEach(function() {
        $('#mylink').remove();
    });

    it('Click my link', function() {
        spyOnEvent($('#mylink'), 'click');
        $('#mylink').trigger('click');
        expect('click').toHaveBeenTriggeredOn($('#mylink'));
    });

    describe('Top level objects', function () {
        it('WRK is an object', function () {
        	expect(typeof WRK).toBe('object');
        });

        it('WRK.util is an object', function () {
        	expect(typeof WRK.util).toBe('object');
        });
        
        it('WRK.workout is an object', function () {
        	expect(typeof WRK.workout).toBe('object');
        });
        
        it('WRK.exercise is an object', function () {
        	expect(typeof WRK.exercise).toBe('object');
        });
    });
    
    describe('Init checks', function() {
    	it('There are zero workouts', function() {
    		expect(WRK.workouts.collection.length).toBe(0);
    	});
    });

	describe('New Workout', function() {

		beforeEach(function() {
	    	var data = {"name": "workout1"};
	    	WRK.workout.create(data);
	    });

	    afterEach(function() {
	        WRK.workouts.collection = [];
	    });

	    it('Workout1 name set to "workout1"', function() {
	    	expect(WRK.workouts.collection[0].get('name')).toBe('workout1');
	    });

	    it('Workout1 ID set to "0"', function() {
	    	expect(WRK.workouts.collection[0].get('id')).toBe(0);
	    });

	    it('Number of workouts is 1', function() {
	    	expect(WRK.workouts.collection.length).toBe(1);
	    });

	    it('Add another workout: Number of workouts is 2', function() {
	    	var data = {"name": "workout2"};
	    	WRK.workout.create(data);
	    	expect(WRK.workouts.collection.length).toBe(2);
	    });

	    it('Workout2 name set to "workout2"', function() {
	    	var data = {"name": "workout2"};
	    	WRK.workout.create(data);
	    	expect(WRK.workouts.collection[1].get('name')).toBe('workout2');
	    });
	});

	describe('Updating Workout', function() {

		beforeEach(function() {
	    	var data = {"name": "workout1"};
	    	WRK.workout.create(data);
	    });

	    afterEach(function() {
	        WRK.workouts.collection = [];
	    });

	    it('Workout1 name set to "workout1"', function() {
	    	expect(WRK.workouts.collection[0].get('name')).toBe('workout1');
	    });

	    it('Workout1 name now set to "workout1Updated"', function() {
	    	WRK.workouts.collection[0].set('name', 'workout1Updated');
	    	expect(WRK.workouts.collection[0].get('name')).toBe('workout1Updated');
	    });
	});

	describe('Delete Workout', function() {

		beforeEach(function() {
	    	var data = {"name": "workout1"};
	    	var data2 = {"name": "workout2"};
	    	WRK.workout.create(data);
	    	WRK.workout.create(data2);
	    });

	    afterEach(function() {
	        WRK.workouts.collection = [];
	    });

	    it('There are 2 workouts', function() {
	    	expect(WRK.workouts.collection.length).toBe(2);
	    });

	    it('There is now 1 workout', function() {
	    	WRK.workouts.delete(1);
	    	expect(WRK.workouts.collection.length).toBe(1);
	    });
	});

	describe('Create an exercise', function() {
		beforeEach(function() {
			var data = {"name": "workout1"};
	    	WRK.workout.create(data);
			WRK.exercise.create(true);
		});

	    afterEach(function() {
	        WRK.workouts.collection[0].deleteExercise(0);
	        WRK.workouts.collection = [];
	    });

		it('Workout1 has a new exercise', function() {
	    	expect(WRK.workouts.collection[0].exercises.length).toBe(1);
	    });
	});

	describe('Add exercise to workout', function() {

	    it('Workout1 has zero exercises', function() {
	    	var data = {"name": "workout1"};
	    	WRK.workout.create(data);
	    	expect(WRK.workouts.collection[0].exercises.length).toBe(0);
	    });

	    it('Workout1 has 1 exercise', function() {
	    	var exData = {};
	    	WRK.workouts.collection[0].addExercise(exData);
	    	expect(WRK.workouts.collection[0].exercises.length).toBe(1);
	    });

	    it('Workout1 has 3 exercises', function() {
	    	var exData = {};
	    	WRK.workouts.collection[0].addExercise(exData);
	    	WRK.workouts.collection[0].addExercise(exData);
	    	expect(WRK.workouts.collection[0].exercises.length).toBe(3);
	    });

	    it('Workout1 has 2 exercises after adding 3 and deleting 1', function() {
	    	var wrk1 = WRK.workouts.collection[0];
	    	var ex2 = wrk1.exercises[1];
	    	wrk1.deleteExercise(ex2);
	    	expect(WRK.workouts.collection[0].exercises.length).toBe(2);
	    });
	});
});