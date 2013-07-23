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

        titles = {
            e1: 'Squats',
            e2: 'Sit-ups',
            e3: 'Press-ups',
            e4: 'Plank',
            e5: 'Mountain Climbers'
        };

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
        // Create exercise
        // - add exercise object to WRK.exercises
        // - add id to workout exercise collection
        var collection = WRK.workouts.collection,
            config = useDefaults ? {} : formData(),
            ex,
            index = collection.findByProperty('id', +config.workoutId || 0);

        ex = Object.create(Exercise).init(config);
        
        ex.id = collection[index].addExercise();

        WRK.exercises.add(ex);
    }

    function exerciseDetail(id) {
        // Will become a template rendered with the exercise json data
        var collection = WRK.exercise.library.collection,
            index = collection.findByProperty('id', +id || 0),
            ex = collection[index],
            form = document.querySelector('[data-js="exercise-config"]');

        form.dataset.id = ex.get('id');
        form.querySelector('#exercise-name').value = titles[ex.get('name')];
        form.querySelector('#' + ex.get('type')).checked = 'checked';
        form.querySelector('#sets').value = ex.get('sets');
        form.querySelector('#rest-' + ex.get('restUnits')).checked = 'checked';
        form.querySelector('#rest').value = ex.get('rest');
    }

    function exerciseUpdate(id) {
        var index = WRK.exercise.library.collection.findByProperty('id', +id || 0),
            ex = WRK.exercise.library.collection[index],
            data = formData();

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                console.log('Set ' + key + ' = ' + data[key]);
                ex.set[key].call(ex, data[key]);
            }
        }
    }
    
    function formData() {
        var form = document.querySelector('[data-js="exercise-config"]'),
            data = {
                "workoutId": form.dataset.workoutId,
                "name": form.querySelector('#exercise-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="type"]')),
                "sets": form.querySelector('#sets').value,
                "rest": form.querySelector('#rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="rest-time"]'))
            };
        return data;
    }

    return {
        //init: createLibrary,
        create: exerciseCreate,
        detail: exerciseDetail,
        titles: titles,
        update: exerciseUpdate
    };
}());