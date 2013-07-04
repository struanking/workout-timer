var WRK = WRK || {};

WRK.exercise = (function () {

    var titles = {
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

    Exercise.prototype.getId = function () {
        return this.id;
    };

    Exercise.prototype.getName = function () {
        return this.name;
    };

    Exercise.prototype.setName = function (name) {
        this.name = name;
    };

    Exercise.prototype.set = {
        name: function (value) {
            console.log('value = ' + value);
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

    Exercise.prototype.get = {
        name: function () {
            return this.name;
        }
    };

    Exercise.prototype.getType = function () {
        return this.type;
    };

    Exercise.prototype.getSets = function () {
        return this.sets;
    };

    Exercise.prototype.getRest = function () {
        return this.rest;
    };

    Exercise.prototype.getRestUnits = function () {
        return this.restUnits;
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
    }

    Library.prototype.add = function (ex) {
        console.log('Adding...');
        var collection = this.collection;
        ex.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.collection.push(ex);
        console.log('collection', this.collection);
        amplify.publish('exercise-collection-updated');
    }

    Library.prototype.delete = function (id) {
        var index = this.collection.findByProperty('id', +id);
        //var index = this.collection.indexOf(ex);
        console.log('Heard delete request for: ' + id + ', index = ' + index + ', collection', this.collection);
        this.collection.splice(index, 1);
        amplify.publish('exercise-collection-updated');
    }

    Library.prototype.refresh = function () {
        var container = document.querySelector('[data-js="exercise-collection-list"]'),
            ex,
            html = '<ul>';

        for (var i = 0, max = this.collection.length; i < max; i += 1) {
            ex = this.collection[i];
            html += '<li><a href="#" data-js="exercise-detail" data-index="' + ex.getId() + '">' + ex.getName() + '</a></li>';
        }

        html += '</ul>';

        container.innerHTML = html;
    }

    function createLibrary () {
        this.library = new Library();
    }

    /* Create a new exercise
     * @Public
     */
    function createExercise (data) {
        var ex,
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
        console.log('Add to lib...');
        this.library.add(ex);
    }
    
    function exerciseFormData() {
        var form = doc.querySelector('[data-js="exercise-config"]'),
            name = form.querySelector('#name').value,
            type = WRK.util.getRadioValue(form.querySelectorAll('[name="type"]')),
            sets = form.querySelector('#sets').value,
            restUnits = WRK.util.getRadioValue(form.querySelectorAll('[name="rest-time"]')),
            rest = form.querySelector('#rest').value,
            data = {
                "name": name,
                "type": type,
                "sets": sets,
                "rest": rest,
                "restUnits": restUnits
            };
        return data;
    }

    function exerciseDetail(index) {
        var ex = this.library.collection[index],
            form = doc.querySelector('[data-js="exercise-config"]');

        console.log(ex.getId());
        console.log(ex.getName());
        console.log(ex.getType());
        console.log(ex.getSets());
        console.log(ex.getRest());
        console.log(ex.getRestUnits());

        form.querySelector('#name').value = ex.getName();
        form.querySelector('#' + ex.getType()).checked = 'checked';
        form.querySelector('#sets').value = ex.getSets();
        form.querySelector('#rest-' + ex.getRestUnits()).checked = 'checked';
        form.querySelector('#rest').value = ex.getRest();
    }

    function exerciseUpdate(id) {
        var index = WRK.exercise.library.collection.findByProperty('id', id),
            ex = WRK.exercise.library.collection[index],
            data = WRK.exercise.formData();

        console.log('index = ' + index + ', ex:', ex);

        for (var key in data) {
            console.log('Set ' + key + ' = ' + data[key]);
            ex.set[key].call(ex, data[key]);
        }

    }

    return {
        init: createLibrary,
        create: createExercise,
        detail: exerciseDetail,
        formData: exerciseFormData,
        titles: titles,
        update: exerciseUpdate
    }
}());

WRK.exercise.init();