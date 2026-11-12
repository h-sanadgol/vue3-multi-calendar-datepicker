import { defineComponent, toRefs, computed, createElementBlock, openBlock, createElementVNode, createCommentVNode, unref, mergeProps, createStaticVNode, Fragment, renderList, markRaw, resolveComponent, normalizeClass, renderSlot, createBlock, toDisplayString, normalizeProps, guardReactiveProps, createVNode, withDirectives, vShow, createTextVNode, withKeys, withModifiers } from 'vue';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var PersianDate_1;
var hasRequiredPersianDate;

function requirePersianDate () {
	if (hasRequiredPersianDate) return PersianDate_1;
	hasRequiredPersianDate = 1;

	var CALENDAR = {
	  jalali: {
	    months: {
	      1: "فروردین",
	      2: "اردیبهشت",
	      3: "خرداد",
	      4: "تیر",
	      5: "مرداد",
	      6: "شهریور",
	      7: "مهر",
	      8: "آبان",
	      9: "آذر",
	      10: "دی",
	      11: "بهمن",
	      12: "اسفند"
	    },
	    days: {
	      label: {
	        6: "شنبه",
	        0: "یکشنبه",
	        1: "دوشنبه",
	        2: "سه‌شنبه",
	        3: "چهارشنبه",
	        4: "پنجشنبه",
	        5: "جمعه"
	      },
	      weekNumber: {
	        // days in jalali calendar start from saturday or 6
	        6: 0,
	        //شنبه
	        0: 1,
	        //یکشنبه
	        1: 2,
	        //دوشنبه
	        2: 3,
	        //سه‌شنبه
	        3: 4,
	        //چهارشنبه
	        4: 5,
	        //پنجشنبه
	        5: 6 //جمعه

	      }
	    },
	    ordinalNumbers: function ordinalNumbers(number, mode) {
	      var numbers = {
	        1: "یک",
	        2: "دو",
	        3: "سو",
	        4: "چهار",
	        5: "پنج",
	        6: "شش",
	        7: "هفت",
	        8: "هشت",
	        9: "نه",
	        10: "ده",
	        11: "یازده",
	        12: "دوازده",
	        13: "سیزده",
	        14: "چهارده",
	        15: "پانزده",
	        16: "شانزده",
	        17: "هفده",
	        18: "هجده",
	        19: "نوزده",
	        20: "بیست",
	        30: "سی‌",
	        40: "چهل",
	        50: "پنجاه",
	        60: "شصت",
	        70: "هفتاد",
	        80: "هشتاد",
	        90: "نود",
	        100: "صد",
	        200: "دویست",
	        300: "سیصد"
	      };
	      var ordinalNumber = "";
	      if (number == 1) ordinalNumber = "اول";else if (numbers[number]) ordinalNumber = numbers[number] + (number == 30 ? "ام" : "م");else {
	        var remainder = number % 100;
	        if (numbers[remainder]) ordinalNumber = numbers[remainder] + "م";else {
	          remainder = number % 10;
	          if (remainder) ordinalNumber = numbers[remainder] + "م";
	        }
	        remainder = (number - remainder) % 100;
	        if (remainder) ordinalNumber = numbers[remainder] + (ordinalNumber ? " و " + ordinalNumber : remainder == 30 ? "ام " : "م");
	        remainder = Math.floor(number / 100) * 100;
	        if (remainder) ordinalNumber = numbers[remainder] + (ordinalNumber ? " و " + ordinalNumber : "م");
	      }
	      if (mode == 2) ordinalNumber += "ین";
	      return ordinalNumber;
	    }
	  },
	  gregorian: {
	    months: {
	      1: "January",
	      2: "February",
	      3: "March",
	      4: "April",
	      5: "May",
	      6: "June",
	      7: "July",
	      8: "August",
	      9: "September",
	      10: "October",
	      11: "November",
	      12: "December"
	    },
	    days: {
	      label: {
	        0: "Sunday",
	        1: "Monday",
	        2: "Tuesday",
	        3: "Wednesday",
	        4: "Thursday",
	        5: "Friday",
	        6: "Saturday"
	      },
	      weekNumber: {
	        // days in gregorian calendar start from sunday or 0
	        0: 0,
	        // Sunday
	        1: 1,
	        // Monday
	        2: 2,
	        // Tuesday
	        3: 3,
	        // Wednesday
	        4: 4,
	        // Thursday
	        5: 5,
	        // Friday
	        6: 6 // Saturday

	      }
	    },
	    ordinalNumbers: function ordinalNumbers(number) {
	      if (number == 1 || number % 10 == 1 && number != 11) return number + "st";else if (number == 2 || number % 10 == 2 && number != 12) return number + "nd";else if (number == 3 || number % 10 == 3 && number != 13) return number + "rd";else return number + "th";
	    }
	  }
	};
	var REGEX = {
	  format: /j*(YYYY|YY|y|Qo|QO|Q|MMMM|MMM|MM|Mo|MO|M|DDDD|DDDo|DDDO|DDD|DD|Do|DO|D|dddd|ddd|dd|do|dO|de|d|ww|WW|wo|Wo|wO|WO|w|W|HH|hh|H|h|kk|k|mm|m|ss|s|CCCC|CCC|c|t|aa|a|A)/g,
	  isNumeric: /^\d+$/,
	  // this regex, checks input to see is a number or not
	  separators: "\\/| |-|\\.|,|:",
	  // find ['/',' ','-','.',',',':'] and split string to array by this symbols
	  betweenBacktick: /`(.*?)`/g // find the texts between the backticks ==> `Alireza`

	};

	var TIMETYPE = function TIMETYPE(hour, format) {
	  if (hour >= 0 && hour < 12) {
	    if (format == "a") return "am";else if (format == "aa") return "A.M.";else if (format == "A") return "AM";else if (format == "ja") return "ق ظ";else if (format == "jaa") return "ق.ظ";else if (format == "jA") return "قبل از ظهر";
	    return "ق.ظ";
	  } else if (hour >= 12 && hour < 24) {
	    if (format == "a") return "pm";else if (format == "aa") return "P.M.";else if (format == "A") return "PM";else if (format == "ja") return "ب ظ";else if (format == "jaa") return "ب.ظ";else if (format == "jA") return "بعد از ظهر";
	    return "ب.ظ";
	  }
	};

	var isDate = function isDate(date) {
	  return date instanceof Date;
	};

	var jalali$4 = function jalali(year) {
	  var array = year > 1342 ? [1, 5, 9, 13, 17, 22, 26, 30] : [1, 5, 9, 13, 17, 21, 26, 30];
	  var remainder = year % 33;
	  return array.includes(remainder);
	};

	var gregorian$4 = function gregorian(year) {
	  return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
	};

	var isLeapYear = function isLeapYear(calendar, year) {
	  // calendar[0] ==> first letter of calendar ('j' | 'g' | ...)
	  switch (calendar[0]) {
	    case "j":
	      return jalali$4(year);

	    default:
	      return gregorian$4(year);
	  }
	};

	var isPersianDate = function isPersianDate(date) {
	  return date instanceof PersianDate;
	};

	var isValid = function isValid(calendar, year, month, day, hour, minute, second, millisecond) {
	  return isValidDate(calendar, year, month, day) && isValidTime(hour, minute, second, millisecond);
	};

	var jalali$3 = function jalali(year, month, day) {
	  if (month >= 7 && month <= 11 && day == 31) return false;
	  if (month == 12 && day == 31) return false;
	  if (month == 12 && day == 30 && !isLeapYear("j", year)) return false;
	  return true;
	};

	var gregorian$3 = function gregorian(year, month, day) {
	  if ([2, 4, 6, 9, 11].includes(month) && day == 31) return false;
	  if (month == 2 && (day == 30 || day == 29 && !isLeapYear("g", year))) return false;
	  return true;
	};

	var isValidDate = function isValidDate(calendar, year, month, day) {
	  if ([year, month, day].some(function (e) {
	    return String(e).search(/null|NaN/) != -1;
	  })) return false;
	  if (year < 0 || month > 12 || month < 1 || day > 31 || day < 1) return false;

	  switch (calendar[0]) {
	    case "j":
	      return jalali$3(year, month, day);

	    default:
	      return gregorian$3(year, month, day);
	  }
	};

	var isValidTime = function isValidTime(hour, minute, second, millisecond) {
	  if ([hour, minute, second, millisecond].some(function (e) {
	    return String(e).search(/null|NaN/) != -1;
	  })) return false;
	  if (hour < 0 || hour > 23) return false;
	  if (minute < 0 || minute > 59) return false;
	  if (second < 0 || second > 59) return false;
	  if (millisecond < 0 || millisecond > 999) return false;
	  return true;
	};

	function isSame() {
	  var date = typesToArray.apply(void 0, [this.c].concat(Array.prototype.slice.call(arguments)));
	  date = this.toArray().map(function (value, i) {
	    return REGEX["isNumeric"].test(date[i]) ? date[i] : value;
	  });
	  return compare.call(this, date, "==");
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}

	function _iterableToArrayLimit(arr, i) {
	  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

	  if (!it) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike) {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = it.call(o);
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	var matchingDate = function matchingDate(date, mainDate) {
	  mainDate.year(date[0] || mainDate.year());
	  mainDate.month(date[1] || mainDate.month());
	  mainDate.date(date[2] || mainDate.date());
	  mainDate.hour(date[3] || mainDate.hour());
	  mainDate.minute(date[4] || mainDate.minute());
	  mainDate.second(date[5] || mainDate.second());
	  mainDate.millisecond(date[6] || mainDate.millisecond());
	  return mainDate.toArray();
	};

	function isBetween(from, to, method) {
	  from = typesToArray(this.c, from);
	  from = matchingDate(from, this.clone());
	  to = typesToArray(this.c, to);
	  to = matchingDate(to, this.clone());
	  if (!(this.isValid.apply(this, _toConsumableArray(from)) && this.isValid.apply(this, _toConsumableArray(to)))) return false;
	  return compare.call(this, from, method[0] === "[" ? ">=" : ">") && compare.call(this, to, method[1] === "]" ? "<=" : "<");
	}

	function isInArray(array) {
	  var _this = this;

	  return array.some(function (date) {
	    return isSame.call(_this, date);
	  });
	}

	/**
	 * Gregorian to Jalali
	 * @param {Null|Date|Number|String} [year=new Date()] - Gregorian year
	 * @param {Null|Number|String} [month=1] - Gregorian month
	 * @param {Null|Number|String} [day=1] - Gregorian day
	 * @param {Null|Number|String} [hour=0] - Gregorian hour
	 * @param {Null|Number|String} [minute=0] - Gregorian minute
	 * @param {Null|Number|String} [second=0] - Gregorian second
	 * @param {Null|Number|String} [millisecond=0] - Gregorian millisecond
	 * @returns {Array} Jalali date
	 */

	var gtj = function gtj(year, month, day, hour, minute, second, millisecond) {
	  var date;
	  if (!year) date = new Date();else if (isDate(year)) // if the year was an instance of Date
	    date = year;else date = new Date(REGEX["isNumeric"].test(year) ? year : 0, REGEX["isNumeric"].test(month) ? month : 0, REGEX["isNumeric"].test(day) ? day : 1, REGEX["isNumeric"].test(hour) ? hour : 0, REGEX["isNumeric"].test(minute) ? minute : 0, REGEX["isNumeric"].test(second) ? second : 0, REGEX["isNumeric"].test(millisecond) ? millisecond : 0);
	  day = date.getDate();
	  month = date.getMonth() + 1; // Because the output of getMonth() start from zero, add one

	  year = date.getFullYear();
	  hour = date.getHours();
	  minute = date.getMinutes();
	  second = date.getSeconds();
	  millisecond = date.getMilliseconds();
	  var jYear, jMonth, jDay;
	  var pastDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]; // Past days from the start of the year in each month

	  if (year > 1600) {
	    jYear = 979;
	    year -= 1600;
	  } else {
	    jYear = 0;
	    year -= 621;
	  }

	  var newYear = month > 2 ? year + 1 : year;
	  var days = 365 * year + parseInt((newYear + 3) / 4) - parseInt((newYear + 99) / 100) + parseInt((newYear + 399) / 400) - 80 + day + pastDaysInMonth[month - 1];
	  jYear += 33 * parseInt(days / 12053);
	  days %= 12053;
	  jYear += 4 * parseInt(days / 1461);
	  days %= 1461;

	  if (days > 365) {
	    jYear += parseInt((days - 1) / 365);
	    days = (days - 1) % 365;
	  }

	  jMonth = days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
	  jDay = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
	  return [jYear, jMonth, jDay, hour, minute, second, millisecond];
	};

	/**
	 * Jalali to Gregorian
	 * @param {Null|Number|String} year - Jalali year
	 * @param {Null|Number|String} [month=1] -  Jalali month
	 * @param {Null|Number|String} [day=1] -  Jalali day
	 * @param {Null|Number|String} [hour=0] -  Jalali hour
	 * @param {Null|Number|String} [minute=0] -  Jalali minute
	 * @param {Null|Number|String} [second=0] -  Jalali second
	 * @param {Null|Number|String} [millisecond=0] -  Jalali millisecond
	 * @returns {Date} Gregorian date
	 */

	var jtg = function jtg(year, month, day, hour, minute, second, millisecond) {
	  //plus sign before a variable, convert variable to int
	  year = REGEX["isNumeric"].test(year) ? +year : 1;
	  month = REGEX["isNumeric"].test(month) ? +month : 1;
	  day = REGEX["isNumeric"].test(day) ? +day : 1;
	  hour = REGEX["isNumeric"].test(hour) ? +hour : 0;
	  minute = REGEX["isNumeric"].test(minute) ? +minute : 0;
	  second = REGEX["isNumeric"].test(second) ? +second : 0;
	  millisecond = REGEX["isNumeric"].test(millisecond) ? +millisecond : 0;
	  var gYear, gMonth, gDay;

	  if (year > 979) {
	    gYear = 1600;
	    year -= 979;
	  } else {
	    gYear = 621;
	  }

	  var days = 365 * year + parseInt(year / 33) * 8 + parseInt((year % 33 + 3) / 4) + 78 + day + (month < 7 ? (month - 1) * 31 : (month - 7) * 30 + 186);
	  gYear += 400 * parseInt(days / 146097);
	  days %= 146097;

	  if (days > 36524) {
	    gYear += 100 * parseInt(--days / 36524);
	    days %= 36524;
	    if (days >= 365) days++;
	  }

	  gYear += 4 * parseInt(days / 1461);
	  days %= 1461;

	  if (days > 365) {
	    gYear += parseInt((days - 1) / 365);
	    days = (days - 1) % 365;
	  }

	  gDay = days + 1;
	  var daysOfMonths = [0, 31, isLeapYear("gregorian", gYear) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	  for (gMonth = 0; gMonth < 13; gMonth++) {
	    var v = daysOfMonths[gMonth];
	    if (gDay <= v) break;
	    gDay -= v;
	  }

	  return new Date(gYear, gMonth - 1, gDay, hour, minute, second, millisecond);
	};

	/**
	 * show warning
	 * @since 2.0.0
	 * @param {String} msg - the message for warning
	 */
	var warn = function warn(msg) {
	  console.warn(msg);
	};

	/**
	 * show error
	 * @since 3.0.0
	 * @param {String} msg - the message for error
	 */
	var error = function error(msg) {
	  console.error(msg);
	};

	/**
	 * make error and delete this.d
	 * @param {String} errorText - Error Text
	 * @returns {PersianDate} make error and return class
	 */
	var invalid = function invalid(errorText) {
	  delete this.d;
	  this.error = errorText;
	  return this;
	};

	/**
	 * convert String or Array or Object or PersianDate to Array
	 * @since 1.2.0
	 * @param {String|Array|Object|Number} year - this param must be string or array or Object from date or year
	 * @param {String|Number} year.y - year of date
	 * @param {Null|String|Number} year.year - year of date
	 * @param {Null|String|Number} year.years - year of date
	 * @param {Null|String|Number} year.M - month of date
	 * @param {Null|String|Number} year.month - month of date
	 * @param {Null|String|Number} year.months - month of date
	 * @param {Null|String|Number} year.d - day of date
	 * @param {Null|String|Number} year.day - day of date
	 * @param {Null|String|Number} year.days - day of date
	 * @param {Null|String|Number} year.date - day of date
	 * @param {Null|String|Number} year.h - hour of date
	 * @param {Null|String|Number} year.hour - hour of date
	 * @param {Null|String|Number} year.hours - hour of date
	 * @param {Null|String|Number} year.m - minute of date
	 * @param {Null|String|Number} year.minute - minute of date
	 * @param {Null|String|Number} year.minutes - minute of date
	 * @param {Null|String|Number} year.s - second of date
	 * @param {Null|String|Number} year.second - second of date
	 * @param {Null|String|Number} year.seconds - second of date
	 * @param {Null|String|Number} year.ms - millisecond of date
	 * @param {Null|String|Number} year.millisecond - millisecond of date
	 * @param {Null|String|Number} year.milliseconds - millisecond of date
	 * @param {Null|Number|String} month month of date
	 * @param {Null|Number|String} day day of date
	 * @param {Null|Number|String} hour hour of date
	 * @param {Null|Number|String} minute minute of date
	 * @param {Null|Number|String} second second of date
	 * @param {Null|Number|String} millisecond millisecond of date
	 * @returns {Array} array includes year, month, date, hour, minute, second, millinsecond
	 */

	var typesToArray = function typesToArray(calendar, year, month, date, hour, minute, second, millisecond) {
	  if (!year) // if year not defined
	    year = new Date(); // return now

	  if (typeof year == "string" && year.search(REGEX["separators"]) != -1) {
	    return year.split(/[/ -.,:\\]/);
	  } else if (Array.isArray(year)) {
	    return year;
	  } else if (PersianDate.isPersianDate(year)) {
	    return year.clone().calendar(calendar).toArray();
	  } else if (PersianDate.isDate(year)) {
	    return new PersianDate(year).calendar(calendar).toArray();
	  } else if (Object.prototype.toString.call(year) === "[object Object]") {
	    return [year.y || year.year || year.years, year.M || year.month || year.months || 1, year.d || year.day || year.days || year.date || 1, year.h || year.hour || year.hours || 0, year.m || year.minute || year.minutes || 0, year.s || year.second || year.seconds || 0, year.ms || year.millisecond || year.milliseconds || 0];
	  }

	  return [year, month, date, hour, minute, second, millisecond];
	};

	/**
	 * returns the ordinal number of that number sent to it
	 * @param {Number} number - the number that gives ordinal number --> from 1 to 366
	 * @param {'jalali','gregorian'} calendar - the calendar
	 * @param {?Number} mode  - 'jalali' calendar have two mode of ordinal number
	 * @returns {String} ordinal number
	 * @example 1st | اول | اولین
	 */

	var ordinalNumber = function ordinalNumber(number) {
	  var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "jalali";
	  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
	  return CALENDAR[calendar].ordinalNumbers(number, mode);
	};

	/**
	 * add a prefix to the text in the number of characters that the text has less
	 * @param {String|Number} text a text need prefix
	 * @param {Number} length length of text
	 * @param {String} [prefix=0] - string for add before of text
	 * @returns {String} text with or wihtout prefix
	 */
	var addPrefix = function addPrefix(text, length) {
	  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "0";
	  return prefix.repeat(length - String(text).length) + text;
	};

	/**
	 * set the date with Date instance
	 * @since 2.0.0
	 * @param {Date} date - the Date
	 */

	var setJalaliDate = function setJalaliDate(date) {
	  var _gtj = gtj(date);

	  var _gtj2 = _slicedToArray(_gtj, 7);

	  this.d.year = _gtj2[0];
	  this.d.month = _gtj2[1];
	  this.d.date = _gtj2[2];
	  this.d.hour = _gtj2[3];
	  this.d.minute = _gtj2[4];
	  this.d.second = _gtj2[5];
	  this.d.millisecond = _gtj2[6];
	};

	/**
	 * set the date with Date instance
	 * @since 2.0.0
	 * @param {Date} date - the Date instance
	 */
	var setGregorianDate = function setGregorianDate(date) {
	  this.d = {
	    year: date.getFullYear(),
	    month: date.getMonth() + 1,
	    date: date.getDate(),
	    hour: date.getHours(),
	    minute: date.getMinutes(),
	    second: date.getSeconds(),
	    millisecond: date.getMilliseconds()
	  };
	};

	/**
	 * get label of day
	 * @param {Date} date - the date that received day
	 * @param {'jalali'|'gregorian'} calendar - the calendar
	 * @returns {String} returns day label
	 * @example Saturday | شنبه
	 */

	var getDayLabel = function getDayLabel() {
	  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
	  var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "jalali";
	  if (isDate(date)) return CALENDAR[calendar]["days"]["label"][date.getDay()];
	  return error("the first param must be instance of Date.");
	};

	/**
	 * get the day of the week
	 * @param {Date} date - the date that received day of week
	 * @param {'jalali', 'gregorian'} calendar - the calendar
	 * @param {'standard','array'} mode - standard mode start from 1 and array mode start from 0
	 * @returns {Number|String} the number of the day of week
	 */

	var getDayOfWeek = function getDayOfWeek() {
	  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
	  var calendar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "jalali";
	  var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "standard";

	  if (isDate(date)) {
	    // if the year was an instance of Date
	    return CALENDAR[calendar]["days"]["weekNumber"][date.getDay()] + (mode != "standard" ? 0 : 1);
	  }

	  return error("the first param must be instance of Date.");
	};

	var getDefaultFormat$4 = function getDefaultFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jy";

	    default:
	      return "y";
	  }
	};

	function year(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    this.d.year = +format;

	    if (!this.isValidDate()) {
	      return this.subDay(1, false);
	    }

	    return this;
	  } else {
	    if (!format) format = getDefaultFormat$4(this.c);
	    var jYear = this.c == "jalali" ? this.d.year : gtj(this.toDate())[0];
	    if (format == "jy" || format == "jYYYY") return jYear;
	    if (format == "jYY") return String(jYear).slice(-2);
	    var gYear = this.c == "gregorian" ? this.d.year : this.toDate().getFullYear();
	    if (format == "y" || format == "YYYY") return gYear;
	    if (format == "YY") return String(gYear).slice(-2);
	    return jYear;
	  }
	}

	var getDefaultFormat$3 = function getDefaultFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jQ";

	    default:
	      return "Q";
	  }
	};

	function quarter(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 1) {
	      this.d.month = 1;
	      this.subQuarter(format - 1, false);
	    } else if (format > 4) {
	      this.d.month = 12;
	      this.addQuarter(format - 4, false);
	    } else {
	      this.d.month = +format * 3 - 2;
	    }

	    while (!this.isValidDate()) {
	      this.subDay(1, false);
	    }

	    return this;
	  } else {
	    if (!format) format = getDefaultFormat$3(this.c);
	    var jQuarter = Math.ceil((this.c == "jalali" ? this.d.month : gtj(this.toDate())[1]) / 3);
	    if (format == "jQ") return jQuarter;
	    if (format == "jQo") return ordinalNumber(jQuarter);
	    if (format == "jQO") return ordinalNumber(jQuarter, "jalali", 2);
	    var gQuarter = Math.ceil((this.c == "gregorian" ? this.d.month : this.toDate().getMonth() + 1) / 3);
	    if (format == "Q") return gQuarter;
	    if (format == "Qo" || format == "QO") return ordinalNumber(gQuarter, "gregorian");
	    return jQuarter;
	  }
	}

	var getDefaultFormat$2 = function getDefaultFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jM";

	    default:
	      return "M";
	  }
	};

	function month(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 1) {
	      this.d.month = 1;
	      this.subMonth(format - 1, false);
	    } else if (format > 12) {
	      this.d.month = 12;
	      this.addMonth(format - 12, false);
	    } else {
	      this.d.month = +format;
	    }

	    while (!this.isValidDate()) {
	      this.subDay(1, false);
	    }

	    return this;
	  } else {
	    if (!format) format = getDefaultFormat$2(this.c);
	    var jMonth = this.c == "jalali" ? this.d.month : gtj(this.toDate())[1];
	    if (format == "jMM") return addPrefix(jMonth, 2);
	    if (format == "jM") return jMonth;
	    if (format == "jMMMM" || format == "jMMM") return CALENDAR["jalali"]["months"][jMonth];
	    if (format == "jMo") return ordinalNumber(jMonth);
	    if (format == "jMO") return ordinalNumber(jMonth, "jalali", 2);
	    var gMonth = this.c == "gregorian" ? this.d.month : this.toDate().getMonth() + 1;
	    if (format == "M") return gMonth;
	    if (format == "MM") return addPrefix(gMonth, 2);
	    if (format == "MMMM") return CALENDAR["gregorian"]["months"][gMonth];
	    if (format == "Mo" || format == "MO") return ordinalNumber(gMonth, "gregorian");
	    if (format == "MMM") return CALENDAR["gregorian"]["months"][gMonth].slice(0, 3);
	    return jMonth;
	  }
	}

	var getDefaultFormat$1 = function getDefaultFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jw";

	    default:
	      return "w";
	  }
	};

	function week(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    var weeksInYear = this.getWeeksInYear();

	    if (format < 1) {
	      this.week(1);
	      this.subWeek(format - 1, false);
	    } else if (format > weeksInYear) {
	      this.week(weeksInYear);
	      this.addWeek(format - weeksInYear, false);
	    } else {
	      var weekOfYear = getWeekOfYear.call(this, this.d.year, this.d.month, this.d.date, this.c);
	      this.addWeek(+format - weekOfYear);
	    }

	    while (!this.isValidDate()) {
	      this.subDay(1, false);
	    }

	    return this;
	  } else {
	    if (!format) format = getDefaultFormat$1(this.c);
	    var jWeekOfYear = getWeekOfYear.call(this, this.year("jy"), this.month("jM"), this.date("jD"), this.c);
	    if (format == "jw" || format == "jW") return jWeekOfYear;
	    if (format == "jww" || format == "jWW") return addPrefix(jWeekOfYear, 2);
	    if (format == "jwo" || format == "jWo") return ordinalNumber(jWeekOfYear);
	    if (format == "jwO" || format == "jWO") return ordinalNumber(jWeekOfYear, "jalali", 2);
	    var gWeekOfYear = getWeekOfYear.call(this, this.year("y"), this.month("M"), this.date("D"), "gregorian");
	    if (format == "w" || format == "W") return gWeekOfYear;
	    if (format == "ww" || format == "WW") return addPrefix(gWeekOfYear, 2);
	    if (format == "wo" || format == "Wo" || format == "wO" || format == "WO") return ordinalNumber(gWeekOfYear, "gregorian");
	    return jWeekOfYear;
	  }
	}

	var getDefaultFormat = function getDefaultFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jD";

	    default:
	      return "D";
	  }
	};

	function date(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    var daysInMonth = this.getDaysInMonth();

	    if (format < 1) {
	      this.d.date = 1;
	      this.subDay(format - 1);
	    } else if (format > daysInMonth) {
	      this.d.date = daysInMonth;
	      this.addDay(format - daysInMonth);
	    } else {
	      this.d.date = +format;
	    }

	    return this;
	  } else {
	    if (!format) format = getDefaultFormat(this.c);
	    var jDate = this.c == "jalali" ? this.d.date : gtj(this.toDate())[2]; //---------- Day of Month ----------//

	    if (format == "jDD") return addPrefix(jDate, 2);
	    if (format == "jD") return jDate;
	    if (format == "jDo") return ordinalNumber(jDate);
	    if (format == "jDO") return ordinalNumber(jDate, "jalali", 2); //---------- Day of Week ----------//

	    var gDate = this.toDate();
	    if (format == "jdddd" || format == "jddd") return getDayLabel(gDate);
	    if (format == "jdd") return getDayLabel(gDate).slice(0, 1);
	    var dayOfWeek = getDayOfWeek(gDate);
	    if (format == "jdo") return ordinalNumber(dayOfWeek);
	    if (format == "jdO") return ordinalNumber(dayOfWeek, "jalali", 2);
	    if (format == "jd") return getDayOfWeek(gDate, "jalali", "array");
	    if (format == "jde") return dayOfWeek; //---------- Day of Year ----------//

	    var dayOfYear = getDayOfYear(this.year("jy"), this.month("jM"), jDate, "j");
	    if (format == "jDDDD") return addPrefix(dayOfYear, 3);
	    if (format == "jDDD") return dayOfYear;
	    if (format == "jDDDo") return ordinalNumber(dayOfYear);
	    if (format == "jDDDO") return ordinalNumber(dayOfYear, "jalali", 2); //---------- Day of Month ----------//

	    if (format == "DD") return addPrefix(gDate.getDate(), 2);
	    if (format == "D") return gDate.getDate();
	    if (format == "Do" || format == "DO") return ordinalNumber(gDate.getDate(), "gregorian"); //---------- Day of Week ----------//

	    if (format == "dddd") return getDayLabel(gDate, "gregorian");
	    if (format == "ddd") return getDayLabel(gDate, "gregorian").slice(0, 3);
	    if (format == "dd") return getDayLabel(gDate, "gregorian").slice(0, 2);
	    dayOfWeek = getDayOfWeek(gDate, "gregorian");
	    if (format == "do" || format == "dO") return ordinalNumber(dayOfWeek, "gregorian");
	    if (format == "d") return dayOfWeek - 1;
	    if (format == "de") return dayOfWeek; //---------- Day of Year ----------//

	    dayOfYear = getDayOfYear(gDate.getFullYear(), gDate.getMonth() + 1, gDate.getDate(), "g");
	    if (format == "DDDD") return addPrefix(dayOfYear, 3);
	    if (format == "DDD") return dayOfYear;
	    if (format == "DDDo" || format == "DDDO") return ordinalNumber(dayOfYear, "gregorian");
	    return jDate;
	  }
	}

	function hour(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 0) {
	      this.d.hour = 0;
	      this.subHour(format);
	    } else if (format > 23) {
	      this.d.hour = 23;
	      this.addHour(format - 23);
	    } else {
	      this.d.hour = +format;
	    }

	    return this;
	  } else {
	    var h = this.d.hour;
	    if (format == "H") return h;
	    if (format == "HH") return addPrefix(h, 2);
	    if (format == "k") return h || 24;
	    if (format == "kk") return addPrefix(h || 24, 2);
	    h = h > 12 ? h - 12 : h;
	    if (format == "h") return h;
	    if (format == "hh") return addPrefix(h, 2);
	    return h;
	  }
	}

	function minute(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 0) {
	      this.d.minute = 0;
	      this.subMinute(format);
	    } else if (format > 23) {
	      this.d.minute = 23;
	      this.addMinute(format - 23);
	    } else {
	      this.d.minute = +format;
	    }

	    return this;
	  } else {
	    if (format == "m") return this.d.minute;
	    if (format == "mm") return addPrefix(this.d.minute, 2);
	    return this.d.minute;
	  }
	}

	function second(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 0) {
	      this.d.second = 0;
	      this.subSecond(format);
	    } else if (format > 23) {
	      this.d.second = 23;
	      this.addSecond(format - 23);
	    } else {
	      this.d.second = +format;
	    }

	    return this;
	  } else {
	    if (format == "s") return this.d.second;
	    if (format == "ss") return addPrefix(this.d.second, 2);
	    return this.d.second;
	  }
	}

	function millisecond(format) {
	  format = String(format).trim();

	  if (REGEX["isNumeric"].test(format)) {
	    if (format < 0) {
	      this.d.millisecond = 0;
	      this.subMillisecond(format);
	    } else if (format > 23) {
	      this.d.millisecond = 23;
	      this.addMillisecond(format - 23);
	    } else {
	      this.d.millisecond = +format;
	    }

	    return this;
	  } else {
	    if (format == "CCC" || format == "c") return this.d.millisecond;
	    if (format == "CCCC") return addPrefix(this.d.millisecond, 3);
	    return this.d.millisecond;
	  }
	}

	function timestamp(value) {
	  if (value) {
	    return this.fromGregorian(+String(value).trim());
	  } else {
	    return this.toDate().getTime();
	  }
	}

	var jalali$2 = function jalali(calendar, year, month) {
	  if (month >= 1 && month <= 6) return 31;else if (month > 6 && month <= 11 || isLeapYear(calendar, year)) {
	    return 30;
	  }
	  return 29;
	};

	var gregorian$2 = function gregorian(calendar, year, month) {
	  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) return 31;else if (month != 2) return 30;else if (isLeapYear(calendar, year)) return 29;
	  return 28;
	};

	var getDaysInMonth = function getDaysInMonth(calendar, year, month) {
	  switch (calendar[0]) {
	    case "j":
	      return jalali$2(calendar, year, month);

	    default:
	      return gregorian$2(calendar, year, month);
	  }
	};

	var getDayOfYearFormat = function getDayOfYearFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jd";

	    default:
	      return "d";
	  }
	};

	function getWeeksInYear(year) {
	  var dayOfYearFormat = getDayOfYearFormat(this.c);
	  var firstOfYear = this.clone().parse(year);
	  var firstOfYearDay = firstOfYear.date(dayOfYearFormat);
	  var lastOfYear = firstOfYear.clone().endOf("year").startOf("day");
	  var lastOfYearDay = lastOfYear.date(dayOfYearFormat);
	  if (firstOfYearDay > 3) firstOfYear.addDay(7 - firstOfYearDay);else firstOfYear.subDay(firstOfYearDay);
	  if (lastOfYearDay > 3) lastOfYear.addDay(7 - lastOfYearDay);else lastOfYear.subDay(lastOfYearDay);
	  return Math.ceil(lastOfYear.diff(firstOfYear, "date") / 7);
	}

	function startOf(unit) {
	  this.d.millisecond = 0;
	  if (unit[0] == "s") return this;
	  this.d.second = 0;
	  if (unit == "m" || unit == "minute") return this;
	  this.d.minute = 0;
	  if (unit[0] == "h") return this;
	  this.d.hour = 0;
	  if (unit[0] == "d") return this;
	  if (unit[0] == "w") return this.subDay(getDayOfWeek(this.toDate(), this.c, "array"));
	  this.d.date = 1;
	  if (unit[0] == "q") return this.quarter(this.quarter());
	  if (unit == "M" || unit == "month") return this;
	  this.d.month = 1;
	  if (unit[0] == "y") return this;
	}

	function endOf(unit) {
	  this.d.millisecond = 999;
	  if (unit[0] == "s") return this;
	  this.d.second = 59;
	  if (unit == "m" || unit == "minute") return this;
	  this.d.minute = 59;
	  if (unit[0] == "h") return this;
	  this.d.hour = 23;
	  if (unit[0] == "d") return this;
	  if (unit[0] == "w") return this.addDay(7 - getDayOfWeek(this.toDate(), this.c));

	  if (unit[0] == "q") {
	    this.quarter(this.quarter()).addMonth(2);
	    this.d.date = this.getDaysInMonth();
	    return this;
	  }

	  this.d.date = this.getDaysInMonth();
	  if (unit == "M" || unit == "month") return this;
	  this.d.month = 12;
	  this.d.date = this.getDaysInMonth();
	  if (unit[0] == "y") return this;
	}

	function time() {
	  for (var _len = arguments.length, t = new Array(_len), _key = 0; _key < _len; _key++) {
	    t[_key] = arguments[_key];
	  }

	  if (!t.length) return this.toArray().slice(3);
	  var times = [];
	  if (isPersianDate(t[0])) times = t[0].time();else if (isDate(t[0])) times = [t[0].getHours(), t[0].getMinutes(), t[0].getSeconds(), t[0].getMilliseconds()];else if (Object.prototype.toString.call(t[0]) === "[object Object]") times = [t[0].h || t[0].hour || t[0].hours || 0, t[0].m || t[0].minute || t[0].minutes || 0, t[0].s || t[0].second || t[0].seconds || 0, t[0].ms || t[0].millisecond || t[0].milliseconds || 0];else times = typesToArray.apply(void 0, [this.c].concat(t));

	  if (this.isValidTime.apply(this, _toConsumableArray(times))) {
	    return this.hour(times[0] || 0).minute(times[1] || 0).second(times[2] || 0).millisecond(times[3] || 0);
	  } else return "زمان نامعتبر";
	}

	/**
	 * get the day of the year
	 * @param {Null|String|Number} year - the year of date
	 * @param {Null|Number|String} month - the month of date that gives the day of the year
	 * @param {Null|Number|String} day - the day of date that gives the day of the year
	 * @param {Null|Number|String} calendar - the calendar
	 * @returns {Number} the day of the year
	 */

	var getDayOfYear = function getDayOfYear(year, month, day, calendar) {
	  //plus sign before a variable, convert variable to int
	  month = +month;
	  day = +day;

	  while (--month != 0) {
	    day += getDaysInMonth(calendar, year, month);
	  }

	  return day;
	};

	var dayOfYearFormat = function dayOfYearFormat(calendar) {
	  switch (calendar[0]) {
	    case "j":
	      return "jd";

	    default:
	      return "d";
	  }
	};
	/**
	 * get the week of the year
	 * @param {Null|Number|String} year - the year of date that gives the week of the year
	 * @param {Null|Number|String} month - the month of date that gives the week of the year
	 * @param {Null|Number|String} day - the day of date that gives the week of the year
	 * @param {String} calendar - the calendar
	 * @returns {Number} the week of the year
	 */


	var getWeekOfYear = function getWeekOfYear(year, month, day, calendar) {
	  var firstOfYear = this.clone().calendar(calendar).parse(year);
	  var firstOfYearDay = firstOfYear.date(dayOfYearFormat(calendar));
	  var date = firstOfYear.clone().parse(year, month, day);
	  if (firstOfYearDay > 3) firstOfYear.addDay(7 - firstOfYearDay);
	  var weekNumber = Math.ceil(date.diff(firstOfYear, "date", true) / 7);
	  var weeksInYear = date.clone().getWeeksInYear();
	  return weekNumber > weeksInYear ? weeksInYear : weekNumber;
	};

	/**
	 * compare the dates
	 * @since 2.0.0
	 * @param {PersianDate|Date|String|Array|Object} date - the date
	 * @param {'>'|'>='|'<'|'<='|'=='} operator - the operator for compare
	 * @returns {‌Boolean} if date valid, return true of false
	 */

	var compare = function compare(date, operator) {
	  date = typesToArray.apply(void 0, [this.c].concat(_toConsumableArray(date)));
	  if (!this.isValid.apply(this, _toConsumableArray(date))) return false;
	  var left = this.timestamp();
	  var right = this.clone().parse.apply(this.clone(), date).timestamp();
	  switch (operator) {
	    case ">":
	      return left > right;
	    case ">=":
	      return left >= right;
	    case "<":
	      return left < right;
	    case "<=":
	      return left <= right;
	    case "==":
	      return left === right;
	    default:
	      return false;
	  }
	};

	/**
	 * do the math operation on dates
	 * @since 1.4.0
	 * @param {...String|PersianDate|Date|Array|Object} values - the dates
	 * @param {'min'|'max'} operation - the operation
	 * @returns {*} return maximum date
	 * @throws {false} if parameters not send or parameters is invalid, return false
	 */

	var mathOperation = function mathOperation(values, operation) {
	  var _this = this;

	  if (!values.length) {
	    return false;
	  }

	  var args = _toConsumableArray(values);

	  var argsNumber = args.map(function (date) {
	    var _this$clone;

	    date = typesToArray(_this.c, date);
	    if (_this.isValid.apply(_this, _toConsumableArray(date))) return (_this$clone = _this.clone()).parse.apply(_this$clone, _toConsumableArray(date)).timestamp();
	    return false;
	  });
	  if (argsNumber.includes(false)) return false;
	  return args[argsNumber.indexOf(Math[operation].apply(Math, _toConsumableArray(argsNumber)))];
	};

	/**
	 * check the input is timestamp
	 * @since 2.0.0
	 * @param {Number|String} timestamp - input that must be checked
	 * @returns {Boolean} if input was timestamp, return true
	 */
	var isTimestamp = function isTimestamp(timestamp) {
	  return !isNaN(timestamp) && Math.floor(timestamp / 10000) > 0;
	};

	function now() {
	  var date = new Date();

	  if (this.c == "jalali") {
	    setJalaliDate.call(this, date);
	  } else {
	    setGregorianDate.call(this, date);
	  }

	  return this;
	}

	function parse() {
	  if (this.c == "jalali") {
	    return this.fromJalali.apply(this, arguments);
	  } else {
	    return this.fromGregorian.apply(this, arguments);
	  }
	}

	function clone() {
	  return Object.assign(Object.create(Object.getPrototypeOf(this)), JSON.parse(JSON.stringify(this)));
	}

	function fromJalali() {
	  for (var _len = arguments.length, date = new Array(_len), _key = 0; _key < _len; _key++) {
	    date[_key] = arguments[_key];
	  }

	  if (!date.length) date = gtj();else date = typesToArray.apply(void 0, ["jalali"].concat(_toConsumableArray(date)));

	  if (this.c == "jalali") {
	    this.d.year = +date[0];
	    this.d.month = +date[1] || 1;
	    this.d.date = +date[2] || 1;
	    this.d.hour = +date[3] || 0;
	    this.d.minute = +date[4] || 0;
	    this.d.second = +date[5] || 0;
	    this.d.millisecond = +date[6] || 0;
	  } else {
	    setGregorianDate.call(this, jtg.apply(void 0, _toConsumableArray(date)));
	  }

	  if (!this.isValid()) return invalid.call(this, "تاریخ نامعتبر");
	  return this;
	}

	function fromGregorian() {
	  for (var _len = arguments.length, date = new Array(_len), _key = 0; _key < _len; _key++) {
	    date[_key] = arguments[_key];
	  }

	  if (!date.length) date[0] = new Date().getTime();else if (this.isPersianDate(date[0])) {
	    date = date[0].clone().calendar("g").toArray();
	  } else if (!isTimestamp(date[0])) {
	    date = typesToArray.apply(void 0, ["gregorian"].concat(_toConsumableArray(date)));
	    date[6] = +date[6] || 0;
	    date[5] = +date[5] || 0;
	    date[4] = +date[4] || 0;
	    date[3] = +date[3] || 0;
	    date[2] = +date[2] || 1;
	    date[1] = +date[1] || 1;
	    date[0] = +date[0];
	  }

	  if (date.length > 1) {
	    if (!isValid.apply(void 0, ["gregorian"].concat(_toConsumableArray(date)))) return invalid.call(this, "تاریخ نامعتبر");
	    --date[1]; // this is month; becuse the Date get month from 0, subtract one
	  }

	  date = _construct(Date, _toConsumableArray(date));
	  if (date == "Invalid Date") return invalid.call(this, "تاریخ نامعتبر");

	  if (this.c == "jalali") {
	    setJalaliDate.call(this, date);
	  } else {
	    setGregorianDate.call(this, date);
	  }

	  return this;
	}

	function calendar(c) {
	  if (!c) return this.c;

	  if (c[0] == "j" && this.c[0] != "j") {
	    if (!this.error) setJalaliDate.call(this, this.toDate());
	    this.c = "jalali";
	  } else if (c[0] == "g" && this.c[0] != "g") {
	    if (!this.error) setGregorianDate.call(this, this.toDate());
	    this.c = "gregorian";
	  }

	  return this;
	}

	function addYear(year, checkDate) {
	  // if the number was negative, send to subYear method
	  if (year < 0) return this.subYear(Math.abs(year));
	  this.d.year += +year; //plus sign before a variable, convert variable to int

	  while (checkDate && !this.isValidDate()) {
	    this.subDay(1, false);
	  }

	  return this;
	}

	function addQuarter(quarter, checkDate) {
	  // if the number was negative, send to subQuarter method
	  if (quarter < 0) return this.subQuarter(Math.abs(quarter));
	  return this.addMonth(+quarter * 3, checkDate);
	}

	function addMonth(month, checkDate) {
	  if (month < 0) // if the number was negative, send to subMonth method
	    return this.subMonth(Math.abs(month));
	  month = +month; // plus sign before a variable, convert variable to int

	  var monthToStartNewYear = 12 - this.d.month + 1; // monthToStartNewYear -> Number of month to start of new year

	  if (monthToStartNewYear > month) {
	    this.d.month += month;
	  } else {
	    this.addYear(1, false);
	    this.d.month = 1;
	    month -= monthToStartNewYear;

	    while (month >= 12) {
	      month -= 12;
	      this.addYear(1, false);
	    }

	    if (month != 0) {
	      this.d.month += month;
	    }
	  }

	  while (checkDate && !this.isValidDate()) {
	    this.subDay(1, false);
	  }

	  return this;
	}

	function addWeek(week, checkDate) {
	  // if the number was negative, send to subWeek method
	  if (week < 0) return this.subWeek(Math.abs(week));
	  return this.addDay(+week * 7, checkDate);
	}

	function addDay(day) {
	  if (day < 0) // if the number was negative, send to subDay method
	    return this.subDay(Math.abs(day));
	  day = +day; //plus sign before a variable, convert variable to int

	  var dayToStartNextMonth = this.getDaysInMonth() - this.d.date + 1; // dayToStartNextMonth -> Number of day to start of next month

	  if (dayToStartNextMonth > day) {
	    this.d.date += day;
	  } else {
	    this.addMonth(1, false);
	    this.d.date = 1;
	    day -= dayToStartNextMonth;
	    var daysInMonth = this.getDaysInMonth();

	    while (day >= daysInMonth) {
	      day -= daysInMonth;
	      this.addMonth(1, false);
	      daysInMonth = this.getDaysInMonth();
	    }

	    if (day != 0) {
	      this.d.date += day;
	    }
	  }

	  return this;
	}

	function addHour(hour) {
	  if (hour < 0) // if the number was negative, send to subHour method
	    return this.subHour(Math.abs(hour));
	  hour = +hour; //plus sign before a variable, convert variable to int

	  while (hour >= 24) {
	    hour -= 24;
	    this.addDay(1, false);
	  }

	  var hourToNextDay = 24 - this.d.hour; // hourToNextDay -> Number of hour to start of next day

	  if (hour >= hourToNextDay) {
	    this.addDay(1, false);
	    hour -= hourToNextDay;
	    this.d.hour = hour;
	  } else this.d.hour += hour;

	  return this;
	}

	function addMinute(minute) {
	  if (minute < 0) // if the number was negative, send to subMinute method
	    return this.subMinute(Math.abs(minute));
	  minute = +minute; //plus sign before a variable, convert variable to int

	  while (minute >= 60) {
	    this.addHour(1, false);
	    minute -= 60;
	  }

	  var minuteToNextHour = 60 - this.d.minute; // minuteToNextHour -> Number of minute to start of next hour

	  if (minute >= minuteToNextHour) {
	    this.addHour(1, false);
	    minute -= minuteToNextHour;
	    this.d.minute = minute;
	  } else this.d.minute += minute;

	  return this;
	}

	function addSecond(second) {
	  if (second < 0) // if the number was negative, send to subSecond method
	    return this.subSecond(Math.abs(second));
	  second = +second; //plus sign before a variable, convert variable to int

	  while (second >= 60) {
	    this.addMinute(1, false);
	    second -= 60;
	  }

	  var secondToNextMinute = 60 - this.d.second; // secondToNextMinute -> Number of second to start of next Minute

	  if (second >= secondToNextMinute) {
	    this.addMinute(1, false);
	    second -= secondToNextMinute;
	    this.d.second = second;
	  } else this.d.second += second;

	  return this;
	}

	function addMillisecond(millisecond) {
	  if (millisecond < 0) // if the number was negative, send to subMillisecond method
	    return this.subMillisecond(Math.abs(millisecond));
	  millisecond = +millisecond; //plus sign before a variable, convert variable to int

	  while (millisecond >= 1000) {
	    this.addSecond(1, false);
	    millisecond -= 1000;
	  }

	  var millisecondToNextSecond = 1000 - this.d.millisecond; // millisecondToNextSecond -> Number of milllisecond to start of next second

	  if (millisecond >= millisecondToNextSecond) {
	    this.addSecond(1, false);
	    millisecond -= millisecondToNextSecond;
	    this.d.millisecond = millisecond;
	  } else this.d.millisecond += millisecond;

	  return this;
	}

	function subYear(year, checkDate) {
	  this.d.year -= Math.abs(year);

	  while (checkDate && !this.isValidDate()) {
	    this.subDay(1, false);
	  }

	  return this;
	}

	function subQuarter(quarter, checkDate) {
	  quarter = Math.abs(quarter);
	  return this.subMonth(quarter * 3, checkDate);
	}

	function subMonth(month, checkDate) {
	  month = Math.abs(month); //plus sign before a variable, convert variable to int

	  var pastMonth = this.d.month; //pastMonth -> Number of month that is past

	  if (pastMonth > month) {
	    this.d.month -= month;
	  } else {
	    this.subYear(1, false);
	    this.d.month = 12;
	    month -= pastMonth;

	    while (month >= 12) {
	      this.subYear(1, false);
	      month -= 12;
	    }

	    if (month != 0) {
	      this.d.month -= month;
	    }
	  }

	  while (checkDate && !this.isValidDate()) {
	    this.subDay(1, false);
	  }

	  return this;
	}

	function subWeek(week, checkDate) {
	  week = Math.abs(week);
	  return this.subDay(week * 7, checkDate);
	}

	function subDay(day) {
	  day = Math.abs(day);
	  var pastDays = this.d.date; // pastDays -> Number of days that is past

	  if (pastDays > day) {
	    this.d.date -= day;
	  } else {
	    this.subMonth(1, false);
	    var daysInMonth = this.getDaysInMonth();
	    this.d.date = daysInMonth;
	    day -= pastDays;

	    while (day >= daysInMonth) {
	      day -= daysInMonth;
	      this.subMonth(1, false);
	      daysInMonth = this.getDaysInMonth();
	    }

	    this.d.date = daysInMonth - day;
	  }

	  return this;
	}

	function subHour(hour) {
	  hour = Math.abs(hour);

	  while (hour >= 24) {
	    hour -= 24;
	    this.subDay(1, false);
	  }

	  var pastHours = this.d.hour; // pastHours -> Number of hours that is past

	  if (hour > pastHours) {
	    this.subDay(1, false);
	    hour -= pastHours;
	    this.d.hour = 24 - hour;
	  } else this.d.hour -= hour;

	  return this;
	}

	function subMinute(minute) {
	  minute = Math.abs(minute);

	  while (minute >= 60) {
	    minute -= 60;
	    this.subHour(1, false);
	  }

	  var pastMinute = this.d.minute; // pastMinutes -> Number of minutes that is past

	  if (minute > pastMinute) {
	    this.subHour(1, false);
	    minute -= pastMinute;
	    this.d.minute = 60 - minute;
	  } else this.d.minute -= minute;

	  return this;
	}

	function subSecond(second) {
	  second = Math.abs(second);

	  while (second >= 60) {
	    second -= 60;
	    this.subMinute(1, false);
	  }

	  var pastSeconds = this.d.second; // pastSeconds -> Number of seconds that is past

	  if (second > pastSeconds) {
	    this.subMinute(1, false);
	    second -= pastSeconds;
	    this.d.second = 60 - second;
	  } else this.d.second -= second;

	  return this;
	}

	function subMillisecond(millisecond) {
	  millisecond = Math.abs(millisecond);

	  while (millisecond >= 1000) {
	    millisecond -= 1000;
	    this.subSecond(1, false);
	  }

	  var pastMilliseconds = this.d.millisecond; // pastMilliseconds -> Number of milliseconds that is past

	  if (millisecond > pastMilliseconds) {
	    this.subSecond(1, false);
	    millisecond -= pastMilliseconds;
	    this.d.millisecond = 1000 - millisecond;
	  } else this.d.millisecond -= millisecond;

	  return this;
	}

	var jalali$1 = function jalali(format) {
	  return format.replace(/\?/g, "j").replace(/datetime/gi, "jYYYY/jMM/jDD HH:mm").replace(/date/gi, "jYYYY/jMM/jDD").replace(/time/gi, "HH:mm");
	};

	var gregorian$1 = function gregorian(format) {
	  return format.replace(/\?/g, "").replace(/datetime/gi, "YYYY-MM-DD HH:mm").replace(/date/gi, "YYYY-MM-DD").replace(/time/gi, "HH:mm");
	};

	function toString(format) {
	  var rawTexts = [];
	  format = format.replace(REGEX["betweenBacktick"], function (_matched, text) {
	    rawTexts.push(text);
	    return "###";
	  });

	  switch (this.c[0]) {
	    case "j":
	      format = jalali$1(format);
	      break;

	    default:
	      format = gregorian$1(format);
	  }

	  var matchedFormats = format.match(REGEX["format"]);
	  var dateString = "";

	  var _iterator = _createForOfIteratorHelper(matchedFormats),
	      _step;

	  try {
	    for (_iterator.s(); !(_step = _iterator.n()).done;) {
	      var _i = _step.value;
	      dateString += format.substring(0, format.indexOf(_i));
	      if (_i.search(/Y|y/) != -1) dateString += this.year(_i);else if (_i.search(/M/) != -1) dateString += this.month(_i);else if (_i.search(/Q/) != -1) dateString += this.quarter(_i);else if (_i.search(/D|d/) != -1) dateString += this.date(_i);else if (_i.search(/W|w/) != -1) dateString += this.week(_i);else if (_i.search(/H|h|k/) != -1) dateString += this.hour(_i);else if (_i.search(/m/) != -1) dateString += this.minute(_i);else if (_i.search(/s/) != -1) dateString += this.second(_i);else if (_i.search(/c|C/) != -1) dateString += this.millisecond(_i);else if (_i.search(/t/) != -1) dateString += this.timestamp();else if (_i.search(/a|A/) != -1) dateString += TIMETYPE(this.d.hour, _i);
	      format = format.substr(format.indexOf(_i) + _i.length);
	    }
	  } catch (err) {
	    _iterator.e(err);
	  } finally {
	    _iterator.f();
	  }

	  dateString += format;

	  for (var i = 0; i < rawTexts.length; i++) {
	    dateString = dateString.replace("###", rawTexts[i]);
	  }

	  return String(dateString);
	}

	function toArray() {
	  if (!arguments.length) {
	    return Object.values(this.d);
	  }

	  var formats = typesToArray.apply(void 0, [this.c].concat(Array.prototype.slice.call(arguments)));
	  return [this.year(formats[0]), this.month(formats[1]), this.date(formats[2]), this.hour(formats[3]), this.minute(formats[4]), this.second(formats[5]), this.millisecond(formats[6])];
	}

	function toObject() {
	  if (!arguments.length) {
	    return this.d;
	  }

	  var formats = typesToArray.apply(void 0, [this.c].concat(Array.prototype.slice.call(arguments)));
	  return {
	    year: this.year(formats[0]),
	    month: this.month(formats[1]),
	    date: this.date(formats[2]),
	    hour: this.hour(formats[3]),
	    minute: this.minute(formats[4]),
	    second: this.second(formats[5]),
	    millisecond: this.millisecond(formats[6])
	  };
	}

	var jalali = function jalali(date) {
	  return jtg.apply(void 0, _toConsumableArray(date));
	};

	var gregorian = function gregorian(date) {
	  --date[1];
	  return _construct(Date, _toConsumableArray(date));
	};

	function toDate() {
	  switch (this.c[0]) {
	    case "j":
	      return jalali(this.toArray());

	    default:
	      return gregorian(this.toArray());
	  }
	}

	function diff(date, unit, addOne) {
	  var _this$clone;

	  date = typesToArray(this.c, date);
	  if (!this.isValid.apply(this, _toConsumableArray(date))) return "تاریخ نامعتبر";

	  var result = this.timestamp() - (_this$clone = this.clone()).parse.apply(_this$clone, _toConsumableArray(date)).timestamp();

	  switch (unit) {
	    case "y":
	    case "year":
	    case "years":
	      result = this.d.year - date[0];
	      break;

	    case "M":
	    case "month":
	    case "months":
	      result = this.d.year * 12 + this.d.month - (+date[0] * 12 + +date[1]);
	      break;

	    case "d":
	    case "date":
	    case "day":
	    case "days":
	      result = Math.ceil(result / 1000 / 60 / 60 / 24);
	      break;

	    case "h":
	    case "hour":
	    case "hours":
	      result = Math.ceil(result / 1000 / 60 / 60);
	      break;

	    case "m":
	    case "minute":
	    case "minutes":
	      result = Math.ceil(result / 1000 / 60);
	      break;

	    case "s":
	    case "second":
	    case "seconds":
	      result = Math.ceil(result / 1000);
	      break;
	  }

	  return addOne ? result + (result >= 0 ? 1 : -1) : result;
	}

	function diffForHumans(date, suffix) {
	  var result = this.diff(date, "s");
	  if (typeof result == "string") return "تاریخ نامعتبر";
	  var prefix = suffix && (result > 0 ? "آینده" : "پیش");
	  result = Math.abs(result);
	  if (result == 0) return "هم اکنون";else if (result < 45) result = "لحظات";else if ((result /= 60) < 45) // divide by 60, for getting minute
	    result = Math.round(result) + " " + "دقیقه";else if ((result /= 60) < 23.5) // divide by 60, for getting hour
	    result = Math.round(result) + " " + "ساعت";else if ((result /= 24) < 26) // divide by 24, for getting day
	    result = Math.round(result) + " " + "روز";else if (result < 320) result = Math.round(result / 30) + " " + "ماه";else result = Math.round(result / 365) + " " + "سال";
	  return result + (suffix ? " " + prefix : "");
	}

	////////////////////---------- Are You Ready? ----------////////////////////
	/**
	 * A Date library for working with persian date
	 * @class
	 * @param {Date|Array|Null|Object|String} date - the date that convert to persian date
	 * @param {String} [calendar='jalali'] - the calendar
	 */

	var PersianDate = function PersianDate(dateVal, calendarVal) {
	  /**
	   * keeps the date and time
	   * @type {Object}
	   * @property {Number} year - the year of date
	   * @property {Number} month - the month of date
	   * @property {Number} date - the day of month of date
	   * @property {Number} hour - the hour of time
	   * @property {Number} minute - the minute of time
	   * @property {Number} second - the second of time
	   * @property {Number} millisecond - the millisecond of time
	   * @property {Number} gregorian - the gregorian date
	   */

	  this.d = {};
	  /**
	   * the calendar type
	   * @type {String}
	   * @default "jalali"
	   * @example jalali | gregorian
	   */

	  this.c = "jalali"; ////////////////////--------- create & parse ---------/////////////////////

	  /**
	   * make current date in persian calendar
	   * @returns {PersianDate} make current date and return class
	   */

	  PersianDate.prototype.now = function () {
	    if (this.error) {
	      delete this.error;
	      this.d = {};
	    }

	    return now.call(this);
	  };
	  /**
	   * set persian date from Gregorian date
	   * @deprecated
	   * @param {...Number|Date|Array|Null} date - the date that convert to persian date
	   * @returns {PersianDate} return class with persian date
	   * @throws {PersianDate|String} if date invalid return class with error property with error property
	   */


	  PersianDate.prototype.setDate = function () {
	    warn('"setDate" function is deprecated! use "fromGregorian" function instead.\n' + "https://alireza-ab.ir/persian-date/create-and-parse#from-gregorian-date");
	    return this.fromGregorian.apply(this, arguments);
	  };
	  /**
	   * convert a jalali or gregorian date to PersianDate instance
	   * @param {String|Array|Object|Number} year - this param must be string of date or array of date or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {PersianDate} return class with persian date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.parse = function () {
	    return parse.call.apply(parse, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * get clone of this date
	   * @since 1.1.0
	   * @returns {PersianDate} returns the clone of this date
	   */


	  PersianDate.prototype.clone = function () {
	    return clone.call(this);
	  };
	  /**
	   * convert a jalali date to PersianDate instance
	   * @since 2.0.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be string of date or array of date or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {PersianDate} return class with persian date
	   * @throws {PersianDate} if date invalid return class with error
	   */


	  PersianDate.prototype.fromJalali = function () {
	    if (this.error) {
	      delete this.error;
	      this.d = {};
	    }

	    return fromJalali.call.apply(fromJalali, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * convert a gregorian date to PersianDate instance
	   * @since 2.0.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be string of date or array of date or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {PersianDate} return class with persian date
	   * @throws {PersianDate} if date invalid return class with error
	   */


	  PersianDate.prototype.fromGregorian = function () {
	    if (this.error) {
	      delete this.error;
	      this.d = {};
	    }

	    return fromGregorian.call.apply(fromGregorian, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * convert a gregorian date to PersianDate instance
	   * @since 2.0.0
	   * @param {"j"|"jalali"|"g"|"gregorian"} calendar - the calendar
	   * @returns {PersianDate} return class with persian date
	   */


	  PersianDate.prototype.calendar = function (calendar$1) {
	    return calendar.call(this, calendar$1);
	  }; ////////////////////--------- set & get ---------/////////////////////

	  /**
	   * get or set year
	   * @param {Null|Number|String} [format=jYYYY] - a number for set the year or a format for formatting
	   * @returns {PersianDate|String|Number} if set the year, returns class,
	   * else returns a number or string from year
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.year = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	    if (this.error) return this.error;
	    return year.call(this, format);
	  };
	  /**
	   * get or set month
	   * @param {Null|Number|String} [format=jM] - a number for set the month or a format for formatting
	   * @returns {PersianDate|String|Number} if set the month, returns class,
	   * else returns a number or string from month
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.month = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	    if (this.error) return this.error;
	    return month.call(this, format);
	  };
	  /**
	   * get or set day in month
	   * @param {Null|Number|String} [format=jD] - a number for set the day in month or a format for formatting
	   * @returns {PersianDate|String|Number} if set the day, returns class,
	   * else returns a number or string from day
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.date = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	    if (this.error) return this.error;
	    return date.call(this, format);
	  };
	  /**
	   * get or set quarter
	   * @param {Null|Number|String} [format=jQ] - a number for set the quarter or a format for formatting
	   * @returns {PersianDate|String|Number} if set the quarter, returns class,
	   * else returns a number or string from quarter
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.quarter = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	    if (this.error) return this.error;
	    return quarter.call(this, format);
	  };
	  /**
	   * get or set week
	   * @param {Null|Number|String} [format=jw] - a number for set the week or a format for formatting
	   * @returns {PersianDate|String|Number} if set the week, returns class,
	   * else returns a number or string from week
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.week = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
	    if (this.error) return this.error;
	    return week.call(this, format);
	  };
	  /**
	   * get or set hour
	   * @param {Null|Number|String} [format=H] - a number for set the hour or a format for formatting
	   * @returns {PersianDate|String|Number} if set the hour, returns class,
	   * else returns a number or string from hour
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.hour = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "H";
	    if (this.error) return this.error;
	    return hour.call(this, format);
	  };
	  /**
	   * get or set minute
	   * @param {Null|Number|String} [format=m] - a number for set the minute or a format for formatting
	   * @returns {PersianDate|String|Number} if set the minute, returns class,
	   * else returns a number or string from minute
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.minute = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "m";
	    if (this.error) return this.error;
	    return minute.call(this, format);
	  };
	  /**
	   * get or set second
	   * @param {Null|Number|String} [format=s] - a number for set the second or a format for formatting
	   * @returns {PersianDate|String|Number} if set the second, returns class,
	   * else returns a number or string from second
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.second = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "s";
	    if (this.error) return this.error;
	    return second.call(this, format);
	  };
	  /**
	   * get or set millisecond
	   * @param {Null|Number|String} [format=c] - a number for set the millisecond or a format for formatting
	   * @returns {PersianDate|String|Number} if set the millisecond, returns class,
	   * else returns a number or string from millisecond
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.millisecond = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "c";
	    if (this.error) return this.error;
	    return millisecond.call(this, format);
	  };
	  /**
	   * get timestamp or set date from timestamp
	   * @param {Null|Number|String} value - a number for set the millisecond
	   * @returns {PersianDate|Number} if set the timestamp, returns class,
	   * else returns timestamp (number)
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.timestamp = function (value) {
	    if (this.error) return this.error;
	    return timestamp.call(this, value);
	  };

	  PersianDate.prototype.valueOf = function () {
	    return this.timestamp();
	  };
	  /**
	   * returns number of days in month
	   * @param {?Number} year - year of date that returns number of days in month
	   * @param {?Number} month - month of date that returns number of days in month
	   * @returns {Number} number of days in month
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.getDaysInMonth = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.d.year;
	    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.d.month;
	    if (this.error) return this.error;
	    return getDaysInMonth(this.c, year, month);
	  };
	  /**
	   * return number of weeks in year
	   * @since 2.0.0
	   * @param {Number|String} year - the year
	   * @returns {Number} number of weeks in year
	   */


	  PersianDate.prototype.getWeeksInYear = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.d.year;
	    if (this.error) return this.error;
	    return getWeeksInYear.call(this, year);
	  };
	  /**
	   * change the date to start of the year or month or ...
	   * @since 2.0.0
	   * @param {String} unit - the unit of time
	   * @returns {PersianDate} return the class with new date or time
	   */


	  PersianDate.prototype.startOf = function () {
	    var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "year";
	    return startOf.call(this, unit);
	  };
	  /**
	   * change the date to end of the year or month or ...
	   * @since 2.0.0
	   * @param {String} unit - the unit of time
	   * @returns {PersianDate} return the class with new date or time
	   */


	  PersianDate.prototype.endOf = function () {
	    var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "year";
	    return endOf.call(this, unit);
	  };
	  /**
	   * change the time
	   * @since 2.3.0
	   * @param {PersianDate|Date|String|Array|Object|Number} time - the new time
	   * @param {Null|String|Number} time.h - hour of date
	   * @param {Null|String|Number} time.hour - hour of date
	   * @param {Null|String|Number} time.hours - hour of date
	   * @param {Null|String|Number} time.m - minute of date
	   * @param {Null|String|Number} time.minute - minute of date
	   * @param {Null|String|Number} time.minutes - minute of date
	   * @param {Null|String|Number} time.s - second of date
	   * @param {Null|String|Number} time.second - second of date
	   * @param {Null|String|Number} time.seconds - second of date
	   * @param {Null|String|Number} time.ms - millisecond of date
	   * @param {Null|String|Number} time.millisecond - millisecond of date
	   * @param {Null|String|Number} time.milliseconds - millisecond of date
	   * @returns {PersianDate|Array} if set the time, returns class,
	   * else returns an array of time
	   * @throws {String} if time invalid return error text
	   */


	  PersianDate.prototype.time = function () {
	    if (this.error) return this.error;
	    return time.call.apply(time, [this].concat(Array.prototype.slice.call(arguments)));
	  }; ////////////////////--------- add & sub ---------/////////////////////

	  /**
	   * add to year
	   * @param {?Number|String} [year=1] - a number for add with year
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addYear = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!year) return this;
	    return addYear.call(this, year, checkDate);
	  };
	  /**
	   * add to month
	   * @param {?Number|String} [month=1] - a number for add with month
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addMonth = function () {
	    var month = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!month) return this;
	    return addMonth.call(this, month, checkDate);
	  };
	  /**
	   * add to day
	   * @param {?Number|String} [day=1] - a number for add with day
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addDay = function () {
	    var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!day) return this;
	    return addDay.call(this, day, checkDate);
	  };
	  /**
	   * add to quarter
	   * @param {?Number|String} [quarter=1] - a number for add with quarter
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addQuarter = function () {
	    var quarter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!quarter) return this;
	    return addQuarter.call(this, quarter, checkDate);
	  };
	  /**
	   * add to week
	   * @param {?Number|String} [week=1] - a number for add with week
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addWeek = function () {
	    var week = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!week) return this;
	    return addWeek.call(this, week, checkDate);
	  };
	  /**
	   * add to hour
	   * @param {?Number|String} [hour=1] - a number for add with hour
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addHour = function () {
	    var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!hour) return this;
	    return addHour.call(this, hour, checkDate);
	  };
	  /**
	   * add to minute
	   * @param {?Number|String} [minute=1] - a number for add with minute
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addMinute = function () {
	    var minute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!minute) return this;
	    return addMinute.call(this, minute, checkDate);
	  };
	  /**
	   * add to second
	   * @param {?Number|String} [second=1] - a number for add with second
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addSecond = function () {
	    var second = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!second) return this;
	    return addSecond.call(this, second, checkDate);
	  };
	  /**
	   * add to millisecond
	   * @param {?Number|String} [millisecond=1] - a number for add with millisecond
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.addMillisecond = function () {
	    var millisecond = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!millisecond) return this;
	    return addMillisecond.call(this, millisecond, checkDate);
	  };
	  /**
	   * subtract from year
	   * @param {?Number|String} [year=1] - a number for subtract from year
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subYear = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!year) return this;
	    return subYear.call(this, year, checkDate);
	  };
	  /**
	   * subtract from month
	   * @param {?Number|String} [month=1] - a number for subtract from month
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subMonth = function () {
	    var month = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!month) return this;
	    return subMonth.call(this, month, checkDate);
	  };
	  /**
	   * subtract from day
	   * @param {?Number|String} [day=1] - a number for subtract from day
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subDay = function () {
	    var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!day) return this;
	    return subDay.call(this, day, checkDate);
	  };
	  /**
	   * subtract from quarter
	   * @param {?Number|String} [quarter=1] - a number for subtract from quarter
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subQuarter = function () {
	    var quarter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!quarter) return this;
	    return subQuarter.call(this, quarter, checkDate);
	  };
	  /**
	   * subtract from week
	   * @param {?Number|String} [week=1] - a number for subtract from week
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subWeek = function () {
	    var week = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!week) return this;
	    return subWeek.call(this, week, checkDate);
	  };
	  /**
	   * subtract from hour
	   * @param {?Number|String} [hour=1] - a number for subtract from hour
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subHour = function () {
	    var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!hour) return this;
	    return subHour.call(this, hour, checkDate);
	  };
	  /**
	   * subtract from minute
	   * @param {?Number|String} [minute=1] - a number for subtract from minute
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subMinute = function () {
	    var minute = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!minute) return this;
	    return subMinute.call(this, minute, checkDate);
	  };
	  /**
	   * subtract from second
	   * @param {?Number|String} [second=1] - a number for subtract from second
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subSecond = function () {
	    var second = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!second) return this;
	    return subSecond.call(this, second, checkDate);
	  };
	  /**
	   * subtract from millisecond
	   * @param {?Number|String} [millisecond=1] - a number for subtract from millisecond
	   * @param {?Boolean} checkDate checks the result that the date is valid,
	   * If not valid, it will be deducted from the day to be valid
	   * @returns {PersianDate} return class with new date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.subMillisecond = function () {
	    var millisecond = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var checkDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    if (!millisecond) return this;
	    return subMillisecond.call(this, millisecond, checkDate);
	  }; ////////////////////--------- conversion ---------/////////////////////

	  /**
	   * returns date as string with specify format
	   * @param {?String} [format=date] - formatting date to string
	   * @returns {String} date string
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.toString = function () {
	    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "date";
	    if (this.error) return this.error;
	    return toString.call(this, format);
	  };
	  /**
	   * return the array of PersianDate
	   * @since 1.3.0
	   * @param {String|Array|Object|Number} yearForamt - this param must be string or array or Object from date or year
	   * @param {String|Number} yearForamt.y - year format
	   * @param {Null|String|Number} yearForamt.year - year format
	   * @param {Null|String|Number} yearForamt.years - year format
	   * @param {Null|String|Number} yearForamt.M - month format
	   * @param {Null|String|Number} yearForamt.month - month format
	   * @param {Null|String|Number} yearForamt.months - month format
	   * @param {Null|String|Number} yearForamt.d - day format
	   * @param {Null|String|Number} yearForamt.day - day format
	   * @param {Null|String|Number} yearForamt.days - day format
	   * @param {Null|String|Number} yearForamt.date - day format
	   * @param {Null|String|Number} yearForamt.h - hour format
	   * @param {Null|String|Number} yearForamt.hour - hour format
	   * @param {Null|String|Number} yearForamt.hours - hour format
	   * @param {Null|String|Number} yearForamt.m - minute format
	   * @param {Null|String|Number} yearForamt.minute - minute format
	   * @param {Null|String|Number} yearForamt.minutes - minute format
	   * @param {Null|String|Number} yearForamt.s - second format
	   * @param {Null|String|Number} yearForamt.second - second format
	   * @param {Null|String|Number} yearForamt.seconds - second format
	   * @param {Null|String|Number} yearForamt.ms - millisecond format
	   * @param {Null|String|Number} yearForamt.millisecond - millisecond format
	   * @param {Null|String|Number} yearForamt.milliseconds - millisecond format
	   * @param {Null|Number|String} monthFormat month format
	   * @param {Null|Number|String} dayFormat day format
	   * @param {Null|Number|String} hourFormat hour format
	   * @param {Null|Number|String} minuteFormat minute format
	   * @param {Null|Number|String} secondFormat second format
	   * @param {Null|Number|String} millisecondFormat millisecond format
	   * @returns {Object} if date valid, return array of date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.toArray = function () {
	    if (this.error) return this.error;
	    return toArray.call.apply(toArray, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * return the object of PersianDate
	   * @since 1.3.0
	   * @param {String|Array|Object|Number} yearForamt - this param must be string or array or Object from date or year
	   * @param {String|Number} yearForamt.y - year format
	   * @param {Null|String|Number} yearForamt.year - year format
	   * @param {Null|String|Number} yearForamt.years - year format
	   * @param {Null|String|Number} yearForamt.M - month format
	   * @param {Null|String|Number} yearForamt.month - month format
	   * @param {Null|String|Number} yearForamt.months - month format
	   * @param {Null|String|Number} yearForamt.d - day format
	   * @param {Null|String|Number} yearForamt.day - day format
	   * @param {Null|String|Number} yearForamt.days - day format
	   * @param {Null|String|Number} yearForamt.date - day format
	   * @param {Null|String|Number} yearForamt.h - hour format
	   * @param {Null|String|Number} yearForamt.hour - hour format
	   * @param {Null|String|Number} yearForamt.hours - hour format
	   * @param {Null|String|Number} yearForamt.m - minute format
	   * @param {Null|String|Number} yearForamt.minute - minute format
	   * @param {Null|String|Number} yearForamt.minutes - minute format
	   * @param {Null|String|Number} yearForamt.s - second format
	   * @param {Null|String|Number} yearForamt.second - second format
	   * @param {Null|String|Number} yearForamt.seconds - second format
	   * @param {Null|String|Number} yearForamt.ms - millisecond format
	   * @param {Null|String|Number} yearForamt.millisecond - millisecond format
	   * @param {Null|String|Number} yearForamt.milliseconds - millisecond format
	   * @param {Null|Number|String} monthFormat month format
	   * @param {Null|Number|String} dayFormat day format
	   * @param {Null|Number|String} hourFormat hour format
	   * @param {Null|Number|String} minuteFormat minute format
	   * @param {Null|Number|String} secondFormat second format
	   * @param {Null|Number|String} millisecondFormat millisecond format
	   * @returns {Object} if date valid, return Object of date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.toObject = function () {
	    if (this.error) return this.error;
	    return toObject.call.apply(toObject, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * return the Date instance of PersianDate
	   * @since 2.0.0
	   * @returns {Date} if date valid, return Date instance of date
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.toDate = function () {
	    if (this.error) return this.error;
	    return toDate.call(this);
	  }; ////////////////////--------- diff ---------/////////////////////

	  /**
	   * get the diffrence between two date
	   * @since 1.4.0
	   * @param {PersianDate|Date|String|Array|Object} date - this param must be PersianDate or string or array or Object from date
	   * @param {String|Number} date.y - year of date
	   * @param {Null|String|Number} date.year - year of date
	   * @param {Null|String|Number} date.years - year of date
	   * @param {Null|String|Number} date.M - month of date
	   * @param {Null|String|Number} date.month - month of date
	   * @param {Null|String|Number} date.months - month of date
	   * @param {Null|String|Number} date.d - day of date
	   * @param {Null|String|Number} date.day - day of date
	   * @param {Null|String|Number} date.days - day of date
	   * @param {Null|String|Number} date.date - day of date
	   * @param {Null|String|Number} date.h - hour of date
	   * @param {Null|String|Number} date.hour - hour of date
	   * @param {Null|String|Number} date.hours - hour of date
	   * @param {Null|String|Number} date.m - minute of date
	   * @param {Null|String|Number} date.minute - minute of date
	   * @param {Null|String|Number} date.minutes - minute of date
	   * @param {Null|String|Number} date.s - second of date
	   * @param {Null|String|Number} date.second - second of date
	   * @param {Null|String|Number} date.seconds - second of date
	   * @param {Null|String|Number} date.ms - millisecond of date
	   * @param {Null|String|Number} date.millisecond - millisecond of date
	   * @param {Null|String|Number} date.milliseconds - millisecond of date
	   * @param {String} unit - the unit of the measurment
	   * @param {Boolean} addOne - add one day to result
	   * @returns {Number} diffrence
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.diff = function (date, unit) {
	    var addOne = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	    if (this.error) return this.error;
	    return diff.call(this, date, unit, addOne);
	  };
	  /**
	   * get the diffrence between two date in a human-readable format
	   * @since 2.0.0
	   * @param {PersianDate|Date|String|Array|Object} date - this param must be PersianDate or string or array or Object from date
	   * @param {String|Number} date.y - year of date
	   * @param {Null|String|Number} date.year - year of date
	   * @param {Null|String|Number} date.years - year of date
	   * @param {Null|String|Number} date.M - month of date
	   * @param {Null|String|Number} date.month - month of date
	   * @param {Null|String|Number} date.months - month of date
	   * @param {Null|String|Number} date.d - day of date
	   * @param {Null|String|Number} date.day - day of date
	   * @param {Null|String|Number} date.days - day of date
	   * @param {Null|String|Number} date.date - day of date
	   * @param {Null|String|Number} date.h - hour of date
	   * @param {Null|String|Number} date.hour - hour of date
	   * @param {Null|String|Number} date.hours - hour of date
	   * @param {Null|String|Number} date.m - minute of date
	   * @param {Null|String|Number} date.minute - minute of date
	   * @param {Null|String|Number} date.minutes - minute of date
	   * @param {Null|String|Number} date.s - second of date
	   * @param {Null|String|Number} date.second - second of date
	   * @param {Null|String|Number} date.seconds - second of date
	   * @param {Null|String|Number} date.ms - millisecond of date
	   * @param {Null|String|Number} date.millisecond - millisecond of date
	   * @param {Null|String|Number} date.milliseconds - millisecond of date
	   * @param {Boolean} suffix - add suffix or not
	   * @returns {String} if date valid, return diff human-readable format
	   * @throws {String} if date invalid return error message
	   */


	  PersianDate.prototype.diffForHumans = function (date) {
	    var suffix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
	    if (this.error) return this.error;
	    return diffForHumans.call(this, date, suffix);
	  }; ////////////////////--------- comparison ---------/////////////////////

	  /**
	   * returns minimum date in arguments that passed
	   * @since 1.4.0
	   * @param {...String|PersianDate|Date|Array|Object} date - this parameters must be string or array or Object from date;
	   * @param {String} date.y - year of date
	   * @param {Null|String} date.year - year of date
	   * @param {Null|String} date.years - year of date
	   * @param {Null|String} date.M - month of date
	   * @param {Null|String} date.month - month of date
	   * @param {Null|String} date.months - month of date
	   * @param {Null|String} date.d - day of date
	   * @param {Null|String} date.day - day of date
	   * @param {Null|String} date.days - day of date
	   * @param {Null|String} date.date - day of date
	   * @param {Null|String} date.h - hour of date
	   * @param {Null|String} date.hour - hour of date
	   * @param {Null|String} date.hours - hour of date
	   * @param {Null|String} date.m - minute of date
	   * @param {Null|String} date.minute - minute of date
	   * @param {Null|String} date.minutes - minute of date
	   * @param {Null|String} date.s - second of date
	   * @param {Null|String} date.second - second of date
	   * @param {Null|String} date.seconds - second of date
	   * @param {Null|String} date.ms - millisecond of date
	   * @param {Null|String} date.millisecond - millisecond of date
	   * @param {Null|String} date.milliseconds - millisecond of date
	   * @returns {*} return minimum date
	   * @throws {false} if parameters not send or parameters is invalid, return false
	   */


	  PersianDate.prototype.min = function () {
	    return mathOperation.call(this, arguments, "min");
	  };
	  /**
	   * returns maximum date in arguments that passed
	   * @since 1.4.0
	   * @param {...String|PersianDate|Date|Array|Object} date - this parameters must be string or array or Object from date;
	   * @param {String} date.y - year of date
	   * @param {Null|String} date.year - year of date
	   * @param {Null|String} date.years - year of date
	   * @param {Null|String} date.M - month of date
	   * @param {Null|String} date.month - month of date
	   * @param {Null|String} date.months - month of date
	   * @param {Null|String} date.d - day of date
	   * @param {Null|String} date.day - day of date
	   * @param {Null|String} date.days - day of date
	   * @param {Null|String} date.date - day of date
	   * @param {Null|String} date.h - hour of date
	   * @param {Null|String} date.hour - hour of date
	   * @param {Null|String} date.hours - hour of date
	   * @param {Null|String} date.m - minute of date
	   * @param {Null|String} date.minute - minute of date
	   * @param {Null|String} date.minutes - minute of date
	   * @param {Null|String} date.s - second of date
	   * @param {Null|String} date.second - second of date
	   * @param {Null|String} date.seconds - second of date
	   * @param {Null|String} date.ms - millisecond of date
	   * @param {Null|String} date.millisecond - millisecond of date
	   * @param {Null|String} date.milliseconds - millisecond of date
	   * @returns {*} return maximum date
	   * @throws {false} if parameters not send or parameters is invalid, return false
	   */


	  PersianDate.prototype.max = function () {
	    return mathOperation.call(this, arguments, "max");
	  };
	  /**
	   * receives year and determined that is leap year or not
	   * @param {?Number} year - the year to be determined is a leap or not
	   * @returns {Boolean} if is leap year, returns true
	   */


	  PersianDate.prototype.isLeapYear = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.d.year;
	    if (this.error) return false;
	    return isLeapYear(this.c, year);
	  };
	  /**
	   * checks the persian date and time
	   * @param {?Number} year - year of date that will be checked
	   * @param {?Number} month - month of date that will be checked
	   * @param {?Number} day - day of date that will be checked
	   * @param {?Number} hour - hour of date that will be checked
	   * @param {?Number} minute - minute of date that will be checked
	   * @param {?Number} second - second of date that will be checked
	   * @param {?Number} millisecond - millisecond of date that will be checked
	   * @returns {Boolean} if is valid, returns true
	   */


	  PersianDate.prototype.isValid = function (year, month, day, hour, minute, second, millisecond) {
	    if (this.error) return false;
	    return this.isValidDate(year, month, day) && this.isValidTime(hour, minute, second, millisecond);
	  };
	  /**
	   * checks the persian date
	   * @param {?Number} year - year of date that will be checked
	   * @param {?Number} month - month of date that will be checked
	   * @param {?Number} day - day of date that will be checked
	   * @returns {Boolean} if is valid date, returns true
	   */


	  PersianDate.prototype.isValidDate = function () {
	    var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.d.year;
	    var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.d.month;
	    var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.d.date;
	    if (this.error) return false;
	    return isValidDate(this.c, year, month, day);
	  };
	  /**
	   * checks the time
	   * @param {?Number} hour - hour of date that will be checked
	   * @param {?Number} minute - minute of date that will be checked
	   * @param {?Number} second - second of date that will be checked
	   * @param {?Number} millisecond - millisecond of date that will be checked
	   * @returns {Boolean} if is valid time, returns true
	   */


	  PersianDate.prototype.isValidTime = function () {
	    var hour = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.d.hour;
	    var minute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.d.minute;
	    var second = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.d.second;
	    var millisecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.d.millisecond;
	    if (this.error) return false;
	    return isValidTime(hour, minute, second, millisecond);
	  };
	  /**
	   * checks this date is the same to another date
	   * @since 1.1.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be PersianDate or string or array or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {‌Boolean} if this date is same to the argument, return true of false
	   */


	  PersianDate.prototype.isSame = function () {
	    if (this.error) return false;
	    return isSame.call.apply(isSame, [this].concat(Array.prototype.slice.call(arguments)));
	  };
	  /**
	   * checks this date is before the another date
	   * @since 1.2.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be PersianDate or string or array or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {‌Boolean} if this date is before the argument, return true of false
	   */


	  PersianDate.prototype.isBefore = function () {
	    if (this.error) return false;
	    return compare.call(this, arguments, "<");
	  };
	  /**
	   * checks this date is after the another date
	   * @since 1.2.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be PersianDate or string or array or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {‌Boolean} if this date is after the argument, return true of false
	   */


	  PersianDate.prototype.isAfter = function () {
	    if (this.error) return false;
	    return compare.call(this, arguments, ">");
	  };
	  /**
	   * checks this date is same or before the another date
	   * @since 1.2.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be PersianDate or string or array or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {‌Boolean} if this date is samr or before the argument, return true of false
	   */


	  PersianDate.prototype.isSameOrBefore = function () {
	    if (this.error) return false;
	    return compare.call(this, arguments, "<=");
	  };
	  /**
	   * checks this date is same or after the another date
	   * @since 1.2.0
	   * @param {PersianDate|Date|String|Array|Object|Number} year - this param must be PersianDate or string or array or Object from date or year
	   * @param {String|Number} year.y - year of date
	   * @param {Null|String|Number} year.year - year of date
	   * @param {Null|String|Number} year.years - year of date
	   * @param {Null|String|Number} year.M - month of date
	   * @param {Null|String|Number} year.month - month of date
	   * @param {Null|String|Number} year.months - month of date
	   * @param {Null|String|Number} year.d - day of date
	   * @param {Null|String|Number} year.day - day of date
	   * @param {Null|String|Number} year.days - day of date
	   * @param {Null|String|Number} year.date - day of date
	   * @param {Null|String|Number} year.h - hour of date
	   * @param {Null|String|Number} year.hour - hour of date
	   * @param {Null|String|Number} year.hours - hour of date
	   * @param {Null|String|Number} year.m - minute of date
	   * @param {Null|String|Number} year.minute - minute of date
	   * @param {Null|String|Number} year.minutes - minute of date
	   * @param {Null|String|Number} year.s - second of date
	   * @param {Null|String|Number} year.second - second of date
	   * @param {Null|String|Number} year.seconds - second of date
	   * @param {Null|String|Number} year.ms - millisecond of date
	   * @param {Null|String|Number} year.millisecond - millisecond of date
	   * @param {Null|String|Number} year.milliseconds - millisecond of date
	   * @param {Null|Number|String} month month of date
	   * @param {Null|Number|String} day day of date
	   * @param {Null|Number|String} hour hour of date
	   * @param {Null|Number|String} minute minute of date
	   * @param {Null|Number|String} second second of date
	   * @param {Null|Number|String} millisecond millisecond of date
	   * @returns {‌Boolean} if this date is same or after the argument, return true of false
	   */


	  PersianDate.prototype.isSameOrAfter = function () {
	    if (this.error) return false;
	    return compare.call(this, arguments, ">=");
	  };
	  /**
	   * checks this date is between the another dates
	   * @since 1.3.0
	   * @param {PersianDate|Date|String|Array|Object} from - this param must be PersianDate or string or array or Object from date
	   * @param {String|Number} from.y - year of date
	   * @param {Null|String|Number} from.year - year of date
	   * @param {Null|String|Number} from.years - year of date
	   * @param {Null|String|Number} from.M - month of date
	   * @param {Null|String|Number} from.month - month of date
	   * @param {Null|String|Number} from.months - month of date
	   * @param {Null|String|Number} from.d - day of date
	   * @param {Null|String|Number} from.day - day of date
	   * @param {Null|String|Number} from.days - day of date
	   * @param {Null|String|Number} from.date - day of date
	   * @param {Null|String|Number} from.h - hour of date
	   * @param {Null|String|Number} from.hour - hour of date
	   * @param {Null|String|Number} from.hours - hour of date
	   * @param {Null|String|Number} from.m - minute of date
	   * @param {Null|String|Number} from.minute - minute of date
	   * @param {Null|String|Number} from.minutes - minute of date
	   * @param {Null|String|Number} from.s - second of date
	   * @param {Null|String|Number} from.second - second of date
	   * @param {Null|String|Number} from.seconds - second of date
	   * @param {Null|String|Number} from.ms - millisecond of date
	   * @param {Null|String|Number} from.millisecond - millisecond of date
	   * @param {Null|String|Number} from.milliseconds - millisecond of date
	   * @param {PersianDate|Date|String|Array|Object} to - this param must be PersianDate or string or array or Object from date
	   * @param {String|Number} to.y - year of date
	   * @param {Null|String|Number} to.year - year of date
	   * @param {Null|String|Number} to.years - year of date
	   * @param {Null|String|Number} to.M - month of date
	   * @param {Null|String|Number} to.month - month of date
	   * @param {Null|String|Number} to.months - month of date
	   * @param {Null|String|Number} to.d - day of date
	   * @param {Null|String|Number} to.day - day of date
	   * @param {Null|String|Number} to.days - day of date
	   * @param {Null|String|Number} to.date - day of date
	   * @param {Null|String|Number} to.h - hour of date
	   * @param {Null|String|Number} to.hour - hour of date
	   * @param {Null|String|Number} to.hours - hour of date
	   * @param {Null|String|Number} to.m - minute of date
	   * @param {Null|String|Number} to.minute - minute of date
	   * @param {Null|String|Number} to.minutes - minute of date
	   * @param {Null|String|Number} to.s - second of date
	   * @param {Null|String|Number} to.second - second of date
	   * @param {Null|String|Number} to.seconds - second of date
	   * @param {Null|String|Number} to.ms - millisecond of date
	   * @param {Null|String|Number} to.millisecond - millisecond of date
	   * @param {Null|String|Number} to.milliseconds - millisecond of date
	   * @param {String} method - determines that consider the dates themselves
	   * @returns {‌Boolean} if this date is between the arguments, return true of false
	   */


	  PersianDate.prototype.isBetween = function (from, to) {
	    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "()";
	    if (this.error) return false;
	    return isBetween.call(this, from, to, method);
	  };
	  /**
	   * checks this date is in array of dates
	   * @since 2.6.0
	   * @param {(PersianDate|Date|String|Array|Object)[]} array - this param must be array of PersianDate - string - array - Object and array date
	   * @param {String|Number} array[].y - year of date
	   * @param {Null|String|Number} array[].year - year of date
	   * @param {Null|String|Number} array[].years - year of date
	   * @param {Null|String|Number} array[].M - month of date
	   * @param {Null|String|Number} array[].month - month of date
	   * @param {Null|String|Number} array[].months - month of date
	   * @param {Null|String|Number} array[].d - day of date
	   * @param {Null|String|Number} array[].day - day of date
	   * @param {Null|String|Number} array[].days - day of date
	   * @param {Null|String|Number} array[].date - day of date
	   * @param {Null|String|Number} array[].h - hour of date
	   * @param {Null|String|Number} array[].hour - hour of date
	   * @param {Null|String|Number} array[].hours - hour of date
	   * @param {Null|String|Number} array[].m - minute of date
	   * @param {Null|String|Number} array[].minute - minute of date
	   * @param {Null|String|Number} array[].minutes - minute of date
	   * @param {Null|String|Number} array[].s - second of date
	   * @param {Null|String|Number} array[].second - second of date
	   * @param {Null|String|Number} array[].seconds - second of date
	   * @param {Null|String|Number} array[].ms - millisecond of date
	   * @param {Null|String|Number} array[].millisecond - millisecond of date
	   * @param {Null|String|Number} array[].milliseconds - millisecond of date
	   * @returns {‌Boolean} if date is in array return true
	   */


	  PersianDate.prototype.isInArray = function (array) {
	    if (this.error) return false;
	    return isInArray.call(this, array);
	  };
	  /**
	   * checks date is a native js Date object
	   * @since 1.3.0
	   * @param {*} date date that must be checked
	   * @returns {Boolean} if date is a native js Date, return true
	   */


	  PersianDate.prototype.isDate = isDate;
	  /**
	   * checks date is a PersianDate object
	   * @since 1.3.0
	   * @param {*} date date that must be checked
	   * @returns {Boolean} if date is a PersianDate, return true
	   */

	  PersianDate.prototype.isPersianDate = isPersianDate;
	  if (calendarVal) this.calendar(calendarVal);

	  if (dateVal) {
	    if (calendarVal && calendarVal[0] == "j") this.fromJalali(dateVal);else this.fromGregorian(dateVal);
	  } else this.now();
	}; ////////////////////--------- statics  ---------/////////////////////

	/**
	 * receives year and determined that is leap year or not
	 * @static
	 * @since 2.3.0
	 * @param {"jalali"|"gregorian"} calendar - the calendar
	 * @param {Number} year - the year to be determined is a leap or not
	 * @returns {Boolean} if is leap year, returns true
	 */


	PersianDate.isLeapYear = isLeapYear;
	/**
	 * checks date is a native js Date object
	 * @static
	 * @since 2.3.0
	 * @param {*} date date that must be checked
	 * @returns {Boolean} if date is a native js Date, return true
	 */

	PersianDate.isDate = isDate;
	/**
	 * checks date is a PersianDate object
	 * @static
	 * @since 2.3.0
	 * @param {*} date date that must be checked
	 * @returns {Boolean} if date is a PersianDate, return true
	 */

	PersianDate.isPersianDate = isPersianDate;
	/**
	 * checks the date and time
	 * @static
	 * @since 2.4.0
	 * @param {"jalali"|"gregorian"} calendar - the calendar
	 * @param {?Number} year - year of date that will be checked
	 * @param {?Number} month - month of date that will be checked
	 * @param {?Number} day - day of date that will be checked
	 * @param {?Number} hour - hour of date that will be checked
	 * @param {?Number} minute - minute of date that will be checked
	 * @param {?Number} second - second of date that will be checked
	 * @param {?Number} millisecond - millisecond of date that will be checked
	 * @returns {Boolean} if is valid, returns true
	 */

	PersianDate.isValid = isValid;
	/**
	 * checks the date
	 * @static
	 * @since 2.4.0
	 * @param {"jalali"|"gregorian"} calendar - the calendar
	 * @param {?Number} year - year of date that will be checked
	 * @param {?Number} month - month of date that will be checked
	 * @param {?Number} day - day of date that will be checked
	 * @returns {Boolean} if is valid date, returns true
	 */

	PersianDate.isValidDate = isValidDate;
	/**
	 * checks the time
	 * @static
	 * @since 2.4.0
	 * @param {?Number} hour - hour of date that will be checked
	 * @param {?Number} minute - minute of date that will be checked
	 * @param {?Number} second - second of date that will be checked
	 * @param {?Number} millisecond - millisecond of date that will be checked
	 * @returns {Boolean} if is valid time, returns true
	 */

	PersianDate.isValidTime = isValidTime;
	/**
	 * returns number of days in month
	 * @param {"jalali"|"gregorian"} calendar - the calendar
	 * @param {?Number} year - year of date that returns number of days in month
	 * @param {?Number} month - month of date that returns number of days in month
	 * @returns {Number} number of days in month
	 * @throws {String} if date invalid return error message
	 */

	PersianDate.getDaysInMonth = getDaysInMonth; //TODO: add localization
	////////////////////--------- Have A Good Day ---------/////////////////////

	PersianDate_1 = PersianDate;
	return PersianDate_1;
}

var PersianDateExports = requirePersianDate();
var PersianDate = /*@__PURE__*/getDefaultExportFromCjs(PersianDateExports);

const Core = {
    langs: {
        fa: {
            calendar: 'jalali',
            weekdays: ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'],
            months: [
                'فروردین',
                'اردیبهشت',
                'خرداد',
                'تیر',
                'مرداد',
                'شهریور',
                'مهر',
                'آبان',
                'آذر',
                'دی',
                'بهمن',
                'اسفند',
            ],
            dir: {
                input: 'rtl',
                picker: 'rtl',
            },
            translations: {
                label: 'شمسی',
                text: 'تقویم شمسی',
                prevMonth: 'ماه قبل',
                nextMonth: 'ماه بعد',
                now: 'هم اکنون',
                submit: 'تایید',
                /* use in shourcuts */
                // date-single
                yesterday: 'دیروز',
                tomorrow: 'فردا',
                firstOfWeek: 'اول هفته',
                lastOfWeek: 'آخر هفته',
                // date-range
                thisWeek: 'این هفته',
                prevWeek: 'هفته قبل',
                nextWeek: 'هفته بعد',
                thisMonth: 'این ماه',
                // time-single
                oneHourAgo: 'یک ساعت قبل',
                oneHourLater: 'یک ساعت بعد',
                midnight: 'نیمه شب',
                midday: 'نیمروز',
                // time-range
                thisHour: 'این ساعت',
                prevHour: 'ساعت قبل',
                nextHour: 'ساعت بعد',
                allDay: 'تمام روز',
            },
            inputFormat: '',
            displayFormat: '',
        },
        en: {
            calendar: 'gregorian',
            weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
            dir: {
                input: 'rtl',
                picker: 'ltr',
            },
            translations: {
                label: 'میلادی',
                text: 'Gregorian Calendar',
                prevMonth: 'Previous Month',
                nextMonth: 'Next Month',
                now: 'Now',
                submit: 'Submit',
                /* use in shourcuts */
                // date-single
                yesterday: 'Yesterday',
                tomorrow: 'Tomorrow',
                firstOfWeek: 'First of Week',
                lastOfWeek: 'Last of Week',
                // date-range
                thisWeek: 'This Week',
                prevWeek: 'Previous Week',
                nextWeek: 'Next Week',
                thisMonth: 'This Month',
                // time-single
                oneHourAgo: 'One Hour ago',
                oneHourLater: 'One Hour later',
                midnight: 'Midnight',
                midday: 'Midday',
                // time-range
                thisHour: 'This Hour',
                prevHour: 'Previous Hour',
                nextHour: 'Next Hour',
                allDay: 'All Day',
            },
            inputFormat: '',
            displayFormat: '',
        },
    },
    mergeObject: function (original, changed) {
        const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
        const isPlainObject = (value) => {
            if (Object.prototype.toString.call(value) !== '[object Object]') {
                return false;
            }
            const prototype = Object.getPrototypeOf(value);
            return prototype === Object.prototype || prototype === null;
        };
        const cloneValue = (value) => {
            if (Array.isArray(value))
                return value.map(cloneValue);
            if (!isPlainObject(value))
                return value;
            const clone = {};
            for (const key of Object.keys(value)) {
                if (!unsafeKeys.has(key))
                    clone[key] = cloneValue(value[key]);
            }
            return clone;
        };
        const newObject = cloneValue(original);
        if (!changed)
            return newObject;
        for (const key of Object.keys(changed)) {
            if (unsafeKeys.has(key))
                continue;
            const changedValue = changed[key];
            if (isPlainObject(newObject[key]) && isPlainObject(changedValue)) {
                newObject[key] = this.mergeObject(newObject[key], changedValue);
            }
            else {
                newObject[key] = cloneValue(changedValue);
            }
        }
        return newObject;
    },
    setStyles: function (styles, root) {
        for (const name in styles) {
            root.style.setProperty('--' + name, styles[name]);
        }
    },
    setColor: function (color, root) {
        if (!color)
            return;
        let colors = {};
        switch (color) {
            case 'red':
                colors = {
                    'primary-color': '#c7004c',
                    'secondary-color': '#ffaaaa',
                    'in-range-background': '#ffd2d2',
                };
                break;
            case 'pink':
                colors = {
                    'primary-color': '#e56ab3',
                    'secondary-color': '#ef87be',
                    'in-range-background': '#fcbcd7',
                };
                break;
            case 'orange':
                colors = {
                    'primary-color': '#ffa500',
                    'secondary-color': '#ffbe47',
                    'in-range-background': '#ffe0a6',
                };
                break;
            case 'green':
                colors = {
                    'primary-color': '#38a169',
                    'secondary-color': '#89dda3',
                    'in-range-background': '#c6f6d5',
                };
                break;
            case 'purple':
                colors = {
                    'primary-color': '#7825d0',
                    'secondary-color': '#c196ed',
                    'in-range-background': '#d4baf3',
                };
                break;
            case 'gray':
                colors = {
                    'primary-color': '#494848',
                    'secondary-color': '#909090',
                    'in-range-background': '#b4b4b4',
                };
                break;
        }
        this.setStyles(colors, root);
    },
    getLastUnit: function (date, type) {
        const unitsCount = date.split(/[/ \-.,:\\]/).length + (type == 'time' ? 3 : 0);
        switch (unitsCount) {
            case 1:
                return 'year';
            case 2:
                return 'month';
            case 3:
                return 'date';
            case 4:
                return 'hour';
            case 5:
                return 'minute';
            case 6:
                return 'second';
            default:
                return 'millisecond';
        }
    },
    getShortcuts(date, part, translate) {
        const c = () => date.clone();
        switch (part) {
            case 'date-single':
                return {
                    [translate.now]: [c()],
                    [translate.yesterday]: [c().subDay()],
                    [translate.tomorrow]: [c().addDay()],
                    [translate.firstOfWeek]: [c().startOf('week')],
                    [translate.lastOfWeek]: [c().endOf('week')],
                };
            case 'date-range':
                return {
                    [translate.thisWeek]: [c().startOf('week'), c().endOf('week')],
                    [translate.prevWeek]: [
                        c().subWeek().startOf('week'),
                        c().subWeek().endOf('week'),
                    ],
                    [translate.nextWeek]: [
                        c().addWeek().startOf('week'),
                        c().addWeek().endOf('week'),
                    ],
                    [translate.thisMonth]: [c().startOf('month'), c().endOf('month')],
                    [translate.prevMonth]: [
                        c().subMonth().startOf('month'),
                        c().subMonth().endOf('month'),
                    ],
                    [translate.nextMonth]: [
                        c().addMonth().startOf('month'),
                        c().addMonth().endOf('month'),
                    ],
                };
            case 'time-single':
                return {
                    [translate.now]: [c()],
                    [translate.oneHourAgo]: [c().subHour()],
                    [translate.oneHourLater]: [c().addHour()],
                    [translate.midnight]: [c().startOf('date')],
                    [translate.midday]: [c().time(12)],
                };
            case 'time-range':
                return {
                    [translate.thisHour]: [c().startOf('hour'), c().endOf('hour')],
                    [translate.prevHour]: [
                        c().subHour().startOf('hour'),
                        c().subHour().endOf('hour'),
                    ],
                    [translate.nextHour]: [
                        c().addHour().startOf('hour'),
                        c().addHour().endOf('hour'),
                    ],
                    [translate.allDay]: [c().startOf('date'), c().endOf('date')],
                };
            default:
                return {};
        }
    },
    isString: function (val) {
        return typeof val == 'string';
    },
    isNumber: function (val) {
        return typeof val == 'number';
    },
    isFunction: function (val) {
        return typeof val == 'function';
    },
    isPersianDate: function (val) {
        return PersianDate.isPersianDate(val);
    },
};
// Built-in language packs used by the calendar-aware locale defaults. They
// inherit the complete action/shortcut vocabulary from English and only
// override the calendar identity and native labels that are user-visible.
Core.langs.ar = {
    ...Core.langs.en,
    calendar: 'gregorian',
    dir: { input: 'rtl', picker: 'rtl' },
    weekdays: [
        'أحد',
        'اثن',
        'ثلا',
        'أرب',
        'خمي',
        'جمع',
        'سبت',
    ],
    translations: {
        ...Core.langs.en.translations,
        label: 'هجري',
        text: 'التقويم الهجري',
        prevMonth: 'الشهر السابق',
        nextMonth: 'الشهر التالي',
        now: 'الآن',
        submit: 'تأكيد',
    },
};
Core.langs.he = {
    ...Core.langs.en,
    calendar: 'hebrew',
    dir: { input: 'ltr', picker: 'ltr' },
    weekdays: [
        'א׳',
        'ב׳',
        'ג׳',
        'ד׳',
        'ה׳',
        'ו׳',
        'ש׳',
    ],
    translations: {
        ...Core.langs.en.translations,
        label: 'עברי',
        text: 'לוח שנה עברי',
        prevMonth: 'חודש קודם',
        nextMonth: 'חודש הבא',
        now: 'היום',
        submit: 'אישור',
    },
};
Core.langs.th = {
    ...Core.langs.en,
    calendar: 'buddhist',
    dir: { input: 'ltr', picker: 'ltr' },
    weekdays: [
        'อา',
        'จ',
        'อ',
        'พ',
        'พฤ',
        'ศ',
        'ส',
    ],
    translations: {
        ...Core.langs.en.translations,
        label: 'พุทธศักราช',
        text: 'ปฏิทินพุทธศักราช',
        prevMonth: 'เดือนก่อน',
        nextMonth: 'เดือนถัดไป',
        now: 'วันนี้',
        submit: 'ยืนยัน',
    },
};
Core.langs.zh = {
    ...Core.langs.en,
    calendar: 'chinese',
    dir: { input: 'ltr', picker: 'ltr' },
    weekdays: [
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
    ],
    translations: {
        ...Core.langs.en.translations,
        label: '农历',
        text: '中国农历',
        prevMonth: '上个月',
        nextMonth: '下个月',
        now: '今天',
        submit: '确定',
    },
};

function validateTimeParts(parts) {
    const ranges = [
        ['hour', parts.hour, 0, 23],
        ['minute', parts.minute, 0, 59],
        ['second', parts.second, 0, 59],
        ['millisecond', parts.millisecond, 0, 999],
    ];
    for (const [name, value, min, max] of ranges) {
        if (value !== undefined &&
            (!Number.isInteger(value) || value < min || value > max)) {
            throw new RangeError(`Invalid ${name} value: ${value}`);
        }
    }
}

const calendarNames = {
    gregorian: 'gregory',
    hijri: 'islamic-umalqura',
    hebrew: 'hebrew',
    buddhist: 'buddhist',
    chinese: 'chinese',
};
const dayMilliseconds$2 = 86_400_000;
function parsePart(value) {
    return Number.parseInt(value || '0', 10);
}
function isHebrewLeapYear(year) {
    return (7 * year + 1) % 19 < 7;
}
function parseHebrewMonth(value, year) {
    const month = value || '';
    const names = isHebrewLeapYear(year)
        ? [
            'Tishri',
            'Heshvan',
            'Kislev',
            'Tevet',
            'Shevat',
            'Adar I',
            'Adar II',
            'Nisan',
            'Iyar',
            'Sivan',
            'Tamuz',
            'Av',
            'Elul',
        ]
        : [
            'Tishri',
            'Heshvan',
            'Kislev',
            'Tevet',
            'Shevat',
            'Adar',
            'Nisan',
            'Iyar',
            'Sivan',
            'Tamuz',
            'Av',
            'Elul',
        ];
    const index = names.findIndex((name) => month.toLowerCase() === name.toLowerCase());
    return index >= 0 ? index + 1 : parsePart(value);
}
function parseChineseMonth(value) {
    const month = (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const names = [
        'first month',
        'second month',
        'third month',
        'fourth month',
        'fifth month',
        'sixth month',
        'seventh month',
        'eighth month',
        'ninth month',
        'tenth month',
        'eleventh month',
        'twelfth month',
    ];
    const leapMonth = month.endsWith('bis');
    const normalized = leapMonth ? month.slice(0, -3).trim() : month;
    const index = names.indexOf(normalized);
    return {
        month: index >= 0 ? index + 1 : parsePart(value),
        leapMonth,
    };
}
function sameDate(left, right) {
    return (left.year === right.year &&
        left.month === right.month &&
        left.day === right.day &&
        Boolean(left.leapMonth) === Boolean(right.leapMonth));
}
function compareDateParts(left, right) {
    const leftValues = [left.year, left.month, left.leapMonth ? 1 : 0, left.day];
    const rightValues = [
        right.year,
        right.month,
        right.leapMonth ? 1 : 0,
        right.day,
    ];
    for (let index = 0; index < leftValues.length; index++) {
        if (leftValues[index] !== rightValues[index])
            return leftValues[index] < rightValues[index] ? -1 : 1;
    }
    return 0;
}
function formatParts(formatter, date) {
    const values = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
    const year = parsePart(values.year || values.relatedYear);
    const calendar = formatter.resolvedOptions().calendar;
    const chineseMonth = calendar === 'chinese' ? parseChineseMonth(values.month) : undefined;
    return {
        year,
        month: calendar === 'hebrew'
            ? parseHebrewMonth(values.month, year)
            : chineseMonth?.month || parsePart(values.month),
        day: parsePart(values.day),
        ...(chineseMonth?.leapMonth ? { leapMonth: true } : {}),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds(),
    };
}
function createFormatter(calendar) {
    const formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}-nu-latn`, {
        timeZone: 'UTC',
        year: 'numeric',
        month: calendar === 'chinese' ? 'long' : 'numeric',
        day: 'numeric',
    });
    if (formatter.resolvedOptions().calendar !== calendar) {
        throw new Error(`Calendar is not supported by this runtime: ${calendar}`);
    }
    return formatter;
}
function estimateGregorianYear(calendar, year) {
    switch (calendar) {
        case 'hijri':
            return Math.floor((year - 1) * 0.970224 + 622);
        case 'hebrew':
            return year - 3760;
        case 'buddhist':
            return year - 543;
        default:
            return year;
    }
}
function findGregorianDate(formatter, calendar, wanted) {
    const estimate = new Date(Date.UTC(estimateGregorianYear(calendar, wanted.year), Math.max(0, wanted.month - 1), Math.max(1, wanted.day)));
    // Hijri years drift roughly one month per Gregorian year, so a calendar
    // month-shaped estimate can be several months away from the target date.
    const searchWindow = calendar === 'hijri' ? 900 : 450;
    const start = estimate.getTime() - searchWindow * dayMilliseconds$2;
    const end = estimate.getTime() + searchWindow * dayMilliseconds$2;
    const startParts = formatParts(formatter, new Date(start));
    const endParts = formatParts(formatter, new Date(end));
    if (compareDateParts(startParts, wanted) > 0 ||
        compareDateParts(endParts, wanted) < 0) {
        throw new RangeError(`Unable to convert ${wanted.year}/${wanted.month}/${wanted.day} from ${calendar}`);
    }
    let lower = start;
    let upper = end;
    while (lower <= upper) {
        const middle = lower +
            Math.floor((upper - lower) / (2 * dayMilliseconds$2)) * dayMilliseconds$2;
        const candidate = new Date(middle);
        const comparison = compareDateParts(formatParts(formatter, candidate), wanted);
        if (comparison === 0)
            return candidate;
        if (comparison < 0)
            lower = middle + dayMilliseconds$2;
        else
            upper = middle - dayMilliseconds$2;
    }
    throw new RangeError(`Unable to convert ${wanted.year}/${wanted.month}/${wanted.day} from ${calendar}`);
}
function createIntlAdapter(id, provider = 'ummalqura') {
    if (id === 'hijri' && provider !== 'ummalqura') {
        throw new Error(`Hijri provider is not implemented yet: ${provider}`);
    }
    const formatter = createFormatter(calendarNames[id]);
    return {
        id,
        ...(id === 'hijri' ? { provider } : {}),
        getParts(date) {
            return formatParts(formatter, date);
        },
        fromParts(parts) {
            validateTimeParts(parts);
            const date = findGregorianDate(formatter, id, parts);
            date.setUTCHours(parts.hour || 0, parts.minute || 0, parts.second || 0, parts.millisecond || 0);
            return date;
        },
        addDays(date, amount) {
            return new Date(date.getTime() + amount * dayMilliseconds$2);
        },
        addMonths(date, amount) {
            const current = formatParts(formatter, date);
            let targetYear = current.year;
            let normalizedMonth = current.month;
            const monthCount = (year) => id === 'hebrew' && isHebrewLeapYear(year) ? 13 : 12;
            const direction = amount < 0 ? -1 : 1;
            for (let step = 0; step < Math.abs(amount); step++) {
                normalizedMonth += direction;
                if (normalizedMonth > monthCount(targetYear)) {
                    normalizedMonth = 1;
                    targetYear += 1;
                }
                else if (normalizedMonth < 1) {
                    targetYear -= 1;
                    normalizedMonth = monthCount(targetYear);
                }
            }
            const targetDay = Math.min(current.day, (() => {
                const first = findGregorianDate(formatter, id, {
                    year: targetYear,
                    month: normalizedMonth,
                    day: 1,
                });
                let days = 1;
                while (sameDate(formatParts(formatter, new Date(first.getTime() + days * dayMilliseconds$2)), { year: targetYear, month: normalizedMonth, day: days + 1 })) {
                    days += 1;
                }
                return days;
            })());
            return findGregorianDate(formatter, id, {
                ...current,
                year: targetYear,
                month: normalizedMonth,
                day: targetDay,
            });
        },
        daysInMonth(year, month) {
            const first = findGregorianDate(formatter, id, { year, month, day: 1 });
            let count = 1;
            while (sameDate(formatParts(formatter, new Date(first.getTime() + count * dayMilliseconds$2)), { year, month, day: count + 1 })) {
                count += 1;
            }
            return count;
        },
    };
}

const dayMilliseconds$1 = 86_400_000;
const islamicEpoch = 1_948_439.5;
function islamicToJulianDay(year, month, day) {
    return (day +
        Math.ceil(29.5 * (month - 1)) +
        (year - 1) * 354 +
        Math.floor((3 + 11 * year) / 30) +
        islamicEpoch -
        1);
}
function julianDayToGregorian(julianDay) {
    return new Date((julianDay - 2_440_587.5) * dayMilliseconds$1);
}
function gregorianToJulianDay(date) {
    return date.getTime() / dayMilliseconds$1 + 2_440_587.5;
}
function gregorianToIslamic(date) {
    const julianDay = Math.floor(gregorianToJulianDay(date)) + 0.5;
    const year = Math.floor((30 * (julianDay - islamicEpoch) + 10_646) / 10_631);
    const month = Math.min(12, Math.ceil((julianDay - (29 + islamicToJulianDay(year, 1, 1))) / 29.5) + 1);
    const day = Math.floor(julianDay - islamicToJulianDay(year, month, 1) + 1);
    return {
        year,
        month,
        day,
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds(),
    };
}
function createTabularHijriAdapter() {
    return {
        id: 'hijri',
        provider: 'tabular',
        getParts: gregorianToIslamic,
        fromParts(parts) {
            validateTimeParts(parts);
            if (!Number.isInteger(parts.year) ||
                !Number.isInteger(parts.month) ||
                !Number.isInteger(parts.day) ||
                parts.year < 1 ||
                parts.month < 1 ||
                parts.month > 12 ||
                parts.day < 1 ||
                parts.day > this.daysInMonth(parts.year, parts.month)) {
                throw new RangeError(`Unable to convert ${parts.year}/${parts.month}/${parts.day} from hijri`);
            }
            const date = julianDayToGregorian(islamicToJulianDay(parts.year, parts.month, parts.day));
            date.setUTCHours(parts.hour || 0, parts.minute || 0, parts.second || 0, parts.millisecond || 0);
            return date;
        },
        addDays(date, amount) {
            return new Date(date.getTime() + amount * dayMilliseconds$1);
        },
        addMonths(date, amount) {
            const current = gregorianToIslamic(date);
            const absoluteMonth = current.year * 12 + current.month - 1 + amount;
            const year = Math.floor(absoluteMonth / 12);
            const month = (((absoluteMonth % 12) + 12) % 12) + 1;
            const maxDay = month % 2 === 1 ? 30 : 29;
            return this.fromParts({
                ...current,
                year,
                month,
                day: Math.min(current.day, maxDay),
            });
        },
        daysInMonth(year, month) {
            if (month % 2 === 1)
                return 30;
            if (month !== 12)
                return 29;
            return (year * 11 + 14) % 30 < 11 ? 30 : 29;
        },
    };
}

function createCalendarAdapter(calendar, options = {}) {
    if (calendar === 'hijri' && options.hijriProvider === 'tabular') {
        return createTabularHijriAdapter();
    }
    return createIntlAdapter(calendar, options.hijriProvider);
}

function parseCalendarParts(value, calendar) {
    const values = value.split(/[-/ .,:]/).filter(Boolean);
    const monthToken = values[1] || '1';
    const leapMonth = calendar === 'chinese' && /bis$/i.test(monthToken);
    const month = Number.parseInt(monthToken.replace(/bis$/i, ''), 10);
    return {
        year: Number(values[0]),
        month: month || 1,
        day: Number(values[2]) || 1,
        hour: Number(values[3]) || 0,
        minute: Number(values[4]) || 0,
        second: Number(values[5]) || 0,
        ...(leapMonth ? { leapMonth: true } : {}),
    };
}

const dayMilliseconds = 86_400_000;
function startOfUtcDay(value) {
    return Math.floor(value.getTime() / dayMilliseconds) * dayMilliseconds;
}
function isWithinCalendarBounds(value, from, to, part) {
    if (part === 'year' || part === 'month' || part === 'date') {
        const day = startOfUtcDay(value);
        return day >= startOfUtcDay(from) && day <= startOfUtcDay(to);
    }
    const timestamp = value.getTime();
    return timestamp >= from.getTime() && timestamp <= to.getTime();
}

function matchesDisable(candidate, matcher, options) {
    if (typeof matcher === 'string') {
        return options.matchesString(matcher);
    }
    if (matcher instanceof RegExp) {
        matcher.lastIndex = 0;
        const result = matcher.test(options.format(candidate));
        matcher.lastIndex = 0;
        return result;
    }
    if (typeof matcher === 'function') {
        return matcher(candidate);
    }
    return matcher.some((entry) => matchesDisable(candidate, entry, options));
}

/**
 * PersianDate uses a `j` prefix for Jalali date tokens, while the adapter
 * formatters use the same token names for their native calendar. Keep the
 * public format contract stable when a model is serialized in another
 * calendar.
 */
function normalizeCalendarFormat(format, calendar) {
    return format.replace(/j?(YYYY|YY|MMMM|MM|M|DD|D)/g, (token, name) => calendar === 'jalali'
        ? token.startsWith('j')
            ? token
            : `j${name}`
        : token.startsWith('j')
            ? name
            : token);
}
function formatCalendarParts(parts, format, options) {
    const pad = (value, size = 2) => String(value).padStart(size, '0');
    const leapSuffix = options.calendar === 'chinese' && parts.leapMonth ? 'bis' : '';
    const normalizedFormat = normalizeCalendarFormat(format, options.calendar)
        .replace(/\?MMMM/g, 'MMMM')
        .replace(/\?D/g, 'D');
    const tokens = {
        YYYY: String(parts.year),
        YY: String(parts.year).slice(-2),
        MMMM: options.monthName || 'MMMM',
        MM: `${pad(parts.month)}${leapSuffix}`,
        M: `${parts.month}${leapSuffix}`,
        DD: pad(parts.day),
        D: String(parts.day),
        HH: pad(parts.hour || 0),
        H: String(parts.hour || 0),
        mm: pad(parts.minute || 0),
        m: String(parts.minute || 0),
        ss: pad(parts.second || 0),
        s: String(parts.second || 0),
    };
    return normalizedFormat.replace(/YYYY|MMMM|YY|MM|DD|HH|mm|ss|M|D|H|m|s/g, (token) => tokens[token]);
}

function useCalendarAdapter(adapter, toDate, fromDate) {
    return {
        getParts(value) {
            if (!adapter)
                throw new Error('Calendar adapter is not available');
            return adapter.getParts(toDate(value));
        },
        fromParts(parts) {
            if (!adapter)
                throw new Error('Calendar adapter is not available');
            return fromDate(adapter.fromParts(parts));
        },
        addDays(value, amount) {
            if (!adapter)
                throw new Error('Calendar adapter is not available');
            return fromDate(adapter.addDays(toDate(value), amount));
        },
        addMonths(value, amount) {
            if (!adapter)
                throw new Error('Calendar adapter is not available');
            return fromDate(adapter.addMonths(toDate(value), amount));
        },
        daysInMonth(year, month) {
            if (!adapter)
                throw new Error('Calendar adapter is not available');
            return adapter.daysInMonth(year, month);
        },
    };
}

const _hoisted_1$2 = ["transform"];
var script$3 = /*@__PURE__*/ defineComponent({
    __name: 'PDPArrow',
    props: {
        direction: {
            default: 'up',
            type: String,
        },
        inverse: {
            default: false,
            type: Boolean,
        },
    },
    setup(__props) {
        const props = __props;
        const { direction, inverse } = toRefs(props);
        const rotate = computed(() => {
            const directions = {
                up: -90,
                down: 90,
                right: 0,
                left: 180,
            };
            const deg = directions[direction.value] + (inverse.value ? 180 : 0);
            return `rotate(${deg} 0 0)`;
        });
        return (_ctx, _cache) => {
            return (openBlock(), createElementBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
                viewBox: "314.6749267578125 199.97494506835938 370.62506103515625 600.050048828125",
                transform: rotate.value
            }, [...(_cache[0] || (_cache[0] = [
                    createElementVNode("metadata", null, "Arrow icon", -1 /* CACHED */),
                    createElementVNode("path", { d: "M419.9 785.6l251.10000000000002-251c9.600000000000023-9.600000000000023 14.299999999999955-22.100000000000023 14.299999999999955-34.60000000000002s-4.7999999999999545-25.100000000000023-14.299999999999955-34.60000000000002l-251.10000000000002-251.09999999999997c-19.099999999999966-19.100000000000023-50.099999999999966-19.100000000000023-69.29999999999995 0l-21.600000000000023 21.599999999999994c-19.100000000000023 19.099999999999994-19.100000000000023 50.099999999999994 0 69.29999999999998l160.2 160.2c9.600000000000023 9.600000000000023 14.300000000000011 22.100000000000023 14.300000000000011 34.60000000000002s-4.800000000000011 25.100000000000023-14.300000000000011 34.60000000000002l-160.2 160.29999999999995c-19.100000000000023 19.100000000000023-19.100000000000023 50.10000000000002 0 69.30000000000007l21.600000000000023 21.59999999999991c19.19999999999999 19 50.19999999999999 19 69.29999999999995-0.1999999999999318z" }, null, -1 /* CACHED */)
                ]))], 8 /* PROPS */, _hoisted_1$2));
        };
    }
});

script$3.__file = "src/components/utils/components/PDPArrow.vue";

const __default__ = {
    inheritAttrs: false,
};
var script$2 = /*@__PURE__*/ defineComponent({
    ...__default__,
    __name: 'PDPIcon',
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
    setup(__props) {
        const props = __props;
        const { icon } = toRefs(props);
        return (_ctx, _cache) => {
            return (unref(icon) === 'clear')
                ? (openBlock(), createElementBlock("svg", mergeProps({
                    key: 0,
                    viewBox: "0 0 512 512",
                    width: "1rem",
                    xmlns: "http://www.w3.org/2000/svg"
                }, _ctx.$attrs), [...(_cache[0] || (_cache[0] = [
                        createElementVNode("metadata", null, "Clear icon", -1 /* CACHED */),
                        createElementVNode("path", { d: "M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" }, null, -1 /* CACHED */)
                    ]))], 16 /* FULL_PROPS */))
                : (unref(icon) === 'date')
                    ? (openBlock(), createElementBlock("svg", mergeProps({
                        key: 1,
                        version: "1.1",
                        viewBox: "20.711000442504883 19.33300018310547 51.29999542236328 53.48200225830078",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, _ctx.$attrs, { "xmlns:xlink": "http://www.w3.org/1999/xlink" }), [...(_cache[1] || (_cache[1] = [
                            createStaticVNode("<metadata>Calendar icon</metadata><g><path d=\"M30.35,19.333v2.76h-9.639V32.79v3.4v36.625h44.781c3.595,0,6.519-2.926,6.519-6.52V36.19v-3.4V22.093h-9.64v-2.76h-3.399   v2.76H48.061v-2.76h-3.399v2.76H33.75v-2.76H30.35z M68.61,66.296c0,1.719-1.398,3.119-3.118,3.119H24.111V36.19H68.61V66.296z    M44.661,25.493v2.906h3.399v-2.906h10.911v2.906h3.399v-2.906h6.239v7.297H24.111v-7.297h6.239v2.906h3.4v-2.906H44.661z\"></path><path d=\"M38.073,40.157H27.448v10.625h10.625V40.157z M34.673,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M51.673,40.157H41.048v10.625h10.625V40.157z M48.273,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M65.273,40.157H54.648v10.625h10.625V40.157z M61.873,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M38.073,54.476H27.448v10.625h10.625V54.476z M34.673,61.7h-3.825v-3.826h3.825V61.7z\"></path><path d=\"M51.673,54.476H41.048v10.625h10.625V54.476z M48.273,61.7h-3.825v-3.826h3.825V61.7z\"></path><path d=\"M65.273,54.476H54.648v10.625h10.625V54.476z M61.873,61.7h-3.825v-3.826h3.825V61.7z\"></path></g>", 2)
                        ]))], 16 /* FULL_PROPS */))
                    : (unref(icon) === 'datetime')
                        ? (openBlock(), createElementBlock("svg", mergeProps({
                            key: 2,
                            "xmlns:svg": "http://www.w3.org/2000/svg",
                            xmlns: "http://www.w3.org/2000/svg"
                        }, _ctx.$attrs, {
                            viewBox: "7.146755218505859 47.93895721435547 195.70648193359375 201.1220703125",
                            version: "1.1"
                        }), [...(_cache[2] || (_cache[2] = [
                                createElementVNode("metadata", null, "Calendar And Clock Icon", -1 /* CACHED */),
                                createElementVNode("g", {
                                    id: "g915",
                                    "inkscape:label": "calendar",
                                    "inkscape:groupmode": "layer",
                                    style: { "display": "inline" }
                                }, [
                                    createElementVNode("g", {
                                        id: "g907",
                                        transform: "matrix(3.2971191,0,0,3.2971191,-61.13988,-15.80425)"
                                    }, [
                                        createElementVNode("path", {
                                            id: "path893",
                                            d: "m 30.35,19.333 v 2.76 h -9.639 v 10.697 3.4 36.625 h 44.781 c 3.595,0 6.519,-2.926 6.519,-6.52 V 36.19 32.79 22.093 h -9.64 v -2.76 h -3.399 v 2.76 H 48.061 v -2.76 h -3.399 v 2.76 H 33.75 v -2.76 z m 38.26,46.963 c 0,1.719 -1.398,3.119 -3.118,3.119 H 24.111 V 36.19 H 68.61 Z M 44.661,25.493 v 2.906 h 3.399 v -2.906 h 10.911 v 2.906 h 3.399 v -2.906 h 6.239 V 32.79 H 24.111 v -7.297 h 6.239 v 2.906 h 3.4 v -2.906 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path895",
                                            d: "M 38.073,40.157 H 27.448 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path897",
                                            d: "M 51.673,40.157 H 41.048 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path899",
                                            d: "M 65.273,40.157 H 54.648 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path901",
                                            d: "M 38.073,54.476 H 27.448 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path903",
                                            d: "M 51.673,54.476 H 41.048 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
                                        }),
                                        createElementVNode("path", {
                                            id: "path905",
                                            d: "M 65.273,54.476 H 54.648 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
                                        })
                                    ])
                                ], -1 /* CACHED */),
                                createElementVNode("g", { "inkscape:groupmode": "layer" }, [
                                    createElementVNode("circle", {
                                        id: "path918",
                                        style: { "fill": "#ffffff", "fill-opacity": "1", "stroke-width": "2.46968" },
                                        cx: "156.58038",
                                        cy: "201.26753",
                                        r: "44.96637"
                                    })
                                ], -1 /* CACHED */),
                                createElementVNode("g", { "inkscape:groupmode": "layer" }, [
                                    createElementVNode("g", {
                                        id: "g932",
                                        style: { "clip-rule": "evenodd", "fill-rule": "evenodd" },
                                        transform: "matrix(3.8598712,0,0,3.8598712,110.21634,156.42414)"
                                    }, [
                                        createElementVNode("path", {
                                            id: "path921",
                                            d: "M 12,0 C 18.623,0 24,5.377 24,12 24,18.623 18.623,24 12,24 5.377,24 0,18.623 0,12 0,5.377 5.377,0 12,0 Z m 0,1 C 18.071,1 23,5.929 23,12 23,18.071 18.071,23 12,23 5.929,23 1,18.071 1,12 1,5.929 5.929,1 12,1 Z m 0,11 h 6 v 1 H 11 V 4 h 1 z"
                                        })
                                    ])
                                ], -1 /* CACHED */)
                            ]))], 16 /* FULL_PROPS */))
                        : (unref(icon) === 'time')
                            ? (openBlock(), createElementBlock("svg", mergeProps({
                                key: 3,
                                xmlns: "http://www.w3.org/2000/svg"
                            }, _ctx.$attrs, {
                                "fill-rule": "evenodd",
                                "clip-rule": "evenodd",
                                viewBox: "0 0 24 24"
                            }), [...(_cache[3] || (_cache[3] = [
                                    createElementVNode("metadata", null, "Clock Icon", -1 /* CACHED */),
                                    createElementVNode("path", { d: "M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z" }, null, -1 /* CACHED */)
                                ]))], 16 /* FULL_PROPS */))
                            : createCommentVNode("v-if", true);
        };
    }
});

script$2.__file = "src/components/utils/components/PDPIcon.vue";

const _hoisted_1$1 = ["name", "value"];
const _hoisted_2$1 = ["name", "value"];
var script$1 = /*@__PURE__*/ defineComponent({
    __name: 'PDPAlt',
    props: {
        name: {
            type: String,
            required: true,
        },
        format: {
            type: String,
            required: true,
        },
        dates: {
            type: Array,
            required: true,
        },
    },
    setup(__props) {
        return (_ctx, _cache) => {
            return (__props.name.endsWith('[]'))
                ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(__props.dates, (date, i) => {
                    return (openBlock(), createElementBlock("input", {
                        key: i,
                        type: "hidden",
                        name: __props.name,
                        value: date.toString(__props.format)
                    }, null, 8 /* PROPS */, _hoisted_1$1));
                }), 128 /* KEYED_FRAGMENT */))
                : (openBlock(), createElementBlock("input", {
                    key: 1,
                    type: "hidden",
                    name: __props.name,
                    value: __props.dates.map((date) => date.toString(__props.format))
                }, null, 8 /* PROPS */, _hoisted_2$1));
        };
    }
});

script$1.__file = "src/components/utils/components/PDPAlt.vue";

//TODO: use scoped slots
//TODO: add time config
//TODO: add tip for days
//TODO: test the project with attention and test in nuxt
//TODO: refactor and write comment --> pay a high attention
// ************************ Core ************************
const isClient = typeof window !== 'undefined';
const jalaliDisableFormats = {
    date: 'jYYYY/jM/jD',
    datetime: 'jYYYY/jM/jD H:m',
    time: 'H:m',
};
function gregorianPartsFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
    };
}
var script = defineComponent({
    components: {
        PDPArrow: script$3,
        PDPIcon: script$2,
        PDPAlt: script$1,
    },
    inheritAttrs: false,
    props: {
        /**
         * the format of the model value
         * @type String
         * @see https://alireza-ab.ir/persian-date/formats#
         * @desc default value in "date" type is "YYYY-MM-DD"
         * 		default value in "datetime" type is "YYYY-MM-DD HH:mm"
         * 		default value in "time" type is "HH:mm"
         */
        format: {
            type: String,
        },
        /**
         * the format of the input value
         * @type String
         * @see https://alireza-ab.ir/persian-date/formats#
         * @desc default value equal to the value of "type" prop
         */
        inputFormat: {
            type: String,
        },
        /**
         * input mask configuration. A string is a pattern or
         * "calendar-default"; an object can customize each picker type.
         */
        inputMask: {
            type: [String, Object],
        },
        /**
         * the format of the value that shows in the footer of picker
         * @type String
         * @see https://alireza-ab.ir/persian-date/formats#
         * @desc default value in "date" type is "?D ?MMMM"
         * 		default value in "datetime" type is "?D ?MMMM HH:mm"
         * 		default value in "time" type is "HH:mm"
         */
        displayFormat: {
            type: String,
        },
        /**
         * the type of picker
         * @default "date"
         * @type String
         * @values date | time | datetime
         * @since 2.0.0
         */
        type: {
            type: String,
            default: 'date',
            validator: (val) => ['date', 'time', 'datetime'].includes(val),
        },
        /**
         * the date of start of the picker
         * @type String
         * @example 1400/7/1 | 1400-7
         */
        from: {
            type: String,
            default: (props) => (props.type === 'time' ? '' : '1300'),
        },
        /**
         * the date of end of the picker
         * @type String
         * @example 1400/7/1 | 1400-7
         */
        to: {
            type: String,
            default: (props) => (props.type === 'time' ? '23:59' : '1499'),
        },
        /**
         * show or hide the picker
         * @default false
         * @type Boolean
         */
        show: {
            default: false,
            type: Boolean,
        },
        /**
         * show the picker with click on the some sections
         * @default "all"
         * @type String
         * @values all | input | icon | none
         */
        clickOn: {
            default: 'all',
            type: String,
            validator: (val) => ['all', 'input', 'icon', 'none'].includes(val),
        },
        /**
         * show the picker in modal mode
         * @default true
         * @type Boolean
         */
        modal: {
            default: false,
            type: Boolean,
        },
        /**
         * text for label tag
         * @type String
         */
        label: {
            type: String,
        },
        /**
         * number of column
         * @default "{ 576: 1 }"
         * @type Object | Number
         * @desc 1. you can send the number of column
         *  	or send the object of the number of
         *  	column in the breakpoint.
         * 		2. if the breaking point in the object
         * 		is not specified, the default value it's 2
         */
        column: {
            default: () => ({ 576: 1 }),
            type: [Number, Object],
        },
        /**
         * minute Step
         * @default "1"
         * @type Number
         * @desc 1. you can send the number of step for minute.
         */
        minuteStep: {
            default: () => 1,
            type: [Number],
        },
        /**
         * hour Step
         * @default "1"
         * @type Number
         * @desc 1. you can send the number of step for hour.
         */
        hourStep: {
            default: () => 1,
            type: [Number],
        },
        /**
         * submit when date selected or not
         * @default true
         * @type Boolean
         */
        autoSubmit: {
            default: true,
            type: Boolean,
        },
        /**
         * mode of select date
         * @default "range"
         * @type String
         * @values range | single
         */
        mode: {
            default: 'range',
            type: String,
            validator: (val) => ['single', 'range'].includes(val),
        },
        /**
         * the locale of datepicker
         * @default calendar-aware (fa for jalali, en for gregorian, ar for hijri,
         * he for hebrew, th for buddhist, zh for chinese)
         * @type String
         * @values fa | en | fa,en |  en,fa
         * @desc Except above values, you can add
         *  	the language in "localeConfig" prop and use it.
         * @since 2.0.0
         */
        locale: {
            default: undefined,
            type: String,
        },
        /**
         * the calendar system used for the picker
         * @default undefined (uses the selected locale calendar)
         * @values jalali | gregorian
         */
        calendar: {
            type: String,
            validator: (val) => [
                'jalali',
                'gregorian',
                'hijri',
                'hebrew',
                'buddhist',
                'chinese',
            ].includes(val),
        },
        /** Calendar used to serialize modelValue. Defaults to the active calendar for compatibility. */
        modelCalendar: {
            type: String,
            default: 'active',
            validator: (val) => val === 'active' ||
                [
                    'jalali',
                    'gregorian',
                    'hijri',
                    'hebrew',
                    'buddhist',
                    'chinese',
                ].includes(val),
        },
        /** First weekday as a JavaScript weekday (0=Sunday ... 6=Saturday). */
        weekStartsOn: {
            type: [Number, String],
            default: 'auto',
        },
        /** Weekly official holidays as JavaScript weekdays. */
        weekendDays: {
            type: Array,
        },
        /**
         * Hijri calculation provider
         * @default "ummalqura"
         */
        hijriProvider: {
            type: String,
            default: 'ummalqura',
            validator: (val) => ['ummalqura', 'tabular'].includes(val),
        },
        /**
         * user can clear the selected dates or not
         * @default false
         * @type Boolean
         * @since 2.0.0
         */
        clearable: {
            default: false,
            type: Boolean,
        },
        /**
         * disable some dates or time
         * @type [Array, String, Function, RegExp]
         * @since 2.0.0
         */
        disable: {
            type: [Array, String, Function, RegExp],
        },
        /**
         * the config for locales
         * @type Object
         * @since 2.0.0
         */
        localeConfig: {
            type: Object,
        },
        /**
         * the styles of the picker
         * @type Object
         * @since 2.0.0
         */
        styles: {
            type: Object,
        },
        /**
         * the color of the picker
         * @type String
         * @values red | pink | orange | green | purple | gray
         * @since 2.0.0
         */
        color: {
            type: String,
            validator: (val) => ['blue', 'red', 'pink', 'orange', 'green', 'purple', 'gray'].includes(val),
        },
        /**
         * use two input for dispaly
         * @type Boolean
         * @default false
         * @since 2.2.0
         */
        dualInput: {
            type: Boolean,
            default: false,
        },
        /**
         * show icon inside of input
         * @type Boolean
         * @default false
         * @since 2.2.0
         */
        iconInside: {
            type: Boolean,
            default: false,
        },
        /**
         * shortcut for select date and time quickly
         * @type Boolean | Object
         * @since 2.2.0
         */
        shortcut: {
            type: [Boolean, Object],
            default: false,
        },
    },
    emits: ['open', 'close', 'select', 'submit', 'clear', 'update:modelValue'],
    data() {
        return {
            core: new PersianDate(),
            onDisplay: undefined,
            fromDate: undefined,
            toDate: undefined,
            selectedDates: [],
            selectedTimes: [],
            showDatePicker: false,
            showYearSelect: false,
            showMonthSelect: false,
            showTopOfInput: false,
            displayValue: [],
            inputName: 'firstInput',
            pickerPlace: {},
            documentWidth: isClient ? window.innerWidth : Infinity,
            langs: Core.langs,
            currentLocale: (this.locale || this.defaultLocaleForCalendar(this.calendar)).split(',')[0],
            interval: null,
            resizeHandler: null,
            submitedValue: [],
        };
    },
    computed: {
        lang() {
            return this.langs[this.currentLocale] || this.langs.en;
        },
        effectiveLocale() {
            return this.locale || this.defaultLocaleForCalendar(this.calendar);
        },
        activeCalendar() {
            return this.calendar || this.lang.calendar;
        },
        calendarLang() {
            return this.lang;
        },
        calendarWeekStart() {
            if (this.weekStartsOn !== 'auto')
                return Number(this.weekStartsOn);
            switch (this.activeCalendar) {
                case 'jalali':
                case 'hijri':
                    return 6;
                default:
                    return 0;
            }
        },
        calendarWeekendDays() {
            if (this.weekendDays)
                return this.weekendDays;
            switch (this.activeCalendar) {
                case 'jalali':
                    return [5];
                case 'hijri':
                    return [5, 6];
                case 'hebrew':
                    return [6];
                default:
                    return [0, 6];
            }
        },
        orderedWeekdays() {
            const labels = this.calendarLang.weekdays;
            const sourceStart = this.currentLocale === 'fa' ? 6 : 0;
            return Array.from({ length: 7 }, (_, index) => labels[(this.calendarWeekStart - sourceStart + index + 7) % 7]);
        },
        calendarMonthNames() {
            const year = this.onDisplay
                ? this.getCalendarParts(this.onDisplay).year
                : undefined;
            return this.monthNamesForYear(year);
        },
        calendarAdapter() {
            if (this.activeCalendar === 'jalali' ||
                (this.activeCalendar === 'gregorian' && this.calendar !== 'gregorian'))
                return undefined;
            return createCalendarAdapter(this.activeCalendar, {
                hijriProvider: this.hijriProvider,
            });
        },
        attrs() {
            const attrs = {
                div: { class: 'pdp-group' },
                label: { class: 'pdp-label' },
                alt: {},
                picker: { class: 'pdp-picker' },
                firstInput: { class: 'pdp-input' },
                secondInput: { class: 'pdp-input' },
            };
            for (const key in this.$attrs) {
                try {
                    // @ts-expect-error type
                    const [, group, attr] = key.match(/(div|label|alt|picker|firstInput|secondInput)-(.*)/);
                    attrs[group][attr] = this.$attrs[key];
                }
                catch {
                    attrs['firstInput'][key] = this.$attrs[key];
                }
            }
            attrs.picker.class = [
                attrs.picker.class,
                {
                    'pdp-top': this.pickerPlace.top,
                    'pdp-left': this.pickerPlace.left,
                    'pdp-right': this.pickerPlace.right,
                },
                this.lang.dir.picker,
            ];
            if (this.mode == 'single' && this.dualInput) {
                attrs['secondInput'].disabled = 'disabled';
            }
            if (this.showDatePicker) {
                attrs[this.inputName].class += ' pdp-focus';
            }
            return attrs;
        },
        altDates() {
            return this.submitedValue;
        },
        displayDate() {
            return (this.onDisplay || this.core);
        },
        years() {
            let start = this.displayYear(this.fromDate);
            const end = this.displayYear(this.toDate);
            return Array(end - start + 1)
                .fill(null)
                .map(() => start++);
        },
        columnCount() {
            let column = 2;
            if (Core.isNumber(this.column)) {
                column = this.column;
            }
            else {
                const breakpoint = Object.keys(this.column)
                    .sort((a, b) => +a - +b)
                    .find((bp) => this.documentWidth <= +bp);
                if (breakpoint)
                    column = this.column[breakpoint];
            }
            if (this.type.includes('time')) {
                const scale = column / (this.mode == 'single' ? 1 : 2);
                this.$refs.root.style.setProperty('--time-scale', (scale > 1 ? scale : 1) + '');
            }
            return column;
        },
        minuteStepCount() {
            let step = 1;
            if (Core.isNumber(this.minuteStep)) {
                step = this.minuteStep;
            }
            return step;
        },
        hourStepCount() {
            let step = 1;
            if (Core.isNumber(this.hourStep)) {
                step = this.hourStep;
            }
            return step;
        },
        monthDays() {
            const months = [];
            for (let i = 0; i < this.columnCount; i++) {
                let emptyCells;
                const monthDate = this.calendarMonthDate(this.onDisplay, i);
                const selectedParts = this.getCalendarParts(monthDate);
                const selectedYear = selectedParts.year;
                const selectedMonth = selectedParts.month;
                const firstDay = this.calendarDayDate(monthDate, 1);
                emptyCells = this.calendarWeekdayOffset(firstDay);
                let daysOfMonthNumber = this.calendarDaysInMonth(selectedYear, selectedMonth);
                const numberOfWeek = Math.ceil((daysOfMonthNumber + emptyCells) / 7);
                const month = [];
                let showDay = 1;
                for (let week = 0; week < numberOfWeek; week++) {
                    month[week] = [];
                    for (let day = 0; day < 7; day++) {
                        if (emptyCells) {
                            month[week][day] = { empty: true };
                            --emptyCells;
                        }
                        else if (daysOfMonthNumber) {
                            //FIXME: refactor
                            const dayDate = this.calendarDayDate(monthDate, showDay);
                            month[week][day] = {
                                friday: this.calendarWeekendDays.includes(new Date(this.getDateTimestamp(dayDate)).getUTCDay()),
                                weekend: this.calendarWeekendDays.includes(new Date(this.getDateTimestamp(dayDate)).getUTCDay()),
                                raw: dayDate,
                                startRange: this.selectedDates[0] &&
                                    this.isSameCalendarDate(this.selectedDates[0], dayDate),
                                endRange: this.selectedDates[1] &&
                                    this.isSameCalendarDate(this.selectedDates[1], dayDate),
                                inRange: this.selectedDates.length == 2 &&
                                    this.isBetweenSelectedDates(dayDate),
                                disabled: !this.checkDate(dayDate, 'date') ||
                                    this.isInDisable(dayDate),
                                today: this.isToday(dayDate),
                                val: showDay++,
                            };
                            --daysOfMonthNumber;
                        }
                        else
                            month[week][day] = { empty: true };
                    }
                }
                months.push(month);
            }
            return months;
        },
        months() {
            const months = {};
            const count = this.activeCalendar === 'hebrew'
                ? this.calendarMonthNames.length
                : 12;
            for (let i = 1; i <= count; i++) {
                months[i] = {
                    label: this.calendarMonthNames[i - 1] || `Month ${i}`,
                    selected: this.displayMonth(this.onDisplay) == i,
                    disabled: !this.checkDate(this.calendarMonthDate(this.onDisplay, i - this.displayMonth(this.onDisplay)), 'month'),
                };
            }
            return months;
        },
        nextLocale() {
            const locales = this.effectiveLocale.split(',');
            const index = locales.indexOf(this.currentLocale);
            const locale = locales[index + 1] || locales[0];
            return this.langs[locale].translations.label;
        },
        formats() {
            const displayFormat = {
                date: '?D ?MMMM',
                datetime: '?D ?MMMM HH:mm',
                time: 'HH:mm',
            };
            const format = {
                date: 'YYYY-MM-DD',
                datetime: 'YYYY-MM-DD HH:mm',
                time: 'HH:mm',
            };
            return {
                model: this.format || format[this.type],
                input: this.inputFormat ||
                    this.lang.inputFormat ||
                    (this.calendarAdapter ? format[this.type] : this.type),
                display: this.displayFormat ||
                    this.lang.displayFormat ||
                    (this.calendarAdapter
                        ? displayFormat[this.type]
                            .replace('?D', 'D')
                            .replace('?MMMM', 'MMMM')
                        : displayFormat[this.type]),
                alt: this.attrs.alt.format ||
                    this.format ||
                    format[this.type],
            };
        },
        defaultDate() {
            const prefix = this.type === 'time'
                ? `${this.calendarAdapter
                    ? this.formatDateValue(this.core, 'YYYY-MM-DD')
                    : this.core.toString('jYYYY/jMM/jDD')} `
                : '';
            return {
                from: prefix + this.from,
                to: prefix + this.to,
            };
        },
        inputs() {
            return !this.dualInput ? ['firstInput'] : ['firstInput', 'secondInput'];
        },
        tabIndex() {
            return (+(this.attrs.secondInput.tabindex || this.attrs.firstInput.tabindex) +
                1 || undefined);
        },
        shortcuts() {
            if (!this.shortcut) {
                return false;
            }
            const shortcuts = {};
            const part = this.type.includes('date') ? 'date' : 'time';
            let d = this.core.clone().now();
            if (part == 'time' && !this.validate(d, part))
                d = this.toDate.clone().subDay().now();
            const checkDate = (dates) => {
                return this.mode === 'single'
                    ? this.validate(dates[0], part)
                    : dates.some((d) => this.validate(d, part)) &&
                        !this.isDisableBetween(...dates);
            };
            const setShortcut = (obj, fromProps = false) => {
                for (const phrase in obj) {
                    const dates = fromProps
                        ? obj[phrase].map((date) => part == 'date'
                            ? d.clone().fromJalali(date)
                            : d.clone().time(date))
                        : obj[phrase];
                    if (checkDate(dates)) {
                        shortcuts[phrase] =
                            this.type == 'date'
                                ? dates.map((d) => d.startOf('date'))
                                : dates;
                    }
                }
            };
            if (this.shortcut === true) {
                if (this.calendarAdapter) {
                    setShortcut(this.adapterShortcuts(part));
                    return shortcuts;
                }
                setShortcut(Core.getShortcuts(d, `${part}-${this.mode}`, this.lang.translations));
            }
            else {
                setShortcut(this.shortcut, true);
            }
            return shortcuts;
        },
    },
    watch: {
        show: {
            handler: function (val) {
                this.showDatePicker = val;
            },
        },
        calendar: {
            handler: function (val) {
                if (!this.locale)
                    this.currentLocale = this.defaultLocaleForCalendar(val);
            },
        },
        showDatePicker: {
            handler: function (val) {
                if (val)
                    this.$emit('open');
                else {
                    if (!this.modal)
                        document.removeEventListener('scroll', this.locate);
                    this.$emit('close');
                }
            },
        },
        from: {
            handler: function (val) {
                this.fromDate = this.parseCalendarDate(val);
            },
        },
        to: {
            handler: function (val) {
                this.toDate = this.normalizeEndDate(this.parseCalendarDate(val), Core.getLastUnit(this.to, this.type));
            },
        },
        mode: {
            handler: function (val) {
                if (val == 'single' && this.selectedDates.length == 2)
                    this.selectedDates.pop();
            },
        },
        modelCalendar: {
            handler: function () {
                if (this.selectedDates.length)
                    this.submitDate(false);
            },
        },
        format: {
            handler: function () {
                if (this.selectedDates.length)
                    this.submitDate(false);
            },
        },
        inputFormat: {
            handler: function () {
                if (this.selectedDates.length)
                    this.submitDate(false);
            },
        },
        locale: {
            handler: function (val, oldVal) {
                const next = val || this.defaultLocaleForCalendar(this.calendar);
                const previous = oldVal || this.effectiveLocale;
                const index = previous.split(',').indexOf(this.currentLocale);
                this.currentLocale = next.split(',')[index] || next.split(',')[0];
                if (!this.langs[this.currentLocale])
                    this.currentLocale = 'en';
            },
        },
        localeConfig: {
            handler: function (val) {
                this.langs = Core.mergeObject(this.langs, val);
            },
            deep: true,
        },
        styles: {
            handler: function (val) {
                Core.setStyles(val, this.$refs.root);
            },
            deep: true,
        },
        color: {
            handler: function (val) {
                Core.setColor(val, this.$refs.root);
            },
        },
    },
    beforeMount() {
        this.langs = Core.mergeObject(this.langs, this.localeConfig);
    },
    mounted() {
        Core.setColor(this.color, this.$refs.root);
        Core.setStyles(this.styles, this.$refs.root);
        const calendar = this.activeCalendar;
        const internalCalendar = this.calendarAdapter
            ? 'gregorian'
            : calendar;
        this.fromDate = this.parseCalendarDate(this.defaultDate.from);
        this.toDate = this.normalizeEndDate(this.parseCalendarDate(this.defaultDate.to), Core.getLastUnit(this.to, this.type)).calendar(internalCalendar);
        this.core.calendar(internalCalendar);
        const val = this.$attrs.modelValue;
        if (val) {
            this.setDate(val);
        }
        else {
            const today = this.core.clone();
            if (this.type == 'date')
                today.startOf('date');
            if (this.checkDate(today, 'date')) {
                this.onDisplay = today;
            }
            else {
                this.onDisplay = this.nearestDate(today).startOf('date');
            }
        }
        this.resizeHandler = () => {
            this.documentWidth = window.innerWidth;
        };
        window.addEventListener('resize', this.resizeHandler);
        if (this.type != 'date') {
            this.onDisplay.time(this.core);
        }
        this.showDatePicker = this.show;
    },
    beforeUnmount() {
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        document.removeEventListener('scroll', this.locate);
        if (this.$refs.pdpMain) {
            this.$refs.pdpMain.removeEventListener('mouseover', this.selectInRangeDate);
        }
        this.stopChangeTime();
    },
    methods: {
        adapterShortcuts(part) {
            if (!this.calendarAdapter)
                return {};
            const adapter = this.calendarAdapter;
            const now = new Date();
            const current = adapter.getParts(now);
            const fromParts = (parts) => this.fromCalendarParts(parts);
            const shift = (amount) => fromParts(adapter.getParts(adapter.addDays(now, amount)));
            const dayStart = (parts) => ({
                ...parts,
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
            });
            if (part === 'time') {
                const startOfDay = dayStart(current);
                return {
                    [this.lang.translations.now]: [fromParts(current)],
                    [this.lang.translations.oneHourAgo]: [
                        fromParts(adapter.getParts(new Date(now.getTime() - 60 * 60 * 1000))),
                    ],
                    [this.lang.translations.oneHourLater]: [
                        fromParts(adapter.getParts(new Date(now.getTime() + 60 * 60 * 1000))),
                    ],
                    [this.lang.translations.midnight]: [fromParts(startOfDay)],
                    [this.lang.translations.midday]: [
                        fromParts({ ...startOfDay, hour: 12 }),
                    ],
                };
            }
            const currentDate = fromParts(current);
            const weekOffset = this.calendarWeekdayOffset(currentDate);
            const weekStart = fromParts(adapter.getParts(adapter.addDays(now, -weekOffset)));
            const weekEnd = fromParts(adapter.getParts(adapter.addDays(now, 6 - weekOffset)));
            const monthStart = fromParts({ ...current, day: 1 });
            const monthEnd = fromParts({
                ...current,
                day: adapter.daysInMonth(current.year, current.month),
            });
            const previousMonth = fromParts(adapter.getParts(adapter.addMonths(now, -1)));
            const nextMonth = fromParts(adapter.getParts(adapter.addMonths(now, 1)));
            const monthRange = (start) => {
                const parts = this.getCalendarParts(start);
                return [
                    start,
                    this.calendarAddDays(start, adapter.daysInMonth(parts.year, parts.month) - 1),
                ];
            };
            return {
                [this.lang.translations.now]: [currentDate],
                [this.lang.translations.yesterday]: [shift(-1)],
                [this.lang.translations.tomorrow]: [shift(1)],
                [this.lang.translations.firstOfWeek]: [weekStart],
                [this.lang.translations.lastOfWeek]: [weekEnd],
                [this.lang.translations.thisWeek]: [weekStart, weekEnd],
                [this.lang.translations.prevWeek]: [
                    this.calendarAddDays(weekStart, -7),
                    this.calendarAddDays(weekEnd, -7),
                ],
                [this.lang.translations.nextWeek]: [
                    this.calendarAddDays(weekStart, 7),
                    this.calendarAddDays(weekEnd, 7),
                ],
                [this.lang.translations.thisMonth]: [monthStart, monthEnd],
                [this.lang.translations.prevMonth]: monthRange(this.fromCalendarParts({
                    ...this.getCalendarParts(previousMonth),
                    day: 1,
                })),
                [this.lang.translations.nextMonth]: monthRange(this.fromCalendarParts({
                    ...this.getCalendarParts(nextMonth),
                    day: 1,
                })),
            };
        },
        defaultLocaleForCalendar(calendar) {
            switch (calendar) {
                case 'jalali':
                    return 'fa';
                case 'hijri':
                    return 'ar';
                case 'hebrew':
                    return 'he';
                case 'buddhist':
                    return 'th';
                case 'chinese':
                    return 'zh';
                case 'gregorian':
                    return 'en';
                default:
                    return 'fa';
            }
        },
        isHebrewLeapYear(year) {
            return (7 * year + 1) % 19 < 7;
        },
        monthNamesForYear(year) {
            if (this.activeCalendar === 'jalali') {
                return this.lang.months;
            }
            const fallback = {
                hijri: this.currentLocale === 'ar'
                    ? [
                        'محرم',
                        'صفر',
                        'ربيع الأول',
                        'ربيع الثاني',
                        'جمادى الأولى',
                        'جمادى الثانية',
                        'رجب',
                        'شعبان',
                        'رمضان',
                        'شوال',
                        'ذو القعدة',
                        'ذو الحجة',
                    ]
                    : [
                        'Muharram',
                        'Safar',
                        'Rabi al-awwal',
                        'Rabi al-thani',
                        'Jumada al-awwal',
                        'Jumada al-thani',
                        'Rajab',
                        'Sha’ban',
                        'Ramadan',
                        'Shawwal',
                        'Dhu al-Qadah',
                        'Dhu al-Hijjah',
                    ],
                hebrew: this.isHebrewLeapYear(year || 5785)
                    ? this.currentLocale === 'he'
                        ? [
                            'תשרי',
                            'חשוון',
                            'כסלו',
                            'טבת',
                            'שבט',
                            'אדר א׳',
                            'אדר',
                            'ניסן',
                            'אייר',
                            'סיוון',
                            'תמוז',
                            'אב',
                            'אלול',
                        ]
                        : [
                            'Tishri',
                            'Cheshvan',
                            'Kislev',
                            'Tevet',
                            'Shevat',
                            'Adar I',
                            'Adar II',
                            'Nisan',
                            'Iyar',
                            'Sivan',
                            'Tammuz',
                            'Av',
                            'Elul',
                        ]
                    : this.currentLocale === 'he'
                        ? [
                            'תשרי',
                            'חשוון',
                            'כסלו',
                            'טבת',
                            'שבט',
                            'אדר',
                            'ניסן',
                            'אייר',
                            'סיוון',
                            'תמוז',
                            'אב',
                            'אלול',
                        ]
                        : [
                            'Tishri',
                            'Cheshvan',
                            'Kislev',
                            'Tevet',
                            'Shevat',
                            'Adar',
                            'Nisan',
                            'Iyar',
                            'Sivan',
                            'Tammuz',
                            'Av',
                            'Elul',
                        ],
            };
            if (this.activeCalendar === 'hijri')
                return fallback.hijri;
            if (this.activeCalendar === 'chinese') {
                if (this.currentLocale === 'zh')
                    return [
                        '正月',
                        '二月',
                        '三月',
                        '四月',
                        '五月',
                        '六月',
                        '七月',
                        '八月',
                        '九月',
                        '十月',
                        '冬月',
                        '腊月',
                    ];
                const prefix = this.currentLocale === 'fa'
                    ? 'ماه'
                    : this.currentLocale === 'ar'
                        ? 'الشهر'
                        : 'Month';
                return Array.from({ length: 12 }, (_, index) => `${prefix} ${index + 1}`);
            }
            const count = this.activeCalendar === 'hebrew' ? fallback.hebrew.length : 12;
            const configuredMonths = this.localeConfig?.[this.currentLocale]?.months;
            if (Array.isArray(configuredMonths) &&
                configuredMonths.length >= count) {
                return configuredMonths;
            }
            const names = [];
            const calendarName = this.activeCalendar === 'buddhist'
                ? 'buddhist'
                : this.activeCalendar === 'hebrew'
                    ? 'hebrew'
                    : 'gregory';
            const locale = `${this.currentLocale}-u-ca-${calendarName}-nu-latn`;
            const formatter = new Intl.DateTimeFormat(locale, {
                month: 'long',
                timeZone: 'UTC',
            });
            for (let index = 1; index <= count; index++) {
                try {
                    const date = this.calendarAdapter
                        ? this.calendarAdapter.fromParts({
                            year: year || 1,
                            month: index,
                            day: 1,
                        })
                        : new Date(Date.UTC((year || 1970) -
                            (this.activeCalendar === 'buddhist' ? 543 : 0), index - 1, 1));
                    names.push(formatter.format(date));
                }
                catch {
                    break;
                }
            }
            return names.length
                ? names
                : fallback.hebrew || this.lang.months;
        },
        usesCalendarAdapter() {
            return this.activeCalendar !== 'jalali';
        },
        calendarBridge() {
            return useCalendarAdapter(this.calendarAdapter, (value) => new Date(this.getDateTimestamp(value)), (date) => markRaw(new PersianDate().fromGregorian(gregorianPartsFromTimestamp(date.getTime()))));
        },
        getCalendarParts(date) {
            const value = date;
            if (this.calendarAdapter) {
                return this.calendarBridge().getParts(value);
            }
            const native = value
                .clone()
                .calendar(this.activeCalendar === 'gregorian' ? 'gregorian' : 'jalali');
            return {
                year: native.year(),
                month: native.month(),
                day: native.date(),
                hour: native.hour(),
                minute: native.minute(),
                second: native.second(),
                millisecond: native.millisecond(),
            };
        },
        getDateTimestamp(date) {
            const value = date;
            const timestamp = Number(value.valueOf());
            if (Number.isFinite(timestamp))
                return timestamp;
            const native = value.toDate();
            return Number.isFinite(Number(native))
                ? Number(native)
                : Date.parse(String(native));
        },
        getDayTimestamp(date) {
            return (Math.floor(this.getDateTimestamp(date) / 86_400_000) * 86_400_000);
        },
        normalizeEndDate(date, unit) {
            if (this.calendarAdapter && this.type === 'time') {
                const adapter = this.calendarAdapter;
                const parts = this.getCalendarParts(date);
                const end = {
                    ...parts,
                    ...(unit === 'year' || unit === 'month'
                        ? { day: adapter.daysInMonth(parts.year, parts.month) }
                        : {}),
                    ...(unit === 'year' ? { month: parts.month } : {}),
                    ...(unit === 'date' || unit === 'hour' || unit === 'minute'
                        ? { hour: unit === 'date' ? 23 : parts.hour || 0 }
                        : {}),
                    ...(unit === 'date' || unit === 'hour' || unit === 'minute'
                        ? {
                            minute: unit === 'date' || unit === 'hour' ? 59 : parts.minute || 0,
                        }
                        : {}),
                    ...(unit === 'date' || unit === 'hour' || unit === 'minute'
                        ? {
                            second: unit === 'date' || unit === 'hour' || unit === 'minute'
                                ? 59
                                : parts.second || 0,
                        }
                        : {}),
                    ...(unit !== 'millisecond' ? { millisecond: 999 } : {}),
                };
                if (unit === 'year') {
                    let month = 1;
                    while (month < 20) {
                        try {
                            const candidate = adapter.fromParts({
                                ...parts,
                                month: month + 1,
                                day: 1,
                            });
                            if (adapter.getParts(candidate).year !== parts.year)
                                break;
                            month += 1;
                        }
                        catch {
                            break;
                        }
                    }
                    end.month = month;
                    end.day = adapter.daysInMonth(parts.year, month);
                }
                if (unit === 'month') {
                    end.day = adapter.daysInMonth(parts.year, parts.month);
                }
                return this.fromCalendarParts(end);
            }
            return markRaw(new PersianDate()
                .fromGregorian(gregorianPartsFromTimestamp(this.getDateTimestamp(date)))
                .endOf(unit));
        },
        fromCalendarParts(parts) {
            if (this.calendarAdapter) {
                return this.calendarBridge().fromParts(parts);
            }
            const values = [
                parts.year,
                parts.month,
                parts.day,
                parts.hour || 0,
                parts.minute || 0,
                parts.second || 0,
                parts.millisecond || 0,
            ];
            return markRaw(this.activeCalendar === 'gregorian'
                ? this.core.clone().fromGregorian(values)
                : this.core.clone().fromJalali(values));
        },
        displayYear(date) {
            return this.getCalendarParts(date).year;
        },
        displayMonth(date) {
            return this.getCalendarParts(date).month;
        },
        displayDay(date) {
            return this.getCalendarParts(date).day;
        },
        calendarMonthDate(date, amount) {
            const value = date;
            if (!this.calendarAdapter)
                return markRaw(value.clone().addMonth(amount));
            return this.calendarBridge().addMonths(value, amount);
        },
        calendarDayDate(date, day) {
            const value = date;
            if (!this.calendarAdapter)
                return markRaw(value.clone().date(day));
            return this.calendarBridge().fromParts({
                ...this.getCalendarParts(date),
                day,
            });
        },
        calendarAddDays(date, amount) {
            if (!this.calendarAdapter)
                return markRaw(date.clone().addDay(amount));
            return this.calendarBridge().addDays(date, amount);
        },
        calendarMonthKey(date) {
            const parts = this.getCalendarParts(date);
            return `${parts.year}-${parts.month}-${parts.leapMonth ? 'leap' : 'normal'}`;
        },
        calendarDaysInMonth(year, month) {
            if (this.calendarAdapter) {
                return this.calendarBridge().daysInMonth(year, month);
            }
            return this.core.getDaysInMonth(year, month);
        },
        calendarWeekdayOffset(date) {
            const weekday = new Date(this.getDateTimestamp(date)).getUTCDay();
            return (weekday - this.calendarWeekStart + 7) % 7;
        },
        isToday(date) {
            return this.getDayTimestamp(date) === this.getDayTimestamp(this.core);
        },
        isSameCalendarDate(first, second) {
            const a = this.getCalendarParts(first);
            const b = this.getCalendarParts(second);
            return (a.year === b.year &&
                a.month === b.month &&
                a.day === b.day &&
                Boolean(a.leapMonth) === Boolean(b.leapMonth));
        },
        isBetweenSelectedDates(date) {
            if (this.selectedDates.length !== 2)
                return false;
            const value = this.getDayTimestamp(date);
            const start = this.getDayTimestamp(this.selectedDates[0]);
            const end = this.getDayTimestamp(this.selectedDates[1]);
            return value > Math.min(start, end) && value < Math.max(start, end);
        },
        formatDateValue(date, format) {
            const value = date;
            if (!this.calendarAdapter)
                return value.toString(format);
            const parts = this.getCalendarParts(date);
            const monthName = this.monthNamesForYear(parts.year)[parts.month - 1] ||
                `Month ${parts.month}`;
            return formatCalendarParts(parts, format, {
                calendar: this.activeCalendar,
                monthName,
            });
        },
        formatModelValue(date) {
            const target = this.modelCalendar === 'active'
                ? this.activeCalendar
                : this.modelCalendar;
            if (!target || target === this.activeCalendar) {
                return this.formatDateValue(date, this.formats.model);
            }
            const value = date;
            const timestamp = this.getDateTimestamp(value);
            const modelFormat = normalizeCalendarFormat(this.formats.model, target);
            if (target === 'jalali' || target === 'gregorian') {
                return new PersianDate()
                    .fromGregorian(gregorianPartsFromTimestamp(timestamp))
                    .calendar(target)
                    .toString(modelFormat);
            }
            const adapter = createCalendarAdapter(target, {
                hijriProvider: this.hijriProvider,
            });
            const parts = adapter.getParts(new Date(timestamp));
            return formatCalendarParts(parts, modelFormat, {
                calendar: target,
            });
        },
        parseCalendarDate(value) {
            if (this.calendarAdapter) {
                try {
                    if (this.type === 'time' && !/[\s/-]/.test(value)) {
                        const time = value.split(/[:.,]/).map(Number);
                        const base = this.getCalendarParts(this.core);
                        return this.fromCalendarParts({
                            ...base,
                            hour: time[0] || 0,
                            minute: time[1] || 0,
                            second: time[2] || 0,
                        });
                    }
                    return this.fromCalendarParts(parseCalendarParts(value, this.activeCalendar));
                }
                catch {
                    return markRaw(this.core.clone().parse('invalid'));
                }
            }
            const date = this.core.clone();
            const sourceCalendar = this.calendar === 'gregorian' ||
                (value.includes('-') && !value.includes('/'))
                ? 'gregorian'
                : 'jalali';
            if (!/[-/ ]/.test(value)) {
                return date
                    .calendar(sourceCalendar)
                    .parse(value)
                    .calendar(this.activeCalendar);
            }
            const parsed = sourceCalendar === 'gregorian'
                ? date.fromGregorian(value)
                : date.fromJalali(value);
            return parsed.calendar(this.activeCalendar);
        },
        showPart(part) {
            if (part == 'year') {
                this.showMonthSelect = false;
                this.showYearSelect = !this.showYearSelect;
                if (this.showYearSelect) {
                    this.$nextTick(() => {
                        const selectedYearTop = this.$refs.pdpSelectYear.querySelector('li.selected').offsetTop;
                        this.$refs.pdpSelectYear.scroll({
                            top: selectedYearTop,
                            behavior: 'smooth',
                        });
                    });
                }
            }
            else if (part == 'month') {
                this.showYearSelect = false;
                this.showMonthSelect = !this.showMonthSelect;
            }
        },
        changeSelectedMonth(month) {
            const clone = this.onDisplay.clone();
            if (month == 'add') {
                this.onDisplay = this.calendarMonthDate(this.onDisplay, 1);
            }
            else if (month == 'sub') {
                this.onDisplay = this.calendarMonthDate(this.onDisplay, -1);
            }
            else {
                const parts = this.getCalendarParts(this.onDisplay);
                this.onDisplay = this.fromCalendarParts({
                    ...parts,
                    month,
                    day: Math.min(parts.day, this.calendarDaysInMonth(parts.year, month)),
                });
            }
            if (this.checkDate(this.onDisplay, 'month'))
                this.showMonthSelect = false;
            else
                this.onDisplay = clone;
        },
        changeSelectedYear(year) {
            const parts = this.getCalendarParts(this.onDisplay);
            this.onDisplay = this.fromCalendarParts({
                ...parts,
                year,
                day: Math.min(parts.day, this.calendarDaysInMonth(year, parts.month)),
            });
            if (!this.checkDate(this.onDisplay, 'date'))
                this.onDisplay = this.nearestDate(this.onDisplay);
            this.showYearSelect = false;
        },
        validate(date, part) {
            if (!this.checkDate(date, part) || this.isInDisable(date))
                return false;
            return true;
        },
        isDisableBetween(first, second) {
            if (!this.disable)
                return false;
            if (this.calendarAdapter) {
                const firstTimestamp = this.getDateTimestamp(first);
                const secondTimestamp = this.getDateTimestamp(second);
                const lower = Math.min(firstTimestamp, secondTimestamp);
                const upper = Math.max(firstTimestamp, secondTimestamp);
                const timestampFor = (date) => this.type === 'date'
                    ? this.getDayTimestamp(date)
                    : this.getDateTimestamp(date);
                const disabledValues = typeof this.disable === 'string'
                    ? [this.disable]
                    : Array.isArray(this.disable)
                        ? this.disable.filter((value) => typeof value === 'string')
                        : [];
                if (disabledValues.some((value) => {
                    const disabled = this.type === 'time'
                        ? second.clone().time(value)
                        : this.parseCalendarDate(value);
                    const timestamp = timestampFor(disabled);
                    return timestamp > lower && timestamp < upper;
                })) {
                    return true;
                }
                if (this.type !== 'time') {
                    let cursor = new Date(upper);
                    while (true) {
                        cursor = this.calendarAdapter.addDays(cursor, -1);
                        if (cursor.getTime() <= lower)
                            break;
                        if (this.isInDisable(this.fromCalendarParts(this.calendarAdapter.getParts(cursor))))
                            return true;
                    }
                }
                return false;
            }
            if (this.type != 'datetime' && Core.isString(this.disable)) {
                const date = this.type == 'time'
                    ? second.clone().time(this.disable)
                    : this.disable;
                return this.core
                    .clone()
                    .parse(date)
                    .isBetween(first.toString(), second.toString());
            }
            else if (this.type != 'datetime' &&
                Array.isArray(this.disable) &&
                this.disable.some((date) => Core.isString(date))) {
                return this.disable.some((date) => {
                    if (this.type == 'time')
                        date = second
                            .clone()
                            .time(date)
                            .toString();
                    return this.core
                        .clone()
                        .parse(date)
                        .isBetween(first, second);
                });
            }
            else if (this.type != 'time') {
                const inRangeDate = second.clone().startOf('date').subDay();
                while (!inRangeDate.isSameOrBefore(first)) {
                    if (this.isInDisable(inRangeDate))
                        return true;
                    inRangeDate.subDay();
                }
            }
            return false;
        },
        selectDate(date, part) {
            let isValid = this.validate(date, part);
            if (!isValid) {
                return -1;
            }
            else if (this.mode == 'range' && this.selectedDates.length == 1) {
                isValid = !this.isDisableBetween(this.selectedDates[0], date);
                if (!isValid) {
                    return -2;
                }
            }
            if (this.type == 'date' && !this.calendarAdapter) {
                date.startOf('date');
            }
            if (this.mode == 'single') {
                this.selectedDates = [date];
            }
            else if (this.mode == 'range') {
                this.$refs.pdpMain.addEventListener('mouseover', this.selectInRangeDate);
                if (this.selectedDates.length === 0) {
                    this.selectedDates[0] = date;
                    this.inputName = 'secondInput';
                }
                else if (this.inputName === 'secondInput') {
                    this.inputName = 'firstInput';
                    if (this.getDateTimestamp(date) >=
                        this.getDateTimestamp(this.selectedDates[0])) {
                        this.selectedDates[1] = date;
                    }
                    else {
                        if (this.selectedDates.length === 1)
                            this.selectedDates.unshift(date);
                        else {
                            this.selectedDates = [date];
                            this.inputName = 'secondInput';
                        }
                    }
                }
                else {
                    this.selectedDates = [date];
                    this.inputName = 'secondInput';
                }
                if (this.selectedDates.length == 2) {
                    this.$refs.pdpMain.removeEventListener('mouseover', this.selectInRangeDate);
                }
            }
            if (this.type == 'datetime') {
                this.selectedDates = this.selectedDates.map((d, i) => {
                    if (this.selectedTimes[i]) {
                        d.time(this.selectedTimes[i]);
                    }
                    this.selectedTimes[i] = d;
                    return d;
                });
            }
            this.$emit('select', date);
            if (this.autoSubmit &&
                (this.mode !== 'range' ||
                    (this.mode === 'range' && this.selectedDates.length == 2))) {
                this.submitDate();
                return 1;
            }
            return 0;
        },
        setModel(date) {
            if (date === undefined) {
                date = this.selectedDates.map((el) => this.formatModelValue(el));
                if (this.mode == 'single')
                    date = date[0];
            }
            this.$emit('update:modelValue', date);
        },
        goToToday() {
            this.showMonthSelect = this.showYearSelect = false;
            this.onDisplay = this.core.now().clone();
            if (this.type.includes('time') && this.selectedDates.length) {
                const lastIndex = this.selectedDates.length - 1;
                const time = this.selectedDates[lastIndex];
                time.time(this.onDisplay);
                if (this.selectedTimes[lastIndex]) {
                    this.selectedTimes[lastIndex] = time.clone();
                }
                if (this.autoSubmit &&
                    this.checkDate(time, 'time') &&
                    !this.isInDisable(time))
                    this.submitDate(false);
            }
            if (this.type.includes('date'))
                this.$nextTick(() => {
                    const root = this.$refs.root;
                    const today = root?.querySelector('.pdp-day.today');
                    if (!today)
                        return;
                    today.classList.add('tada');
                    setTimeout(() => {
                        today.classList.remove('tada');
                    }, 1000);
                });
        },
        checkDate(date, part) {
            if (this.calendarAdapter) {
                const current = Core.isPersianDate(date)
                    ? date
                    : this.parseCalendarDate(date);
                const currentTime = this.getDateTimestamp(current);
                const fromTime = this.getDateTimestamp(this.fromDate);
                const toTime = this.getDateTimestamp(this.toDate);
                return isWithinCalendarBounds(new Date(currentTime), new Date(fromTime), new Date(toTime), part);
            }
            let from, to;
            if (!Core.isPersianDate(date))
                date = this.core.clone().parse(date);
            switch (part) {
                case 'year':
                    from = this.fromDate.toString('?YYYY');
                    to = this.toDate.toString('?YYYY');
                    break;
                case 'month':
                    from = this.fromDate.toString('?YYYY/?MM');
                    to = this.toDate.toString('?YYYY/?MM');
                    break;
                case 'date':
                    from = this.fromDate.toString();
                    to = this.toDate.toString();
                    break;
                case 'time':
                    from = this.fromDate.toString(this.type.includes('time') ? 'datetime' : 'date');
                    to = this.toDate.toString(this.type.includes('time') ? 'datetime' : 'date');
                    break;
            }
            return date.isBetween(from, to, '[]');
        },
        isInDisable(date, disable) {
            if (!this.disable)
                return false;
            disable = disable || this.disable;
            const candidate = date;
            const normalizedDate = Core.isPersianDate(candidate)
                ? candidate.clone()
                : this.core.clone().parse(candidate);
            return matchesDisable(normalizedDate, disable, {
                matchesString: (value) => this.isSameDisabledValue(normalizedDate, value),
                format: (value) => this.formatDisableValue(value),
            });
        },
        selectedTimeValue(index) {
            const time = this.selectedTimes[index];
            if (!time)
                return undefined;
            const date = this.selectedDates[index];
            if (!date)
                return time;
            return date
                .clone()
                .hour(time.hour())
                .minute(time.minute())
                .second(time.second())
                .millisecond(time.millisecond());
        },
        isSelectedTimeDisabled(index) {
            const time = this.selectedTimeValue(index);
            return (!!time && (!this.checkDate(time, 'time') || this.isInDisable(time)));
        },
        isSameDisabledValue(date, value) {
            if (this.calendarAdapter) {
                const disabled = this.parseDisabledValue(this.type === 'time' && !/[\s/-]/.test(value)
                    ? `${this.formatDateValue(date, 'YYYY-MM-DD')} ${value}`
                    : value);
                const candidateParts = this.getCalendarParts(date);
                const disabledParts = this.getCalendarParts(disabled);
                if (this.type === 'time') {
                    return (candidateParts.hour === disabledParts.hour &&
                        candidateParts.minute === disabledParts.minute);
                }
                const sameDate = candidateParts.year === disabledParts.year &&
                    candidateParts.month === disabledParts.month &&
                    candidateParts.day === disabledParts.day &&
                    Boolean(candidateParts.leapMonth) ===
                        Boolean(disabledParts.leapMonth);
                if (this.type === 'date' || !/[\s:]/.test(value))
                    return sameDate;
                return (sameDate &&
                    candidateParts.hour === disabledParts.hour &&
                    candidateParts.minute === disabledParts.minute);
            }
            const disabled = this.parseDisabledValue(this.type === 'time' && !/[\s/-]/.test(value)
                ? `${date.toString('YYYY-MM-DD')} ${value}`
                : value);
            if (!this.calendarAdapter && !this.calendar && value.includes('/')) {
                const candidate = date.clone().calendar('jalali');
                const target = disabled.clone().calendar('jalali');
                const sameDate = candidate.year() === target.year() &&
                    candidate.month() === target.month() &&
                    candidate.date() === target.date();
                if (this.type === 'date' || !/\s/.test(value))
                    return sameDate;
                if (this.type === 'datetime') {
                    return (sameDate &&
                        candidate.hour() === target.hour() &&
                        candidate.minute() === target.minute());
                }
            }
            if (this.type === 'time') {
                return (date.hour() === disabled.hour() &&
                    date.minute() === disabled.minute());
            }
            if (this.type === 'date' || !/[\s:]/.test(value)) {
                return date
                    .clone()
                    .startOf('date')
                    .isSame(disabled.clone().startOf('date'));
            }
            return date.isSame(disabled);
        },
        parseDisabledValue(value) {
            if (!this.calendarAdapter && !this.calendar && value.includes('/')) {
                return this.core.clone().calendar('jalali').parse(value);
            }
            return this.parseCalendarDate(value);
        },
        formatDisableValue(date) {
            if (this.calendarAdapter)
                return this.formatDateValue(date, this.formats.input);
            return date.toString(jalaliDisableFormats[this.type]);
        },
        inputSlotProps(index) {
            const input = this.inputs[index];
            return {
                value: this.displayValue[index] || '',
                inputAttrs: {
                    ...this.attrs[input],
                    ref: 'inputs',
                    type: 'text',
                    autocomplete: 'off',
                    placeholder: this.inputMaskConfig().placeholder ||
                        this.attrs[input].placeholder,
                },
                open: () => this.showPicker('input', index),
                clear: () => this.clear(input),
                onInput: (event) => {
                    const target = event.target;
                    this.displayValue[index] = target.value;
                    this.sanitizeInput(index, event);
                },
                onBlur: () => {
                    this.sanitizeInput(index);
                    this.commitInput(index);
                },
                onKeydown: (event) => this.selectWithArrow(event),
            };
        },
        showPicker(el, index) {
            if (this.clickOn == 'all' || this.clickOn == el) {
                const inputName = this.inputs[index];
                if (this.dualInput)
                    this.inputName = inputName;
                const inputs = this.$refs.inputs;
                inputs?.[index]?.focus();
                this.showDatePicker = true;
                if (!this.modal) {
                    this.$nextTick(() => {
                        this.locate();
                    });
                    document.addEventListener('scroll', this.locate);
                }
            }
        },
        async selectWithArrow(e) {
            //FIXME: refactor
            //FIXME: when up arraw press go to last date
            // [37, 38, 39, 40] are key codes of arrow keys
            if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
                const arrow = {
                    ArrowLeft: 1, // for left arrow must one day add in rtl picker
                    ArrowUp: -7, // for up arrow must seven day subtract in rtl picker
                    ArrowRight: -1, // for right arrow must one day subtract in rtl picker
                    ArrowDown: 7, // for down arrow must seven day add in rtl picker
                };
                let numberOfDay = arrow[e.key];
                if (this.lang.dir.picker == 'ltr' &&
                    ['ArrowLeft', 'ArrowRight'].includes(e.key))
                    numberOfDay = -numberOfDay;
                const root = this.$refs.root;
                let focusedDays = root.querySelectorAll('.pdp .pdp-day.hover');
                if (!focusedDays.length) {
                    focusedDays = root.querySelectorAll('.pdp .pdp-day.start-range,.pdp .pdp-day.end-range');
                }
                let focusedDay = focusedDays[focusedDays.length - 1];
                if (focusedDay) {
                    let column = Number(this.getColumn(focusedDay));
                    focusedDay.classList.remove('hover');
                    const focusedMonth = this.calendarMonthDate(this.onDisplay, column);
                    const focusedDate = this.calendarDayDate(focusedMonth, Number(focusedDay.innerText));
                    const nextDate = this.calendarAddDays(focusedDate, numberOfDay);
                    if (!this.checkDate(nextDate, 'date'))
                        return focusedDay.classList.add('hover');
                    const nextMonthKey = this.calendarMonthKey(nextDate);
                    column = -1;
                    for (let i = 0; i < this.columnCount; i++) {
                        if (this.calendarMonthKey(this.calendarMonthDate(this.onDisplay, i)) === nextMonthKey) {
                            column = i;
                            break;
                        }
                    }
                    if (column < 0) {
                        const firstMonth = this.calendarMonthDate(this.onDisplay, 0);
                        if (this.getDateTimestamp(nextDate) <
                            this.getDateTimestamp(firstMonth)) {
                            this.onDisplay = this.calendarMonthDate(this.onDisplay, -this.columnCount);
                            column = this.columnCount - 1;
                        }
                        else {
                            this.onDisplay = this.calendarMonthDate(this.onDisplay, this.columnCount);
                            column = 0;
                        }
                    }
                    await this.$nextTick();
                    focusedDay = root.querySelector(`.pdp .pdp-main .pdp-column[data-column='${column}'] .pdp-day[value='${this.displayDay(nextDate)}']`);
                    if (focusedDay)
                        focusedDay.classList.add('hover');
                }
                else {
                    focusedDay = root.querySelector('.pdp .pdp-day:not(.empty):not(.disabled)');
                    if (focusedDay)
                        focusedDay.classList.add('hover');
                    else {
                        focusedDay = root.querySelector(`.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${this.fromDate.date()}"]`);
                        focusedDay.classList.add('hover');
                    }
                }
                if (this.mode === 'range' && this.selectedDates.length == 1) {
                    this.selectInRangeDate({ target: focusedDay });
                }
            }
            else if (e.key == 'Enter') {
                // 13 is key code of Enter key
                e.preventDefault();
                const focusedDay = this.$refs.root.querySelector('.pdp .pdp-day.hover');
                if (focusedDay) {
                    this.selectDate(this.calendarDayDate(this.calendarMonthDate(this.onDisplay, Number(this.getColumn(focusedDay) || 0)), Number(focusedDay.innerText)), 'date');
                }
                else {
                    this.displayValue.forEach((_, index) => {
                        this.commitInput(index);
                    });
                }
            }
        },
        commitInput(index) {
            const inputs = this.$refs.inputs;
            const input = inputs?.[index];
            // `displayValue` is updated by v-model before Enter/blur handlers run.
            // Prefer it over the DOM value so a fast manual edit cannot be lost
            // while Vue is still synchronizing the native input element.
            const rawValue = this.displayValue[index] || input?.value || '';
            const submittedValue = this.dualInput
                ? this.selectedDates[index]
                    ? this.formatDateValue(this.selectedDates[index], this.formats.input)
                    : ''
                : this.selectedDates
                    .map((date) => this.formatDateValue(date, this.formats.input))
                    .join(' - ');
            if (rawValue === submittedValue)
                return;
            const value = this.inputMask
                ? rawValue
                : this.sanitizeInputValue(rawValue);
            if (!value)
                return;
            if (value !== rawValue) {
                if (input)
                    input.value = value;
                this.displayValue[index] = value;
            }
            const normalizedValue = this.normalizeInputDigits(value);
            let onDisplay;
            if (this.type === 'time') {
                const time = normalizedValue.split(/[/ -.,:\\]/);
                if (this.calendarAdapter) {
                    const base = this.getCalendarParts(this.onDisplay || this.core);
                    onDisplay = this.fromCalendarParts({
                        ...base,
                        hour: Number(time[0]) || 0,
                        minute: Number(time[1]) || 0,
                        second: Number(time[2]) || 0,
                    });
                }
                else {
                    onDisplay = this.checkDate(this.core.clone(), 'time')
                        ? this.core.clone()
                        : this.fromDate.clone();
                    onDisplay.time(time);
                }
            }
            else {
                onDisplay = this.calendarAdapter
                    ? this.parseCalendarDate(normalizedValue)
                    : this.core.clone().parse(normalizedValue);
            }
            // Datetime values must respect both date and time boundaries. Date-only
            // values use the calendar-day validation path; time and datetime use
            // the full timestamp path.
            const part = this.type === 'date' ? 'date' : 'time';
            const selectionResult = this.selectDate(onDisplay, part);
            if (!onDisplay.isValid() || selectionResult < 0)
                return;
            if (this.mode === 'single' && this.type.includes('date')) {
                this.onDisplay = onDisplay.clone();
            }
            else {
                const diff = onDisplay.diff(this.onDisplay, 'month');
                if (diff < 0 || diff >= this.columnCount)
                    this.onDisplay = onDisplay.clone();
            }
            // `selectDate` returns 1 after autoSubmit has already formatted the
            // completed value into the input. Only clear a pending range input;
            // otherwise the committed manual value would be erased immediately.
            if (selectionResult === 0)
                this.displayValue[index] = '';
        },
        inputMaskPattern() {
            const config = this.inputMaskConfig();
            let value = config.pattern;
            if (!value || value === 'calendar-default')
                value = this.defaultInputMaskPattern();
            if (value === 'date' || value === 'datetime' || value === 'time') {
                if (!this.calendarAdapter) {
                    return value === 'date'
                        ? 'jYYYY/jMM/jDD'
                        : value === 'datetime'
                            ? 'jYYYY/jMM/jDD HH:mm'
                            : 'HH:mm';
                }
                return value === 'date'
                    ? 'YYYY-MM-DD'
                    : value === 'datetime'
                        ? 'YYYY-MM-DD HH:mm'
                        : 'HH:mm';
            }
            return value;
        },
        defaultInputMaskPattern() {
            const datePattern = this.activeCalendar === 'jalali' ? 'jYYYY/jMM/jDD' : 'YYYY-MM-DD';
            return this.type === 'date'
                ? datePattern
                : this.type === 'datetime'
                    ? `${datePattern} HH:mm`
                    : 'HH:mm';
        },
        inputMaskConfig() {
            const mask = this.inputMask;
            if (!mask) {
                return {
                    pattern: this.defaultInputMaskPattern(),
                    autoInsert: true,
                    allowedDigits: this.activeCalendar === 'jalali' || this.lang.dir.input === 'rtl'
                        ? 'both'
                        : 'latin',
                    strict: true,
                };
            }
            if (typeof mask === 'string')
                return { pattern: mask, autoInsert: true };
            if ('pattern' in mask ||
                'allowedDigits' in mask ||
                'strict' in mask ||
                'autoInsert' in mask ||
                'blocks' in mask)
                return mask;
            const value = mask[this.type];
            return typeof value === 'string' ? { pattern: value } : value || {};
        },
        normalizeInputDigits(value) {
            return Array.from(value)
                .map((character) => {
                const code = character.codePointAt(0) || 0;
                if (code >= 0x06f0 && code <= 0x06f9)
                    return String(code - 0x06f0);
                if (code >= 0x0660 && code <= 0x0669)
                    return String(code - 0x0660);
                return character;
            })
                .join('');
        },
        isInputDigit(character) {
            return /[0-9۰-۹٠-٩]/.test(character);
        },
        maskTokens(pattern) {
            const tokens = [];
            const matcher = /j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g;
            let lastIndex = 0;
            let match;
            while ((match = matcher.exec(pattern))) {
                if (match.index > lastIndex)
                    tokens.push({ literal: pattern.slice(lastIndex, match.index) });
                tokens.push({ token: match[0] });
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < pattern.length)
                tokens.push({ literal: pattern.slice(lastIndex) });
            return tokens;
        },
        maskTokenMaximum(token) {
            const normalized = token.replace(/^j/, '');
            const block = this.inputMaskConfig().blocks?.[token] ||
                this.inputMaskConfig().blocks?.[normalized] ||
                this.inputMaskConfig().blocks?.[`j${normalized}`];
            if (block?.to !== undefined)
                return block.to;
            if (['M', 'MM'].includes(normalized))
                return 12;
            if (['D', 'DD'].includes(normalized))
                return 31;
            if (['H', 'HH'].includes(normalized))
                return 23;
            if (['m', 'mm', 's', 'ss'].includes(normalized))
                return 59;
            return undefined;
        },
        maskTokenMinimum(token) {
            const normalized = token.replace(/^j/, '');
            const block = this.inputMaskConfig().blocks?.[token] ||
                this.inputMaskConfig().blocks?.[normalized] ||
                this.inputMaskConfig().blocks?.[`j${normalized}`];
            return block?.from;
        },
        maskTokenSize(token) {
            return token.replace(/^j/, '') === 'YYYY' ? 4 : 2;
        },
        sanitizeMaskToken(token, value) {
            const maximum = this.maskTokenMaximum(token);
            const minimum = this.maskTokenMinimum(token);
            if (maximum === undefined && minimum === undefined)
                return value;
            if (value.length < 1)
                return value;
            // Keep a one-digit partial block editable. The next digit is checked
            // against the complete block, matching an IMask date block.
            const size = this.maskTokenSize(token);
            if (value.length < size)
                return value;
            const number = Number(value.slice(0, size));
            return (maximum !== undefined && number > maximum) ||
                (minimum !== undefined && number < minimum)
                ? value.slice(0, size - 1)
                : value.slice(0, size);
        },
        maskedInputValue(value) {
            const config = this.inputMaskConfig();
            if (config.autoInsert === false)
                return value;
            const rangeParts = value.split(/\s+-\s+/);
            if (rangeParts.length > 1)
                return rangeParts
                    .map((part) => this.maskedInputValue(part))
                    .join(' - ');
            const pattern = this.inputMaskPattern();
            const parts = this.maskTokens(pattern);
            const hasTextToken = parts.some((part) => part.token && /MMMM|MMM/.test(part.token));
            if (hasTextToken)
                return value;
            const digits = Array.from(value).filter((character) => this.isInputDigit(character));
            const expectedDigits = parts.reduce((total, part) => total + (part.token ? this.maskTokenSize(part.token) : 0), 0);
            const maskedDigits = digits.slice(0, expectedDigits);
            let digitIndex = 0;
            let result = '';
            parts.forEach((part, index) => {
                if (part.literal) {
                    return;
                }
                const token = part.token.replace(/^j/, '');
                const size = this.maskTokenSize(token);
                const rawChunk = maskedDigits
                    .slice(digitIndex, digitIndex + size)
                    .join('');
                const chunk = this.sanitizeMaskToken(part.token, rawChunk);
                result += chunk;
                digitIndex += rawChunk.length;
                if (rawChunk.length < size)
                    return;
                const next = parts[index + 1];
                if (next?.literal)
                    result += next.literal;
            });
            return result;
        },
        maskedCursorPosition(value, digitCount) {
            if (!digitCount)
                return 0;
            let seen = 0;
            for (let index = 0; index < value.length; index++) {
                if (!this.isInputDigit(value[index]))
                    continue;
                seen++;
                if (seen === digitCount) {
                    let cursor = index + 1;
                    while (cursor < value.length && !this.isInputDigit(value[cursor]))
                        cursor++;
                    return cursor;
                }
            }
            return value.length;
        },
        sanitizeInput(index, event) {
            const input = event?.target;
            const value = input?.value ?? this.displayValue[index];
            if (!value) {
                this.displayValue[index] = '';
                return;
            }
            const cursor = input?.selectionStart ?? value.length;
            const digitsBeforeCursor = Array.from(value.slice(0, cursor)).filter((character) => this.isInputDigit(character)).length;
            const sanitized = this.sanitizeInputValue(value);
            this.displayValue[index] = sanitized;
            if (sanitized !== value) {
                if (input)
                    input.value = sanitized;
                if (input && input === document.activeElement) {
                    const nextCursor = this.maskedCursorPosition(sanitized, digitsBeforeCursor);
                    input.setSelectionRange(nextCursor, nextCursor);
                }
            }
        },
        sanitizeInputValue(value) {
            const pattern = this.inputMaskPattern();
            const allowedDigits = this.inputMaskConfig().allowedDigits || 'latin';
            const hasRangeSeparator = /\s-\s/.test(value);
            const literals = pattern
                .replace(/j?(YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s)/g, '')
                .split('');
            const allowsLetters = /MMMM|MMM/.test(pattern);
            const sanitized = Array.from(value)
                .filter((character) => {
                const isLatinDigit = /[0-9]/.test(character);
                const isLocaleDigit = /[۰-۹٠-٩]/.test(character);
                if ((allowedDigits === 'latin' && isLatinDigit) ||
                    (allowedDigits === 'locale' && isLocaleDigit) ||
                    (allowedDigits === 'both' && (isLatinDigit || isLocaleDigit)))
                    return true;
                if (literals.includes(character) ||
                    /\s/.test(character) ||
                    (hasRangeSeparator && character === '-'))
                    return true;
                return allowsLetters && /\p{L}/u.test(character);
            })
                .join('')
                .replace(/\s{2,}/g, ' ')
                .replace(/([/:.,-])\1+/g, '$1');
            if (this.inputMaskConfig().autoInsert === false)
                return sanitized;
            const masked = this.maskedInputValue(sanitized);
            const maskParts = this.maskTokens(pattern);
            const expectedDigits = maskParts.reduce((total, part) => total + (part.token ? this.maskTokenSize(part.token) : 0), 0);
            const hasCompleteMask = maskParts.some((part) => part.literal) &&
                Array.from(sanitized).filter((character) => this.isInputDigit(character)).length === expectedDigits;
            const hasOverflow = Array.from(sanitized).filter((character) => this.isInputDigit(character)).length > expectedDigits;
            // Keep explicitly typed separators and variable-width fields (for
            // example `1399/6/1`) intact. Compact digit input is reformatted only
            // when it is compatible with the mask's automatic prefix.
            return masked === sanitized ||
                masked.startsWith(sanitized) ||
                hasCompleteMask ||
                hasOverflow ||
                !/\D/.test(sanitized)
                ? masked
                : sanitized;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        selectInRangeDate(e) {
            const target = e.target;
            if (!target.classList.contains('pdp-day'))
                return;
            const root = this.$refs.root;
            root.querySelectorAll(`.pdp .pdp-day`).forEach((el) => {
                el.classList.remove('in-range');
            });
            let column = this.getColumn(target);
            if (this.calendarAdapter) {
                const hoveredDate = this.calendarDayDate(this.calendarMonthDate(this.onDisplay, Number(column)), Number(target.innerText));
                let selectedDate = this.fromCalendarParts({
                    ...this.getCalendarParts(this.selectedDates[0]),
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                });
                const number = this.getDateTimestamp(hoveredDate) >=
                    this.getDateTimestamp(selectedDate)
                    ? 1
                    : -1;
                const selectedDateDOM = root.querySelector('.pdp-day.start-range,.pdp-day.end-range');
                if (selectedDateDOM) {
                    column = +this.getColumn(selectedDateDOM);
                    selectedDateDOM.classList.replace(...(number < 0
                        ? ['start-range', 'end-range']
                        : ['end-range', 'start-range']));
                }
                else if (number === 1) {
                    const parts = this.getCalendarParts(this.onDisplay);
                    selectedDate = this.calendarAddDays(this.fromCalendarParts({ ...parts, day: 1 }), -1);
                    column = -1;
                }
                else {
                    const monthDate = this.calendarMonthDate(this.onDisplay, this.columnCount - 1);
                    const parts = this.getCalendarParts(monthDate);
                    selectedDate = this.calendarAddDays(this.fromCalendarParts({
                        ...parts,
                        day: this.calendarDaysInMonth(parts.year, parts.month),
                    }), 1);
                    column = this.columnCount;
                }
                while (!this.isSameCalendarDate(hoveredDate, selectedDate)) {
                    const oldMonth = this.displayMonth(selectedDate);
                    selectedDate = this.calendarAddDays(selectedDate, number);
                    if (oldMonth !== this.displayMonth(selectedDate)) {
                        column += number;
                    }
                    if (this.checkDate(selectedDate, 'date') &&
                        !this.isInDisable(selectedDate)) {
                        root
                            .querySelector(`.pdp-column[data-column='${column}'] .pdp-day[value='${this.displayDay(selectedDate)}']`)
                            ?.classList.add('in-range');
                    }
                    else {
                        break;
                    }
                }
                return;
            }
            const hoveredDate = this.onDisplay.clone()
                .startOf('date')
                .addMonth(+column)
                .date(target.innerText);
            const selectedDate = this.selectedDates[0].clone().startOf('date');
            const number = hoveredDate.isAfter(selectedDate) ? 1 : -1;
            const selectedDateDOM = root.querySelector('.pdp-day.start-range,.pdp-day.end-range');
            if (selectedDateDOM) {
                column = +this.getColumn(selectedDateDOM);
                selectedDateDOM.classList.replace(...(hoveredDate.isBefore(selectedDate)
                    ? ['start-range', 'end-range']
                    : ['end-range', 'start-range']));
            }
            else {
                selectedDate.parse(this.onDisplay);
                if (number === 1) {
                    selectedDate.startOf('month').subDay();
                    column = -1;
                }
                else {
                    selectedDate
                        .addMonth(this.columnCount - 1)
                        .endOf('month')
                        .addDay()
                        .startOf('date');
                    column = this.columnCount;
                }
            }
            while (!hoveredDate.isSame(selectedDate)) {
                const oldMonth = this.displayMonth(selectedDate);
                selectedDate.addDay(number);
                if (oldMonth != this.displayMonth(selectedDate)) {
                    column += number;
                }
                if (this.checkDate(selectedDate, 'date') &&
                    !this.isInDisable(selectedDate)) {
                    root
                        .querySelector(`.pdp-column[data-column='${column}'] .pdp-day[value='${selectedDate.date()}']`)
                        .classList.add('in-range');
                }
                else {
                    break;
                }
            }
        },
        submitDate(close = true) {
            const displayDate = this.selectedDates.map((el) => {
                return this.formatDateValue(el, this.formats.input);
            });
            if (this.dualInput)
                this.displayValue = displayDate;
            else
                this.displayValue[0] = displayDate.join(' - ');
            this.submitedValue = this.selectedDates.slice();
            this.setModel();
            this.$emit('submit', this.mode === 'range' ? this.selectedDates : this.selectedDates[0]);
            if (close) {
                this.showDatePicker = false;
            }
        },
        getColumn({ parentNode }) {
            return parentNode.parentNode.parentNode.dataset
                .column;
        },
        nearestDate(date) {
            return Math.abs(date.diff(this.fromDate)) <=
                Math.abs(date.diff(this.toDate))
                ? this.fromDate.clone()
                : this.toDate.clone();
        },
        locate() {
            const inputs = this.$refs.inputs;
            if (!inputs?.[0])
                return;
            this.pickerPlace = {
                top: false,
                left: false,
                right: false,
            };
            this.$nextTick(() => {
                const input = inputs[0];
                const inputOffset = input.offsetHeight + input.getBoundingClientRect().top;
                const picker = this.$refs.pdpPicker;
                const pickerHeight = picker.offsetHeight + 10;
                const pickerOffset = picker.getBoundingClientRect();
                this.pickerPlace = {
                    top: inputOffset >= pickerHeight &&
                        window.innerHeight - (inputOffset + pickerHeight) < 0,
                    left: pickerOffset.left <= 0,
                    right: window.innerWidth - (pickerOffset.left + pickerOffset.width) <= 0,
                };
            });
        },
        changeLocale() {
            const locales = this.effectiveLocale.split(',');
            const index = locales.indexOf(this.currentLocale);
            this.currentLocale = locales[index + 1] || locales[0];
            const calendar = this.activeCalendar;
            const internalCalendar = this.calendarAdapter
                ? 'gregorian'
                : calendar;
            this.core.calendar(internalCalendar);
            this.fromDate.calendar(internalCalendar);
            this.toDate.calendar(internalCalendar);
            this.onDisplay.calendar(internalCalendar);
            for (const date of this.selectedDates) {
                date.calendar(internalCalendar);
            }
            for (const time of this.selectedTimes) {
                time.calendar(internalCalendar);
            }
            this.submitDate(false);
        },
        clear(inputName) {
            const inputIndex = inputName === 'firstInput' ? 0 : 1;
            this.displayValue[inputIndex] = '';
            this.$emit('clear');
            if (this.dualInput) {
                const values = this.$attrs.value;
                if (values && Array.isArray(values))
                    return this.setModel(values.map((val, i) => (i == inputIndex ? null : val)));
            }
            this.setModel('');
        },
        startChangeTime(timeIndex, unit, operator) {
            if (this.calendarAdapter) {
                this.startChangeTimeWithAdapter(timeIndex, unit, operator);
                return;
            }
            let time = this.selectedTimes[timeIndex];
            if (!time) {
                time = this.core.clone();
                if (!this.checkDate(time, 'time')) {
                    time = this.toDate.clone()
                        .subDay()
                        .time(this.core);
                }
                if (timeIndex == 1 && !this.selectedTimes.length)
                    this.selectedTimes.push(time.clone());
                this.selectedTimes.push(time);
            }
            this.stopChangeTime();
            const maxAmount = unit == 'hour' ? 23 : 59;
            let currentAmount = time[unit]();
            let step = unit == 'hour' ? this.hourStepCount : this.minuteStepCount;
            const changeTime = () => {
                if (operator == 'add') {
                    currentAmount = currentAmount + step;
                    if (currentAmount > maxAmount)
                        currentAmount = 0;
                }
                else {
                    currentAmount = currentAmount - step;
                    if (currentAmount < 0)
                        currentAmount = maxAmount;
                }
                if (!this.checkDate(time[unit](currentAmount), 'time')) {
                    time.parse(time.isSameOrAfter(this.toDate.clone())
                        ? this.toDate.clone()
                        : this.fromDate.clone());
                }
                else if (this.selectedTimes.length == 2 &&
                    this.selectedTimes[0].isAfter(this.selectedTimes[1])) {
                    time.parse((timeIndex == 0
                        ? this.selectedTimes[1]
                        : this.selectedTimes[0]));
                }
                const selectedTime = this.selectedDates[timeIndex]
                    ? this.selectedDates[timeIndex]
                        .clone()
                        .hour(time.hour())
                        .minute(time.minute())
                        .second(time.second())
                        .millisecond(time.millisecond())
                    : time;
                this.selectedTimes[timeIndex] = time.clone();
                if (!this.isInDisable(selectedTime)) {
                    if (this.type == 'time') {
                        this.selectedDates[timeIndex] = time;
                    }
                    else if (this.selectedDates[timeIndex]) {
                        this.selectedDates[timeIndex].time(time);
                    }
                    this.$emit('select', time);
                    if (this.autoSubmit &&
                        !this.selectedTimes.some((_, index) => this.isSelectedTimeDisabled(index)))
                        this.submitDate(false);
                }
            };
            changeTime();
            this.interval = setInterval(changeTime, 300);
        },
        startChangeTimeWithAdapter(timeIndex, unit, operator) {
            let time = this.selectedTimes[timeIndex];
            if (!time) {
                const currentParts = this.getCalendarParts(this.core);
                time = this.fromCalendarParts(currentParts);
                if (!this.checkDate(time, 'time')) {
                    const fallback = this.calendarAddDays(this.toDate, -1);
                    time = this.fromCalendarParts({
                        ...this.getCalendarParts(fallback),
                        hour: currentParts.hour || 0,
                        minute: currentParts.minute || 0,
                        second: currentParts.second || 0,
                        millisecond: currentParts.millisecond || 0,
                    });
                }
                if (timeIndex === 1 && !this.selectedTimes.length) {
                    this.selectedTimes.push(time);
                }
                this.selectedTimes.push(time);
            }
            this.stopChangeTime();
            const maxAmount = unit === 'hour' ? 23 : 59;
            const step = unit === 'hour' ? this.hourStepCount : this.minuteStepCount;
            let currentAmount = this.getCalendarParts(time)[unit] || 0;
            const changeTime = () => {
                currentAmount += operator === 'add' ? step : -step;
                if (currentAmount > maxAmount)
                    currentAmount = 0;
                if (currentAmount < 0)
                    currentAmount = maxAmount;
                const parts = this.getCalendarParts(time);
                const candidate = this.fromCalendarParts({
                    ...parts,
                    [unit]: currentAmount,
                });
                if (!this.checkDate(candidate, 'time')) {
                    const boundary = this.getDateTimestamp(candidate) >=
                        this.getDateTimestamp(this.toDate)
                        ? this.toDate
                        : this.fromDate;
                    time = this.fromCalendarParts({
                        ...this.getCalendarParts(boundary),
                        hour: parts.hour || 0,
                        minute: parts.minute || 0,
                        second: parts.second || 0,
                        millisecond: parts.millisecond || 0,
                    });
                }
                else if (this.selectedTimes.length === 2 &&
                    timeIndex === 0 &&
                    this.getDateTimestamp(candidate) >
                        this.getDateTimestamp(this.selectedTimes[1])) {
                    time = this.selectedTimes[1];
                }
                else if (this.selectedTimes.length === 2 &&
                    timeIndex === 1 &&
                    this.getDateTimestamp(candidate) <
                        this.getDateTimestamp(this.selectedTimes[0])) {
                    time = this.selectedTimes[0];
                }
                else {
                    time = candidate;
                }
                const selectedDate = this.selectedDates[timeIndex]
                    ? this.fromCalendarParts({
                        ...this.getCalendarParts(this.selectedDates[timeIndex]),
                        hour: this.getCalendarParts(time).hour || 0,
                        minute: this.getCalendarParts(time).minute || 0,
                        second: this.getCalendarParts(time).second || 0,
                        millisecond: this.getCalendarParts(time).millisecond || 0,
                    })
                    : time;
                this.selectedTimes[timeIndex] = time;
                if (!this.isInDisable(selectedDate)) {
                    this.selectedDates[timeIndex] = selectedDate;
                    this.$emit('select', selectedDate);
                    if (this.autoSubmit &&
                        !this.selectedTimes.some((_, index) => this.isSelectedTimeDisabled(index))) {
                        this.submitDate(false);
                    }
                }
            };
            changeTime();
            this.interval = setInterval(changeTime, 300);
        },
        stopChangeTime() {
            clearInterval(this.interval);
        },
        selectShorcut(dates) {
            this.selectedDates = dates.map((date, i) => {
                if (i == 0)
                    this.onDisplay = date.clone();
                this.$emit('select', date);
                return date.clone();
            });
            if (this.autoSubmit) {
                this.submitDate();
            }
        },
        setDate(dates) {
            if (!dates)
                return;
            if (this.mode == 'single' && typeof dates === 'string')
                dates = [dates];
            this.selectedDates = [];
            dates.some((d, index) => {
                const date = this.parseCalendarDate((this.type == 'time'
                    ? this.core.toString('YYYY-MM-DD') + ' '
                    : '') + d);
                if (date) {
                    this.selectedDates.push(markRaw(date.clone()));
                    this.selectedTimes.push(markRaw(date.clone()));
                    if (index == 0)
                        this.onDisplay = markRaw(date.clone());
                }
                else {
                    this.selectedDates = this.selectedTimes = [];
                    return true;
                }
            });
            if (this.selectedDates.length)
                this.submitDate();
        },
    },
});

