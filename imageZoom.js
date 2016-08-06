;(function(){
	$.fn.ImageZoom = function(settings){
		var arr = [];
		$(this).each(function(){
			var options = $.extend({target: $(this)}, settings);
			var imageZoom = new ImageZoom();
			imageZoom.init(options);
			arr.push(imageZoom);
		});
		return arr;
	}
	
	var ImageZoom = function() {};
	
	ImageZoom.prototype = {
		init: function(args){
			this.settings = $.extend({
				width: 100,
				height: 100,
				times: 2,
				handle: false,
				callback: null
			}, args);
			this.zoomArea = $('#zoomArea');
			this.bindEvent();
		},
		bindEvent: function(){
			this.zoomArea.on('touchmove', function(e){
				return this.event['zoommove'].call(this.zoomArea, e, this);
			}.bind(this));
			
			var isMouseClicked = false;
			$('body').on('mousedown', $('#zoomArea'), function(e){
				isMouseClicked = true;
			});
			$('body').on('mouseup', $('#zoomArea'), function(e){
				isMouseClicked = false;
				return this.event['mouseup'].call(this.zoomArea, e, this);
			}.bind(this));
			
			$('body').on('mousemove', $('#zoomArea'), function(e){
				return isMouseClicked && this.event['zoommove'].call(this.zoomArea, e, this);
			}.bind(this));
			
			$(this.settings.target).on('touchstart', function(e){
				this.event['mousedown'].call(this.settings.target, e, this);
			}.bind(this));
			
			$(this.settings.target).on('mousedown', function(e){
				this.event['mousedown'].call(this.settings.target, e, this);
			}.bind(this));
			$(this.settings.target).on('touchmove', function(e){
				return this.event['mousemove'].call(this.settings.target, e, this);
			}.bind(this));
			$(this.settings.target).on('mousemove', function(e){
				return isMouseClicked && this.event['mousemove'].call(this.settings.target, e, this);
			}.bind(this));
			$(this.settings.target).on('touchend', function(e) {
				return this.event['mouseup'].call(this.settings.target, e, this);
			}.bind(this));
			$(this.settings.target).on('mouseup', function(e) {
				return this.event['mouseup'].call(this.settings.target, e, this);
			}.bind(this));
			$('body').on('mouseup', function(e){
				if($('#zoomArea').is(':visible')){
					$('#zoomArea').hide();
				}
			});
		},
		
		event: {
			zoommove: function(e, _this){
				var touch = e.changedTouches ? e.changedTouches : e;
				_this.setPosition(touch.pageX, touch.pageY, _this.settings.target);
				return false;
			},
			mousedown: function(e, _this){
				var touch = e.changedTouches ? e.changedTouches : e;
				_this.createZoom.call(_this, this);
				_this.setPosition(touch.pageX, touch.pageY, this);
			},
			mousemove: function(e, _this){
				var touch = e.changedTouches ? e.changedTouches : e;
				_this.setPosition(touch.pageX, touch.pageY, this);
				return false;
			},
			mouseup: function(e, _this){
				_this.removeZoom();
				return false;
			}
		},
		
		removeZoom: function(){
			this.zoomArea.hide();
		},
		
		createZoom: function(pic){
			this.zoomArea = $('<div id="zoomArea" style="position:absolute;background:none;"/>');
			$('body').append(this.zoomArea);
			this.zoomArea.css({
				'position': 'absolute',
				'background': 'url(' + $(pic).attr('src') + ') no-repeat',
				'borderRadius': this.settings.width + 'px ' + this.settings.height + 'px',
				'border': '1px solid #ccc'
			}).width(this.settings.width).height(this.settings.height);
			this.zoomArea.show();
		},
		
		setPosition: function(x, y, pic){
			var offset = $(pic).offset();
			var picHeight = $(pic).height();
			var picWidth = $(pic).width();
			
			x = Math.max(Math.min(x, offset.left + picWidth), offset.left);
			y = Math.max(Math.min(y, offset.top + picHeight), offset.top);
			
			var startPoint = {
				x: x - this.settings.width / 2,
				y: y - this.settings.height / 2
			};
			var zoomSize = {
				height: picHeight * this.settings.times,
				width: picWidth * this.settings.times 
			};
			var showPoint = {
				x: (x - offset.left) * this.settings.times - this.settings.width / 2,
				y: (y - offset.top) * this.settings.times - this.settings.height / 2
			};
			this.zoomArea.css({
				left: startPoint.x,
				top: startPoint.y,
				'backgroundPosition': -showPoint.x + 'px ' + (-showPoint.y) + 'px',
				'backgroundSize': zoomSize.width + 'px ' + zoomSize.height + 'px'
			});
		}
	}
})(jQuery);