/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

/* global
	console: true
*/

var WRK = WRK || {};

WRK.timer = (function () {
	'use strict';

	var Timer = {

		init: function () {

		},

		start: function () {
			if (this.exNum === -1) {
				console.log('Starting workout');
				//console.log('Workout name = ' + this.name);
				//console.log('Total time = ' + this.time);
				//console.log('Default recovery = ' + this.defaultRecovery);
				this.duration = this.totalTime();
				console.log('Workout total = ' + this.duration);
			}

			if (this.exercises[this.exNum] && !this.exercises[this.exNum].recoveryTaken) {
				this.inRecoveryMode = true;
				this.recovery();
			} else {
				this.inRecoveryMode = false;
				this.nextExercise();

				if (this.exNum === this.exercises.length) {
					console.log('Finished workout');
					document.getElementById('time').innerHTML = 'Workout Finished';
				} else {
					var ex = this.exercises[this.exNum];
					var self = this;
					var time = ex.time;
					
					ex.recovery = ex.recovery || this.defaultRecovery;
					ex.recoveryUnits = ex.recoveryUnits || this.defaultRecoveryUnits;
					
					document.getElementById('timer').innerHTML = $.render.timerTemplate(this);
					
					WRK.util.addListener(document.getElementById('workout-pause'), 'click', function(ev) {
						self.pause(ev);
					});
					
					this.countdown(time);
				}
			}
		},

		totalTime: function () {
			var exercises = this.exercises,
				total = 0;

			for (var i = 0, len = exercises.length; i < len; i += 1) {
				total += exercises[i].time;
				total += exercises[i].recovery || this.defaultRecovery;
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
				clearTimeout(timer);
			}
		},

		nextExercise: function () {
			console.log('nextExercise = ' + this.exNum);
			this.exNum = this.exNum += 1;
		},

		countdown: function (t) {
			//console.log('Countdown: ' + t);
			var self = this;
			this.pausedTime = t;
			document.getElementById('time').innerHTML = t.toHHMMSS();

			/*
			if (t === 1 && this.inRecoveryMode) {
			moveExercise();
			}
			*/

			timer = setTimeout(function() {
				if (t === 0) {
					self.start();
				} else {
					var workoutCountdown = document.querySelector('#duration span');
					self.duration = self.duration - 1;
					workoutCountdown.innerHTML = self.duration.toHHMMSS();
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

	function init() {
		// Create timer object
	}

	return {
		init: init
	};

}());