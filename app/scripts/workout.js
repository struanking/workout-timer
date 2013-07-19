/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
    undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
    amplify: true, console: true
*/

var WRK = WRK || {};

WRK.workout = (function () {
    'use strict';

    /* Workout constructor
     * @Private
     */

    var defaults = {
        name: 'not-yet-set',
        recoveryTime: 2,
        rest: 2, //seconds
        restUnits: 'seconds',
        //this.time = data.time; //miliseconds - should be a function to calculate from exercises or updated whenever an exercise is added/removed/changed
        exercises: []
    };

    var Workout = {

        init: function (config) {
            var data = config || {},
                prop;
            
            defaults = defaults || {};

            // Loop through props in data and set on this - therefore any not there will assume the default value
            for (prop in data) {
                if (data.hasOwnProperty(prop)) {
                    this[prop] = data[prop];
                }
            }

            for (prop in defaults) {
                if (!(prop in data) || !data[prop]) {
                    this[prop] = defaults[prop];
                }
            }

            return this;
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
    function workoutCreate(data) {
        var config = data || formData(),
            workout = Object.create(Workout).init(config);

        WRK.workouts = WRK.workouts || WRK.library.create(); // Belt and braces because library should be initialised on page load

        WRK.workouts.add(workout); // Add it to the global library

        return workout;
    }

    function workoutDetail(id) {
        // Will become a template rendered with the workout json data
        var index = WRK.workouts.collection.findByProperty('id', +id || 0),
            obj = WRK.workouts.collection[index],
            form = document.querySelector('[data-js="workout-config"]');

        form.dataset.id = obj.get('id');
        form.querySelector('#workout-name').value = obj.get('name');
        form.querySelector('#default-recovery-time').value = obj.get('recoveryTime');
        form.querySelector('#default-rest-' + obj.get('restUnits')).checked = 'checked';
        form.querySelector('#default-rest').value = obj.get('rest');
    }

    function workoutUpdate(id) {
        var index = WRK.workouts.collection.findByProperty('id', +id || 0),
            data = formData(),
            obj = WRK.workouts.collection[index],
            prop;

        for (prop in data) {
            if (data.hasOwnProperty(prop)) {
                obj.set.call(obj, prop, data[prop]); // Call set method on the object with the context of the object itself
            }
        }
    }

    function formData() {
        var form = document.querySelector('[data-js="workout-config"]'),
            data = {
                "name": form.querySelector('#workout-name').value,
                "recoveryTime": form.querySelector('#default-recovery-time').value,
                "rest": form.querySelector('#default-rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="default-rest-units"]'))
            };
        return data;
    }

    return {
        create: workoutCreate,
        detail: workoutDetail,
        update: workoutUpdate
    };

}());