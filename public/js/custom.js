$(document).ready(function() {
    $('.side').addClass('affix');
    $('.mason').isotope();

    $(window).resize(function() {
        //992 is the medium breakpoint
        if ($(window).width() >= 992) {
            $('.side').addClass('affix');
            $('.mason').isotope();
        }
        
        else {
            $('.side').removeClass('affix');
            $('.mason').isotope('destroy');
        }
        
        //set sidebar width to parent column width
        $('.side').width($('.side-parent').width());
    }).resize();
    
    $('#hours').slider();
});