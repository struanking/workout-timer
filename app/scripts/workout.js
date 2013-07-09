var WRK = WRK || {};

WRK.workout = (function () {

    /* Workout constructor
     * @Private
     */
    function Workout(data) {
        var data = data || {};

        this.name = data.name || 'not-yet-set';
        this.defaultRecoveryTime = data.defaultRecoveryTime || 2; //seconds
        this.defaultRest = data.defaultRest || 2; //seconds
        this.defaultRestUnits = 'seconds';
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

    Workout.prototype.addExercise = function (ex) {
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

        if (!WRK.workouts) {
            WRK.library.createLibrary('workout');
        }

        WRK.workouts.add(workout); // To do: create a Library and add workout to it
        console.log('Workout: name = ' + workout.get('name') + ', id = ' + workout.get('id'));
    }

    function detail(id) {
        var index = id ? WRK.workouts.collection.findByProperty('id', +id) : 0,
            obj = WRK.workouts.collection[index],
            form = doc.querySelector('[data-js="workout-config"]');

        form.dataset.id = obj.get('id');
        form.querySelector('#workout-name').value = obj.get('name');
        form.querySelector('#default-recovery-time').value = obj.get('defaultRecoveryTime');
        form.querySelector('#default-rest-' + obj.get('defaultRestUnits')).checked = 'checked';
        form.querySelector('#default-rest').value = obj.get('defaultRest');
    }

    function update(id) {
        var index = id ? WRK.workouts.collection.findByProperty('id', +id) : 0,
            obj = WRK.workouts.collection[index],
            data = formData();

        for (var key in data) {
            console.log('Set ' + key + ' = ' + data[key]);
            obj.set.call(obj, key, data[key]);
        }
    }

    function formData() {
        var form = doc.querySelector('[data-js="workout-config"]'),
            data = {
                "name": form.querySelector('#workout-name').value,
                "defaultRecoveryTime": form.querySelector('#default-recovery-time').value,
                "defaultRest": form.querySelector('#default-rest').value,
                "defaultRestUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="default-rest-units"]'))
            };
        return data;
    }

    return {
        create: createWorkout,
        detail: detail,
        update: update
    }

}());