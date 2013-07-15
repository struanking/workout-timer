var WRK = WRK || {};

WRK.workout = (function () {

    /* Workout constructor
     * @Private
     */

     var Workout = {

        defaults: {
            name: 'not-yet-set',
            recoveryTime: 2,
            rest: 2, //seconds
            restUnits: 'seconds',
            //this.time = data.time; //miliseconds - should be a function to calculate from exercises or updated whenever an exercise is added/removed/changed
            exercises: []
        },

        init: function (data) {
            var data = data || {},
                defaults = this.defaults;

            // Loop through props in data and set on this - therefore any not there will assume the default value
            for (var prop in data) {
                this[prop] = data[prop];
            }

            for (var prop in defaults) {
                if (!(prop in data) || !data[prop]) {
                    this[prop] = defaults[prop];
                }
            }
        },

        set: function (prop, value) {
            this[prop] = value;
        },

        get: function (prop) {
            return this[prop];
        },

        addExercise: function (ex) {
            var exercises = this.exercises;
            ex.id = (exercises && exercises.length > 0) ? exercises[exercises.length - 1].id + 1 : 0;
            exercises.push(ex);
            amplify.publish('workout-exercises-updated');
        },

        deleteExercise: function (id) {
            var exercises = this.exercises,
                index = exercises.findByProperty('id', +id);

            console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', exercises);
            exercises.splice(index, 1);
            amplify.publish('workout-exercises-updated');
        }
     };

    /* Create a new workout
     * @Public
     */
    function createWorkout(data) {
        var data = data || formData(),
            workout;

        workout = Object.create(Workout);
        workout.init(data);

        if (!WRK.workouts) {
            WRK.library.createLibrary('workout');
        }

        WRK.workouts.add(workout); // To do: create a Library and add workout to it
        return workout;
    }

    function detail(id) {
        var id = +id || 0,
            index = WRK.workouts.collection.findByProperty('id', +id),
            obj = WRK.workouts.collection[index],
            form = doc.querySelector('[data-js="workout-config"]');

        form.dataset.id = obj.get('id');
        form.querySelector('#workout-name').value = obj.get('name');
        form.querySelector('#default-recovery-time').value = obj.get('recoveryTime');
        form.querySelector('#default-rest-' + obj.get('restUnits')).checked = 'checked';
        form.querySelector('#default-rest').value = obj.get('rest');
    }

    function update(id) {
        var index = id ? WRK.workouts.collection.findByProperty('id', +id) : 0,
            obj = WRK.workouts.collection[index],
            data = formData();

        for (var prop in data) {
            obj.set.call(obj, prop, data[prop]);
        }
    }

    function formData() {
        var form = doc.querySelector('[data-js="workout-config"]'),
            data = {
                "name": form.querySelector('#workout-name').value,
                "recoveryTime": form.querySelector('#default-recovery-time').value,
                "rest": form.querySelector('#default-rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="default-rest-units"]'))
            };
        return data;
    }

    return {
        create: createWorkout,
        detail: detail,
        update: update
    }

}());