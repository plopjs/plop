import co from 'co';
import actionInterfaceTest from './_common-action-interface-check';
import addFile from './_common-action-add-file';

export default co.wrap(function* (data, cfg, plop) {
	const interfaceTestResult = actionInterfaceTest(cfg);
	if (interfaceTestResult !== true) { throw interfaceTestResult; }

	return yield addFile(data, cfg, plop);
});
