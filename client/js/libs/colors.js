var stripColors = function(str) {
  return str.replace(/(\x03\d{0,2}(,\d{0,2})?|\u200B)/g, '');
};

var stripStyle = function(str) {
  return str.replace(/[\x0F\x02\x16\x1F]/g, '');
};

var stripColorsAndStyle = function(str) {
  return stripColors(stripStyle(str));
};

window.color = {
  stripColors: stripColors,
  stripStyle: stripStyle,
  stripColorsAndStyle: stripColorsAndStyle
}
