$(function () {
  // change body structure to custom footer
  $('#x-layout a').on('click', function (e) {
    // set layout class into wrapper instead of body
    $('#wrapper').removeClass();
    var layout = this.hash.slice(1);
    layout == 'fixed'
      ? $('#wrapper').addClass('container')
      : $('#wrapper').addClass('container container-fluid');

    // remove all body's classes
    $('#express-admin').removeClass();
    return false;
  });

  // custom footer
  var footer = $('footer p small a');
  footer.attr('id', 'footer-a');
  footer.attr('href', 'https://www.facebook.com/Lifepedia-1786329371607767');
  footer.text("©2016 Life Pedia");
});
