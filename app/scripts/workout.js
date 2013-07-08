var WRK = WRK || {};

WRK.workout = (function () {

    //var collection = [];

    /* Workout constructor
     * @Private
     */
    function Workout(data) {
        var collection = WRK.library.collection,
            data = data || {};

        //this.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.name = data.name || 'not-yet-set';
        this.defaultRecovery = data.defaultRecovery || 2; //seconds
        this.defaultRecoveryUnits = 'seconds';
        //this.time = data.time; //miliseconds - should be a function to calculate from exercises or updated whenever an exercise is added/removed/changed
        this.exercises = data.exercises || [];
        this.exNum = -1; // ?
    }

    Workout.prototype.set = function (prop, value) {
        this[prop] = value;
        //amplify.publish('workout-exercises-updated');
    };

    Workout.prototype.get = function (prop) {
        return this[prop];
    };

    Workout.prototype.addExercise = function () {
        var exercises = this.exercises;
        ex.id = (exercises && exercises.length > 0) ? exercises[exercises.length - 1].id + 1 : 0;
        exercises.push(ex);
        amplify.publish('workout-exercises-updated');
    };

    Workout.prototype.deleteExercise = function (id) {
        var exercises = this.exercises,
            index = exercises.findByProperty('id', +id);
        console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', exercises);
        exercises.splice(index, 1);
        amplify.publish('workout-exercises-updated');
    };

    /* Create a new workout
     * @Public
     */
    function createWorkout() {
        var data = formData(),
            workout = new Workout(data);

        WRK.library.add(workout); // To do: create a Library and add workout to it
        console.log('Workout: name = ' + workout.get('name') + ', id = ' + workout.get('id'));
    }

    function formData() {
        var form = doc.querySelector('[data-js="workout-config"]'),
            data = {
                "name": form.querySelector('#workout-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="default-rest-time"]')),
                "rest": form.querySelector('#default-rest').value,
            };
        return data;
    }

    return {
        //collection: collection,
        create: createWorkout
    }

}());