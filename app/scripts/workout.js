var WRK = WRK || {};

WRK.workout = (function () {

    var collection = [];

    /* Create a new workout
     * @Public
     */
    function createWorkout () {
        var workout = new Workout();
        collection.push(workout);
        console.log('Workout: name = ' + workout.getName() + ', id = ' + workout.getId());
        return workout;
    }

    /* Workout constructor
     * @Private
     */
    function Workout(params) {
        var params = params || {};
        this.id = (collection && collection.length > 0) ? collection[collection.length - 1].id + 1 : 0;
        this.name = params.name || 'not-yet-set';
        this.defaultRecovery = params.defaultRecovery || 2; //seconds
        this.defaultRecoveryUnits = 'seconds';
        //this.time = params.time; //miliseconds - should be a function to calculate from exercises or updated whenever an exercise is added/removed/changed
        this.exercises = params.exercises || [];
        this.exNum = -1; // ?
    }

    Workout.prototype.getId = function () {
        return this.id;
    };
    
    Workout.prototype.getName = function () {
        return this.name;
    };
    
    Workout.prototype.setName = function (name) {
        this.name = name;
    };

    Workout.prototype.addExercise = function () {};
    Workout.prototype.removeExercise = function (id) {};

    return {
        collection: collection,
        create: createWorkout
    }

}());