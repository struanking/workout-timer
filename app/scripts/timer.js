var WRK = WRK || {};

WRK.timer = (function () {

	//
	// Constructors
	// Workout, Exercise (Timed, Repetition), Timer, WorkoutCollection, ExerciseCollection
	//
  function Timer(params) {
    var params = params || {};
    
    return this;
  }

  Timer.prototype.start = function () {};
  Timer.prototype.stop = function () {};
  Timer.prototype.countdown = function (name) {};

}());