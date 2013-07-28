/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
	console: true
*/

WRK = WRK || {};

WRK.timer = (function () {
	'use strict';

	var timer2;

	function Timer(workout) {
		this.exNum = -1;
		return this;
	}

	Timer.prototype = {

		start: function () {
			var exercises = this.workout.exercises;

			if (this.exNum === -1) {
				console.log('Starting workout');
				//console.log('Workout name = ' + this.name);
				//console.log('Total time = ' + this.time);
				//console.log('Default recovery = ' + this.defaultRecovery);
				//this.duration = this.totalTime();
				//console.log('Workout total = ' + this.duration);
			}

			if (this.exercises[this.exNum] && !this.exercises[this.exNum].recoveryTaken) {
				this.inRecoveryMode = true;
				this.recovery();
			} else {
				this.inRecoveryMode = false;
				this.nextExercise();

				if (this.exNum === this.exercises.length) {
					console.log('Finished workout');
					//document.getElementById('time').innerHTML = 'Workout Finished';
				} else {
					var ex = this.exercises[this.exNum];
					var self = this;
					var time = ex.time;
					
					ex.recovery = ex.recovery || this.defaultRecovery;
					ex.recoveryUnits = ex.recoveryUnits || this.defaultRecoveryUnits;
					
					//document.getElementById('timer').innerHTML = $.render.timerTemplate(this);
					
					/*WRK.util.addListener(document.getElementById('workout-pause'), 'click', function(ev) {
						self.pause(ev);
					});*/
					
					this.countdown(+time);
				}
			}
		},

		totalTime: function () {
			var ex,
				exercises = this.workout.exercises,
				timeFriendlyFormat,
				total = 0,
				t1,
				t2;

			for (var i = 0, len = exercises.length; i < len; i += 1) {
				ex = exercises[i];
				total += WRK.util.timeCalc(ex.time, ex.timeUnits);
				total += WRK.util.timeCalc(ex.rest, ex.restUnits);
			}

			return total;
		},

		pause: function (ev) {
			WRK.util.preventDefaultStopPropagtion(ev);
			
			if (this.paused) {
				console.log('Restarting timer');
				this.paused = false;
				document.getElementById('workout-pause').innerHTML = 'Pause';
				this.countdown(this.pausedTime);
			} else {
				console.log('Pause timer');
				this.paused = true;
				document.getElementById('workout-pause').innerHTML = 'Continue';
				clearTimeout(timer2);
			}
		},

		nextExercise: function () {
			console.log('nextExercise = ' + this.exNum);
			this.exNum = this.exNum += 1;
		},

		countdown: function (t) {
			console.log('Countdown: ' + t);
			var self = this;
			this.pausedTime = t;
			
			//document.getElementById('time').innerHTML = t.toHHMMSS();

			/*
			if (t === 1 && this.inRecoveryMode) {
			moveExercise();
			}
			*/

			timer2 = setTimeout(function() {
				if (t === 0) {
					// Start next exercise
					self.start();
				} else {
					console.log('self.duration = ' + self.duration);
					//var workoutCountdown = document.querySelector('#duration span');
					self.duration = self.duration - 1;
					//workoutCountdown.innerHTML = self.duration.toHHMMSS();
					self.countdown(t - 1);
				}
			}, 1000);
		},

		recovery: function () {
			console.log('Take recovery...');
			var ex = this.exercises[this.exNum];
			var time = ex.recovery || 0;
			//time = time * 1 / 1000;
			console.log('Recovery time = ' + time);
			document.getElementById('exercise-name').innerHTML = 'Recovery';
			this.countdown(time);
			ex.recoveryTaken = true;
		}
	};

	function createTimer(workout) {
	    console.log('timer2 ' + typeof(timer2));
		// Create timer object
		var wrktimer = new Timer();

		// Copy properties
		for (var key in workout) {
			if (workout.hasOwnProperty(key)) {
				wrktimer[key] = workout[key];
			}
		}

		console.log('wrktimer:', wrktimer);

		wrktimer.workout = workout;
		wrktimer.duration = wrktimer.totalTime();
		wrktimer.timeFriendly = WRK.util.timeFriendlyFormat(wrktimer.duration);

		console.log('Total time = ' + wrktimer.duration);
		console.log('Time friendly = ' + wrktimer.timeFriendly);

		return wrktimer;

		// Render timer interface
	}

	return {
		create: createTimer
	};

}());