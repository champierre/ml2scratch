import $ from 'jquery'
import 'bootstrap'

$(function () {

  // fileを選択したら名前を表示させる
  $('[data-file]').each(function(index, el) {
    $(el).on('change', function(e) {
      let filename = $(e.currentTarget).val().split('\\').pop()
      let element = $(e.currentTarget).closest('.input-file').find('[data-file-name]')[0]
      element.innerText = filename;
      $(e.currentTarget).closest('.input-file').addClass('has-file')
    });
  });
})