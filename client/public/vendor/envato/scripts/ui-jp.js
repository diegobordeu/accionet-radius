/*eslint-disable*/
(function ($, MODULE_CONFIG) {
  	"use strict";

	$.fn.uiJp = function(){

		var lists  = this;

        lists.each(function()
        {
        	var self = $(this);
			var options = eval('[' + self.attr('ui-options') + ']');
			if ($.isPlainObject(options[0])) {
				options[0] = $.extend({}, options[0]);
			}

      if(self.attr('ui-jp') != 'chart') {
        uiLoad.load(MODULE_CONFIG[self.attr('ui-jp')]).then( function(){
          self[self.attr('ui-jp')].apply(self, options);

          if(self.attr('ui-jp') == 'parsley') {
            window.Parsley.addValidator('weblink', {
              validateString: function(value) {
                return value.startsWith('http://') || value.startsWith('https://');
              },
              messages: {
                es: 'Debe empezar con http:// o https://',
                en: 'It must start with http:// or https://'
              }
            });
          }
        });
      }


        });

        return lists;
	}

})(jQuery, MODULE_CONFIG);
