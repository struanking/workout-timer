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
            // Move id calculation to utility
            var exercises = this.exercises,
                id = (exercises && exercises.length > 0) ? exercises[exercises.length - 1].id + 1 : 0;

                console.log('id = ' + id);

            ex.id = id;

            exercises.push(ex);

            amplify.publish('workout-exercises-updated', this.id);
            
        },

        deleteExercise: function (index) {
            //console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', exercises);
            this.exercises.splice(index, 1);

            amplify.publish('workout-exercises-updated');
        }
    };

    /* Create a new workout
     * @Public
     */
    function workoutCreate(data) {
        var config = data || formData(),
            workout = Object.create(Workout).init(config);

        WRK.workouts = WRK.workouts || WRK.library.create('workout'); // Belt and braces because library should be initialised on page load

        WRK.workouts.add(workout); // Add it to the global library

        return workout; // ?
    }

    function workoutDetail(id) {
        console.time('render workout config template');
        var collection = WRK.workouts.collection,
            index = collection.findByProperty('id', +id || 0),
            data = collection[index];

        dust.render("workout-form", data, function(err, output) {
            document.querySelector('[data-js="workout-config"] div').innerHTML = output;
        });
        console.timeEnd('render workout config template');
    }

    function workoutConfig(name) {
        var data = defaults,
            form = document.querySelector('[data-js="workout-config"]');

        data.name = name;

        dust.render("workout-form", data, function(err, output) {
            form.querySelector('div').innerHTML = output;
        });
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
        config: workoutConfig,
        create: workoutCreate,
        detail: workoutDetail,
        update: workoutUpdate
    };

}());