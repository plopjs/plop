module.exports = (function () {
	'use strict';
	function listOptions(plopList) {
		console.log('#### AVAILABLE OPTIONS ####\n -', plopList.join('\n - '));
		process.exit(0);
	}

	return {
		listOptions: listOptions
	};
})();