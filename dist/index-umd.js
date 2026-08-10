(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
	typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DatePicker = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var PersianDate_min = createCommonjsModule(function (module) {
	var CALENDAR={jalali:{months:{1:"فروردین",2:"اردیبهشت",3:"خرداد",4:"تیر",5:"مرداد",6:"شهریور",7:"مهر",8:"آبان",9:"آذر",10:"دی",11:"بهمن",12:"اسفند"},days:{label:{6:"شنبه",0:"یکشنبه",1:"دوشنبه",2:"سه‌شنبه",3:"چهارشنبه",4:"پنجشنبه",5:"جمعه"},weekNumber:{6:0,0:1,1:2,2:3,3:4,4:5,5:6}},ordinalNumbers:function(t,r){var e={1:"یک",2:"دو",3:"سو",4:"چهار",5:"پنج",6:"شش",7:"هفت",8:"هشت",9:"نه",10:"ده",11:"یازده",12:"دوازده",13:"سیزده",14:"چهارده",15:"پانزده",16:"شانزده",17:"هفده",18:"هجده",19:"نوزده",20:"بیست",30:"سی‌",40:"چهل",50:"پنجاه",60:"شصت",70:"هفتاد",80:"هشتاد",90:"نود",100:"صد",200:"دویست",300:"سیصد"},i="";if(1==t)i="اول";else if(e[t])i=e[t]+(30==t?"ام":"م");else {var a=t%100;(e[a]||(a=t%10))&&(i=e[a]+"م"),(a=(t-a)%100)&&(i=e[a]+(i?" و "+i:30==a?"ام ":"م")),(a=100*Math.floor(t/100))&&(i=e[a]+(i?" و "+i:"م"));}return 2==r&&(i+="ین"),i}},gregorian:{months:{1:"January",2:"February",3:"March",4:"April",5:"May",6:"June",7:"July",8:"August",9:"September",10:"October",11:"November",12:"December"},days:{label:{0:"Sunday",1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"},weekNumber:{0:0,1:1,2:2,3:3,4:4,5:5,6:6}},ordinalNumbers:function(t){return 1==t||t%10==1&&11!=t?t+"st":2==t||t%10==2&&12!=t?t+"nd":3==t||t%10==3&&13!=t?t+"rd":t+"th"}}},REGEX={format:/j*(YYYY|YY|y|Qo|QO|Q|MMMM|MMM|MM|Mo|MO|M|DDDD|DDDo|DDDO|DDD|DD|Do|DO|D|dddd|ddd|dd|do|dO|de|d|ww|WW|wo|Wo|wO|WO|w|W|HH|hh|H|h|kk|k|mm|m|ss|s|CCCC|CCC|c|t|aa|a|A)/g,isNumeric:/^\d+$/,separators:"\\/| |-|\\.|,|:",betweenBacktick:/`(.*?)`/g},TIMETYPE=function(t,r){return t>=0&&t<12?"a"==r?"am":"aa"==r?"A.M.":"A"==r?"AM":"ja"==r?"ق ظ":"jaa"==r?"ق.ظ":"jA"==r?"قبل از ظهر":"ق.ظ":t>=12&&t<24?"a"==r?"pm":"aa"==r?"P.M.":"A"==r?"PM":"ja"==r?"ب ظ":"jaa"==r?"ب.ظ":"jA"==r?"بعد از ظهر":"ب.ظ":void 0},isDate=function(t){return t instanceof Date},jalali$4=function(t){return (t>1342?[1,5,9,13,17,22,26,30]:[1,5,9,13,17,21,26,30]).includes(t%33)},gregorian$4=function(t){return t%4==0&&t%100!=0||t%400==0},isLeapYear=function(t,r){switch(t[0]){case "j":return jalali$4(r);default:return gregorian$4(r)}},isPersianDate=function(t){return t instanceof PersianDate},isValid=function(t,r,e,i,a,n,s,o){return isValidDate(t,r,e,i)&&isValidTime(a,n,s,o)},jalali$3=function(t,r,e){return !(r>=7&&r<=11&&31==e)&&((12!=r||31!=e)&&!(12==r&&30==e&&!isLeapYear("j",t)))},gregorian$3=function(t,r,e){return (![2,4,6,9,11].includes(r)||31!=e)&&!(2==r&&(30==e||29==e&&!isLeapYear("g",t)))},isValidDate=function(t,r,e,i){if([r,e,i].some((function(t){return  -1!=String(t).search(/null|NaN/)})))return  false;if(r<0||e>12||e<1||i>31||i<1)return  false;switch(t[0]){case "j":return jalali$3(r,e,i);default:return gregorian$3(r,e,i)}},isValidTime=function(t,r,e,i){return ![t,r,e,i].some((function(t){return  -1!=String(t).search(/null|NaN/)}))&&(!(t<0||t>23)&&(!(r<0||r>59)&&(!(e<0||e>59)&&!(i<0||i>999))))};function isSame(){var t=typesToArray.apply(void 0,[this.c].concat(Array.prototype.slice.call(arguments)));return t=this.toArray().map((function(r,e){return REGEX.isNumeric.test(t[e])?t[e]:r})),compare.call(this,t,"==")}function _setPrototypeOf(t,r){return (_setPrototypeOf=Object.setPrototypeOf||function(t,r){return t.__proto__=r,t})(t,r)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return  false}}function _construct(t,r,e){return (_construct=_isNativeReflectConstruct()?Reflect.construct:function(t,r,e){var i=[null];i.push.apply(i,r);var a=new(Function.bind.apply(t,i));return e&&_setPrototypeOf(a,e.prototype),a}).apply(null,arguments)}function _slicedToArray(t,r){return _arrayWithHoles(t)||_iterableToArrayLimit(t,r)||_unsupportedIterableToArray(t,r)||_nonIterableRest()}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_unsupportedIterableToArray(t)||_nonIterableSpread()}function _arrayWithoutHoles(t){if(Array.isArray(t))return _arrayLikeToArray(t)}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _iterableToArray(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}function _iterableToArrayLimit(t,r){var e=t&&("undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"]);if(null!=e){var i,a,n=[],s=true,o=false;try{for(e=e.call(t);!(s=(i=e.next()).done)&&(n.push(i.value),!r||n.length!==r);s=!0);}catch(t){o=true,a=t;}finally{try{s||null==e.return||e.return();}finally{if(o)throw a}}return n}}function _unsupportedIterableToArray(t,r){if(t){if("string"==typeof t)return _arrayLikeToArray(t,r);var e=Object.prototype.toString.call(t).slice(8,-1);return "Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?_arrayLikeToArray(t,r):void 0}}function _arrayLikeToArray(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,i=new Array(r);e<r;e++)i[e]=t[e];return i}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _createForOfIteratorHelper(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=_unsupportedIterableToArray(t))||r){e&&(t=e);var i=0,a=function(){};return {s:a,n:function(){return i>=t.length?{done:true}:{done:false,value:t[i++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var n,s=true,o=false;return {s:function(){e=e.call(t);},n:function(){var t=e.next();return s=t.done,t},e:function(t){o=true,n=t;},f:function(){try{s||null==e.return||e.return();}finally{if(o)throw n}}}}var matchingDate=function(t,r){return r.year(t[0]||r.year()),r.month(t[1]||r.month()),r.date(t[2]||r.date()),r.hour(t[3]||r.hour()),r.minute(t[4]||r.minute()),r.second(t[5]||r.second()),r.millisecond(t[6]||r.millisecond()),r.toArray()};function isBetween(t,r,e){return t=typesToArray(this.c,t),t=matchingDate(t,this.clone()),r=typesToArray(this.c,r),r=matchingDate(r,this.clone()),!(!this.isValid.apply(this,_toConsumableArray(t))||!this.isValid.apply(this,_toConsumableArray(r)))&&(compare.call(this,t,"["===e[0]?">=":">")&&compare.call(this,r,"]"===e[1]?"<=":"<"))}function isInArray(t){var r=this;return t.some((function(t){return isSame.call(r,t)}))}var gtj=function(t,r,e,i,a,n,s){var o,h;e=(o=t?isDate(t)?t:new Date(REGEX.isNumeric.test(t)?t:0,REGEX.isNumeric.test(r)?r:0,REGEX.isNumeric.test(e)?e:1,REGEX.isNumeric.test(i)?i:0,REGEX.isNumeric.test(a)?a:0,REGEX.isNumeric.test(n)?n:0,REGEX.isNumeric.test(s)?s:0):new Date).getDate(),r=o.getMonth()+1,t=o.getFullYear(),i=o.getHours(),a=o.getMinutes(),n=o.getSeconds(),s=o.getMilliseconds();t>1600?(h=979,t-=1600):(h=0,t-=621);var u=r>2?t+1:t,l=365*t+parseInt((u+3)/4)-parseInt((u+99)/100)+parseInt((u+399)/400)-80+e+[0,31,59,90,120,151,181,212,243,273,304,334][r-1];return h+=33*parseInt(l/12053),l%=12053,h+=4*parseInt(l/1461),(l%=1461)>365&&(h+=parseInt((l-1)/365),l=(l-1)%365),[h,l<186?1+parseInt(l/31):7+parseInt((l-186)/30),1+(l<186?l%31:(l-186)%30),i,a,n,s]},jtg=function(t,r,e,i,a,n,s){var o,h,u;t=REGEX.isNumeric.test(t)?+t:1,r=REGEX.isNumeric.test(r)?+r:1,e=REGEX.isNumeric.test(e)?+e:1,i=REGEX.isNumeric.test(i)?+i:0,a=REGEX.isNumeric.test(a)?+a:0,n=REGEX.isNumeric.test(n)?+n:0,s=REGEX.isNumeric.test(s)?+s:0,t>979?(o=1600,t-=979):o=621;var l=365*t+8*parseInt(t/33)+parseInt((t%33+3)/4)+78+e+(r<7?31*(r-1):30*(r-7)+186);o+=400*parseInt(l/146097),(l%=146097)>36524&&(o+=100*parseInt(--l/36524),(l%=36524)>=365&&l++),o+=4*parseInt(l/1461),(l%=1461)>365&&(o+=parseInt((l-1)/365),l=(l-1)%365),u=l+1;var d=[0,31,isLeapYear("gregorian",o)?29:28,31,30,31,30,31,31,30,31,30,31];for(h=0;h<13;h++){var c=d[h];if(u<=c)break;u-=c;}return new Date(o,h-1,u,i,a,n,s)},warn=function(t){console.warn(t);},error=function(t){console.error(t);},invalid=function(t){return delete this.d,this.error=t,this},typesToArray=function(t,r,e,i,a,n,s,o){return r||(r=new Date),"string"==typeof r&&-1!=r.search(REGEX.separators)?r.split(/[/ -.,:\\]/):Array.isArray(r)?r:PersianDate.isPersianDate(r)?r.clone().calendar(t).toArray():PersianDate.isDate(r)?new PersianDate(r).calendar(t).toArray():"[object Object]"===Object.prototype.toString.call(r)?[r.y||r.year||r.years,r.M||r.month||r.months||1,r.d||r.day||r.days||r.date||1,r.h||r.hour||r.hours||0,r.m||r.minute||r.minutes||0,r.s||r.second||r.seconds||0,r.ms||r.millisecond||r.milliseconds||0]:[r,e,i,a,n,s,o]},ordinalNumber=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"jalali",e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return CALENDAR[r].ordinalNumbers(t,e)},addPrefix=function(t,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"0";return e.repeat(r-String(t).length)+t},setJalaliDate=function(t){var r=_slicedToArray(gtj(t),7);this.d.year=r[0],this.d.month=r[1],this.d.date=r[2],this.d.hour=r[3],this.d.minute=r[4],this.d.second=r[5],this.d.millisecond=r[6];},setGregorianDate=function(t){this.d={year:t.getFullYear(),month:t.getMonth()+1,date:t.getDate(),hour:t.getHours(),minute:t.getMinutes(),second:t.getSeconds(),millisecond:t.getMilliseconds()};},getDayLabel=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"jalali";return isDate(t)?CALENDAR[r].days.label[t.getDay()]:error("the first param must be instance of Date.")},getDayOfWeek=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"jalali",e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"standard";return isDate(t)?CALENDAR[r].days.weekNumber[t.getDay()]+("standard"!=e?0:1):error("the first param must be instance of Date.")},getDefaultFormat$4=function(t){switch(t[0]){case "j":return "jy";default:return "y"}};function year(t){if(t=String(t).trim(),REGEX.isNumeric.test(t))return this.d.year=+t,this.isValidDate()?this:this.subDay(1,false);t||(t=getDefaultFormat$4(this.c));var r="jalali"==this.c?this.d.year:gtj(this.toDate())[0];if("jy"==t||"jYYYY"==t)return r;if("jYY"==t)return String(r).slice(-2);var e="gregorian"==this.c?this.d.year:this.toDate().getFullYear();return "y"==t||"YYYY"==t?e:"YY"==t?String(e).slice(-2):r}var getDefaultFormat$3=function(t){switch(t[0]){case "j":return "jQ";default:return "Q"}};function quarter(t){if(t=String(t).trim(),REGEX.isNumeric.test(t)){for(t<1?(this.d.month=1,this.subQuarter(t-1,false)):t>4?(this.d.month=12,this.addQuarter(t-4,false)):this.d.month=3*+t-2;!this.isValidDate();)this.subDay(1,false);return this}t||(t=getDefaultFormat$3(this.c));var r=Math.ceil(("jalali"==this.c?this.d.month:gtj(this.toDate())[1])/3);if("jQ"==t)return r;if("jQo"==t)return ordinalNumber(r);if("jQO"==t)return ordinalNumber(r,"jalali",2);var e=Math.ceil(("gregorian"==this.c?this.d.month:this.toDate().getMonth()+1)/3);return "Q"==t?e:"Qo"==t||"QO"==t?ordinalNumber(e,"gregorian"):r}var getDefaultFormat$2=function(t){switch(t[0]){case "j":return "jM";default:return "M"}};function month(t){if(t=String(t).trim(),REGEX.isNumeric.test(t)){for(t<1?(this.d.month=1,this.subMonth(t-1,false)):t>12?(this.d.month=12,this.addMonth(t-12,false)):this.d.month=+t;!this.isValidDate();)this.subDay(1,false);return this}t||(t=getDefaultFormat$2(this.c));var r="jalali"==this.c?this.d.month:gtj(this.toDate())[1];if("jMM"==t)return addPrefix(r,2);if("jM"==t)return r;if("jMMMM"==t||"jMMM"==t)return CALENDAR.jalali.months[r];if("jMo"==t)return ordinalNumber(r);if("jMO"==t)return ordinalNumber(r,"jalali",2);var e="gregorian"==this.c?this.d.month:this.toDate().getMonth()+1;return "M"==t?e:"MM"==t?addPrefix(e,2):"MMMM"==t?CALENDAR.gregorian.months[e]:"Mo"==t||"MO"==t?ordinalNumber(e,"gregorian"):"MMM"==t?CALENDAR.gregorian.months[e].slice(0,3):r}var getDefaultFormat$1=function(t){switch(t[0]){case "j":return "jw";default:return "w"}};function week(t){if(t=String(t).trim(),REGEX.isNumeric.test(t)){var r=this.getWeeksInYear();if(t<1)this.week(1),this.subWeek(t-1,false);else if(t>r)this.week(r),this.addWeek(t-r,false);else {var e=getWeekOfYear.call(this,this.d.year,this.d.month,this.d.date,this.c);this.addWeek(+t-e);}for(;!this.isValidDate();)this.subDay(1,false);return this}t||(t=getDefaultFormat$1(this.c));var i=getWeekOfYear.call(this,this.year("jy"),this.month("jM"),this.date("jD"),this.c);if("jw"==t||"jW"==t)return i;if("jww"==t||"jWW"==t)return addPrefix(i,2);if("jwo"==t||"jWo"==t)return ordinalNumber(i);if("jwO"==t||"jWO"==t)return ordinalNumber(i,"jalali",2);var a=getWeekOfYear.call(this,this.year("y"),this.month("M"),this.date("D"),"gregorian");return "w"==t||"W"==t?a:"ww"==t||"WW"==t?addPrefix(a,2):"wo"==t||"Wo"==t||"wO"==t||"WO"==t?ordinalNumber(a,"gregorian"):i}var getDefaultFormat=function(t){switch(t[0]){case "j":return "jD";default:return "D"}};function date(t){if(t=String(t).trim(),REGEX.isNumeric.test(t)){var r=this.getDaysInMonth();return t<1?(this.d.date=1,this.subDay(t-1)):t>r?(this.d.date=r,this.addDay(t-r)):this.d.date=+t,this}t||(t=getDefaultFormat(this.c));var e="jalali"==this.c?this.d.date:gtj(this.toDate())[2];if("jDD"==t)return addPrefix(e,2);if("jD"==t)return e;if("jDo"==t)return ordinalNumber(e);if("jDO"==t)return ordinalNumber(e,"jalali",2);var i=this.toDate();if("jdddd"==t||"jddd"==t)return getDayLabel(i);if("jdd"==t)return getDayLabel(i).slice(0,1);var a=getDayOfWeek(i);if("jdo"==t)return ordinalNumber(a);if("jdO"==t)return ordinalNumber(a,"jalali",2);if("jd"==t)return getDayOfWeek(i,"jalali","array");if("jde"==t)return a;var n=getDayOfYear(this.year("jy"),this.month("jM"),e,"j");return "jDDDD"==t?addPrefix(n,3):"jDDD"==t?n:"jDDDo"==t?ordinalNumber(n):"jDDDO"==t?ordinalNumber(n,"jalali",2):"DD"==t?addPrefix(i.getDate(),2):"D"==t?i.getDate():"Do"==t||"DO"==t?ordinalNumber(i.getDate(),"gregorian"):"dddd"==t?getDayLabel(i,"gregorian"):"ddd"==t?getDayLabel(i,"gregorian").slice(0,3):"dd"==t?getDayLabel(i,"gregorian").slice(0,2):(a=getDayOfWeek(i,"gregorian"),"do"==t||"dO"==t?ordinalNumber(a,"gregorian"):"d"==t?a-1:"de"==t?a:(n=getDayOfYear(i.getFullYear(),i.getMonth()+1,i.getDate(),"g"),"DDDD"==t?addPrefix(n,3):"DDD"==t?n:"DDDo"==t||"DDDO"==t?ordinalNumber(n,"gregorian"):e))}function hour(t){if(t=String(t).trim(),REGEX.isNumeric.test(t))return t<0?(this.d.hour=0,this.subHour(t)):t>23?(this.d.hour=23,this.addHour(t-23)):this.d.hour=+t,this;var r=this.d.hour;return "H"==t?r:"HH"==t?addPrefix(r,2):"k"==t?r||24:"kk"==t?addPrefix(r||24,2):(r=r>12?r-12:r,"h"==t?r:"hh"==t?addPrefix(r,2):r)}function minute(t){return t=String(t).trim(),REGEX.isNumeric.test(t)?(t<0?(this.d.minute=0,this.subMinute(t)):t>23?(this.d.minute=23,this.addMinute(t-23)):this.d.minute=+t,this):"m"==t?this.d.minute:"mm"==t?addPrefix(this.d.minute,2):this.d.minute}function second(t){return t=String(t).trim(),REGEX.isNumeric.test(t)?(t<0?(this.d.second=0,this.subSecond(t)):t>23?(this.d.second=23,this.addSecond(t-23)):this.d.second=+t,this):"s"==t?this.d.second:"ss"==t?addPrefix(this.d.second,2):this.d.second}function millisecond(t){return t=String(t).trim(),REGEX.isNumeric.test(t)?(t<0?(this.d.millisecond=0,this.subMillisecond(t)):t>23?(this.d.millisecond=23,this.addMillisecond(t-23)):this.d.millisecond=+t,this):"CCC"==t||"c"==t?this.d.millisecond:"CCCC"==t?addPrefix(this.d.millisecond,3):this.d.millisecond}function timestamp(t){return t?this.fromGregorian(+String(t).trim()):this.toDate().getTime()}var jalali$2=function(t,r,e){return e>=1&&e<=6?31:e>6&&e<=11||isLeapYear(t,r)?30:29},gregorian$2=function(t,r,e){return [1,3,5,7,8,10,12].includes(e)?31:2!=e?30:isLeapYear(t,r)?29:28},getDaysInMonth=function(t,r,e){switch(t[0]){case "j":return jalali$2(t,r,e);default:return gregorian$2(t,r,e)}},getDayOfYearFormat=function(t){switch(t[0]){case "j":return "jd";default:return "d"}};function getWeeksInYear(t){var r=getDayOfYearFormat(this.c),e=this.clone().parse(t),i=e.date(r),a=e.clone().endOf("year").startOf("day"),n=a.date(r);return i>3?e.addDay(7-i):e.subDay(i),n>3?a.addDay(7-n):a.subDay(n),Math.ceil(a.diff(e,"date")/7)}function startOf(t){return this.d.millisecond=0,"s"==t[0]?this:(this.d.second=0,"m"==t||"minute"==t?this:(this.d.minute=0,"h"==t[0]?this:(this.d.hour=0,"d"==t[0]?this:"w"==t[0]?this.subDay(getDayOfWeek(this.toDate(),this.c,"array")):(this.d.date=1,"q"==t[0]?this.quarter(this.quarter()):"M"==t||"month"==t?this:(this.d.month=1,"y"==t[0]?this:void 0)))))}function endOf(t){return this.d.millisecond=999,"s"==t[0]?this:(this.d.second=59,"m"==t||"minute"==t?this:(this.d.minute=59,"h"==t[0]?this:(this.d.hour=23,"d"==t[0]?this:"w"==t[0]?this.addDay(7-getDayOfWeek(this.toDate(),this.c)):"q"==t[0]?(this.quarter(this.quarter()).addMonth(2),this.d.date=this.getDaysInMonth(),this):(this.d.date=this.getDaysInMonth(),"M"==t||"month"==t?this:(this.d.month=12,this.d.date=this.getDaysInMonth(),"y"==t[0]?this:void 0)))))}function time(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];if(!r.length)return this.toArray().slice(3);var i=[];return i=isPersianDate(r[0])?r[0].time():isDate(r[0])?[r[0].getHours(),r[0].getMinutes(),r[0].getSeconds(),r[0].getMilliseconds()]:"[object Object]"===Object.prototype.toString.call(r[0])?[r[0].h||r[0].hour||r[0].hours||0,r[0].m||r[0].minute||r[0].minutes||0,r[0].s||r[0].second||r[0].seconds||0,r[0].ms||r[0].millisecond||r[0].milliseconds||0]:typesToArray.apply(void 0,[this.c].concat(r)),this.isValidTime.apply(this,_toConsumableArray(i))?this.hour(i[0]||0).minute(i[1]||0).second(i[2]||0).millisecond(i[3]||0):"زمان نامعتبر"}var getDayOfYear=function(t,r,e,i){for(r=+r,e=+e;0!=--r;)e+=getDaysInMonth(i,t,r);return e},dayOfYearFormat=function(t){switch(t[0]){case "j":return "jd";default:return "d"}},getWeekOfYear=function(t,r,e,i){var a=this.clone().calendar(i).parse(t),n=a.date(dayOfYearFormat(i)),s=a.clone().parse(t,r,e);n>3&&a.addDay(7-n);var o=Math.ceil(s.diff(a,"date",true)/7),h=s.clone().getWeeksInYear();return o>h?h:o},compare=function compare(date,operator){return date=typesToArray.apply(void 0,[this.c].concat(_toConsumableArray(date))),!!this.isValid.apply(this,_toConsumableArray(date))&&eval("this.timestamp()"+operator+"this.clone().parse(...date).timestamp()")},mathOperation=function(t,r){var e=this;if(!t.length)return  false;var i=_toConsumableArray(t),a=i.map((function(t){var r;return t=typesToArray(e.c,t),!!e.isValid.apply(e,_toConsumableArray(t))&&(r=e.clone()).parse.apply(r,_toConsumableArray(t)).timestamp()}));return !a.includes(false)&&i[a.indexOf(Math[r].apply(Math,_toConsumableArray(a)))]},isTimestamp=function(t){return !isNaN(t)&&Math.floor(t/1e4)>0};function now(){var t=new Date;return "jalali"==this.c?setJalaliDate.call(this,t):setGregorianDate.call(this,t),this}function parse(){return "jalali"==this.c?this.fromJalali.apply(this,arguments):this.fromGregorian.apply(this,arguments)}function clone(){return Object.assign(Object.create(Object.getPrototypeOf(this)),JSON.parse(JSON.stringify(this)))}function fromJalali(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];return r=r.length?typesToArray.apply(void 0,["jalali"].concat(_toConsumableArray(r))):gtj(),"jalali"==this.c?(this.d.year=+r[0],this.d.month=+r[1]||1,this.d.date=+r[2]||1,this.d.hour=+r[3]||0,this.d.minute=+r[4]||0,this.d.second=+r[5]||0,this.d.millisecond=+r[6]||0):setGregorianDate.call(this,jtg.apply(void 0,_toConsumableArray(r))),this.isValid()?this:invalid.call(this,"تاریخ نامعتبر")}function fromGregorian(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];if(r.length?this.isPersianDate(r[0])?r=r[0].clone().calendar("g").toArray():isTimestamp(r[0])||((r=typesToArray.apply(void 0,["gregorian"].concat(_toConsumableArray(r))))[6]=+r[6]||0,r[5]=+r[5]||0,r[4]=+r[4]||0,r[3]=+r[3]||0,r[2]=+r[2]||1,r[1]=+r[1]||1,r[0]=+r[0]):r[0]=(new Date).getTime(),r.length>1){if(!isValid.apply(void 0,["gregorian"].concat(_toConsumableArray(r))))return invalid.call(this,"تاریخ نامعتبر");--r[1];}return "Invalid Date"==(r=_construct(Date,_toConsumableArray(r)))?invalid.call(this,"تاریخ نامعتبر"):("jalali"==this.c?setJalaliDate.call(this,r):setGregorianDate.call(this,r),this)}function calendar(t){return t?("j"==t[0]&&"j"!=this.c[0]?(this.error||setJalaliDate.call(this,this.toDate()),this.c="jalali"):"g"==t[0]&&"g"!=this.c[0]&&(this.error||setGregorianDate.call(this,this.toDate()),this.c="gregorian"),this):this.c}function addYear(t,r){if(t<0)return this.subYear(Math.abs(t));for(this.d.year+=+t;r&&!this.isValidDate();)this.subDay(1,false);return this}function addQuarter(t,r){return t<0?this.subQuarter(Math.abs(t)):this.addMonth(3*+t,r)}function addMonth(t,r){if(t<0)return this.subMonth(Math.abs(t));t=+t;var e=12-this.d.month+1;if(e>t)this.d.month+=t;else {for(this.addYear(1,false),this.d.month=1,t-=e;t>=12;)t-=12,this.addYear(1,false);0!=t&&(this.d.month+=t);}for(;r&&!this.isValidDate();)this.subDay(1,false);return this}function addWeek(t,r){return t<0?this.subWeek(Math.abs(t)):this.addDay(7*+t,r)}function addDay(t){if(t<0)return this.subDay(Math.abs(t));t=+t;var r=this.getDaysInMonth()-this.d.date+1;if(r>t)this.d.date+=t;else {this.addMonth(1,false),this.d.date=1,t-=r;for(var e=this.getDaysInMonth();t>=e;)t-=e,this.addMonth(1,false),e=this.getDaysInMonth();0!=t&&(this.d.date+=t);}return this}function addHour(t){if(t<0)return this.subHour(Math.abs(t));for(t=+t;t>=24;)t-=24,this.addDay(1,false);var r=24-this.d.hour;return t>=r?(this.addDay(1,false),t-=r,this.d.hour=t):this.d.hour+=t,this}function addMinute(t){if(t<0)return this.subMinute(Math.abs(t));for(t=+t;t>=60;)this.addHour(1,false),t-=60;var r=60-this.d.minute;return t>=r?(this.addHour(1,false),t-=r,this.d.minute=t):this.d.minute+=t,this}function addSecond(t){if(t<0)return this.subSecond(Math.abs(t));for(t=+t;t>=60;)this.addMinute(1,false),t-=60;var r=60-this.d.second;return t>=r?(this.addMinute(1,false),t-=r,this.d.second=t):this.d.second+=t,this}function addMillisecond(t){if(t<0)return this.subMillisecond(Math.abs(t));for(t=+t;t>=1e3;)this.addSecond(1,false),t-=1e3;var r=1e3-this.d.millisecond;return t>=r?(this.addSecond(1,false),t-=r,this.d.millisecond=t):this.d.millisecond+=t,this}function subYear(t,r){for(this.d.year-=Math.abs(t);r&&!this.isValidDate();)this.subDay(1,false);return this}function subQuarter(t,r){return t=Math.abs(t),this.subMonth(3*t,r)}function subMonth(t,r){t=Math.abs(t);var e=this.d.month;if(e>t)this.d.month-=t;else {for(this.subYear(1,false),this.d.month=12,t-=e;t>=12;)this.subYear(1,false),t-=12;0!=t&&(this.d.month-=t);}for(;r&&!this.isValidDate();)this.subDay(1,false);return this}function subWeek(t,r){return t=Math.abs(t),this.subDay(7*t,r)}function subDay(t){t=Math.abs(t);var r=this.d.date;if(r>t)this.d.date-=t;else {this.subMonth(1,false);var e=this.getDaysInMonth();for(this.d.date=e,t-=r;t>=e;)t-=e,this.subMonth(1,false),e=this.getDaysInMonth();this.d.date=e-t;}return this}function subHour(t){for(t=Math.abs(t);t>=24;)t-=24,this.subDay(1,false);var r=this.d.hour;return t>r?(this.subDay(1,false),t-=r,this.d.hour=24-t):this.d.hour-=t,this}function subMinute(t){for(t=Math.abs(t);t>=60;)t-=60,this.subHour(1,false);var r=this.d.minute;return t>r?(this.subHour(1,false),t-=r,this.d.minute=60-t):this.d.minute-=t,this}function subSecond(t){for(t=Math.abs(t);t>=60;)t-=60,this.subMinute(1,false);var r=this.d.second;return t>r?(this.subMinute(1,false),t-=r,this.d.second=60-t):this.d.second-=t,this}function subMillisecond(t){for(t=Math.abs(t);t>=1e3;)t-=1e3,this.subSecond(1,false);var r=this.d.millisecond;return t>r?(this.subSecond(1,false),t-=r,this.d.millisecond=1e3-t):this.d.millisecond-=t,this}var jalali$1=function(t){return t.replace(/\?/g,"j").replace(/datetime/gi,"jYYYY/jMM/jDD HH:mm").replace(/date/gi,"jYYYY/jMM/jDD").replace(/time/gi,"HH:mm")},gregorian$1=function(t){return t.replace(/\?/g,"").replace(/datetime/gi,"YYYY-MM-DD HH:mm").replace(/date/gi,"YYYY-MM-DD").replace(/time/gi,"HH:mm")};function toString(t){var r=[];switch(t=t.replace(REGEX.betweenBacktick,(function(t,e){return r.push(e),"###"})),this.c[0]){case "j":t=jalali$1(t);break;default:t=gregorian$1(t);}var e,i="",a=_createForOfIteratorHelper(t.match(REGEX.format));try{for(a.s();!(e=a.n()).done;){var n=e.value;i+=t.substring(0,t.indexOf(n)),-1!=n.search(/Y|y/)?i+=this.year(n):-1!=n.search(/M/)?i+=this.month(n):-1!=n.search(/Q/)?i+=this.quarter(n):-1!=n.search(/D|d/)?i+=this.date(n):-1!=n.search(/W|w/)?i+=this.week(n):-1!=n.search(/H|h|k/)?i+=this.hour(n):-1!=n.search(/m/)?i+=this.minute(n):-1!=n.search(/s/)?i+=this.second(n):-1!=n.search(/c|C/)?i+=this.millisecond(n):-1!=n.search(/t/)?i+=this.timestamp():-1!=n.search(/a|A/)&&(i+=TIMETYPE(this.d.hour,n)),t=t.substr(t.indexOf(n)+n.length);}}catch(t){a.e(t);}finally{a.f();}i+=t;for(var s=0;s<r.length;s++)i=i.replace("###",r[s]);return String(i)}function toArray(){if(!arguments.length)return Object.values(this.d);var t=typesToArray.apply(void 0,[this.c].concat(Array.prototype.slice.call(arguments)));return [this.year(t[0]),this.month(t[1]),this.date(t[2]),this.hour(t[3]),this.minute(t[4]),this.second(t[5]),this.millisecond(t[6])]}function toObject(){if(!arguments.length)return this.d;var t=typesToArray.apply(void 0,[this.c].concat(Array.prototype.slice.call(arguments)));return {year:this.year(t[0]),month:this.month(t[1]),date:this.date(t[2]),hour:this.hour(t[3]),minute:this.minute(t[4]),second:this.second(t[5]),millisecond:this.millisecond(t[6])}}var jalali=function(t){return jtg.apply(void 0,_toConsumableArray(t))},gregorian=function(t){return --t[1],_construct(Date,_toConsumableArray(t))};function toDate(){switch(this.c[0]){case "j":return jalali(this.toArray());default:return gregorian(this.toArray())}}function diff(t,r,e){var i;if(t=typesToArray(this.c,t),!this.isValid.apply(this,_toConsumableArray(t)))return "تاریخ نامعتبر";var a=this.timestamp()-(i=this.clone()).parse.apply(i,_toConsumableArray(t)).timestamp();switch(r){case "y":case "year":case "years":a=this.d.year-t[0];break;case "M":case "month":case "months":a=12*this.d.year+this.d.month-(12*+t[0]+ +t[1]);break;case "d":case "date":case "day":case "days":a=Math.ceil(a/1e3/60/60/24);break;case "h":case "hour":case "hours":a=Math.ceil(a/1e3/60/60);break;case "m":case "minute":case "minutes":a=Math.ceil(a/1e3/60);break;case "s":case "second":case "seconds":a=Math.ceil(a/1e3);}return e?a+(a>=0?1:-1):a}function diffForHumans(t,r){var e=this.diff(t,"s");if("string"==typeof e)return "تاریخ نامعتبر";var i=r&&(e>0?"آینده":"پیش");return 0==(e=Math.abs(e))?"هم اکنون":(e=e<45?"لحظات":(e/=60)<45?Math.round(e)+" دقیقه":(e/=60)<23.5?Math.round(e)+" ساعت":(e/=24)<26?Math.round(e)+" روز":e<320?Math.round(e/30)+" ماه":Math.round(e/365)+" سال")+(r?" "+i:"")}var PersianDate=function t(r,e){this.d={},this.c="jalali",t.prototype.now=function(){return this.error&&(delete this.error,this.d={}),now.call(this)},t.prototype.setDate=function(){return warn('"setDate" function is deprecated! use "fromGregorian" function instead.\nhttps://alireza-ab.ir/persian-date/create-and-parse#from-gregorian-date'),this.fromGregorian.apply(this,arguments)},t.prototype.parse=function(){return parse.call.apply(parse,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.clone=function(){return clone.call(this)},t.prototype.fromJalali=function(){return this.error&&(delete this.error,this.d={}),fromJalali.call.apply(fromJalali,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.fromGregorian=function(){return this.error&&(delete this.error,this.d={}),fromGregorian.call.apply(fromGregorian,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.calendar=function(t){return calendar.call(this,t)},t.prototype.year=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.error?this.error:year.call(this,t)},t.prototype.month=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.error?this.error:month.call(this,t)},t.prototype.date=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.error?this.error:date.call(this,t)},t.prototype.quarter=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.error?this.error:quarter.call(this,t)},t.prototype.week=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return this.error?this.error:week.call(this,t)},t.prototype.hour=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"H";return this.error?this.error:hour.call(this,t)},t.prototype.minute=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"m";return this.error?this.error:minute.call(this,t)},t.prototype.second=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"s";return this.error?this.error:second.call(this,t)},t.prototype.millisecond=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"c";return this.error?this.error:millisecond.call(this,t)},t.prototype.timestamp=function(t){return this.error?this.error:timestamp.call(this,t)},t.prototype.valueOf=function(){return this.timestamp()},t.prototype.getDaysInMonth=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.d.year,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.d.month;return this.error?this.error:getDaysInMonth(this.c,t,r)},t.prototype.getWeeksInYear=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.d.year;return this.error?this.error:getWeeksInYear.call(this,t)},t.prototype.startOf=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"year";return startOf.call(this,t)},t.prototype.endOf=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"year";return endOf.call(this,t)},t.prototype.time=function(){return this.error?this.error:time.call.apply(time,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.addYear=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addYear.call(this,t,r):this},t.prototype.addMonth=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addMonth.call(this,t,r):this},t.prototype.addDay=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addDay.call(this,t,r):this},t.prototype.addQuarter=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addQuarter.call(this,t,r):this},t.prototype.addWeek=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addWeek.call(this,t,r):this},t.prototype.addHour=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addHour.call(this,t,r):this},t.prototype.addMinute=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addMinute.call(this,t,r):this},t.prototype.addSecond=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addSecond.call(this,t,r):this},t.prototype.addMillisecond=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?addMillisecond.call(this,t,r):this},t.prototype.subYear=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subYear.call(this,t,r):this},t.prototype.subMonth=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subMonth.call(this,t,r):this},t.prototype.subDay=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subDay.call(this,t,r):this},t.prototype.subQuarter=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subQuarter.call(this,t,r):this},t.prototype.subWeek=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subWeek.call(this,t,r):this},t.prototype.subHour=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subHour.call(this,t,r):this},t.prototype.subMinute=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subMinute.call(this,t,r):this},t.prototype.subSecond=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subSecond.call(this,t,r):this},t.prototype.subMillisecond=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:t?subMillisecond.call(this,t,r):this},t.prototype.toString=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"date";return this.error?this.error:toString.call(this,t)},t.prototype.toArray=function(){return this.error?this.error:toArray.call.apply(toArray,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.toObject=function(){return this.error?this.error:toObject.call.apply(toObject,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.toDate=function(){return this.error?this.error:toDate.call(this)},t.prototype.diff=function(t,r){var e=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return this.error?this.error:diff.call(this,t,r,e)},t.prototype.diffForHumans=function(t){var r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return this.error?this.error:diffForHumans.call(this,t,r)},t.prototype.min=function(){return mathOperation.call(this,arguments,"min")},t.prototype.max=function(){return mathOperation.call(this,arguments,"max")},t.prototype.isLeapYear=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.d.year;return !this.error&&isLeapYear(this.c,t)},t.prototype.isValid=function(t,r,e,i,a,n,s){return !this.error&&(this.isValidDate(t,r,e)&&this.isValidTime(i,a,n,s))},t.prototype.isValidDate=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.d.year,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.d.month,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.d.date;return !this.error&&isValidDate(this.c,t,r,e)},t.prototype.isValidTime=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.d.hour,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.d.minute,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:this.d.second,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:this.d.millisecond;return !this.error&&isValidTime(t,r,e,i)},t.prototype.isSame=function(){return !this.error&&isSame.call.apply(isSame,[this].concat(Array.prototype.slice.call(arguments)))},t.prototype.isBefore=function(){return !this.error&&compare.call(this,arguments,"<")},t.prototype.isAfter=function(){return !this.error&&compare.call(this,arguments,">")},t.prototype.isSameOrBefore=function(){return !this.error&&compare.call(this,arguments,"<=")},t.prototype.isSameOrAfter=function(){return !this.error&&compare.call(this,arguments,">=")},t.prototype.isBetween=function(t,r){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"()";return !this.error&&isBetween.call(this,t,r,e)},t.prototype.isInArray=function(t){return !this.error&&isInArray.call(this,t)},t.prototype.isDate=isDate,t.prototype.isPersianDate=isPersianDate,e&&this.calendar(e),r?e&&"j"==e[0]?this.fromJalali(r):this.fromGregorian(r):this.now();};PersianDate.isLeapYear=isLeapYear,PersianDate.isDate=isDate,PersianDate.isPersianDate=isPersianDate,PersianDate.isValid=isValid,PersianDate.isValidDate=isValidDate,PersianDate.isValidTime=isValidTime,PersianDate.getDaysInMonth=getDaysInMonth,module.exports=PersianDate;
	});

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
	        const newObject = JSON.parse(JSON.stringify(original));
	        for (const key in changed) {
	            if (original[key] &&
	                Object.prototype.toString.call(changed[key]) === '[object Object]')
	                newObject[key] = this.mergeObject(original[key], changed[key]);
	            else
	                newObject[key] = changed[key];
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
	        return PersianDate_min.isPersianDate(val);
	    },
	};

	const _hoisted_1$2 = ["transform"];
	var script$3 = /*@__PURE__*/ vue.defineComponent({
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
	        const { direction, inverse } = vue.toRefs(props);
	        const rotate = vue.computed(() => {
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
	            return (vue.openBlock(), vue.createElementBlock("svg", {
	                xmlns: "http://www.w3.org/2000/svg",
	                "xmlns:xlink": "http://www.w3.org/1999/xlink",
	                viewBox: "314.6749267578125 199.97494506835938 370.62506103515625 600.050048828125",
	                transform: rotate.value
	            }, [...(_cache[0] || (_cache[0] = [
	                    vue.createElementVNode("metadata", null, "Arrow icon", -1 /* CACHED */),
	                    vue.createElementVNode("path", { d: "M419.9 785.6l251.10000000000002-251c9.600000000000023-9.600000000000023 14.299999999999955-22.100000000000023 14.299999999999955-34.60000000000002s-4.7999999999999545-25.100000000000023-14.299999999999955-34.60000000000002l-251.10000000000002-251.09999999999997c-19.099999999999966-19.100000000000023-50.099999999999966-19.100000000000023-69.29999999999995 0l-21.600000000000023 21.599999999999994c-19.100000000000023 19.099999999999994-19.100000000000023 50.099999999999994 0 69.29999999999998l160.2 160.2c9.600000000000023 9.600000000000023 14.300000000000011 22.100000000000023 14.300000000000011 34.60000000000002s-4.800000000000011 25.100000000000023-14.300000000000011 34.60000000000002l-160.2 160.29999999999995c-19.100000000000023 19.100000000000023-19.100000000000023 50.10000000000002 0 69.30000000000007l21.600000000000023 21.59999999999991c19.19999999999999 19 50.19999999999999 19 69.29999999999995-0.1999999999999318z" }, null, -1 /* CACHED */)
	                ]))], 8 /* PROPS */, _hoisted_1$2));
	        };
	    }
	});

	script$3.__file = "src/components/utils/components/PDPArrow.vue";

	const __default__ = {
	    inheritAttrs: false,
	};
	var script$2 = /*@__PURE__*/ vue.defineComponent({
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
	        const { icon } = vue.toRefs(props);
	        return (_ctx, _cache) => {
	            return (vue.unref(icon) === 'clear')
	                ? (vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps({
	                    key: 0,
	                    viewBox: "0 0 512 512",
	                    width: "1rem",
	                    xmlns: "http://www.w3.org/2000/svg"
	                }, _ctx.$attrs), [...(_cache[0] || (_cache[0] = [
	                        vue.createElementVNode("metadata", null, "Clear icon", -1 /* CACHED */),
	                        vue.createElementVNode("path", { d: "M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" }, null, -1 /* CACHED */)
	                    ]))], 16 /* FULL_PROPS */))
	                : (vue.unref(icon) === 'date')
	                    ? (vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps({
	                        key: 1,
	                        version: "1.1",
	                        viewBox: "20.711000442504883 19.33300018310547 51.29999542236328 53.48200225830078",
	                        xmlns: "http://www.w3.org/2000/svg"
	                    }, _ctx.$attrs, { "xmlns:xlink": "http://www.w3.org/1999/xlink" }), [...(_cache[1] || (_cache[1] = [
	                            vue.createStaticVNode("<metadata>Calendar icon</metadata><g><path d=\"M30.35,19.333v2.76h-9.639V32.79v3.4v36.625h44.781c3.595,0,6.519-2.926,6.519-6.52V36.19v-3.4V22.093h-9.64v-2.76h-3.399   v2.76H48.061v-2.76h-3.399v2.76H33.75v-2.76H30.35z M68.61,66.296c0,1.719-1.398,3.119-3.118,3.119H24.111V36.19H68.61V66.296z    M44.661,25.493v2.906h3.399v-2.906h10.911v2.906h3.399v-2.906h6.239v7.297H24.111v-7.297h6.239v2.906h3.4v-2.906H44.661z\"></path><path d=\"M38.073,40.157H27.448v10.625h10.625V40.157z M34.673,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M51.673,40.157H41.048v10.625h10.625V40.157z M48.273,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M65.273,40.157H54.648v10.625h10.625V40.157z M61.873,47.382h-3.825v-3.824h3.825V47.382z\"></path><path d=\"M38.073,54.476H27.448v10.625h10.625V54.476z M34.673,61.7h-3.825v-3.826h3.825V61.7z\"></path><path d=\"M51.673,54.476H41.048v10.625h10.625V54.476z M48.273,61.7h-3.825v-3.826h3.825V61.7z\"></path><path d=\"M65.273,54.476H54.648v10.625h10.625V54.476z M61.873,61.7h-3.825v-3.826h3.825V61.7z\"></path></g>", 2)
	                        ]))], 16 /* FULL_PROPS */))
	                    : (vue.unref(icon) === 'datetime')
	                        ? (vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps({
	                            key: 2,
	                            "xmlns:svg": "http://www.w3.org/2000/svg",
	                            xmlns: "http://www.w3.org/2000/svg"
	                        }, _ctx.$attrs, {
	                            viewBox: "7.146755218505859 47.93895721435547 195.70648193359375 201.1220703125",
	                            version: "1.1"
	                        }), [...(_cache[2] || (_cache[2] = [
	                                vue.createElementVNode("metadata", null, "Calendar And Clock Icon", -1 /* CACHED */),
	                                vue.createElementVNode("g", {
	                                    id: "g915",
	                                    "inkscape:label": "calendar",
	                                    "inkscape:groupmode": "layer",
	                                    style: { "display": "inline" }
	                                }, [
	                                    vue.createElementVNode("g", {
	                                        id: "g907",
	                                        transform: "matrix(3.2971191,0,0,3.2971191,-61.13988,-15.80425)"
	                                    }, [
	                                        vue.createElementVNode("path", {
	                                            id: "path893",
	                                            d: "m 30.35,19.333 v 2.76 h -9.639 v 10.697 3.4 36.625 h 44.781 c 3.595,0 6.519,-2.926 6.519,-6.52 V 36.19 32.79 22.093 h -9.64 v -2.76 h -3.399 v 2.76 H 48.061 v -2.76 h -3.399 v 2.76 H 33.75 v -2.76 z m 38.26,46.963 c 0,1.719 -1.398,3.119 -3.118,3.119 H 24.111 V 36.19 H 68.61 Z M 44.661,25.493 v 2.906 h 3.399 v -2.906 h 10.911 v 2.906 h 3.399 v -2.906 h 6.239 V 32.79 H 24.111 v -7.297 h 6.239 v 2.906 h 3.4 v -2.906 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path895",
	                                            d: "M 38.073,40.157 H 27.448 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path897",
	                                            d: "M 51.673,40.157 H 41.048 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path899",
	                                            d: "M 65.273,40.157 H 54.648 v 10.625 h 10.625 z m -3.4,7.225 h -3.825 v -3.824 h 3.825 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path901",
	                                            d: "M 38.073,54.476 H 27.448 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path903",
	                                            d: "M 51.673,54.476 H 41.048 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
	                                        }),
	                                        vue.createElementVNode("path", {
	                                            id: "path905",
	                                            d: "M 65.273,54.476 H 54.648 v 10.625 h 10.625 z m -3.4,7.224 h -3.825 v -3.826 h 3.825 z"
	                                        })
	                                    ])
	                                ], -1 /* CACHED */),
	                                vue.createElementVNode("g", { "inkscape:groupmode": "layer" }, [
	                                    vue.createElementVNode("circle", {
	                                        id: "path918",
	                                        style: { "fill": "#ffffff", "fill-opacity": "1", "stroke-width": "2.46968" },
	                                        cx: "156.58038",
	                                        cy: "201.26753",
	                                        r: "44.96637"
	                                    })
	                                ], -1 /* CACHED */),
	                                vue.createElementVNode("g", { "inkscape:groupmode": "layer" }, [
	                                    vue.createElementVNode("g", {
	                                        id: "g932",
	                                        style: { "clip-rule": "evenodd", "fill-rule": "evenodd" },
	                                        transform: "matrix(3.8598712,0,0,3.8598712,110.21634,156.42414)"
	                                    }, [
	                                        vue.createElementVNode("path", {
	                                            id: "path921",
	                                            d: "M 12,0 C 18.623,0 24,5.377 24,12 24,18.623 18.623,24 12,24 5.377,24 0,18.623 0,12 0,5.377 5.377,0 12,0 Z m 0,1 C 18.071,1 23,5.929 23,12 23,18.071 18.071,23 12,23 5.929,23 1,18.071 1,12 1,5.929 5.929,1 12,1 Z m 0,11 h 6 v 1 H 11 V 4 h 1 z"
	                                        })
	                                    ])
	                                ], -1 /* CACHED */)
	                            ]))], 16 /* FULL_PROPS */))
	                        : (vue.unref(icon) === 'time')
	                            ? (vue.openBlock(), vue.createElementBlock("svg", vue.mergeProps({
	                                key: 3,
	                                xmlns: "http://www.w3.org/2000/svg"
	                            }, _ctx.$attrs, {
	                                "fill-rule": "evenodd",
	                                "clip-rule": "evenodd",
	                                viewBox: "0 0 24 24"
	                            }), [...(_cache[3] || (_cache[3] = [
	                                    vue.createElementVNode("metadata", null, "Clock Icon", -1 /* CACHED */),
	                                    vue.createElementVNode("path", { d: "M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 11h6v1h-7v-9h1v8z" }, null, -1 /* CACHED */)
	                                ]))], 16 /* FULL_PROPS */))
	                            : vue.createCommentVNode("v-if", true);
	        };
	    }
	});

	script$2.__file = "src/components/utils/components/PDPIcon.vue";

	const _hoisted_1$1 = ["name", "value"];
	const _hoisted_2$1 = ["name", "value"];
	var script$1 = /*@__PURE__*/ vue.defineComponent({
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
	                ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(__props.dates, (date, i) => {
	                    return (vue.openBlock(), vue.createElementBlock("input", {
	                        key: i,
	                        type: "hidden",
	                        name: __props.name,
	                        value: date.toString(__props.format)
	                    }, null, 8 /* PROPS */, _hoisted_1$1));
	                }), 128 /* KEYED_FRAGMENT */))
	                : (vue.openBlock(), vue.createElementBlock("input", {
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
	var script = vue.defineComponent({
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
	         * @default "fa"
	         * @type String
	         * @values fa | en | fa,en |  en,fa
	         * @desc Except above values, you can add
	         *  	the language in "localeConfig" prop and use it.
	         * @since 2.0.0
	         */
	        locale: {
	            default: 'fa',
	            type: String,
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
	            core: new PersianDate_min(),
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
	            currentLocale: this.locale.split(',')[0],
	            interval: null,
	            submitedValue: [],
	        };
	    },
	    computed: {
	        lang() {
	            return this.langs[this.currentLocale];
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
	        years() {
	            let start = this.fromDate.year();
	            const end = this.toDate.year();
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
	                const selectedYear = this.onDisplay.clone().addMonth(i).year();
	                const selectedMonth = this.onDisplay.clone().addMonth(i).month();
	                emptyCells = +this.onDisplay.clone()
	                    .parse(selectedYear, selectedMonth, 1)
	                    .toString('?d');
	                let daysOfMonthNumber = this.onDisplay.getDaysInMonth(selectedYear, selectedMonth);
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
	                            month[week][day] = {
	                                friday: day == 6,
	                                raw: this.onDisplay.clone().addMonth(i).date(showDay),
	                                startRange: this.selectedDates[0] &&
	                                    this.selectedDates[0].isSame(selectedYear, selectedMonth, showDay),
	                                endRange: this.selectedDates[1] &&
	                                    this.selectedDates[1].isSame(selectedYear, selectedMonth, showDay),
	                                inRange: this.selectedDates.length == 2 &&
	                                    this.core
	                                        .clone()
	                                        .parse(selectedYear, selectedMonth, showDay)
	                                        .isBetween(...this.selectedDates.map((date) => date.toString())),
	                                disabled: !this.checkDate(this.onDisplay.clone().addMonth(i).date(showDay), 'date') ||
	                                    this.isInDisable(this.onDisplay.clone().addMonth(i).date(showDay)),
	                                today: this.core
	                                    .clone()
	                                    .isSame(selectedYear, selectedMonth, showDay),
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
	            for (let i = 1; i <= 12; i++) {
	                months[i] = {
	                    label: this.lang.months[i - 1],
	                    selected: this.onDisplay.month() == i,
	                    disabled: !this.checkDate(this.onDisplay.clone().month(i), 'month'),
	                };
	            }
	            return months;
	        },
	        nextLocale() {
	            const locales = this.locale.split(',');
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
	                input: this.inputFormat || this.lang.inputFormat || this.type,
	                display: this.displayFormat ||
	                    this.lang.displayFormat ||
	                    displayFormat[this.type],
	                alt: this.attrs.alt.format ||
	                    this.format ||
	                    format[this.type],
	            };
	        },
	        defaultDate() {
	            const prefix = this.type === 'time' ? this.core.toString('jYYYY/jMM/jDD') + ' ' : '';
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
	                this.fromDate.fromJalali(val);
	            },
	        },
	        to: {
	            handler: function (val) {
	                this.toDate.fromJalali(val);
	            },
	        },
	        mode: {
	            handler: function (val) {
	                if (val == 'single' && this.selectedDates.length == 2)
	                    this.selectedDates.pop();
	            },
	        },
	        locale: {
	            handler: function (val, oldVal) {
	                const index = oldVal.split(',').indexOf(this.currentLocale);
	                this.currentLocale = val.split(',')[index];
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
	        const calendar = this.lang.calendar;
	        this.fromDate = this.core
	            .clone()
	            .parse(this.defaultDate.from)
	            .calendar(calendar);
	        this.toDate = this.core
	            .clone()
	            .parse(this.defaultDate.to)
	            .endOf(Core.getLastUnit(this.to, this.type))
	            .calendar(calendar);
	        this.core.calendar(calendar);
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
	        window.addEventListener('resize', () => {
	            this.documentWidth = window.innerWidth;
	        });
	        if (this.type != 'date') {
	            this.onDisplay.time(this.core);
	        }
	        this.showDatePicker = this.show;
	    },
	    methods: {
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
	                this.onDisplay.addMonth();
	            }
	            else if (month == 'sub') {
	                this.onDisplay.subMonth();
	            }
	            else
	                this.onDisplay.month(month);
	            if (this.checkDate(this.onDisplay, 'month'))
	                this.showMonthSelect = false;
	            else
	                this.onDisplay = clone;
	        },
	        changeSelectedYear(year) {
	            this.onDisplay.year(year);
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
	            if (this.type == 'date') {
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
	                    if (!date.isBefore(this.selectedDates[0])) {
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
	                date = this.selectedDates.map((el) => {
	                    return el.toString(this.formats.model);
	                });
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
	                    document.querySelector('.pdp-day.today').classList.add('tada');
	                    setTimeout(() => {
	                        document
	                            .querySelector('.pdp-day.today')
	                            .classList.remove('tada');
	                    }, 1000);
	                });
	        },
	        checkDate(date, part) {
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
	            date = Core.isPersianDate(date)
	                ? date.clone()
	                : this.core.clone().parse(date);
	            if (Core.isString(disable)) {
	                if (this.type == 'time')
	                    disable = date.toString() + ' ' + disable;
	                return date.calendar('jalali').isSame(disable);
	            }
	            else if (disable instanceof RegExp) {
	                const format = {
	                    date: 'jYYYY/jM/jD',
	                    datetime: 'jYYYY/jM/jD H:m',
	                    time: 'H:m',
	                };
	                return disable.test(date.toString(format[this.type]));
	            }
	            else if (Core.isFunction(disable)) {
	                return disable(date);
	            }
	            else if (Array.isArray(disable)) {
	                return disable.some((val) => {
	                    if (Core.isString(val)) {
	                        if (this.type == 'time')
	                            val = date.toString() + ' ' + val;
	                        return date.calendar('jalali').isSame(val);
	                    }
	                    else if (val instanceof RegExp) {
	                        const format = {
	                            date: 'jYYYY/jM/jD',
	                            datetime: 'jYYYY/jM/jD H:m',
	                            time: 'H:m',
	                        };
	                        return val.test(date.toString(format[this.type]));
	                    }
	                });
	            }
	            else {
	                return false;
	            }
	        },
	        showPicker(el, index) {
	            if (this.clickOn == 'all' || this.clickOn == el) {
	                const inputName = this.inputs[index];
	                if (this.dualInput)
	                    this.inputName = inputName;
	                this.$refs.inputs[index].focus();
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
	                // eslint-disable-next-line no-undef
	                let focusedDay = document.querySelectorAll('.pdp .pdp-day.hover');
	                if (!focusedDay.length) {
	                    focusedDay = document.querySelectorAll('.pdp .pdp-day.start-range,.pdp .pdp-day.end-range');
	                }
	                focusedDay = focusedDay[focusedDay.length - 1];
	                if (focusedDay) {
	                    let column = this.getColumn(focusedDay);
	                    focusedDay.classList.remove('hover');
	                    const firstColumnMonth = this.onDisplay.toString();
	                    const focusedMonth = this.onDisplay.clone().addMonth(column);
	                    let nextElementValue = focusedMonth
	                        .date(focusedDay.innerText)
	                        .addDay(numberOfDay);
	                    if (!this.checkDate(nextElementValue, 'date'))
	                        return focusedDay.classList.add('hover');
	                    nextElementValue = nextElementValue.date();
	                    column = focusedMonth.diff(firstColumnMonth, 'month');
	                    if (column < 0) {
	                        this.onDisplay.subMonth(this.columnCount);
	                        column = this.columnCount - 1;
	                    }
	                    else if (column >= this.columnCount) {
	                        this.onDisplay.addMonth(this.columnCount);
	                        column = 0;
	                    }
	                    await this.$nextTick();
	                    focusedDay = document.querySelector(`.pdp .pdp-main .pdp-column[data-column='${column}'] .pdp-day[value='${nextElementValue}']`);
	                    focusedDay.classList.add('hover');
	                }
	                else {
	                    focusedDay = document.querySelector('.pdp .pdp-day:not(.empty):not(.disabled)');
	                    if (focusedDay)
	                        focusedDay.classList.add('hover');
	                    else {
	                        focusedDay = document.querySelector(`.pdp .pdp-main .pdp-column[data-column="0"] .pdp-day[value="${this.fromDate.date()}"]`);
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
	                const focusedDay = document.querySelector('.pdp .pdp-day.hover');
	                if (focusedDay) {
	                    this.selectDate(this.onDisplay.clone()
	                        .addMonth(this.getColumn(focusedDay) || 0)
	                        .date(focusedDay.innerText), 'date');
	                }
	                else {
	                    let onDisplay;
	                    this.displayValue.forEach((value, index) => {
	                        if (!value)
	                            return false;
	                        if (this.type == 'time') {
	                            const time = value.split(/[/ -.,:\\]/);
	                            if (this.checkDate(this.core.clone(), 'time'))
	                                onDisplay = this.core.clone();
	                            else
	                                onDisplay = this.fromDate.clone();
	                            onDisplay.time(time);
	                        }
	                        else {
	                            onDisplay = this.core.clone().parse(value);
	                        }
	                        if (this.selectDate(onDisplay, 'time') === 0) {
	                            const diff = onDisplay.diff(this.onDisplay, 'month');
	                            if (diff < 0 || diff >= this.columnCount)
	                                this.onDisplay = onDisplay.clone();
	                            this.displayValue[index] = '';
	                        }
	                    });
	                }
	            }
	        },
	        // eslint-disable-next-line @typescript-eslint/no-explicit-any
	        selectInRangeDate(e) {
	            const target = e.target;
	            if (!target.classList.contains('pdp-day'))
	                return;
	            document.querySelectorAll(`.pdp .pdp-day`).forEach((el) => {
	                el.classList.remove('in-range');
	            });
	            let column = this.getColumn(target);
	            const hoveredDate = this.onDisplay.clone()
	                .startOf('date')
	                .addMonth(column)
	                .date(target.innerText);
	            const selectedDate = this.selectedDates[0].clone().startOf('date');
	            const number = hoveredDate.isAfter(selectedDate) ? 1 : -1;
	            const selectedDateDOM = document.querySelector('.pdp-day.start-range,.pdp-day.end-range');
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
	                const oldMonth = selectedDate.month();
	                selectedDate.addDay(number);
	                if (oldMonth != selectedDate.month()) {
	                    column += number;
	                }
	                if (this.checkDate(selectedDate, 'date') &&
	                    !this.isInDisable(selectedDate)) {
	                    document
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
	                return el.toString(this.formats.input);
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
	            this.pickerPlace = {
	                top: false,
	                left: false,
	                right: false,
	            };
	            this.$nextTick(() => {
	                const input = this.$refs.inputs[0];
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
	            const locales = this.locale.split(',');
	            const index = locales.indexOf(this.currentLocale);
	            this.currentLocale = locales[index + 1] || locales[0];
	            const calendar = this.lang.calendar;
	            this.core.calendar(calendar);
	            this.fromDate.calendar(calendar);
	            this.toDate.calendar(calendar);
	            this.onDisplay.calendar(calendar);
	            for (const date of this.selectedDates) {
	                date.calendar(calendar);
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
	                if (!this.isInDisable(time)) {
	                    if (this.type == 'time') {
	                        this.selectedDates[timeIndex] = time;
	                    }
	                    else if (this.selectedDates[timeIndex]) {
	                        this.selectedDates[timeIndex].time(time);
	                    }
	                    this.$emit('select', time);
	                    if (this.autoSubmit &&
	                        !this.selectedTimes.some((sTime) => this.isInDisable(sTime)))
	                        this.submitDate(false);
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
	                const date = this.core
	                    .clone()
	                    .fromGregorian((this.type == 'time'
	                    ? this.core.toString('YYYY-MM-DD') + ' '
	                    : '') + d);
	                if (Core.isPersianDate(date)) {
	                    this.selectedDates.push(date.clone());
	                    this.selectedTimes.push(date.clone());
	                    if (index == 0)
	                        this.onDisplay = date.clone();
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
	const _hoisted_3 = ["onUpdate:modelValue", "onFocus"];
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
	  const _component_PDPIcon = vue.resolveComponent("PDPIcon");
	  const _component_PDPAlt = vue.resolveComponent("PDPAlt");
	  const _component_PDPArrow = vue.resolveComponent("PDPArrow");

	  return (vue.openBlock(), vue.createElementBlock("div", {
	    ref: "root",
	    class: vue.normalizeClass([
	      'pdp',
	      { 'pdp-range': _ctx.mode === 'range' },
	      { 'pdp-modal': _ctx.modal },
	      { 'pdp-dual': _ctx.dualInput },
	      _ctx.lang.dir.input,
	    ])
	  }, [
	    vue.renderSlot(_ctx.$slots, "before", {}, () => [
	      (_ctx.label)
	        ? (vue.openBlock(), vue.createElementBlock("label", vue.mergeProps({
	            key: 0,
	            for: _ctx.attrs.firstInput.id
	          }, _ctx.attrs.label), vue.toDisplayString(_ctx.label), 17 /* TEXT, FULL_PROPS */, _hoisted_1))
	        : vue.createCommentVNode("v-if", true)
	    ]),
	    vue.createElementVNode("div", vue.normalizeProps(vue.guardReactiveProps(_ctx.attrs.div)), [
	      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.inputs, (input, index) => {
	        return (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: input }, [
	          (!_ctx.$slots.hasOwnProperty('icon') || _ctx.$slots?.icon?.()?.length)
	            ? (vue.openBlock(), vue.createElementBlock("div", {
	                key: `icon-${input}`,
	                class: vue.normalizeClass([
	            'pdp-icon',
	            { 'pdp-pointer': ['all', 'icon'].includes(_ctx.clickOn) },
	            { 'pdp-inside': _ctx.iconInside },
	          ]),
	                onClick: $event => (_ctx.showPicker('icon', index))
	              }, [
	                vue.renderSlot(_ctx.$slots, "icon", {}, () => [
	                  vue.createVNode(_component_PDPIcon, {
	                    icon: _ctx.type,
	                    width: "23",
	                    height: "23"
	                  }, null, 8 /* PROPS */, ["icon"])
	                ])
	              ], 10 /* CLASS, PROPS */, _hoisted_2))
	            : vue.createCommentVNode("v-if", true),
	          vue.withDirectives(vue.createElementVNode("input", vue.mergeProps({
	            ref_for: true,
	            ref: "inputs",
	            "onUpdate:modelValue": $event => ((_ctx.displayValue[index]) = $event),
	            type: "text",
	            autocomplete: "off"
	          }, { ref_for: true }, _ctx.attrs[input], {
	            onFocus: $event => (_ctx.showPicker('input', index)),
	            onKeydown: _cache[0] || (_cache[0] = (...args) => (_ctx.selectWithArrow && _ctx.selectWithArrow(...args)))
	          }), null, 16 /* FULL_PROPS */, _hoisted_3), [
	            [vue.vModelText, _ctx.displayValue[index]]
	          ]),
	          (_ctx.clearable)
	            ? (vue.openBlock(), vue.createElementBlock("button", {
	                key: `clear-${input}`,
	                class: "pdp-clear",
	                type: "button",
	                onClick: $event => (_ctx.clear(input))
	              }, [
	                vue.renderSlot(_ctx.$slots, "clear", {}, () => [
	                  vue.createVNode(_component_PDPIcon, { icon: "clear" })
	                ])
	              ], 8 /* PROPS */, _hoisted_4))
	            : vue.createCommentVNode("v-if", true)
	        ], 64 /* STABLE_FRAGMENT */))
	      }), 128 /* KEYED_FRAGMENT */))
	    ], 16 /* FULL_PROPS */),
	    vue.renderSlot(_ctx.$slots, "after"),
	    (_ctx.attrs.alt.name)
	      ? (vue.openBlock(), vue.createBlock(_component_PDPAlt, {
	          key: 0,
	          name: _ctx.attrs.alt.name,
	          format: _ctx.formats.alt,
	          dates: _ctx.submitedValue
	        }, null, 8 /* PROPS */, ["name", "format", "dates"]))
	      : vue.createCommentVNode("v-if", true),
	    (_ctx.showDatePicker)
	      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
	          vue.createElementVNode("div", {
	            class: "pdp-overlay",
	            onClick: _cache[1] || (_cache[1] = $event => (_ctx.showDatePicker = false))
	          }),
	          vue.createElementVNode("div", vue.mergeProps(_ctx.attrs.picker, { ref: "pdpPicker" }), [
	            vue.createElementVNode("div", _hoisted_6, [
	              (_ctx.type.includes('date'))
	                ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
	                    vue.withDirectives(vue.createElementVNode("ul", _hoisted_8, [
	                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.months, (month, index) => {
	                        return (vue.openBlock(), vue.createElementBlock("li", {
	                          key: index,
	                          class: vue.normalizeClass([
	                  { selected: month.selected },
	                  { disabled: month.disabled },
	                ]),
	                          onClick: $event => (_ctx.changeSelectedMonth(index))
	                        }, vue.toDisplayString(month.label), 11 /* TEXT, CLASS, PROPS */, _hoisted_9))
	                      }), 128 /* KEYED_FRAGMENT */))
	                    ], 512 /* NEED_PATCH */), [
	                      [vue.vShow, _ctx.showMonthSelect]
	                    ]),
	                    vue.withDirectives(vue.createElementVNode("ul", _hoisted_10, [
	                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.years, (year, index) => {
	                        return (vue.openBlock(), vue.createElementBlock("li", {
	                          key: index,
	                          class: vue.normalizeClass({ selected: _ctx.onDisplay.year() == year }),
	                          onClick: $event => (_ctx.changeSelectedYear(year))
	                        }, vue.toDisplayString(year), 11 /* TEXT, CLASS, PROPS */, _hoisted_11))
	                      }), 128 /* KEYED_FRAGMENT */))
	                    ], 512 /* NEED_PATCH */), [
	                      [vue.vShow, _ctx.showYearSelect]
	                    ])
	                  ]))
	                : vue.createCommentVNode("v-if", true),
	              (_ctx.type.includes('date'))
	                ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
	                    (_ctx.locale.includes(','))
	                      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_13, [
	                          vue.createElementVNode("div", null, vue.toDisplayString(_ctx.lang.translations.text), 1 /* TEXT */),
	                          vue.createElementVNode("button", {
	                            type: "button",
	                            tabindex: _ctx.tabIndex,
	                            onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.changeLocale && _ctx.changeLocale(...args)))
	                          }, vue.toDisplayString(_ctx.nextLocale), 9 /* TEXT, PROPS */, _hoisted_14)
	                        ]))
	                      : vue.createCommentVNode("v-if", true),
	                    vue.createElementVNode("div", _hoisted_15, [
	                      vue.createElementVNode("button", {
	                        tabindex: "-1",
	                        type: "button",
	                        class: vue.normalizeClass([
	                  'pdp-arrow',
	                  {
	                    disabled: !_ctx.checkDate(_ctx.onDisplay.clone().subMonth(), 'month'),
	                  },
	                ]),
	                        title: _ctx.lang.translations.prevMonth,
	                        onClick: _cache[3] || (_cache[3] = $event => (_ctx.changeSelectedMonth('sub')))
	                      }, [
	                        vue.renderSlot(_ctx.$slots, "right-arrow", {}, () => [
	                          vue.createVNode(_component_PDPArrow, {
	                            direction: "right",
	                            width: "10",
	                            height: "10",
	                            inverse: _ctx.lang.dir.picker == 'ltr'
	                          }, null, 8 /* PROPS */, ["inverse"])
	                        ])
	                      ], 10 /* CLASS, PROPS */, _hoisted_16),
	                      vue.createElementVNode("div", null, [
	                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.columnCount, (item, i) => {
	                          return (vue.openBlock(), vue.createElementBlock("div", { key: i }, [
	                            vue.createElementVNode("button", {
	                              class: "pdp-month",
	                              type: "button",
	                              tabindex: "-1",
	                              onClick: _cache[4] || (_cache[4] = $event => (_ctx.showPart('month')))
	                            }, vue.toDisplayString(_ctx.months[_ctx.onDisplay.clone().addMonth(i).month()].label), 1 /* TEXT */),
	                            vue.createElementVNode("button", {
	                              class: "pdp-year",
	                              type: "button",
	                              tabindex: "-1",
	                              onClick: _cache[5] || (_cache[5] = $event => (_ctx.showPart('year')))
	                            }, vue.toDisplayString(_ctx.onDisplay.clone().addMonth(i).year()), 1 /* TEXT */)
	                          ]))
	                        }), 128 /* KEYED_FRAGMENT */))
	                      ]),
	                      vue.createElementVNode("button", {
	                        tabindex: "-1",
	                        type: "button",
	                        class: vue.normalizeClass([
	                  'pdp-arrow',
	                  {
	                    disabled: !_ctx.checkDate(_ctx.onDisplay.clone().addMonth(), 'month'),
	                  },
	                ]),
	                        title: _ctx.lang.translations.nextMonth,
	                        onClick: _cache[6] || (_cache[6] = $event => (_ctx.changeSelectedMonth('add')))
	                      }, [
	                        vue.renderSlot(_ctx.$slots, "left-arrow", {}, () => [
	                          vue.createVNode(_component_PDPArrow, {
	                            direction: "left",
	                            width: "10",
	                            height: "10",
	                            inverse: _ctx.lang.dir.picker == 'ltr'
	                          }, null, 8 /* PROPS */, ["inverse"])
	                        ])
	                      ], 10 /* CLASS, PROPS */, _hoisted_17)
	                    ])
	                  ]))
	                : vue.createCommentVNode("v-if", true),
	              vue.createElementVNode("div", _hoisted_18, [
	                (_ctx.type.includes('date'))
	                  ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_19, [
	                      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.columnCount, (item, i) => {
	                        return (vue.openBlock(), vue.createElementBlock("div", {
	                          key: i,
	                          class: "pdp-column",
	                          "data-column": i
	                        }, [
	                          vue.createElementVNode("div", _hoisted_21, [
	                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.lang.weekdays, (weekday, index) => {
	                              return (vue.openBlock(), vue.createElementBlock("div", {
	                                key: index,
	                                class: "pdp-weekday"
	                              }, vue.toDisplayString(weekday), 1 /* TEXT */))
	                            }), 128 /* KEYED_FRAGMENT */))
	                          ]),
	                          vue.createElementVNode("div", _hoisted_22, [
	                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.monthDays[i], (week, wIndex) => {
	                              return (vue.openBlock(), vue.createElementBlock("div", { key: wIndex }, [
	                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(week, (day) => {
	                                  return (vue.openBlock(), vue.createElementBlock("div", {
	                                    key: day.raw ? day.raw.toString() : undefined,
	                                    class: vue.normalizeClass([
	                        'pdp-day',
	                        { empty: day.empty },
	                        { friday: day.friday },
	                        { today: day.today },
	                        { 'start-range': day.startRange },
	                        { 'end-range': day.endRange },
	                        { disabled: day.disabled },
	                        { 'in-range': day.inRange },
	                      ]),
	                                    value: day.val,
	                                    onClick: $event => (_ctx.selectDate(day.raw, 'date'))
	                                  }, vue.toDisplayString(day.val), 11 /* TEXT, CLASS, PROPS */, _hoisted_23))
	                                }), 128 /* KEYED_FRAGMENT */))
	                              ]))
	                            }), 128 /* KEYED_FRAGMENT */))
	                          ])
	                        ], 8 /* PROPS */, _hoisted_20))
	                      }), 128 /* KEYED_FRAGMENT */))
	                    ]))
	                  : vue.createCommentVNode("v-if", true),
	                (_ctx.type.includes('time'))
	                  ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_24, [
	                      (_ctx.type == 'time')
	                        ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_25, [
	                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.columnCount, (c, i) => {
	                              return (vue.openBlock(), vue.createElementBlock("div", { key: i }))
	                            }), 128 /* KEYED_FRAGMENT */))
	                          ]))
	                        : vue.createCommentVNode("v-if", true),
	                      vue.createElementVNode("div", {
	                        class: vue.normalizeClass([
	                  'pdp-moment',
	                  { 'column-direction': _ctx.mode == 'range' && _ctx.columnCount == 1 },
	                ])
	                      }, [
	                        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.mode == 'range' ? 2 : 1, (n, i) => {
	                          return (vue.openBlock(), vue.createElementBlock("div", {
	                            key: n,
	                            class: vue.normalizeClass([
	                    {
	                      disabled:
	                        _ctx.selectedTimes[i] &&
	                        (!_ctx.checkDate(_ctx.selectedTimes[i], 'time') ||
	                          _ctx.isInDisable(_ctx.selectedTimes[i])),
	                    }, // FIXME: go to method
	                  ])
	                          }, [
	                            vue.createElementVNode("div", _hoisted_26, [
	                              vue.createElementVNode("button", {
	                                type: "button",
	                                onTouchstart: vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]),
	                                onMousedown: vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]),
	                                onKeydown: vue.withKeys(vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'add')), ["prevent"]), ["enter"]),
	                                onTouchend: _cache[7] || (_cache[7] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onMouseup: _cache[8] || (_cache[8] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onKeyup: _cache[9] || (_cache[9] = vue.withKeys(vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
	                              }, [
	                                vue.renderSlot(_ctx.$slots, "up-arrow", {}, () => [
	                                  vue.createVNode(_component_PDPArrow)
	                                ])
	                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_27),
	                              vue.createTextVNode(vue.toDisplayString(_ctx.selectedTimes[i]
	                        ? _ctx.selectedTimes[i].hour('HH')
	                        : _ctx.core.hour('HH')), 1 /* TEXT */),
	                              vue.createElementVNode("button", {
	                                type: "button",
	                                onTouchstart: vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]),
	                                onMousedown: vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]),
	                                onKeydown: vue.withKeys(vue.withModifiers($event => (_ctx.startChangeTime(i, 'hour', 'sub')), ["prevent"]), ["enter"]),
	                                onTouchend: _cache[10] || (_cache[10] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onMouseup: _cache[11] || (_cache[11] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onKeyup: _cache[12] || (_cache[12] = vue.withKeys(vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
	                              }, [
	                                vue.renderSlot(_ctx.$slots, "down-arrow", {}, () => [
	                                  vue.createVNode(_component_PDPArrow, { direction: "down" })
	                                ])
	                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_28)
	                            ]),
	                            _cache[21] || (_cache[21] = vue.createTextVNode(" : ", -1 /* CACHED */)),
	                            vue.createElementVNode("div", _hoisted_29, [
	                              vue.createElementVNode("button", {
	                                type: "button",
	                                onTouchstart: vue.withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'add')), ["prevent"]),
	                                onMousedown: vue.withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'add')), ["prevent"]),
	                                onKeydown: vue.withKeys(vue.withModifiers($event => (
	                        _ctx.startChangeTime(i, 'minute', 'add')
	                      ), ["prevent"]), ["enter"]),
	                                onTouchend: _cache[13] || (_cache[13] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onMouseup: _cache[14] || (_cache[14] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onKeyup: _cache[15] || (_cache[15] = vue.withKeys(vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
	                              }, [
	                                vue.renderSlot(_ctx.$slots, "up-arrow", {}, () => [
	                                  vue.createVNode(_component_PDPArrow)
	                                ])
	                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_30),
	                              vue.createTextVNode(vue.toDisplayString(_ctx.selectedTimes[i]
	                        ? _ctx.selectedTimes[i].minute('mm')
	                        : _ctx.core.minute('mm')), 1 /* TEXT */),
	                              vue.createElementVNode("button", {
	                                type: "button",
	                                onTouchstart: vue.withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'sub')), ["prevent"]),
	                                onMousedown: vue.withModifiers($event => (_ctx.startChangeTime(i, 'minute', 'sub')), ["prevent"]),
	                                onKeydown: vue.withKeys(vue.withModifiers($event => (
	                        _ctx.startChangeTime(i, 'minute', 'sub')
	                      ), ["prevent"]), ["enter"]),
	                                onTouchend: _cache[16] || (_cache[16] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onMouseup: _cache[17] || (_cache[17] = vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"])),
	                                onKeyup: _cache[18] || (_cache[18] = vue.withKeys(vue.withModifiers((...args) => (_ctx.stopChangeTime && _ctx.stopChangeTime(...args)), ["prevent"]), ["enter"]))
	                              }, [
	                                vue.renderSlot(_ctx.$slots, "down-arrow", {}, () => [
	                                  vue.createVNode(_component_PDPArrow, { direction: "down" })
	                                ])
	                              ], 40 /* PROPS, NEED_HYDRATION */, _hoisted_31)
	                            ])
	                          ], 2 /* CLASS */))
	                        }), 128 /* KEYED_FRAGMENT */))
	                      ], 2 /* CLASS */)
	                    ]))
	                  : vue.createCommentVNode("v-if", true)
	              ], 512 /* NEED_PATCH */),
	              vue.createElementVNode("div", _hoisted_32, [
	                vue.createElementVNode("div", null, [
	                  vue.renderSlot(_ctx.$slots, "footer"),
	                  (_ctx.selectedDates[0])
	                    ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_33, vue.toDisplayString(_ctx.selectedDates[0].toString(_ctx.formats.display)), 1 /* TEXT */))
	                    : vue.createCommentVNode("v-if", true),
	                  (_ctx.selectedDates.length == 2)
	                    ? (vue.openBlock(), vue.createElementBlock("small", _hoisted_34, " - " + vue.toDisplayString(_ctx.selectedDates[1].toString(_ctx.formats.display)), 1 /* TEXT */))
	                    : vue.createCommentVNode("v-if", true)
	                ]),
	                vue.createElementVNode("div", null, [
	                  (_ctx.checkDate(_ctx.core, 'date'))
	                    ? (vue.openBlock(), vue.createElementBlock("button", {
	                        key: 0,
	                        class: "pdp-today",
	                        type: "button",
	                        tabindex: _ctx.tabIndex,
	                        onClick: _cache[19] || (_cache[19] = (...args) => (_ctx.goToToday && _ctx.goToToday(...args)))
	                      }, vue.toDisplayString(_ctx.lang.translations.now), 9 /* TEXT, PROPS */, _hoisted_35))
	                    : vue.createCommentVNode("v-if", true),
	                  (
	                  !_ctx.autoSubmit &&
	                  !_ctx.selectedDates.some((date) => _ctx.isInDisable(date))
	                )
	                    ? (vue.openBlock(), vue.createElementBlock("button", {
	                        key: 1,
	                        class: "pdp-submit",
	                        type: "button",
	                        tabindex: _ctx.tabIndex,
	                        onClick: _cache[20] || (_cache[20] = $event => (_ctx.submitDate()))
	                      }, vue.toDisplayString(_ctx.lang.translations.submit), 9 /* TEXT, PROPS */, _hoisted_36))
	                    : vue.createCommentVNode("v-if", true)
	                ])
	              ])
	            ]),
	            (_ctx.shortcuts && Object.keys(_ctx.shortcuts).length > 0)
	              ? (vue.openBlock(), vue.createElementBlock("ul", _hoisted_37, [
	                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.shortcuts, (dates, name) => {
	                    return (vue.openBlock(), vue.createElementBlock("li", {
	                      key: name,
	                      class: vue.normalizeClass({
	              selected: !dates.some(
	                (date, i) =>
	                  !date.isSame(
	                    _ctx.selectedDates[i] && _ctx.selectedDates[i].toString('datetime'),
	                  ),
	              ),
	            }),
	                      onClick: $event => (_ctx.selectShorcut(dates))
	                    }, vue.toDisplayString(name), 11 /* TEXT, CLASS, PROPS */, _hoisted_38))
	                  }), 128 /* KEYED_FRAGMENT */))
	                ]))
	              : vue.createCommentVNode("v-if", true)
	          ], 16 /* FULL_PROPS */)
	        ]))
	      : vue.createCommentVNode("v-if", true)
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

	var css_248z = ".pdp {\n  --primary-color: #26baee;\n  --secondary-color: #9fe8fa;\n  --in-range-background: #c9f1fb;\n  --radius: 0.25rem;\n  --text-color: #495057;\n  --hover-color: #000;\n  --background: #fff;\n  --border-color: #ced4da;\n  --z-index: 1000;\n  --disabled-opacity: 0.3;\n  --icon-background: #e9ecef;\n  --overlay-color: transparent;\n  --main-box-shadow: 1px 1px 8px 1px rgba(116, 116, 116, 0.5);\n  --day-dimensions: 2.08rem;\n  --time-scale: 1;\n}\n@keyframes start {\nfrom {\n    transform: inherit scale(0.5);\n    opacity: 0;\n}\nto {\n    transform: inherit scale(1);\n    opacity: 1;\n}\n}\n@keyframes startModal {\nfrom {\n    transform: translate(-50%, -50%) scale(0.5);\n    opacity: 0;\n}\nto {\n    transform: translate(-50%, -50%) scale(1);\n    opacity: 1;\n}\n}\n@keyframes tada {\n0% {\n    transform: scale(1);\n}\n10%, 20% {\n    transform: scale(0.9) rotate(-3deg);\n}\n30%, 50%, 70%, 90% {\n    transform: scale(1.1) rotate(3deg);\n}\n40%, 60%, 80% {\n    transform: scale(1.1) rotate(-3deg);\n}\n100% {\n    transform: scale(1) rotate(0);\n}\n}\n@media (max-width: 700px) {\n.pdp-picker {\n    flex-direction: column-reverse;\n}\n.pdp-shortcut {\n    flex-direction: row !important;\n    flex-wrap: wrap;\n    justify-content: space-evenly;\n    padding: 0 !important;\n    border: none !important;\n}\n}\n.pdp {\n  position: relative;\n}\n.pdp:not(.pdp-range) .pdp-day.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.start-range {\n  border-radius: 0 0.25rem 0.25rem 0 !important;\n  border-radius: 0 var(--radius) var(--radius) 0 !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.end-range {\n  border-radius: 0.25rem 0 0 0.25rem !important;\n  border-radius: var(--radius) 0 0 var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.rtl .pdp-day.end-range.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.start-range {\n  border-radius: 0.25rem 0 0 0.25rem !important;\n  border-radius: var(--radius) 0 0 var(--radius) !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.end-range {\n  border-radius: 0 0.25rem 0.25rem 0 !important;\n  border-radius: 0 var(--radius) var(--radius) 0 !important;\n}\n.pdp.pdp-range .pdp-picker.ltr .pdp-day.end-range.start-range {\n  border-radius: 0.25rem !important;\n  border-radius: var(--radius) !important;\n}\n.pdp.rtl {\n  direction: rtl;\n  text-align: right;\n}\n.pdp.rtl .pdp-group :first-child:not(.pdp-inside),\n.pdp.rtl .pdp-group .pdp-inside:first-child + input {\n  border-top-right-radius: 0.25rem;\n  border-top-right-radius: var(--radius);\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-right-radius: var(--radius);\n  margin-left: -1px;\n}\n.pdp.rtl .pdp-group input:last-of-type {\n  border-top-left-radius: 0.25rem;\n  border-top-left-radius: var(--radius);\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-left-radius: var(--radius);\n}\n.pdp.rtl .pdp-group .pdp-icon.pdp-inside:nth-of-type(2) {\n  right: 50%;\n}\n.pdp.rtl .pdp-group .pdp-icon.pdp-inside + input {\n  padding-right: 3rem;\n}\n.pdp.rtl.pdp-dual .pdp-clear:nth-of-type(1) {\n  left: calc(50% + 0.5rem) !important;\n}\n.pdp.rtl .pdp-picker::after {\n  right: 1.2rem;\n}\n.pdp.ltr {\n  direction: ltr;\n  text-align: left;\n}\n.pdp.ltr .pdp-group :first-child:not(.pdp-inside),\n.pdp.ltr .pdp-group .pdp-inside:first-child + input {\n  border-top-left-radius: 0.25rem;\n  border-top-left-radius: var(--radius);\n  border-bottom-left-radius: 0.25rem;\n  border-bottom-left-radius: var(--radius);\n  margin-right: -1px;\n}\n.pdp.ltr .pdp-group input:last-of-type {\n  border-top-right-radius: 0.25rem;\n  border-top-right-radius: var(--radius);\n  border-bottom-right-radius: 0.25rem;\n  border-bottom-right-radius: var(--radius);\n  font-family: sans-serif;\n}\n.pdp.ltr .pdp-group .pdp-clear {\n  left: unset;\n  right: 0.5rem;\n}\n.pdp.ltr .pdp-group .pdp-icon.pdp-inside:nth-of-type(2) {\n  left: 50%;\n}\n.pdp.ltr .pdp-group .pdp-icon.pdp-inside + input {\n  padding-left: 3rem;\n}\n.pdp.ltr.pdp-dual .pdp-clear:nth-of-type(1) {\n  right: calc(50% + 0.5rem) !important;\n}\n.pdp.ltr .pdp-picker::after {\n  left: 1.2rem;\n}\n.pdp.pdp-dual .pdp-picker {\n  left: 50%;\n  transform: translateX(-50%);\n}\n.pdp.pdp-dual .pdp-picker::after {\n  right: unset;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.pdp.pdp-modal .pdp-overlay {\n  background: rgba(0, 0, 0, 0.5) !important;\n}\n.pdp.pdp-modal .pdp-picker {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  animation: startModal 0.1s;\n}\n.pdp.pdp-modal .pdp-picker::after {\n  all: unset !important;\n}\n.pdp * {\n  box-sizing: border-box;\n}\n.pdp svg {\n  vertical-align: middle;\n}\n.pdp input,\n.pdp button {\n  font-family: inherit;\n}\n.pdp .pdp-label {\n  display: inline-block;\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-group {\n  position: relative;\n  display: flex;\n  align-items: stretch;\n  width: 100%;\n}\n.pdp .pdp-group .pdp-input {\n  display: block;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border: 1px solid var(--border-color);\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n  position: relative;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.pdp .pdp-group .pdp-input.pdp-focus {\n  outline: none;\n  border-bottom: 2px solid #26baee;\n  border-bottom: 2px solid var(--primary-color);\n}\n.pdp .pdp-group .pdp-icon {\n  padding: 0.375rem 0.75rem;\n  line-height: 1.5;\n  font-size: 1rem;\n  color: #495057;\n  color: var(--text-color);\n  background: #e9ecef;\n  background: var(--icon-background);\n  border: 1px solid #ced4da;\n  border: 1px solid var(--border-color);\n  max-height: calc(1.5em + 0.75rem + 2px);\n}\n.pdp .pdp-group .pdp-icon:nth-of-type(2) {\n  margin-left: -1px;\n  margin-right: -1px;\n}\n.pdp .pdp-group .pdp-icon.pdp-inside {\n  background: transparent;\n  border: none;\n  position: absolute;\n  z-index: 1;\n}\n.pdp .pdp-group .pdp-clear {\n  border: none;\n  background-color: transparent;\n  position: absolute;\n  left: 0.5rem;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  cursor: pointer;\n  padding: 0 0.5rem;\n}\n.pdp .pdp-overlay {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  z-index: 1000;\n  z-index: var(--z-index);\n  background: transparent;\n  background: var(--overlay-color);\n}\n.pdp .pdp-picker {\n  display: flex;\n  position: absolute;\n  color: #495057;\n  color: var(--text-color);\n  background: #fff;\n  background: var(--background);\n  box-shadow: 1px 1px 8px 1px rgba(116, 116, 116, 0.5);\n  box-shadow: var(--main-box-shadow);\n  z-index: 1001;\n  z-index: calc(var(--z-index) + 1);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  transition: all 1s ease;\n  margin-top: 0.5rem;\n  padding: 0.3rem 0.6rem;\n  animation: start 0.1s;\n}\n.pdp .pdp-picker.ltr {\n  direction: ltr;\n}\n.pdp .pdp-picker.ltr .pdp-header .bottom {\n  flex-direction: row-reverse;\n}\n.pdp .pdp-picker.ltr .pdp-header .bottom > div {\n  display: flex;\n  flex-direction: row-reverse;\n}\n.pdp .pdp-picker.ltr .pdp-select-year,\n.pdp .pdp-picker.ltr .pdp-days,\n.pdp .pdp-picker.ltr .pdp-header .pdp-year,\n.pdp .pdp-picker.ltr .pdp-footer small,\n.pdp .pdp-picker.ltr .pdp-time {\n  font-family: sans-serif !important;\n}\n.pdp .pdp-picker.ltr .pdp-shortcut {\n  border-right: unset;\n  border-left: 1px solid #ced4da;\n  border-left: 1px solid var(--border-color);\n}\n.pdp .pdp-picker.rtl {\n  direction: rtl;\n}\n.pdp .pdp-picker.pdp-top {\n  bottom: calc(1.5em + 0.75rem + 2px);\n  margin-top: unset;\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-picker.pdp-top::after {\n  bottom: unset;\n  top: 100%;\n  transform: rotate(180deg);\n}\n.pdp .pdp-picker.pdp-left {\n  left: 0;\n  right: unset;\n}\n.pdp .pdp-picker.pdp-left::after {\n  right: unset;\n  left: 1.2rem;\n}\n.pdp .pdp-picker.pdp-right {\n  left: unset;\n  right: 0;\n}\n.pdp .pdp-picker.pdp-right::after {\n  left: unset;\n  right: 1.2rem;\n}\n.pdp .pdp-picker:after {\n  content: \"\";\n  position: absolute;\n  bottom: 100%;\n  /* left: 50%; transform: translateX(-50%); */\n  /* left: 1.2rem; */\n  border: solid transparent;\n  border-bottom-color: #fff;\n  border-bottom-color: var(--background);\n  border-width: 0.4rem;\n}\n.pdp .pdp-picker ::selection {\n  all: unset;\n}\n.pdp .pdp-picker .pdp-auto, .pdp .pdp-picker .pdp-auto > div {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-select-year,\n.pdp .pdp-picker .pdp-select-month {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: center;\n  font-size: 0.8rem;\n  background: inherit;\n  list-style: none;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 3.5rem;\n  bottom: 3.5rem;\n  padding: 0;\n  margin: 0;\n  z-index: 1;\n  animation: start 0.1s;\n  overflow: auto;\n}\n.pdp .pdp-picker .pdp-select-year li,\n.pdp .pdp-picker .pdp-select-month li {\n  width: 5rem;\n  height: 4rem;\n  padding: 0.2rem;\n  cursor: pointer;\n  margin: 0.15rem;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  flex: 30% 0;\n}\n.pdp .pdp-picker .pdp-select-year li:not(.disabled):hover,\n.pdp .pdp-picker .pdp-select-month li:not(.disabled):hover {\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n}\n.pdp .pdp-picker .pdp-select-year li.disabled,\n.pdp .pdp-picker .pdp-select-month li.disabled {\n  text-shadow: unset;\n  box-shadow: unset;\n  cursor: default !important;\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-select-year li.selected,\n.pdp .pdp-picker .pdp-select-month li.selected {\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  background: #26baee !important;\n  background: var(--primary-color) !important;\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar {\n  -webkit-appearance: none;\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar:vertical,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar:vertical {\n  width: 0.4rem;\n}\n.pdp .pdp-picker .pdp-select-year::-webkit-scrollbar-thumb,\n.pdp .pdp-picker .pdp-select-month::-webkit-scrollbar-thumb {\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  border: 0.1rem solid white; /* should match background, can't be transparent */\n  background: #ced4da;\n  background: var(--border-color);\n}\n.pdp .pdp-picker .pdp-header > div:first-child {\n  border-bottom: 1px solid #ced4da;\n  border-bottom: 1px solid var(--border-color);\n  margin-bottom: 0.5rem;\n}\n.pdp .pdp-picker .pdp-header .top {\n  padding: 0.75rem 0.3rem 1rem 0.3rem;\n  display: flex;\n  justify-content: space-between;\n  font-size: 0.9rem;\n  direction: rtl;\n}\n.pdp .pdp-picker .pdp-header .top button {\n  border: 0;\n  background: inherit;\n  cursor: pointer;\n  color: #26baee;\n  color: var(--primary-color);\n  padding: 0 0.5rem;\n}\n.pdp .pdp-picker .pdp-header .bottom {\n  padding: 0.3rem;\n  display: flex;\n  align-items: center;\n  height: 3rem;\n  direction: rtl;\n}\n.pdp .pdp-picker .pdp-header .bottom > div {\n  display: flex;\n  flex-grow: 1;\n  justify-content: space-around;\n}\n.pdp .pdp-picker .pdp-header .bottom > div .pdp-month,\n.pdp .pdp-picker .pdp-header .bottom > div .pdp-year {\n  color: #26baee;\n  color: var(--primary-color);\n  font-size: 1rem;\n}\n.pdp .pdp-picker .pdp-header .bottom button {\n  border: 0;\n  background: inherit;\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-header .bottom button:focus {\n  outline: 0;\n}\n.pdp .pdp-picker .pdp-header .bottom .pdp-arrow.disabled {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-header .bottom .pdp-arrow:not(.disabled):hover {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main {\n  position: relative;\n}\n.pdp .pdp-picker .pdp-main .pdp-date {\n  display: flex;\n  justify-content: center;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column {\n  margin: 0 1rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-week {\n  background: inherit;\n  margin-bottom: 0.3rem;\n  display: flex;\n  justify-content: space-around;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-week .pdp-weekday {\n  width: 2.08rem;\n  width: var(--day-dimensions);\n  height: 2.08rem;\n  height: var(--day-dimensions);\n  line-height: 2.08rem;\n  line-height: var(--day-dimensions);\n  font-size: 0.8rem;\n  text-align: center;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  margin: 0.1rem 0;\n  font-size: 0.8rem;\n  width: 2.08rem;\n  width: var(--day-dimensions);\n  height: 2.08rem;\n  height: var(--day-dimensions);\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  padding: 0;\n  cursor: pointer;\n  transition-property: background-color, box-shadow;\n  transition-duration: 0.1s;\n  contain: content;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.friday {\n  color: #26baee;\n  color: var(--primary-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.empty {\n  visibility: hidden;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.start-range, .pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.end-range {\n  background: #26baee;\n  background: var(--primary-color);\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.disabled {\n  box-shadow: unset;\n  text-shadow: unset;\n  cursor: default !important;\n  border-color: transparent;\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.hover {\n  background: #9fe8fa !important;\n  background: var(--secondary-color) !important;\n  color: #000;\n  color: var(--hover-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.in-range {\n  background: #c9f1fb;\n  background: var(--in-range-background);\n  color: #000;\n  color: var(--hover-color);\n  border-radius: 0 !important;\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day:not(.disabled):hover, .pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.today {\n  border: 2px solid #26baee;\n  border: 2px solid var(--primary-color);\n}\n.pdp .pdp-picker .pdp-main .pdp-date .pdp-column .pdp-days .pdp-day.tada {\n  animation: tada 1s;\n  background: #9fe8fa;\n  background: var(--secondary-color);\n  box-shadow: inset 0 4px 9px rgba(0, 0, 0, 0.24);\n  color: #000;\n  position: relative;\n  z-index: 1;\n}\n.pdp .pdp-picker .pdp-main .pdp-time {\n  background: inherit;\n}\n.pdp .pdp-picker .pdp-main .pdp-time:not(.inline) {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-column {\n  display: flex;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-column div {\n  width: 16.6rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment {\n  margin-bottom: 1rem;\n  font-size: 2rem;\n  font-size: calc(2rem * var(--time-scale));\n  display: flex;\n  justify-content: space-around;\n  height: 100%;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment.column-direction {\n  flex-direction: column;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  direction: ltr;\n  width: 100%;\n  padding: 1rem 0;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div.disabled {\n  opacity: 0.3;\n  opacity: var(--disabled-opacity);\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 0 0.8rem;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div button {\n  border: none;\n  background: none;\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-main .pdp-time .pdp-moment > div div button svg {\n  width: 8px;\n  width: calc(8px * var(--time-scale));\n}\n.pdp .pdp-picker .pdp-footer {\n  text-align: center;\n  min-height: 3rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-top: 1px solid #ced4da;\n  border-top: 1px solid var(--border-color);\n  padding: 0.3rem;\n}\n.pdp .pdp-picker .pdp-footer .pdp-today,\n.pdp .pdp-picker .pdp-footer .pdp-submit {\n  font-size: 0.8rem;\n  padding: 0.25rem 0.5rem;\n  margin: 0 0.3rem;\n  line-height: 1.5;\n  color: #fff;\n  color: var(--background);\n  text-decoration: none;\n  border: none;\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  background: #26baee;\n  background: var(--primary-color);\n  cursor: pointer;\n}\n.pdp .pdp-picker .pdp-footer .pdp-today:hover,\n.pdp .pdp-picker .pdp-footer .pdp-submit:hover {\n  filter: brightness(0.9);\n}\n.pdp .pdp-picker .pdp-footer > div {\n  display: flex;\n}\n.pdp .pdp-picker .pdp-shortcut {\n  margin: 0;\n  padding: 0.5rem;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  border-right: 1px solid #ced4da;\n  border-right: 1px solid var(--border-color);\n}\n.pdp .pdp-picker .pdp-shortcut li {\n  margin: 0;\n  padding: 0.5rem 1rem;\n  text-align: center;\n  cursor: pointer;\n  border-radius: 0.25rem;\n  border-radius: var(--radius);\n  margin: 0.25rem 0;\n  color: #000;\n  color: var(--hover-color);\n  font-weight: 500;\n}\n.pdp .pdp-picker .pdp-shortcut li:hover {\n  background: #c9f1fb;\n  background: var(--in-range-background);\n}\n.pdp .pdp-picker .pdp-shortcut li.selected {\n  background: #26baee;\n  background: var(--primary-color);\n  color: #fff;\n  color: var(--background);\n}\n.pdp .pdp-pointer {\n  cursor: pointer;\n}\n.pdp .pdp-auto {\n  margin: auto;\n  position: relative;\n}";
	styleInject(css_248z);

	script.render = render;
	script.__file = "src/components/DatePicker.vue";

	exports.PersianDate = PersianDate_min;
	exports.default = script;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
