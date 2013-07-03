var WRK = WRK || {};

WRK.util = {
	addListener: null,
	removeListener: null,
	getRadioValue: function (radioGroup) {
		var radioGroup = radioGroup || null;
		if (radioGroup[0].type !== 'radio') {
			return;
		}
		for (var i = 0, max = radioGroup.length; i < max; i += 1) {
			if (radioGroup[i].checked) {
				return radioGroup[i].value;
			}
		}
	}
};

(function() {

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
		WRK.util.removeListener = function (el, type, fn) {
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
			}
		return format(hours) !== '00' ? format(hours) + ':' + format(minutes) + ':' + format(seconds) : format(minutes) + ':' + format(seconds);
	}

	Array.prototype.findByProperty = function (prop, value) {
		for (var i = 0, max = this.length; i < max; i += 1) {
	        if (this[i][prop] === value) {
	            return i;
	        }
    	}
	}

}());