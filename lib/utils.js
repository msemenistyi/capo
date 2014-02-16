module.exports.logWithNewLineOdds = function(array){
	for (var i = 0, l = array.length; i < l; i = i + 2){
		console.log(array[i], array[i+1]);
	}
}

module.exports.formTitleString = function(count, baseString){
	var str;
	if (count === 0){
		str = baseString + 's';
	} else if (count % 10 === 1 && count !== 11){
		str = baseString + ':';
	} else {
		str = baseString + 's:';
	}
	return str.toUpperCase();
}