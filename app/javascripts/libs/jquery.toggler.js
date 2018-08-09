/*
 *  Project: Toggler - jQuery Plugin
 *  Description:
 *  Author: Yu Ishihara (http://12px.com)
 *  License: MIT
 *  Example:

$(function() {
  $('[data-toggler]').toggler();
  $('#targetA').on('on.toggler', function(event) {
    console.log('add');
  });
  $('#targetA').on('off.toggler', function(event) {
    console.log('remove');
  });
});

 */

import $ from 'jquery';

;( function( $, window, document, undefined ) {
  "use strict";

  // plugin settings
  var PLUGIN_NAME = 'toggler';
  // var DATA_KEY = '12px.'+PLUGIN_NAME;
  var EVENT_KEY = '.' + PLUGIN_NAME;
  var Event = {
    ON: 'on' + EVENT_KEY,
    OFF: 'off' + EVENT_KEY
  };
  var defaults = {
    triggerClassName: 'is-added',
    targetClassName: 'is-disabled',
    target: null
  };

  function Plugin ( element, options ) {
    this.element = element;
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = PLUGIN_NAME;
    this.init();
  }

  $.extend( Plugin.prototype, {
    init: function() {
      var $trigger = $(this.element);
      if($(this.element).attr('data-target')) {
        this.target = $(this.element).attr('data-target');
      } else {
        this.target = $trigger.attr('href');
      }
      var $target = $(this.target);
      if($(this.element).attr('data-toggler')) {
        this.settings.targetClassName = $(this.element).attr('data-toggler');
      }
      $trigger.attr('aria-controls', this.target);

      var settings = this.settings;
      $trigger.on('click', function(event) {
        event.preventDefault();
        if($target.hasClass(settings.targetClassName)) {
          $target.removeClass(settings.targetClassName);
          $target.trigger($.Event(Event.OFF));
          $trigger.removeClass(settings.triggerClassName);
        } else {
          $target.addClass(settings.targetClassName);
          $target.trigger($.Event(Event.ON));
          $trigger.addClass(settings.triggerClassName);
        }
      });
    }
  });

  $.fn[ PLUGIN_NAME ] = function( options ) {
    return this.each( function() {
      if ( !$.data( this, PLUGIN_NAME ) ) {
        $.data( this, PLUGIN_NAME, new Plugin( this, options ) );
      }
    });
  };

  $(function() {
    $('[data-toggler]').toggler();
  });
})( $, window, document );
