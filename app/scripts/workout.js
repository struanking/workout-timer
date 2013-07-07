var WRK = WRK || {};

WRK.workout = (function () {

    var collection = [];

    /* Workout constructor
     * @Private
     */
    function Workout(data) {
        var data = data || {};
        this.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.name = data.name || 'not-yet-set';
        this.defaultRecovery = data.defaultRecovery || 2; //seconds
        this.defaultRecoveryUnits = 'seconds';
        //this.time = data.time; //miliseconds - should be a function to calculate from exercises or updated whenever an exercise is added/removed/changed
        this.exercises = data.exercises || [];
        this.exNum = -1; // ?
    }

    Workout.prototype.get = function (prop) {
        return this[prop];
    };

    Workout.prototype.addExercise = function () {};
    Workout.prototype.removeExercise = function (id) {};

    /* Create a new workout
     * @Public
     */
    function createWorkout() {
        var data = exerciseFormData(),
            workout = new Workout(data);

        collection.push(workout);
        console.log('Workout: name = ' + workout.get('name') + ', id = ' + workout.get('id'));
    }

    function exerciseFormData() {
        var form = doc.querySelector('[data-js="workout-config"]'),
            data = {
                "name": form.querySelector('#workout-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="default-rest-time"]')),
                "rest": form.querySelector('#default-rest').value,
            };
        return data;
    }

    return {
        collection: collection,
        create: createWorkout
    }

}());