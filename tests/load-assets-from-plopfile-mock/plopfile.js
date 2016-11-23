module.exports = function (plop, config = {}) {

	const cfg = Object.assign({prefix: ''}, config);

	plop.setHelper(`${cfg.prefix}helper1`, (t) => `helper 1: ${t}`);
	plop.setHelper(`${cfg.prefix}helper2`, (t) => `helper 2: ${t}`);
	plop.setHelper(`${cfg.prefix}helper3`, (t) => `helper 3: ${t}`);

	plop.setPartial(`${cfg.prefix}partial1`, 'partial 1: {{name}}');
	plop.setPartial(`${cfg.prefix}partial2`, 'partial 2: {{name}}');
	plop.setPartial(`${cfg.prefix}partial3`, 'partial 3: {{name}}');

	plop.setActionType(`${cfg.prefix}actionType1`, () => 'test');

	const generatorObject = { actions: [{type:'add', path:'src/{{name}}.txt' }] };
	plop.setGenerator(`${cfg.prefix}generator1`, generatorObject);
	plop.setGenerator(`${cfg.prefix}generator2`, generatorObject);
	plop.setGenerator(`${cfg.prefix}generator3`, generatorObject);

};
