module.exports = function (plop, config = {}) {

	const cfg = Object.assign({prefix: ''}, config);

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	plop.setHelper(`${cfg.prefix}helper1`, (t) => `helper 1: ${t}`);
	plop.setHelper(`${cfg.prefix}helper2`, (t) => `helper 2: ${t}`);
	plop.setHelper(`${cfg.prefix}helper3`, (t) => `helper 3: ${t}`);

	plop.setPartial(`${cfg.prefix}partial1`, 'partial 1: {{name}}');
	plop.setPartial(`${cfg.prefix}partial2`, 'partial 2: {{name}}');
	plop.setPartial(`${cfg.prefix}partial3`, 'partial 3: {{name}}');

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator(`${cfg.prefix}generator1`, {
		actions: [{type:'add', path:'src/{{name}}.txt', template: ''}]
	});
	plop.setGenerator(`${cfg.prefix}generator2`, {
		actions: [{type:'add', path:'src/{{name}}.txt', template: ''}]
	});
	plop.setGenerator(`${cfg.prefix}generator3`, {
		actions: [{type:'add', path:'src/{{name}}.txt', template: ''}]
	});

};