const _hoisted_1 = ["for"];
const _hoisted_2 = ["onClick"];
const _hoisted_3 = ["value", "placeholder", "onFocus", "onInput", "onBlur"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = { key: 1 };
const _hoisted_6 = { class: "pdp-auto" };
const _hoisted_7 = { key: 0 };
const _hoisted_8 = { class: "pdp-select-month" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = {
  ref: "pdpSelectYear",
  class: "pdp-select-year"
};
const _hoisted_11 = ["onClick"];
const _hoisted_12 = {
  key: 1,
  class: "pdp-header"
};
const _hoisted_13 = {
  key: 0,
  class: "top"
};
const _hoisted_14 = ["tabindex"];
const _hoisted_15 = { class: "bottom" };
const _hoisted_16 = ["title"];
const _hoisted_17 = ["title"];
const _hoisted_18 = {
  ref: "pdpMain",
  class: "pdp-main"
};
const _hoisted_19 = {
  key: 0,
  class: "pdp-date"
};
const _hoisted_20 = ["data-column"];
const _hoisted_21 = { class: "pdp-week" };
const _hoisted_22 = { class: "pdp-days" };
const _hoisted_23 = ["value", "onClick"];
const _hoisted_24 = {
  key: 1,
  class: "pdp-time inline"
};
const _hoisted_25 = {
  key: 0,
  class: "pdp-column"
};
const _hoisted_26 = { class: "hour" };
const _hoisted_27 = ["onTouchstart", "onMousedown", "onKeydown"];
const _hoisted_28 = ["onTouchstart", "onMousedown", "onKeydown"];
const _hoisted_29 = { class: "minute" };
const _hoisted_30 = ["onTouchstart", "onMousedown", "onKeydown"];
const _hoisted_31 = ["onTouchstart", "onMousedown", "onKeydown"];
const _hoisted_32 = { class: "pdp-footer" };
const _hoisted_33 = { key: 0 };
const _hoisted_34 = { key: 1 };
const _hoisted_35 = ["tabindex"];
const _hoisted_36 = ["tabindex"];
const _hoisted_37 = {
  key: 0,
  class: "pdp-shortcut"
};
const _hoisted_38 = ["onClick"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_PDPIcon = resolveComponent("PDPIcon");
  const _component_PDPAlt = resolveComponent("PDPAlt");
  const _component_PDPArrow = resolveComponent("PDPArrow");

  return (openBlock(), createElementBlock("div", {
    ref: "root",
    class: normalizeClass([
      'pdp',
      { 'pdp-range': _ctx.mode === 'range' },
      { 'pdp-modal': _ctx.modal },
      { 'pdp-dual': _ctx.dualInput },
      { 'pdp-open': _ctx.showDatePicker },
      _ctx.lang.dir.input,
    ])
  }, [
    renderSlot(_ctx.$slots, "before", {}, () => [
      (_ctx.label)
        ? (openBlock(), createElementBlock("label", mergeProps({
            key: 0,
            for: _ctx.attrs.firstInput.id
          }, _ctx.attrs.label), toDisplayString(_ctx.label), 17 /* TEXT, FULL_PROPS */, _hoisted_1))
        : createCommentVNode("v-if", true)
    ]),
    createElementVNode("div", normalizeProps(guardReactiveProps(_ctx.attrs.div)), [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.inputs, (input, index) => {
        return (openBlock(), createElementBlock(Fragment, { key: input }, [
          (!_ctx.$slots.hasOwnProperty('icon') || _ctx.$slots?.icon?.()?.length)
            ? (openBlock(), createElementBlock("div", {
                key: `icon-${input}`,
                class: normalizeClass([
            'pdp-icon',
            { 'pdp-pointer': ['all', 'icon'].includes(_ctx.clickOn) },
            { 'pdp-inside': _ctx.iconInside },
          ]),
                onClick: $event => (_ctx.showPicker('icon', index))
              }, [
                renderSlot(_ctx.$slots, "icon", {}, () => [
                  createVNode(_component_PDPIcon, {
                    icon: _ctx.type,
                    width: "23",
                    height: "23"
                  }, null, 8 /* PROPS */, ["icon"])
                ])
              ], 10 /* CLASS, PROPS */, _hoisted_2))
            : createCommentVNode("v-if", true),
          renderSlot(_ctx.$slots, "input", mergeProps({ ref_for: true }, _ctx.inputSlotProps(index)), () => [
            createElementVNode("input", mergeProps({
              ref_for: true,
              ref: "inputs",
              value: _ctx.displayValue[index] || '',
              type: "text",
              autocomplete: "off"
            }, { ref_for: true }, _ctx.attrs[input], {
              placeholder: 
              _ctx.inputMaskConfig().placeholder || _ctx.attrs[input].placeholder
            ,
              onFocus: $event => (_ctx.showPicker('input', index)),
              onInput: $event => (_ctx.sanitizeInput(index, $event)),
              onBlur: $event => {
              _ctx.sanitizeInput(index, $event);
              _ctx.commitInput(index);
            },
              onKeydown: _cache[0] || (_cache[0] = (...args) => (_ctx.selectWithArrow && _ctx.selectWithArrow(...args)))
            }), null, 16 /* FULL_PROPS */, _hoisted_3)
          ]),
          (_ctx.clearable)
            ? (openBlock(), createElementBlock("button", {
                key: `clear-${input}`,
                class: "pdp-clear",
                type: "button",
                onClick: $event => (_ctx.clear(input))
              }, [
                renderSlot(_ctx.$slots, "clear", {}, () => [
                  createVNode(_component_PDPIcon, { icon: "clear" })
                ])
              ], 8 /* PROPS */, _hoisted_4))
            : createCommentVNode("v-if", true)
        ], 64 /* STABLE_FRAGMENT */))
      }), 128 /* KEYED_FRAGMENT */))
    ], 16 /* FULL_PROPS */),
    renderSlot(_ctx.$slots, "after"),
    (_ctx.attrs.alt.name)
      ? (openBlock(), createBlock(_component_PDPAlt, {
          key: 0,
          name: _ctx.attrs.alt.name,
          format: _ctx.formats.alt,
          dates: _ctx.altDates
        }, null, 8 /* PROPS */, ["name", "format", "dates"]))
      : createCommentVNode("v-if", true),
    (_ctx.showDatePicker)
      ? (openBlock(), createElementBlock("div", _hoisted_5, [
          createElementVNode("div", {
            class: "pdp-overlay",
            onClick: _cache[1] || (_cache[1] = $event => (_ctx.showDatePicker = false))
          }),
          createElementVNode("div", mergeProps(_ctx.attrs.picker, { ref: "pdpPicker" }), [
            createElementVNode("div", _hoisted_6, [
              (_ctx.type.includes('date'))
                ? (openBlock(), createElementBlock("div", _hoisted_7, [
                    withDirectives(createElementVNode("ul", _hoisted_8, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.months, (month, index) => {
                        return (openBlock(), createElementBlock("li", {
                          key: index,
                          class: normalizeClass([
                  { selected: month.selected },
                  { disabled: month.disabled },
                ]),
                          onClick: $event => (_ctx.changeSelectedMonth(index))
                        }, toDisplayString(month.label), 11 /* TEXT, CLASS, PROPS */, _hoisted_9))
                      }), 128 /* KEYED_FRAGMENT */))
                    ], 512 /* NEED_PATCH */), [
                      [vShow, _ctx.showMonthSelect]
                    ]),
                    withDirectives(createElementVNode("ul", _hoisted_10, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.years, (year, index) => {
                        return (openBlock(), createElementBlock("li", {
                          key: index,
                          class: normalizeClass({ selected: _ctx.displayYear(_ctx.displayDate) == year }),
                          onClick: $event => (_ctx.changeSelectedYear(year))
                        }, toDisplayString(year), 11 /* TEXT, CLASS, PROPS */, _hoisted_11))
                      }), 128 /* KEYED_FRAGMENT */))
                    ], 512 /* NEED_PATCH */), [
                      [vShow, _ctx.showYearSelect]
                    ])
                  ]))
                : createCommentVNode("v-if", true),
              (_ctx.type.includes('date'))
                ? (openBlock(), createElementBlock("div", _hoisted_12, [
                    (_ctx.effectiveLocale.includes(','))
                      ? (openBlock(), createElementBlock("div", _hoisted_13, [
                          createElementVNode("div", null, toDisplayString(_ctx.lang.translations.text), 1 /* TEXT */),
                          createElementVNode("button", {
                            type: "button",
                            tabindex: _ctx.tabIndex,
                            onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.changeLocale && _ctx.changeLocale(...args)))
                          }, toDisplayString(_ctx.nextLocale), 9 /* TEXT, PROPS */, _hoisted_14)
                        ]))
                      : createCommentVNode("v-if", true),
                    createElementVNode("div", _hoisted_15, [
                      createElementVNode("button", {
                        tabindex: "-1",
                        type: "button",
                        class: normalizeClass([
                  'pdp-arrow',
                  {
                    disabled: !_ctx.checkDate(
                      _ctx.calendarMonthDate(_ctx.displayDate, -1),
                      'month',
                    ),
                  },
                ]),
                        title: _ctx.lang.translations.prevMonth,
                        onClick: _cache[3] || (_cache[3] = $event => (_ctx.changeSelectedMonth('sub')))
                      }, [
                        renderSlot(_ctx.$slots, "right-arrow", {}, () => [
                          createVNode(_component_PDPArrow, {
                            direction: "right",
                            width: "10",
                            height: "10",
                            inverse: _ctx.lang.dir.picker == 'ltr'
                          }, null, 8 /* PROPS */, ["inverse"])
                        ])
                      ], 10 /* CLASS, PROPS */, _hoisted_16),
                      createElementVNode("div", null, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columnCount, (item, i) => {
                          return (openBlock(), createElementBlock("div", { key: i }, [
                            createElementVNode("button", {
                              class: "pdp-month",
                              type: "button",
                              tabindex: "-1",
                              onClick: _cache[4] || (_cache[4] = $event => (_ctx.showPart('month')))
                            }, toDisplayString(_ctx.months[_ctx.displayMonth(_ctx.calendarMonthDate(_ctx.displayDate, i))]
                        .label), 1 /* TEXT */),
                            createElementVNode("button", {
                              class: "pdp-year",
                              type: "button",
                              tabindex: "-1",
                              onClick: _cache[5] || (_cache[5] = $event => (_ctx.showPart('year')))
                            }, toDisplayString(_ctx.displayYear(_ctx.calendarMonthDate(_ctx.displayDate, i))), 1 /* TEXT */)
                          ]))
                        }), 128 /* KEYED_FRAGMENT */))
                      ]),
                      createElementVNode("button", {
                        tabindex: "-1",
                        type: "button",
                        class: normalizeClass([
                  'pdp-arrow',
                  {
                    disabled: !_ctx.checkDate(
                      _ctx.calendarMonthDate(_ctx.displayDate, 1),
                      'month',
                    ),
                  },
                ]),
                        title: _ctx.lang.translations.nextMonth,
                        onClick: _cache[6] || (_cache[6] = $event => (_ctx.changeSelectedMonth('add')))
                      }, [
                        renderSlot(_ctx.$slots, "left-arrow", {}, () => [
                          createVNode(_component_PDPArrow, {
                            direction: "left",
                            width: "10",
                            height: "10",
                            inverse: _ctx.lang.dir.picker == 'ltr'
                          }, null, 8 /* PROPS */, ["inverse"])
                        ])
                      ], 10 /* CLASS, PROPS */, _hoisted_17)
                    ])
                  ]))
                : createCommentVNode("v-if", true),
              createElementVNode("div", _hoisted_18, [
                (_ctx.type.includes('date'))
                  ? (openBlock(), createElementBlock("div", _hoisted_19, [
                      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columnCount, (item, i) => {
                        return (openBlock(), createElementBlock("div", {
                          key: i,
                          class: "pdp-column",
                          "data-column": i
                        }, [
                          createElementVNode("div", _hoisted_21, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.orderedWeekdays, (weekday, index) => {
                              return (openBlock(), createElementBlock("div", {
                                key: index,
                                class: "pdp-weekday"
                              }, toDisplayString(weekday), 1 /* TEXT */))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]),
                          createElementVNode("div", _hoisted_22, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.monthDays[i], (week, wIndex) => {
                              return (openBlock(), createElementBlock("div", { key: wIndex }, [
                                (openBlock(true), createElementBlock(Fragment, null, renderList(week, (day) => {
                                  return (openBlock(), createElementBlock("div", {
                                    key: day.raw ? day.raw.toString() : undefined,
                                    class: normalizeClass([
                        'pdp-day',
                        { empty: day.empty },
                        { friday: day.friday },
                        { weekend: day.weekend },
                        { today: day.today },
                        { 'start-range': day.startRange },
                        { 'end-range': day.endRange },
                        { disabled: day.disabled },
                        { 'in-range': day.inRange },
                      ]),
                                    value: day.val,
                                    onClick: $event => (day.raw && _ctx.selectDate(day.raw, 'date'))
                                  }, toDisplayString(day.val), 11 /* TEXT, CLASS, PROPS */, _hoisted_23))
                                }), 128 /* KEYED_FRAGMENT */))
                              ]))
                            }), 128 /* KEYED_FRAGMENT */))
                          ])
                        ], 8 /* PROPS */, _hoisted_20))
                      }), 128 /* KEYED_FRAGMENT */))
                    ]))
                  : createCommentVNode("v-if", true),
                (_ctx.type.includes('time'))
                  ? (openBlock(), createElementBlock("div", _hoisted_24, [
                      (_ctx.type == 'time')
                        ? (openBlock(), createElementBlock("div", _hoisted_25, [
                            (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.columnCount, (c, i) => {
                              return (openBlock(), createElementBlock("div", { key: i }))
                            }), 128 /* KEYED_FRAGMENT */))
                          ]))
                        : createCommentVNode("v-if", true),
                      createElementVNode("div", {
                        class: normalizeClass([
                  'pdp-moment',
                  { 'column-direction': _ctx.mode == 'range' && _ctx.columnCount == 1 },
                ])
                      }, [
                        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.mode == 'range' ? 2 : 1, (n, i) => {
                          return (openBlock(), createElementBlock("div", {
                            key: n,
                            class: normalizeClass([
                    {
                      disabled: _ctx.selectedTimes[i] && _ctx.isSelectedTimeDisabled(i),
                    }, // FIXME: go to method
                  ])
                          }, [
                            createElementVNode("div", _hoisted_26, [
                              createElementVNode("button", {
                                type: "button",
                                onTouchstart: withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]),
                                onMousedown: withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]),
                                onKeydown: withKeys(withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]), ["enter"]),
                                onTouchend: _cache[7] || (_cache[7] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onMouseup: _cache[8] || (_cache[8] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onKeyup: _cache[9] || (_cache[9] = withKeys(withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
                              }, [
                                renderSlot(_ctx.$slots, "up-arrow", {}, () => [
                                  createVNode(_component_PDPArrow)
                                ])
                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_27),
                              createTextVNode(toDisplayString(_ctx.selectedTimes[i]
                        ? _ctx.selectedTimes[i].hour('HH')
                        : _ctx.core.hour('HH')), 1 /* TEXT */),
                              createElementVNode("button", {
                                type: "button",
                                onTouchstart: withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]),
                                onMousedown: withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]),
                                onKeydown: withKeys(withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]), ["enter"]),
                                onTouchend: _cache[10] || (_cache[10] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onMouseup: _cache[11] || (_cache[11] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onKeyup: _cache[12] || (_cache[12] = withKeys(withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
                              }, [
                                renderSlot(_ctx.$slots, "down-arrow", {}, () => [
                                  createVNode(_component_PDPArrow, { direction: "down" })
                                ])
                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_28)
                            ]),
                            _cache[21] || (_cache[21] = createTextVNode(" : ", -1 /* CACHED */)),
                            createElementVNode("div", _hoisted_29, [
                              createElementVNode("button", {
                                type: "button",
                                onTouchstart: withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'add')), ["prevent"]),
                                onMousedown: withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'add')), ["prevent"]),
                                onKeydown: withKeys(withModifiers($event => (
                        _ctx.startChangeTime(i, 'minute', 'add')
                      ), ["prevent"]), ["enter"]),
                                onTouchend: _cache[13] || (_cache[13] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onMouseup: _cache[14] || (_cache[14] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onKeyup: _cache[15] || (_cache[15] = withKeys(withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
                              }, [
                                renderSlot(_ctx.$slots, "up-arrow", {}, () => [
                                  createVNode(_component_PDPArrow)
                                ])
                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_30),
                              createTextVNode(toDisplayString(_ctx.selectedTimes[i]
                        ? _ctx.selectedTimes[i].minute('mm')
                        : _ctx.core.minute('mm')), 1 /* TEXT */),
                              createElementVNode("button", {
                                type: "button",
                                onTouchstart: withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'sub')), ["prevent"]),
                                onMousedown: withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'sub')), ["prevent"]),
                                onKeydown: withKeys(withModifiers($event => (
                        _ctx.startChangeTime(i, 'minute', 'sub')
                      ), ["prevent"]), ["enter"]),
                                onTouchend: _cache[16] || (_cache[16] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onMouseup: _cache[17] || (_cache[17] = withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
                                onKeyup: _cache[18] || (_cache[18] = withKeys(withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
                              }, [
                                renderSlot(_ctx.$slots, "down-arrow", {}, () => [
                                  createVNode(_component_PDPArrow, { direction: "down" })
                                ])
                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_31)
                            ])
                          ], 2 /* CLASS */))
                        }), 128 /* KEYED_FRAGMENT */))
                      ], 2 /* CLASS */)
                    ]))
                  : createCommentVNode("v-if", true)
              ], 512 /* NEED_PATCH */),
              createElementVNode("div", _hoisted_32, [
                createElementVNode("div", null, [
                  renderSlot(_ctx.$slots, "footer"),
                  (_ctx.selectedDates[0])
                    ? (openBlock(), createElementBlock("small", _hoisted_33, toDisplayString(_ctx.formatDateValue(_ctx.selectedDates[0], _ctx.formats.display)), 1 /* TEXT */))
                    : createCommentVNode("v-if", true),
                  (_ctx.selectedDates.length == 2)
                    ? (openBlock(), createElementBlock("small", _hoisted_34, " - " + toDisplayString(_ctx.formatDateValue(_ctx.selectedDates[1], _ctx.formats.display)), 1 /* TEXT */))
                    : createCommentVNode("v-if", true)
                ]),
                createElementVNode("div", null, [
                  (_ctx.checkDate(_ctx.core, 'date'))
                    ? (openBlock(), createElementBlock("button", {
                        key: 0,
                        class: "pdp-today",
                        type: "button",
                        tabindex: _ctx.tabIndex,
                        onClick: _cache[19] || (_cache[19] = (...args) => (_ctx.goToToday && _ctx.goToToday(...args)))
                      }, toDisplayString(_ctx.lang.translations.now), 9 /* TEXT, PROPS */, _hoisted_35))
                    : createCommentVNode("v-if", true),
                  (
                  !_ctx.autoSubmit &&
                  !_ctx.selectedDates.some((date) => _ctx.isInDisable(date))
                )
                    ? (openBlock(), createElementBlock("button", {
                        key: 1,
                        class: "pdp-submit",
                        type: "button",
                        tabindex: _ctx.tabIndex,
                        onClick: _cache[20] || (_cache[20] = $event => (_ctx.submitDate()))
                      }, toDisplayString(_ctx.lang.translations.submit), 9 /* TEXT, PROPS */, _hoisted_36))
                    : createCommentVNode("v-if", true)
                ])
              ])
            ]),
            (_ctx.shortcuts && Object.keys(_ctx.shortcuts).length > 0)
              ? (openBlock(), createElementBlock("ul", _hoisted_37, [
                  (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.shortcuts, (dates, name) => {
                    return (openBlock(), createElementBlock("li", {
                      key: name,
                      class: normalizeClass({
              selected: !dates.some(
                (date, i) =>
                  !date.isSame(
                    _ctx.selectedDates[i] && _ctx.selectedDates[i].toString('datetime'),
                  ),
              ),
            }),
                      onClick: $event => (_ctx.selectShorcut(dates))
                    }, toDisplayString(name), 11 /* TEXT, CLASS, PROPS */, _hoisted_38))
                  }), 128 /* KEYED_FRAGMENT */))
                ]))
              : createCommentVNode("v-if", true)
          ], 16 /* FULL_PROPS */)
        ]))
      : createCommentVNode("v-if", true)
  ], 2 /* CLASS */))
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".pdp {\n  --primary-color: #26baee;\n  --secondary-color: #9fe8fa;\n  --in-range-background: #c9f1fb;\n  --radius: 0.25rem;\n  --text-color: #495057;\n  --hover-color: #000;\n  --background: #fff;\n  --border-color: #ced4da;\n  --z-index: 1000;\n  --disabled-opacity: 0.3;\n  --icon-background: #e9ecef;\n  --overlay-color: transparent;\n  --main-box-shadow: 1px 1px 8px 1px rgba(116, 116, 116, 0.5);\n  --day-dimensions: 2.08rem;\n  --time-scale: 1;\n}\n@keyframes start {\nfrom {\n    transform: inherit scale(0.5);\n    opacity: 0;\n}\nto {\n    transform: inherit scale(1);\n    opacity: 1;\n}\n}\n@keyframes startModal {\nfrom {\n    transform: translate(-50%, -50%) scale(0.5);\n    opacity: 0;\n}\nto {\n    transform: translate(-50%, -50%) scale(1);\n    opacity: 1;\n}\n}\n@keyframes tada {\n0% {\n    transform: scale(1);\n}\n10%, 20% {\n    transform: scale(0.9) rotate(-3deg);\n}\n30%, 50%, 70%, 90% {\n    transform: scale(1.1) rotate(3deg);\n}\n40%, 60%, 80% {\n    transform: scale(1.1) rotate(-3deg);\n}\n100% {\n    transform: scale(1) rotate(0);\n}\n}\n@media (max-width: 700px) {\n.pdp-picker {\n    flex-direction: column-reverse;\n}\n.pdp-shortcut {\n    flex-direction: row !important;\n    flex-wrap: wrap;\n    justify-content: space-evenly;\n    padding: 0 !important;\n    border: none !important;\n}\n}\n.pdp {\n  position: relative;\n}\n.pdp.pdp-open {\n  z-index: 10000;\n}\n.pdp.pdp-open .pdp-overlay {\n  z-index: 10000 !important;\n}\n.pdp.pdp-open .pdp-picker {\n  z-index: 10001 !important;\n}\n.pdp:not(.pdp-range) .pdp-day.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.start-range {\n  border-radius: 0 0.25rem 0.25rem 0 !important;\n  border-radius: 0 var(--radius) var(--radius) 0 !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.end-range {\n  border-radius: 0.25rem 0 0 0.25rem !important;\n  border-radius: var(--radius) 0 0 var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.end-range.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.start-range {\n  border-radius: 0.25rem 0 0 0.25rem !important;\n  border-radius: var(--radius) 0 0 var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.end-range {\n  border-radius: 0 0.25rem 0.25rem 0 !important;\n  border-radius: 0 var(--radius) var(--radius) 0 !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.end-range.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.rtl {\n  direction: rtl;\n  text-align: right;\n}\n.pdp.rtl .pdp-group :first-child:not(.pdp-inside),\n.pdp.rtl .pdp-group .pdp-inside:first-child + input {\n  border-top-right-radius: 0.25rem;\n  border-top-right-radius: var(--radius);\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-right-radius: var(--radius);\n  margin-left: -1px;\n}\n.pdp.rtl .pdp-group input:last-of-type {\n  border-top-left-radius: 0.25rem;\n  border-top-left-radius: var(--radius);\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-left-radius: var(--radius);\n}\n.pdp.rtl .pdp-group .pdp-icon.pdp-inside:nth-of-type(2) {\n  right: 50%;\n}\n.pdp.rtl .pdp-group .pdp-icon.pdp-inside + input {\n  padding-right: 3rem;\n}\n.pdp.rtl.pdp-dual .pdp-clear:nth-of-type(1) {\n  left: calc(50% + 0.5rem) !important;\n}\n.pdp.rtl .pdp-picker::after {\n  right: 1.2rem;\n}\n.pdp.ltr {\n  direction: ltr;\n  text-align: left;\n}\n.pdp.ltr .pdp-group :first-child:not(.pdp-inside),\n.pdp.ltr .pdp-group .pdp-inside:first-child + input {\n  border-top-left-radius: 0.25rem;\n  border-top-left-radius: var(--radius);\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-left-radius: var(--radius);\n  margin-right: -1px;\n}\n.pdp.ltr .pdp-group input:last-of-type {\n  border-top-right-radius: 0.25rem;\n  border-top-right-radius: var(--radius);\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-right-radius: var(--radius);\n  font-family: sans-serif;\n}\n.pdp.ltr .pdp-group .pdp-clear {\n  left: unset;\n  right: 0.5rem;\n}\n.pdp.ltr .pdp-group .pdp-icon.pdp-inside:nth-of-type(2) {\n  left: 50%;\n}\n.pdp.ltr .pdp-group .pdp-icon.pdp-inside + input {\n  padding-left: 3rem;\n}\n.pdp.ltr.pdp-dual .pdp-clear:nth-of-type(1) {\n  right: calc(50% + 0.5rem) !important;\n}\n.pdp.ltr .pdp-picker::after {\n  left: 1.2rem;\n}\n.pdp.pdp-dual .pdp-picker {\n  left: 50%;\n  transform: translateX(-50%);\n}\n.pdp.pdp-dual .pdp-picker::after {\n  right: unset;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.pdp.pdp-modal .pdp-overlay {\n  background: rgba(0, 0, 0, 0.5) !important;\n}\n.pdp.pdp-modal .pdp-picker {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  animation: startModal 0.1s;\n}\n.pdp.pdp-modal .pdp-picker::after {\n  all: unset !important;\n}\n.pdp * {\n  box-sizing: border-box;\n}\n.pdp svg {\n  vertical-align: middle;\n}\n.pdp input,\n.pdp button {\n  font-family: inherit;\n}\n.pdp .pdp-label {\n  display: inline-block;\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-group {\n  position: relative;\n  display: flex;\n  align-items: stretch;\n  width: 100%;\n}\n.pdp .pdp-group .pdp-input {\n  display: block;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border: 1px solid var(--border-color);\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  position: relative;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.pdp .pdp-group .pdp-input.pdp-focus {\n  outline: none;\n  border-bottom: 2px solid #26baee;\n  border-bottom: 2px solid var(--primary-color);\n}\n.pdp .pdp-group .pdp-icon {\n  padding: 0.375rem 0.75rem;\n  line-height: 1.5;\n  font-size: 1rem;\n  color: #495057;\n  color: var(--text-color);\n  background: #e9ecef;\n  background: var(--icon-background);\n  border: 1px solid #ced4da;\n  border: 1px solid var(--border-color);\n  max-height: calc(1.5em + 0.75rem + 2px);\n}\n.pdp .pdp-group .pdp-icon:nth-of-type(2) {\n  margin-left: -1px;\n  margin-right: -1px;\n}\n.pdp .pdp-group .pdp-icon.pdp-inside {\n  background: transparent;\n  border: none;\n  position: absolute;\n  z-index: 1;\n}\n.pdp .pdp-group .pdp-clear {\n  border: none;\n  background-color: transparent;\n  position: absolute;\n  left: 0.5rem;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  cursor: pointer;\n  padding: 0 0.5rem;\n}\n.pdp .pdp-overlay {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  z-index: 1000;\n  z-index: var(--z-index);\n  background: transparent;\n  background: var(--overlay-color);\n}\n.pdp .pdp-picker {\n  display: flex;\n  position: absolute;\n  color: #495057;\n  color: var(--text-color);\n  background: #fff;\n  background: var(--background);\n  box-shadow: 1px 1px 8px 1px rgba(116, 116, 116, 0.5);\n  box-shadow: var(--main-box-shadow);\n  z-index: 10001;\n  z-index: calc(var(--z-index) + 1);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  transition: all 1s ease;\n  margin-top: 0.5rem;\n  padding: 0.3rem 0.6rem;\n  animation: start 0.1s;\n}\n.pdp .pdp-picker.ltr {\n  direction: ltr;\n}\n.pdp .pdp-picker.ltr .pdp-header .bottom {\n  flex-direction: row-reverse;\n}\n.pdp .pdp-picker.ltr .pdp-header .bottom > div {\n  display: flex;\n  flex-direction: row-reverse;\n}\n.pdp .pdp-picker.ltr .pdp-select-year,\n.pdp .pdp-picker.ltr .pdp-days,\n.pdp .pdp-picker.ltr .pdp-header .pdp-year,\n.pdp .pdp-picker.ltr .pdp-footer small,\n.pdp .pdp-picker.ltr .pdp-time {\n  font-family: sans-serif !important;\n}\n.pdp .pdp-picker.ltr .pdp-shortcut {\n  border-right: unset;\n  border-left: 1px solid #ced4da;\n  border-left: 1px solid var(--border-color);\n}\n.pdp .pdp-picker.rtl {\n  direction: rtl;\n}\n.pdp .pdp-picker.pdp-top {\n  bottom: calc(1.5em + 0.75rem + 2px);\n  margin-top: unset;\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-picker.pdp-top::after {\n  bottom: unset;\n  top: 100%;\n  transform: rotate(180deg);\n}\n.pdp .pdp-picker.pdp-left {\n  left: 0;\n  right: unset;\n}\n.pdp .pdp-picker.pdp-left::after {\n  right: unset;\n  left: 1.2rem;\n}\n.pdp .pdp-picker.pdp-right {\n  left: unset;\n  right: 0;\n}\n.pdp .pdp-picker.pdp-right::after {\n  left: unset;\n  right: 1.2rem;\n}\n.pdp .pdp-picker:after {\n  content: \"\";\n  position: absolute;\n  bottom: 100%;\n  /* left: 50%; transform: translateX(-50%); */\n  /* left: 1.2rem; */\n  border: solid transparent;\n  border-bottom-color: #fff;\n  border-bottom-color: var(--background);\n  border-width: 0.4rem;\n}\n.pdp .pdp-picker ::selection {\n  all: unset;\n}\n.pdp .pdp-picker .pdp-auto, .pdp .pdp-picker .pdp-auto > div {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-select-year,\n.pdp .pdp-picker .pdp-select-month {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  font-size: 0.8rem;\n  background: inherit;\n  list-style: none;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 3.5rem;\n  bottom: 3.5rem;\n  padding: 0;\n  margin: 0;\n  z-index: 1;\n  animation: start 0.1s;\n  overflow: auto;\n}\n.pdp .pdp-picker .pdp-select-year li,\n.pdp .pdp-picker .pdp-select-month li {\n  width: 5rem;\n  height: 4rem;\n  padding: 0.2rem;\n  cursor: pointer;\n  margin: 0.15rem;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  flex: 30% 0;\n}\n.pdp .pdp-picker .pdp-select-year li:not(.disabled):hover,\n.pdp .pdp-picker .pdp-select-month li:not(.disabled):hover {\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n}\n.pdp .pdp-picker .pdp-select-year li.disabled,\n.pdp .pdp-picker .pdp-select-month li.disabled {\n  text-shadow: unset;\n  box-shadow: unset;\n  cursor: default !important;\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-select-year li.selected,\n.pdp .pdp-picker .pdp-select-month li.selected {\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  background: #26baee !important;\n  background: var(--primary-color) !important;\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar {\n  -webkit-appearance: none;\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar:vertical,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar:vertical {\n  width: 0.4rem;\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar-thumb,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  border: 0.1rem solid white; /* should match background, can't be transparent */\n  background: #ced4da;\n  background: var(--border-color);\n}\n.pdp .pdp-picker .pdp-header > div:first-child {\n  border-bottom: 1px solid #ced4da;\n  border-bottom: 1px solid var(--border-color);\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-picker .pdp-header .top {\n  padding: 0.75rem 0.3rem 1rem 0.3rem;\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n  direction: rtl;\n}\n.pdp .pdp-picker .pdp-header .top button {\n  border: 0;\n  background: inherit;\n  cursor: pointer;\n  color: #26baee;\n  color: var(--primary-color);\n  padding: 0 0.5rem;\n}\n.pdp .pdp-picker .pdp-header .bottom {\n  padding: 0.3rem;\n  display: flex;\n  align-items: center;\n  height: 3rem;\n  direction: rtl;\n}\n.pdp .pdp-picker .pdp-header .bottom > div {\n  display: flex;\n  flex-grow: 1;\n  justify-content: space-around;\n}\n.pdp .pdp-picker .pdp-header .bottom > div .pdp-month,\n.pdp .pdp-picker .pdp-header .bottom > div .pdp-year {\n  color: #26baee;\n  color: var(--primary-color);\n  font-size: 1rem;\n}\n.pdp .pdp-picker .pdp-header .bottom button {\n  border: 0;\n  background: inherit;\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-header .bottom button:focus {\n  outline: 0;\n}\n.pdp .pdp-picker .pdp-header .bottom .pdp-arrow.disabled {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-header .bottom .pdp-arrow:not(.disabled):hover {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main {\n  position: relative;\n}\n.pdp .pdp-picker .pdp-main .pdp-date {\n  display: flex;\n  justify-content: center;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column {\n  margin: 0 1rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-week {\n  background: inherit;\n  margin-bottom: 0.3rem;\n  display: flex;\n  justify-content: space-around;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-week .pdp-weekday {\n  width: 2.08rem;\n  width: var(--day-dimensions);\n  height: 2.08rem;\n  height: var(--day-dimensions);\n  line-height: 2.08rem;\n  line-height: var(--day-dimensions);\n  font-size: 0.8rem;\n  text-align: center;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0.1rem 0;\n  font-size: 0.8rem;\n  width: 2.08rem;\n  width: var(--day-dimensions);\n  height: 2.08rem;\n  height: var(--day-dimensions);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  padding: 0;\n  cursor: pointer;\n  transition-property: background-color, box-shadow;\n  transition-duration: 0.1s;\n  contain: content;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.friday {\n  color: #26baee;\n  color: var(--primary-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.weekend {\n  color: #26baee;\n  color: var(--primary-color);\n  font-weight: 700;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.empty {\n  visibility: hidden;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.start-range, .pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.end-range {\n  background: #26baee;\n  background: var(--primary-color);\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.disabled {\n  box-shadow: unset;\n  text-shadow: unset;\n  cursor: default !important;\n  border-color: transparent;\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.hover {\n  background: #9fe8fa !important;\n  background: var(--secondary-color) !important;\n  color: #000;\n  color: var(--hover-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.in-range {\n  background: #c9f1fb;\n  background: var(--in-range-background);\n  color: #000;\n  color: var(--hover-color);\n  border-radius: 0 !important;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day:not(.disabled):hover, .pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.today {\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.tada {\n  animation: tada 1s;\n  background: #9fe8fa;\n  background: var(--secondary-color);\n  box-shadow: inset 0 4px 9px rgba(0, 0, 0, 0.24);\n  color: #000;\n  position: relative;\n  z-index: 1;\n}\n.pdp .pdp-picker .pdp-main .pdp-time {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-main .pdp-time:not(.inline) {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-column {\n  display: flex;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-column div {\n  width: 16.6rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment {\n  margin-bottom: 1rem;\n  font-size: 2rem;\n  font-size: calc(2rem * var(--time-scale));\n  display: flex;\n  justify-content: space-around;\n  height: 100%;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment.column-direction {\n  flex-direction: column;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  direction: ltr;\n  width: 100%;\n  padding: 1rem 0;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div.disabled {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 0 0.8rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div button {\n  border: none;\n  background: none;\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div button svg {\n  width: 8px;\n  width: calc(8px * var(--time-scale));\n}\n.pdp .pdp-picker .pdp-footer {\n  text-align: center;\n  min-height: 3rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-top: 1px solid #ced4da;\n  border-top: 1px solid var(--border-color);\n  padding: 0.3rem;\n}\n.pdp .pdp-picker .pdp-footer .pdp-today,\n.pdp .pdp-picker .pdp-footer .pdp-submit {\n  font-size: 0.8rem;\n  padding: 0.25rem 0.5rem;\n  margin: 0 0.3rem;\n  line-height: 1.5;\n  color: #fff;\n  color: var(--background);\n  text-decoration: none;\n  border: none;\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  background: #26baee;\n  background: var(--primary-color);\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-footer .pdp-today:hover,\n.pdp .pdp-picker .pdp-footer .pdp-submit:hover {\n  filter: brightness(0.9);\n}\n.pdp .pdp-picker .pdp-footer > div {\n  display: flex;\n}\n.pdp .pdp-picker .pdp-shortcut {\n  margin: 0;\n  padding: 0.5rem;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  border-right: 1px solid #ced4da;\n  border-right: 1px solid var(--border-color);\n}\n.pdp .pdp-picker .pdp-shortcut li {\n  margin: 0;\n  padding: 0.5rem 1rem;\n  text-align: center;\n  cursor: pointer;\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  margin: 0.25rem 0;\n  color: #000;\n  color: var(--hover-color);\n  font-weight: 500;\n}\n.pdp .pdp-picker .pdp-shortcut li:hover {\n  background: #c9f1fb;\n  background: var(--in-range-background);\n}\n.pdp .pdp-picker .pdp-shortcut li.selected {\n  background: #26baee;\n  background: var(--primary-color);\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-pointer {\n  cursor: pointer;\n}\n.pdp .pdp-auto {\n  margin: auto;\n  position: relative;\n}";
styleInject(css_248z);

script.render = render;
script.__file = "src/components/DatePicker.vue";

export { PersianDate, script as default };
