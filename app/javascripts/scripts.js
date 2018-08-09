import $ from 'jquery'
import 'bootstrap'
import './libs/jquery.toggler.js'

$(function () {
  console.log('ready')

  $('[data-file]').each(function(index, el) {
    $(el).on('change', function(e) {
      let filename = $(e.currentTarget).val().split('\\').pop()
      let element = $(e.currentTarget).closest('.input-file').find('[data-file-name]')[0]
      element.innerText = filename;
      $(e.currentTarget).closest('.input-file').addClass('has-file')
    });
  });
})