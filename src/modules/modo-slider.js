/**
 * Modo Slider
 * ===========
 * The slider element can be used to set up numeric values.
 * It has a horizontal and vertical direction.
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

	function cn(index, prefixed){
		if(prefixed !== undefined){
			return modoCore.Slider.classNames[index];
		}
		return modoCore.cssPrefix + modoCore.Slider.classNames[index];
	}

	modoCore.defineElement('Slider', ['slider', 'slider-vertical', 'slider-range', 'slider-value', 'slider-plug1', 'slider-plug2'], function (params){
		params = params || {};

		modoCore.Element.call(this, params);

		var that,
			settings,
			$uiValue,
			$uiPlug1,
			$uiPlug2,
			draggedPlug;

		that = this;
		settings = {
			direction: _.indexOf(['horizontal', 'vertical'], params.direction) !== -1 ? params.direction : 'horizontal',
			range: params.range ? true : false,
			minValue: params.minValue || 0,
			maxValue: params.maxValue || 100,
			value1:   params.value || params.value1 || 0,
			value2:   params.value2 || 0,
			step:     params.step || 1
		};

		if(params.model){
			if(settings.range){
				params.modelKey = params.modelKey1;
			} else {
				params.value1 = params.value;
			}

			if(!params.modelKey){
				if(typeof params.value1 === 'function'){
					params.model.on('change', function (){
						that.set(params.value1.call(that, params.model));
					});
				} else {
					throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
				}
			} else {
				params.value1 = params.model.get(params.modelKey);

				params.model.on('change:' + params.modelKey, function (){
					that.set(params.model.get(params.modelKey));
				});
			}

			if(settings.range){
				if(!params.modelKey2){
					if(typeof params.value2 === 'function'){
						params.model.on('change', function (){
							that.set(params.value2.call(that, params.model));
						});
					} else {
						throw new Error('Trying to bind to model, but no modelKey and no valueFunction given');
					}
				} else {
					params.value2 = params.model.get(params.modelKey2);

					params.model.on('change:' + params.modelKey2, function (){
						that.set(params.model.get(params.modelKey2));
					});
				}
			}

		}

		$uiValue = $('<div class="' + cn(3) + '"></div>');
		$uiPlug1 = $('<div class="' + cn(4) + '"></div>');

		this.el.append($uiValue, $uiPlug1);

		this.disabled = false;

		this.addClass(cn(0, false));
		if(settings.direction === 'vertical'){
			this.addClass(cn(1, false));
		}

		if(settings.range){
			this.addClass(cn(2, false));
			$uiPlug2 = $('<div class="' + cn(5) + '"></div>');
			this.el.append($uiPlug2);
		}

		this.get = function (){
			if(settings.range){
				return [settings.value1, settings.value2];
			}
			return settings.value1;
		};

		this.set = function (values, options){
			options = options || {silent: false};

			if(settings.range){
				values.sort();
				settings.value1 = values[0];
				settings.value2 = values[1];
				return;
			}
			settings.value1 = values;

			update(options.silent);

			return this;
		};

		this.setMin = function (value){
			settings.minValue = value;

			return this;
		};

		this.setMax = function (value){
			settings.maxValue = value;

			return this;
		};

		/**
		 * Updates the elements DOM nodes.
		 */
		function update(silent){
			var p1Percent,
				p2Percent,
				vPercent,
				vPos,
				vert;

			vert = settings.direction === 'vertical';

			p1Percent = (settings.value1 - settings.minValue) / ((settings.maxValue - settings.minValue) / 100);

			if(settings.range){
				p2Percent = (settings.value2 - settings.minValue) / ((settings.maxValue - settings.minValue) / 100);

				vPos = p1Percent;
				vPercent = p2Percent - p1Percent;
				if(!vert){
					$uiPlug2.css({
						left: p2Percent + '%'
					});
				} else {
					$uiPlug2.css({
						bottom: p2Percent + '%'
					});
				}
				if(!silent){
					that.trigger('change', [settings.value1, settings.value2]);
				}
				if(params.model){
					if(params.modelKey){
						params.model.set(params.modelKey, settings.value1);
					}
					if(params.modelKey2){
						params.model.set(params.modelKey2, settings.value2);
					}
				}
			} else {
				vPos = 0;
				vPercent = p1Percent;
				if(!silent){
					that.trigger('change', settings.value1);
				}
				if(params.model){
					if(params.modelKey){
						params.model.set(params.modelKey, settings.value1);
					}
				}
			}

			if(!vert){
				$uiValue.css({
					left:  vPos + '%',
					width: vPercent + '%'
				});
				$uiPlug1.css({
					left: p1Percent + '%'
				});
			} else {
				$uiValue.css({
					bottom: vPos + '%',
					height: vPercent + '%'
				});
				$uiPlug1.css({
					bottom: p1Percent + '%'
				});
			}
		}

		update(true);

		function updateValue(plugNr, pos){
			var begin,
				end,
				v,
				vX,
				s;

			v = settings['value' + plugNr];

			if(settings.direction === 'horizontal'){
				begin = that.el.offset().left;
				end = that.el.width();
			} else {
				begin = that.el.offset().top;
				end = that.el.height();
			}

			if(pos < begin){
				pos = begin;
			}
			if(pos > end + begin){
				pos = end + begin;
			}

			if(settings.direction === 'vertical'){
				pos = (begin + end) - (pos - begin);
			}

			v = settings.minValue + ((pos - begin) / (end / 100)) * ((settings.maxValue - settings.minValue) / 100);

			v = Math.floor(v / settings.step) * settings.step;

			//Weird attempt to "fix" misbehaving floating point numbers.
			s = settings.step.toString().split('.');
			if(s.length > 1){
				vX = v.toString().split('.');
				if(vX.length > 1 && vX[1].length > s[1].length){
					v = Number(vX[0] + '.' + vX[1].substr(0, s[1].length));
				}
			}

			if(v < settings.minValue){
				v = settings.minValue;
			}
			if(v > settings.maxValue){
				v = settings.maxValue;
			}

			if(settings.range){
				if(plugNr === 1 && settings.value2 < v){
					vX = settings.value2;
					settings.value2 = v;
					settings.value1 = vX;
					draggedPlug = plugNr = 2;
				}

				if(plugNr === 2 && settings.value1 > v){
					vX = settings.value1;
					settings.value1 = v;
					settings.value2 = vX;
					draggedPlug = plugNr = 1;
				}
			}

			settings['value' + plugNr] = v;

			update();
		}

		function mouseMove(e){
			stop(e);
			updateValue(draggedPlug, settings.direction === 'horizontal' ? e.clientX : e.clientY);
		}

		function mouseUp(){
			$(document).off('mousemove', mouseMove).off('mouseup', mouseUp);
		}

		function stop(e){
			e.preventDefault();
			e.stopPropagation();
		}

		this.el.on('mousedown', '.' + cn(4) + ',.' + cn(5), function (e){
			var $this;

			stop(e);

			if(that.disabled){
				return;
			}

			$this = $(this);

			$(document).on('mousemove', mouseMove).on('mouseup', mouseUp);

			draggedPlug = $this.hasClass(cn(4)) ? 1 : 2;
		});

		modoCore._stat('Slider');
	})
		.inheritPrototype('Element')
		.extendPrototype({
			/* PROTOTYPE FUNCTIONS HERE */
			disable: function (){
				this.addClass(modo.Element.classNames[2]);
				this.disabled = true;
				this.trigger('disabled');
				return this;
			},

			enable: function (){
				this.removeClass(modo.Element.classNames[2]);
				this.disabled = false;
				this.trigger('enabled');
				return this;
			}
		});

	if(typeof exports !== 'undefined'){
		//commonJS modularization
		exports = modoCore.Slider;
	} else {
		if(typeof define === 'function'){
			//AMD modularization
			define('modo-slider', [], function (){
				return modoCore.Slider;
			});
		}
	}
})();