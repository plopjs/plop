plop.load
=========

`plop.load` can be used to load generators, actionTypes, helpers, and partials from a other plopfiles that are in your project or on NPM (`plop-pack`). `plop.load` executes async when used within es6 modules and requires `async/await`. Example code below.

### plop.load([targets](#targets), [[config](#config)], [[include](#include)])

#### targets
- **type:** `String` or `Array<String>`
- **required**

`targets` is the location or locations of the plopfile(s) to be loaded. These locations can be file paths (absolute or relative to the current plopfile) or the node module name of the `plop-pack` that should be loaded.

#### config
- **type:** `Object`
- **optional**

`config` is an object that can be passed to the plopfile or `plop-pack` when they are run. This allows the consumer of the plopfile or `plop-pack` to configure certain aspects of its functionality. To know what properties should be in this object, see the documentation provided by the author.

#### include
- **type:** `Object` or `Boolean`
- **default:** `{ generators:true, helpers:false, partials:false, actionTypes:false }`
- **optional**

If `include` is `true` all assets from the target will be included (none if `false`). Otherwise, `include` should be an object that can contain 4 properties (`generators`, `helpers`, `partials`, and `actionTypes`). Each of these properties should have an [`IncludeDefinition`](#Interface-IncludeDefinition) as its value. Most of the time this object is not needed because the plopfile or `plop-pack` is able to specify a default [`IncludeDefinition`](#Interface-IncludeDefinition) to be used.

#### Interface `IncludeDefinition`
- **Boolean:** `true` will include all assets, `false` will include non of them.
- **Array:** a list of asset names that should be included. any assets that don't match a name in this list will be skipped.
- **Object:** the include object allows the consumer to rename assets when for use in their own plopfile. the property name in this object is the asset name, the value is the name that will be given to the asset when loaded.

## Examples
*Usage in es6 modules*
```javascript
// plop.load has to be within an async function
export default async function(plop) {
	// Use await to actually load the external files
	await plop.load('./plopfiles/component.js`);
}
```
*load via a path*
```javascript
	// loads all 5 generators, no helpers, actionTypes or partials (even if they exist)
	plop.load('./plopfiles/component.js');
```
*load all assets from a path*
```javascript
	// loads all 5 generators, all helpers, actionTypes and partials (if they exist)
	plop.load('./plopfiles/component.js', {}, true);
```
*load via a path with a custom include config*
```javascript
	// loads all helpers, no generators, actionTypes or partials (even if they exist)
	plop.load('./plopfiles/component.js', {}, { helpers: true });
```
*load via a path with a limited include*
```javascript
	// loads only the "js-header" helper, no generators, actionTypes or partials (even if they exist)
	plop.load('./plopfiles/component.js', {}, { helpers: ['js-header'] });
```
*load via a path with config object*
```javascript
	// the component.js module will receive the config object and do something
	// example: it could use it to alter which templates it will use (es6)
	//          and prefix all generator names with 'foo'
	plop.load('./plopfiles/component.js', { es6: true, namePrefix: 'foo' });
```
*load via [npm module](https://www.npmjs.com/package/plop-pack-fancy-comments)*
> this module [configures a default include definition](https://github.com/amwmedia/plop-pack-fancy-comments/blob/master/index.js#L13)

```javascript
	// loads all 3 helpers
	plop.load('plop-pack-fancy-comments');
```
*load via npm module with a renaming include config*
```javascript
	// loads only the header helper, no generators, actionTypes or partials (even if they exist)
	// within the plopfile and templates, the "js-header" helper is referenced as "titleComment"
	plop.load('plop-pack-fancy-comments', {}, { helpers: {'js-header': 'titleComment'} });
```
*load via npm module AND path*
```javascript
	// uses the default include config for each item
	plop.load([
		'plop-pack-fancy-comments',
		'./plopfiles/component.js'
	]);
```
