/**
 * Modo Grid
 * =========
 * Use this element to present information in a tabular structure.
 * Unlike the modoCore.List element, data is separated into single columns in the grid element.
 * You can specify renderers or presentor elements for every column separately.
 * The Modo Grid supports arrays and Backbone.Collection as datasources.
 * @param params
 * @constructor
 */
(function (){
	'use strict';

	var modoCore,
		$;

	$ = jQuery;

	//commonJS and AMD modularization - try to reach the core.
	if(typeof modo !== 'undefined'){
		modoCore = modo;
	} else {
		if(typeof require === 'function'){
			modoCore = require('modo');
		}
	}

	modoCore.defineElement('Grid', ['grid', 'grid-header', 'grid-row', 'grid-cell', 'grid-column-'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		this.addClass(modoCore.Grid.classNames[0]);

		/*var params = {
		 columns: [
		 {
		 key: 'some_key',            //The key to use from the datasource.
		 title: 'The column header', //HTML possible
		 render: function(d){
		 return d.toString();    //HTML, or a Modo Element is expected. Will be wrapped into a additional DIV.
		 },
		 required: false             //Decide if this column can be user-selected or must be shown.
		 }
		 ],
		 */
		/**
		 * The prepare function is called before each column render.
		 * You can make up own columns out of data which is generated dynamically upon table creation.
		 * @param d
		 * @return {*}
		 */
		/*
		 prepare: function(d){
		 return d;
		 },
		 visibleColumns: ['key_a', 'key_b'], //Predefined column selection
		 rowTag: 'div',
		 cellTag: 'div'
		 };*/

		var settings,
			that,
			ids;

		settings = {
			data: null,
			collector:      params.collector || function (c){
				return c.filter(function (){
					return true;
				});
			},
			updateOn:       params.updateOn || ['add', 'change', 'remove', 'sort'],
			columns: params.columns,
			prepare:        params.prepare || function (d){
				if(d instanceof Backbone.Model){
					return d.toJSON();
				}
				return d;
			},
			visibleColumns: params.visibleColumns || null,
			rowTag:         params.rowTag || 'div',
			cellTag:        params.cellTag || 'div'
		};

		that = this;

		//Prevent undefined values.
		function prepareColumns(){
			//Remove all previously attached event listeners.
			that.el.off('.itemEvent', '**');

			_.each(settings.columns, function (c){
					var chain,
						columnClassName;

					if(typeof c.render === 'undefined'){
						c.render = function (d){
							return d.toString();
						};
						c.title = c.title || '';
					}

					if(c.itemEvents){
						for (var evt in c.itemEvents) {
							chain = evt.split(' ');
							columnClassName = modoCore.cssPrefix + modoCore.Grid.classNames[4] + c.key;

							that.el.on(chain.shift() + '.itemEvent', '.' + columnClassName + ' ' + chain.join(' '), (function (columnData, evt){
								return function (e){
									var $this = $(this),
										tableRowElement,
										clickedIndex,
										index = 0,
										data,
										cellData,
										all;

									tableRowElement = $this.parents('.' + modoCore.cssPrefix + modoCore.Grid.classNames[2]);
									all = that.el.find('.' + modoCore.cssPrefix + modoCore.Grid.classNames[2]).not('.' + modoCore.cssPrefix + modoCore.Grid.classNames[1]);

									//Loop through all created table rows to find ours.
									clickedIndex = -1;
									_.every(all, function (e){
										if($(e).is(tableRowElement)){
											clickedIndex = index;
											return false;
										}
										index++;
										return true;
									});

									if(clickedIndex === -1){
										throw new Error('Weird. I could not find the matching row. Please report this!');
									}

									if(settings.data instanceof Backbone.Collection){
										index = ids[clickedIndex];
										data = settings.data.get(index);
									} else {
										if(settings.data instanceof Array){
											index = clickedIndex;
											data = settings.data[clickedIndex];
										} else {
											throw new Error('Not implemented.');
										}
									}

									if(data instanceof Backbone.Model){
										cellData = data.get(columnData.key);
									} else {
										cellData = data[columnData.key];
									}

									if(typeof columnData.itemEvents[evt] === 'function'){
										columnData.itemEvents[evt].call(that, e, index, cellData, data, columnData.key);
									} else {
										that.trigger('item:' + columnData.itemEvents[evt], e, index, cellData, data, columnData.key);
									}
								};
							})(c, evt));
						}
					}
				}
			)
			;
		}

		prepareColumns();

		/**
		 * Set up new column data for the grid.
		 * @param columnData
		 */
		this.setColumns = function (columnData){
			settings.columns = columnData;
			prepareColumns();
			this.update();
			return this;
		};

		this.set = function (data, options){
			var that;

			that = this;

			if(!(data instanceof Backbone.Collection) && !(data instanceof Array)){
				throw new Error('Only data type Array or Backbone.Collection allowed. Yours is: ' + typeof settings.data);
			}

			settings.data = data;
			this.stopListening();

			if(data instanceof Backbone.Collection){
				this.listenTo(data, settings.updateOn.join(' '), function (){
					that.update(options);
				});
			}

			this.update();
		};

		/**
		 * Will trigger a re-render of the grid.
		 * @param options
		 */
		this.update = function (options){
			var html = '',
				rowHtml = '',
				rowData,
				dataset,
				columnPack = [],
				silent,
				i,
				c,
				result,
				cellCount = 0,
				$cells,
				that = this,
				modoElements = [],
				cH = modoCore.cssPrefix + modoCore.Grid.classNames[1],
				cR = modoCore.cssPrefix + modoCore.Grid.classNames[2],
				cC = modoCore.cssPrefix + modoCore.Grid.classNames[3],
				cClm = modoCore.cssPrefix + modoCore.Grid.classNames[4];

			options = options || {};

			silent = options.silent;

			ids = [];

			function makeRow(content, isHeader){
				return '<' + settings.rowTag + ' class="' + cR + (isHeader ? ' ' + cH : '') + '">' + content + '</' + settings.rowTag + '>';
			}

			function makeCell(content, column){
				cellCount++;
				return '<' + settings.cellTag + ' class="' + cC + ' ' + cClm + column + '">' + content + '</' + settings.cellTag + '>';
			}

			if(settings.visibleColumns === null){
				columnPack = settings.columns;
			} else {
				for (i = 0; i < settings.columns.length; i++) {
					if(_.indexOf(settings.visibleColumns, settings.columns[i].key) !== -1){
						columnPack.push(settings.columns[i]);
					}
				}
			}

			_.each(columnPack, function (c){
				rowHtml += makeCell(c.title, c.key);
			});
			html = makeRow(rowHtml, true);

			dataset = settings.collector(settings.data);

			_.each(dataset, function (e, index){
				var key;

				ids.push(e.id || e.cid || index);
				rowHtml = '';
				rowData = settings.prepare(e);
				for (i = 0; i < columnPack.length; i++) {
					c = columnPack[i];
					if(c.key !== null && c.key !== undefined){
						if(typeof rowData[c.key] === 'undefined'){
							throw new Error('Undefined field "' + c.key + '" in row data.');
						}
						result = c.render(rowData[c.key], rowData);
					} else {
						result = c.render(undefined, rowData);
					}
					if(modoCore.isElement(result)){
						c.isModo = true;
						modoElements.push([cellCount, result]);
						if(typeof c.events !== 'undefined'){
							for (key in c.events) {
								if(!c.events.hasOwnProperty(key)){
									continue;
								}
								that.listenTo(result, key, function (e, v){
									c.events[key].call(this, e, v, rowData);
								});
							}
						}
						result = '';
					}
					rowHtml += makeCell(result, c.key);
				}
				html += makeRow(rowHtml);
			});

			this.el.html(html);

			$cells = this.el.find('.' + modoCore.cssPrefix + modoCore.Grid.classNames[3]);
			for (i = 0; i < modoElements.length; i++) {
				$cells.eq(modoElements[i][0]).append(modoElements[i][1].el);
			}

			if(!silent){
				this.trigger('update');
			}

			return this;
		};

		this.set(params.data, {silent: true});

		modoCore._stat('Grid');
	})
		.inheritPrototype('Element');


	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Grid;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define(function (){
				return modoCore.Grid;
			});
		}
	}
})();