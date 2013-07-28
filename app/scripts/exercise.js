/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
    undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
    console: true
*/

var WRK = WRK || {};

WRK.exercise = (function () {
    'use strict';

        var defaults = {
            "name": 'default',
            "type": 'timed',
            "sets": 1,
            "rest": 0,
            "restUnits": 'seconds'
        },

        titles = [
            'Squats',
            'Sit-ups',
            'Press-ups',
            'Plank',
            'Mountain Climbers'
        ];

    //
    // Constructors
    //  Exercise (Timed, Repetition)
    //
    var Exercise = {

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
        }
    };

    /* Create a new exercise
     * @Public
     */
    function exerciseCreate(useDefaults) {
        // - create exercise
        // - add exercise object to workout exercise collection
        var collection = WRK.workouts.collection,
            config = useDefaults ? {} : formData(),
            ex,
            index = collection.findByProperty('id', +config.workoutId || 0);

        ex = Object.create(Exercise).init(config);
        
        collection[index].addExercise(ex);
    }

    function exerciseDelete(workoutId, id) {
        var collection = WRK.workouts.collection,
            index = collection.findByProperty('id', +workoutId || 0),
            exIndex = collection[index].exercises.findByProperty('id', +id || 0);
        
        collection[index].deleteExercise(exIndex);
    }

    function exerciseDetail(workoutId, id) {
        console.time('render exercise config template');
        var collection = WRK.workouts.collection,
            index = collection.findByProperty('id', +workoutId || 0),
            exIndex = collection[index].exercises.findByProperty('id', +id || 0),
            data = collection[index].exercises[exIndex];

        dust.render("exercise-form", data, function(err, output) {
            document.querySelector('[data-js="exercise-config"] div').innerHTML = output;
        });
    }

    function exerciseUpdate(workoutId, id) {
        var collection = WRK.workouts.collection,
            index = collection.findByProperty('id', +workoutId || 0),
            exIndex = collection[index].exercises.findByProperty('id', +id || 0),
            ex = collection[index].exercises[exIndex],
            data = formData();

        console.log('ex:', ex);

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                console.log('Set ' + key + ' = ' + data[key]);
                //ex.set[key].call(ex, data[key]);
                ex.set(key, data[key]);
            }
        }
    }

    function exerciseConfig(workoutId) {
        var data = defaults,
            form = document.querySelector('[data-js="exercise-config"]');

        data.titles = titles;
        data.workoutId = workoutId;

        dust.render("exercise-form", data, function(err, output) {
            form.querySelector('div').innerHTML = output;
        });
    }
    
    function formData() {
        var form = document.querySelector('[data-js="exercise-config"]'),
            data = {
                //"workoutId": form.querySelector('[data-js="exercise-id"]').dataset.workoutId,
                "workoutId": document.querySelector('[data-js="workout-id"]').dataset.id,
                "name": form.querySelector('#exercise-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="type"]')),
                "time": form.querySelector('#time').value,
                "timeUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="time-units"]')),
                "sets": form.querySelector('#sets').value,
                "rest": form.querySelector('#rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="rest-units"]'))
            };
        return data;
    }

    return {
        config: exerciseConfig,
        create: exerciseCreate,
        delete: exerciseDelete,
        detail: exerciseDetail,
        titles: titles,
        update: exerciseUpdate
    };
}());