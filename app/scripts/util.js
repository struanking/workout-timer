/*jshint
	forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
	undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50
*/

var WRK = WRK || {};

WRK.util = {
	
	addListener: null,
	
	removeListener: null,

	getRadioValue: function (radioGroup) {
		'use strict';

		if (radioGroup[0].type !== 'radio') {
			return;
		}

		for (var i = 0, max = radioGroup.length; i < max; i += 1) {
			if (radioGroup[i].checked) {
				return radioGroup[i].value;
			}
		}
	},

	nextId: function (obj) {
		return (obj && obj.length > 0) ? obj[obj.length - 1].id + 1 : 0;
	},

	timeCalc: function (value, units) {
		value *= 1; // Ensure it's a number
		return units === 'minutes' ? value * 60 : value;
	},

	timeFriendlyFormat: function (value) {
		var t1,
			t2,
			timeFriendlyFormat;

		switch (true) {
		case value > 60:
			t1 = Math.floor(value / 60) + ' Minutes';
			t2 = value % 60;

			if (t2 > 0) {
				t2 += t2 === 1 ? ' Second' : ' Seconds';
				t2 = ' ' + t2;
			} else {
				t2 = '';
			}

			timeFriendlyFormat = t1 + t2;
			break;
		
		case value === 60:
			timeFriendlyFormat = '1 minute';
			break;

		default:
			timeFriendlyFormat = value + ' Seconds';
			break;
		}

		return timeFriendlyFormat;
	}

/*	namespace: function (ns, ns_string) {
	    var parts = ns_string.split('.'),
	        parent = ns;

	    if (parts[0] === 'WRK') {
	        parts = parts.slice(1);
	    }

	    for (var i = 0, length = parts.length; i < length; i += 1) {
	        //create a property if it doesnt exist
	        if (typeof parent[parts[i]] === 'undefined') {
	            parent[parts[i]] = {};
	        }
	        parent = parent[parts[i]];
	    }

	    return parent;
	}*/
};

(function() {
	'use strict';

	// Setup cross-browser event listening and removing
	if (window.addEventListener) {
		
		WRK.util.addListener = function (el, type, fn) {
			el.addEventListener(type, fn, false);
		};

		WRK.util.removeListener = function (el, type, fn) {
			el.removeEventListener(type, fn, false);
		};

	} else { // older browsers
		
		WRK.util.addListener = function (el, type, fn) {
			el['on' + type] = fn;
		};
		
		WRK.util.removeListener = function (el, type) {
			el['on' + type] = null;
		};
	}
	// End setup cross-browser event listening and removing

	Number.prototype.toHHMMSS = function () {
		
		var sec_num = parseInt(this, 10),

			hours = Math.floor(sec_num / 3600),
		
			minutes = Math.floor((sec_num - hours * 3600) / 60),
		
			seconds = sec_num - hours * 3600 - minutes * 60,
		
			format = function (n) {
				return n < 10 ? "0" + n : n;
			};

		return format(hours) !== '00' ? format(hours) + ':' + format(minutes) + ':' + format(seconds) : format(minutes) + ':' + format(seconds);
	};

	Array.prototype.findByProperty = function (prop, value) {
		for (var i = 0, max = this.length; i < max; i += 1) {
			if (this[i][prop] === value) {
				return i;
			}
		}
	};

}());