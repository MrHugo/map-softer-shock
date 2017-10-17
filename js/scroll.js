var smoothScroll = function( anchor, duration ) {
  var duration = duration || 1000;
  var anchor = anchor || '#';
  var pageHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight
  var top = anchor != '#' ? $( anchor ).offset().top - pageHeight / 4 : 0;
  $( 'html, body' ).animate( { scrollTop: top }, duration );
}
