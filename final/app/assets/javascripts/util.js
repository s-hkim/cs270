/*
@author: sk342

some miscellaneous utilities
*/

function Date_setJD(jd) {
  this.setTime(Math.round((jd - 2440587.5) * 86400000));
  return this;
};
function Date_getJD() {
  return this.getTime() / 86400000 + 2440587.5;
};

var util = {
  /*
  functions to convert dates to Julian ephemeris dates
  */
  // https://stackoverflow.com/questions/26370688/convert-a-julian-date-to-regular-date-in-javascript
  jdUTC : function (Y, M, D, H, m, s, ms) { // M is Jan = 0, Feb = 1, etc.
    // Add local hour offset to `H` or minute offset to `m` for local time
    return Date.UTC.apply(Date, arguments) / 86400000 + 2440587.5;
  },
  dateFromJD : function(jd, isValue) { // Any time of day to nearest millisecond
    var obj = new Date();
    obj.getJD = Date_getJD;
    obj.setJD = Date_setJD;

    if (arguments.length) obj.setJD(jd);
    if (isValue) obj.valueOf = Date_getJD;

    return obj;
  },
  dateToJD : function(date) {
    date.getJD = Date_getJD;
    date.setJD = Date_setJD;
    return date;
  },

  toRadians : function(angle) {
    return angle * (Math.PI / 180);
  }
};
