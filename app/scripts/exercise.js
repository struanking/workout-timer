/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
    undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
    amplify: true, console: true
*/

var WRK = WRK || {};

WRK.exercise = (function () {
    'use strict';

    var defaultExercise = {
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
    var Exercise2 = {

    };

    function Exercise(config) {
        var data = config || {};
        this.name = data.name || '';
        this.type = data.type || '';
        this.sets = data.sets || '';
        this.rest = data.rest || '';
        this.restUnits = data.restUnits || '';
    }

    Exercise.prototype.set = {
        name: function (value) {
            this.name = value;
        },

        type: function (value) {
            this.type = value;
        },

        sets: function (value) {
            this.sets = value;
        },

        rest: function (value) {
            this.rest = value;
        },

        restUnits: function (value) {
            this.restUnits = value;
        }
    };

    Exercise.prototype.get = function (prop) {
        return this[prop];
    };

    function TimedExercise(data) {
        Exercise.call(this, data);
    }

    TimedExercise.prototype = Object.create(Exercise.prototype);
    TimedExercise.constructor = TimedExercise;

    function RepetitionExercise(data) {
        Exercise.call(this, data);
    }

    RepetitionExercise.prototype = Object.create(Exercise.prototype);
    RepetitionExercise.constructor = RepetitionExercise;

    /* Create a new exercise
     * @Public
     */
    function createExercise(useDefault) {
        var data = useDefault ? defaultExercise : formData(),
            ex,
            parentId = data.parentId,
            index = parentId !== 'undefined' ? WRK.workouts.collection.findByProperty('id', +parentId) : 0,
            obj = WRK.workouts.collection[index],
            type = data.type;

        switch (type) {
        case 'timed':
            ex = new TimedExercise(data);
            break;
        case 'repetition':
            ex = new RepetitionExercise(data);
            break;
        default:
            console.log('No exercise type provided');
        }

        obj.addExercise(ex);
    }
    
    function formData() {
        var form = document.querySelector('[data-js="exercise-config"]'),
            data = {
                "parentId": form.dataset.parentId,
                "name": form.querySelector('#exercise-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="type"]')),
                "sets": form.querySelector('#sets').value,
                "rest": form.querySelector('#rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="rest-time"]'))
            };
        return data;
    }

    function exerciseDetail(id) {
        var index = WRK.exercise.library.collection.findByProperty('id', +id || 0),
            ex = WRK.exercise.library.collection[index],
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

    return {
        //init: createLibrary,
        create: createExercise,
        detail: exerciseDetail,
        titles: titles,
        update: exerciseUpdate
    };
}());