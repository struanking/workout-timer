var WRK = WRK || {};

WRK.exercise = (function () {

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
    function Exercise(data) {
        var data = data || {};
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
    

    function Library() {
        this.collection = [];
        this.node = document.createElement('fieldset');
        this.node.dataset.js = 'exercise-collection-list';
    }

    Library.prototype.add = function (ex) {
        var collection = this.collection;
        ex.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.collection.push(ex);
        amplify.publish('exercise-collection-updated');
    }

    Library.prototype.delete = function (id) {
        var index = this.collection.findByProperty('id', +id);
        console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', this.collection);
        this.collection.splice(index, 1);
        amplify.publish('exercise-collection-updated');
    }

    Library.prototype.render = function () {
        // This needs to be a template call
        var ex,
            html = '',
            max = this.collection.length;

        if (max > 0) {
            html = '<ul>';
            for (var i = 1; i < max; i += 1) {
                ex = this.collection[i];
                html += '<li><a href="#" data-js="exercise-detail" data-id="' + ex.get('id') + '">' + ex.get('name') + '</a></li>';
            }
            html += '</ul>';
        } else {
            html = '<p>No exercises</p>';
        }

        this.node.innerHTML = html;
        return true;
    }

    Library.prototype.refresh = function () {
        var container = document.querySelector('[data-js="exercise-collection"]');
            //container = document.querySelector('[data-js="exercise-collection-list"]'),
        this.render();
        //container.innerHTML = html;
        container.appendChild(this.node);
    }

    function createLibrary () {
        this.library = new Library();
        this.create(true);
        this.library.refresh();
    }

    /* Create a new exercise
     * @Public
     */
    function createExercise(useDefault) {
        var data = useDefault ? defaultExercise : exerciseFormData(),
            ex,
            type = data.type || null;

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
        this.library.add(ex);
    }
    
    function exerciseFormData() {
        var form = doc.querySelector('[data-js="exercise-config"]'),
            data = {
                "name": form.querySelector('#exercise-name').value,
                "type": WRK.util.getRadioValue(form.querySelectorAll('[name="type"]')),
                "sets": form.querySelector('#sets').value,
                "rest": form.querySelector('#rest').value,
                "restUnits": WRK.util.getRadioValue(form.querySelectorAll('[name="rest-time"]'))
            };
        return data;
    }

    function exerciseDetail(id) {
        var index = id ? WRK.exercise.library.collection.findByProperty('id', +id) : 0,
            ex = this.library.collection[index],
            form = doc.querySelector('[data-js="exercise-config"]');

        form.dataset.id = ex.get('id');
        form.querySelector('#exercise-name').value = ex.get('name');
        form.querySelector('#' + ex.get('type')).checked = 'checked';
        form.querySelector('#sets').value = ex.get('sets');
        form.querySelector('#rest-' + ex.get('restUnits')).checked = 'checked';
        form.querySelector('#rest').value = ex.get('rest');
    }

    function exerciseUpdate(id) {
        var index = id ? WRK.exercise.library.collection.findByProperty('id', +id) : 0,
            ex = WRK.exercise.library.collection[index],
            data = exerciseFormData();

        for (var key in data) {
            console.log('Set ' + key + ' = ' + data[key]);
            ex.set[key].call(ex, data[key]);
        }
    }

    return {
        init: createLibrary,
        create: createExercise,
        detail: exerciseDetail,
        titles: titles,
        update: exerciseUpdate
    }
}());

WRK.exercise.init();