//globals go here
var mentors = [];
var mentRows = {};
var mentee = null;
var auth = false;
var boxes = {};
var search = '';
var loaded = false;
var loadedCt = false;
var suggestMode = false;
var sType = 'name';
var lsType = 'name';
var MDW = 992;

//these are helper functions so I have defined them
//in the variable style rather than the function style

var filtered = function(object) {
    if (object === boxes) return true;
    var objAttrs = _.pick(object, _.keys(boxes));
    return _.isEqual(objAttrs, boxes);
};

var searched = function(object) { // search
    if (search.length === 0) return true;
    
    var lower = search.toLowerCase();
    var keys = Object.keys(object);
    
    for (var i = 0; i < keys.length; i += 1) {
        if (typeof object[keys[i]] !== 'string') continue;
        value = object[keys[i]].toLowerCase();
        if (value.indexOf(lower) !== -1) return true
    }
    
    //not found
    return false
};

var getSimilarity = function(mOne, mTwo, filters) {
    var same = 0; var size = filters.length;
    _.each(filters, function(filter) {
        if (mOne[filter] === mTwo[filter])
            same += 1; // props match
    });
    
    var score = same / size * 100.0;
    return Math.round(score);
};

//trim and JSON newlines to BR tags
var toHTML = function(JSONString) {
    JSONString = JSONString.trim();
    JSONString = JSONString.replace(/\n/g, '<br>');
    return JSONString;
};

//commas to newline characters
var CTON = function(cString) {
    cString = cString.split(', ').join('\n');
    return cString;
};

//self-explanatory pretty much
var getScrollBarWidth = function() {
  var inner = document.createElement('p');
  inner.style.width = "100%";
  inner.style.height = "200px";

  var outer = document.createElement('div');
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild (inner);

  document.body.appendChild(outer);
  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;
  if (w1 == w2) w2 = outer.clientWidth;

  document.body.removeChild(outer);
  return (w1 - w2);
};

function info(mentor) {
    //get corresponding mentor by stored ID
    mentor = mentors[$(mentor).attr('data-id')];
    
    if (mentor.available === 'Yes')
        $('.modal-title .state').removeClass('label-danger')
            .addClass('label-success').html('Available');
    else
        $('.modal-title .state').removeClass('label-success')
            .addClass('label-danger').html('Unavailable');
    
    $('.modal-title .name').html(mentor.name);
    $('.modal-body .gradYear').html(mentor.gradYear);
    $('.modal-body .college').html(mentor.college);
    $('.modal-body .major').html(mentor.major);
    
    var skill = $('.skill-template').clone();
    skill.removeClass('skill-template');
    $('.skills').empty();
    
    if (mentor.STEM === 'Yes') {
        skill.find('a').html('STEM Expertise');
        if (toHTML(mentor.STEMExp).length > 0) {
            skill.find('a').attr('title', 'STEM Expertise');
            skill.find('a').attr('data-content', toHTML(mentor.STEMExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
    
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.arts === 'Yes') {
        skill.find('a').html('Arts Knowledge');
        if (toHTML(mentor.artsExp).length > 0) {
            skill.find('a').attr('title', 'Arts Knowledge');
            skill.find('a').attr('data-content', toHTML(mentor.artsExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.scholarships === 'Yes') {
        skill.find('a').html('Scholarship Advice');
        if (toHTML(mentor.scholarshipsExp).length > 0) {
            skill.find('a').attr('title', 'Scholarship Advice');
            skill.find('a').attr('data-content', toHTML(mentor.scholarshipsExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.essays === 'Yes') {
        skill.find('a').html('Essay Writing');
        if (toHTML(mentor.essaysExp).length > 0) {
            skill.find('a').attr('title', 'Essay Writing');
            skill.find('a').attr('data-content', toHTML(mentor.essaysExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.courses === 'Yes') {
        skill.find('a').html('Course Selection');
        if (toHTML(mentor.coursesExp).length > 0) {
            skill.find('a').attr('title', 'Course Selection');
            skill.find('a').attr('data-content', toHTML(mentor.coursesExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.summers === 'Yes') {
        skill.find('a').html('Summer Programs');
        if (toHTML(mentor.summersExp).length > 0) {
            skill.find('a').attr('title', 'Summer Programs');
            skill.find('a').attr('data-content', toHTML(mentor.summersExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.entrepreneur === 'Yes') {
        skill.find('a').html('Entrepreneurship');
        if (toHTML(mentor.entrepreneurExp).length > 0) {
            skill.find('a').attr('title', 'Entrepreneurship');
            skill.find('a').attr('data-content', toHTML(mentor.entrepreneurExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.volunteer === 'Yes') {
        skill.find('a').html('Volunteer Service');
        if (toHTML(mentor.volunteerExp).length > 0) {
            skill.find('a').attr('title', 'Volunteer Service');
            skill.find('a').attr('data-content', toHTML(mentor.volunteerExp));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    if (mentor.testPref === 'Yes') {
        skill.find('a').html('Standardized Testing');
        if (toHTML(mentor.tests).length > 0) {
            skill.find('a').attr('title', 'Standardized Testing');
            skill.find('a').attr('data-content', toHTML(CTON(mentor.tests)));
        }
        
        else {
            skill.find('a').attr('title', '');
            skill.find('a').attr('data-content', '');
            skill.find('a').removeAttr('href');
        }
        
        $('.skills').append(skill);
        skill = $('.skill-template').clone();
        skill.removeClass('skill-template');
    }
    
    $('.skills a').click(function(e) {
        e.preventDefault();
    }).popover();
    
    if (auth) {
        $('.phone').html(mentor.phone);
        $('.email').html(mentor.email);
        $('.no-contacts').hide();
        $('.contacts').show();
    }
    
    else {
        $('.no-contacts').show();
        $('.contacts').hide();
    }
    
    //open prepared modal
    $('.info').modal();
}

//save mentee information from API call
function loadMentee(email, code, call) {
    email = typeof email !== 'undefined' ? email : '';
    code = typeof code !== 'undefined' ? code : '';
    call = typeof call === 'function' ? call : function(){};
    
    var reqObj = {
        email : email,
        code : code
    }
    
    $.getJSON('api/mentee', reqObj, function(response) {
        if (response.auth === false) { call(); return; }
        mentee = response.data; // save mentee if auth
        call(); // go to callback
    });
}

//load and display mentors from API call
function loadMentors(email, code, call) {
    email = typeof email !== 'undefined' ? email : '';
    code = typeof code !== 'undefined' ? code : '';
    call = typeof call === 'function' ? call : function(){};
    
    var reqObj = {
        email : email,
        code : code
    }
    
    $.getJSON('api/mentors', reqObj, function(response) {
        if (loaded) { // updating mentor list for mentee
            if (!loadedCt) { // we do not have contacts
                _.each(response.data, function(mentor) {
                    //access mentor by rowNumber and use extend to merge
                    $.extend(mentors[mentRows[mentor.rowNumber]], mentor);
                });
            }
                
            simFilters = [
                'STEM',
                'arts',
                'scholarships',
                'essays',
                'courses',
                'summers',
                'entrepreneur',
                'volunteer',
                'tests'
            ];
            
            for (var i = 0; i < mentors.length; i += 1) {
                //returns a percentage representing object similarity on filter criteria
                mentors[i].similarity = getSimilarity(mentors[i], mentee, simFilters);
            }
                
            //jump call
            auth = true;
            call(); return;
        }
        
        else {
            _.each(mentors, function(mentor) { mentor.elem.remove(); });
            mentors = response.data; // array of mentor objects
            auth = response.auth; // set auth state true or false
            
            mentRows = {};
            for (var i = 0; i < mentors.length; i += 1) {
                mentRows[mentors[i].rowNumber] = i; // quick lookup
                var newElem = $('.mentor-item-template').clone();
                newElem.removeClass('mentor-item-template');
                newElem.removeClass('hide').addClass('mentor-item');
                
                //add properties to our cloned mentor item
                newElem.find('.name').html(mentors[i].name);
                newElem.find('.gradYear').html(mentors[i].gradYear);
                newElem.find('.college').html(mentors[i].college);
                newElem.find('.major').html(mentors[i].major);
                
                //remember where to access object info
                newElem.attr('data-id', i.toString());
                        
                //add reference to this
                mentors[i].elem = newElem;
                mentors[i].elem.hide(); // hide now
                $('.mason').append(mentors[i].elem);
                
                var newImg = $('<img />'); newImg.attr('src', mentors[i].photo);
                if (mentors[i].photo) mentors[i].elem.find('.panel').prepend(newImg);
                
                //set view state of element
                mentors[i].visible = true;
            }
            
            //data loaded
            loaded = true;
            
            //show everything only when loaded
            $('.mason').imagesLoaded(function() {
                $('.mason').children().show();
                $('.mentor-item').click(function() {
                    //info dialog
                    info(this);
                });
                
                //callback
                call();
            });
        }
    });
}

//renders mentors on DOM
function render() {
    if (suggestMode) $('.suggest-footer').show();
    else $('.suggest-footer').hide();
    
    var mentorCount = 0;
    _.each(mentors, function(mentor) {
        if (mentor.visible && mentor.elem.is(':hidden')) mentor.elem.show();
        else if (mentor.visible) mentor.elem.show();
        else mentor.elem.hide();
        
        if (mentor.visible)
            mentorCount += 1;
            
        if (suggestMode) {
            var simStr = mentor.similarity.toString();
            mentor.elem.find('.similarity').html(simStr);
        }
    });
    
    //suggest mode recalculates scores
    $('.mason').isotope('updateSortData');
    
    if (mentorCount !== 0) $('.place').hide(); // we actually have some valid mentors
    else $('.place').show().find('h1').html('We were not able to find any such mentors.');
    
    if (suggestMode) init();
    else //refresh our instance
        $('.mason').isotope('layout');
}

//applies filters to mentor objects
function applyFilters() {
    for (var i = 0; i < mentors.length; i += 1) {
        //set true then filter through
        mentors[i].visible = true;
        
        if (!suggestMode) {
            if (!filtered(mentors[i])) mentors[i].visible = false;
            if (!searched(mentors[i])) mentors[i].visible = false;
        }
    }
}

//applies filters and renders
function refresh() {
    applyFilters();
    render();
}

function init() {
    //MDW is the medium breakpoint
    if ($(window).width() >= MDW) {        
        $('html').niceScroll({
            cursorborderradius : '0px',
            cursorcolor: '#999',
            railpadding: {
                right: 10,
                top : 15,
                bottom : 15
            }
        });
    
        $('.mentor-item').removeClass('min');
        $('.mentor-item img').show(); // we have space
        if ($('#minimal').find('input').is(':checked'))
            $('.mentor-item img').hide(); // or not
        $('.side').addClass('affix');
        $('.mason').isotope({
            'itemSelector' : '.mentor-item',
            'transitionDuration' : '0.25s',
            'layoutMode' : 'packery',
            'sortBy' : sType,
            'getSortData' : {
                name : function(elem) { return $(elem).find('.name').text(); },
                college : function(elem) { return $(elem).find('.college').text(); },
                major : function(elem) { return $(elem).find('.major').text(); },
                similarity : function(elem) { 
                    var score = parseInt($(elem).find('.similarity').text());
                    return -score; // negative score for descending sort
                }
            }
        });
    }
    
    else {
        $('html').getNiceScroll().remove();
        $('.mentor-item').addClass('min');
        $('.mentor-item img').hide();
        $('.side').removeClass('affix');
        $('.mason').isotope({
            'itemSelector' : '.mentor-item',
            'transitionDuration' : '0.25s',
            'layoutMode' : 'vertical',
            'sortBy' : sType,
            'getSortData' : {
                name : function(elem) { return $(elem).find('.name').text(); },
                college : function(elem) { return $(elem).find('.college').text(); },
                major : function(elem) { return $(elem).find('.major').text(); },
                similarity : function(elem) { 
                    var score = parseInt($(elem).find('.similarity').text());
                    return -score; // negative score for descending sort
                }
            }
        });
    }
    
    //set sidebar width to parent column width
    $('.side').width($('.side-parent').width());
}

$(document).ready(function() {
    //layout on size change
    $(window).resize(init);
    
    $('.info, .login, .profile').bind('hidden.bs.modal', function () {
        $('html').css('margin-right', '0px');
    });
    
    $('.info, .login, .profile').bind('show.bs.modal', function () {
        if ($('html').get(0).scrollHeight <= $('html').get(0).clientHeight) return;
        $('html').css('margin-right', '-' + getScrollBarWidth().toString() + 'px');
    });
        
    $('.user-bar').click(function(e) {
        e.preventDefault();
    });    
    
    //disable suggest mode on first load
    $('#suggested input').prop('checked', false);
    $('#suggested input').attr('disabled', 'disabled');
    
    loadMentors('', '', function() {
        init(); // init masonry
        
        //checklist
        filters = [
            'STEM',
            'arts',
            'scholarships',
            'essays',
            'courses',
            'summers',
            'entrepreneur',
            'volunteer',
            'tests',
            'available'
        ];
        
        //initialize filters as necessary
        //must come AFTER disabling suggest
        _.each(filters, function(filter) {
            if ($('#' + filter).find('input').is(':checked'))
                boxes[filter] = 'Yes'; // set filter
        });
        
        if ($('#minimal').find('input').is(':checked'))
            $('.mentor-item img').hide(); // minimal mode is set
        
        //filter by search box and refresh
        search = $('input#search').val();
        refresh();
            
        $('input[type="checkbox"]').click(function() {
            var filter = $(this).closest('div').attr('id');
            
            if (filter === 'minimal') {
                if (this.checked) $('.mentor-item img').hide();
                else $('.mentor-item img').show(); // full mode
                refresh(); // size change
                return; // not a filter
            }
            
            if (filter === 'suggested') {
                if (this.checked) {
                    suggestMode = true;
                    lsType = sType; // save
                    sType = 'similarity';
                    
                    $('.sort').attr('disabled', 'disabled');
                    $('input[type="checkbox"]').not(this)
                        .attr('disabled', 'disabled');
                }
                
                else {
                    suggestMode = false;
                    sType = lsType; // recover sort
                    $('.sort').removeAttr('disabled');
                    $('input[type="checkbox"]').not(this)
                        .removeAttr('disabled'); init();
                }
                
                //not a filter
                refresh();
                return;
            }
            
            if (this.checked) boxes[filter] = 'Yes';
            else delete boxes[filter];
            refresh();
        });
        
        $('input#search').on('change keyup input', function() {
            search = $(this).val();
            refresh();
        });
        
        $('.sort').click(function() {
            sType = $(this).attr('data-sort');
            $('.sort').removeClass('active');
            $(this).addClass('active');
            init();
        });
        
        $('.user-bar').click(function(e) {
            e.preventDefault(); // not a link
            
            if (mentee === null) {
                $('#invalid').hide();
                $('.login').modal();
            }
            
            else {
                $('.profile').modal();
            }
        });
        
        $('.login-form').submit(function(e) {
            e.preventDefault();
            $('.login-button').click();
        });
        
        $('.login-button').click(function() {
            $(this).attr('disabled', 'disabled');
            var sThis = this; // save for inner
            
            var email = $('#mentee-email').val();
            var code = $('#mentee-code').val();
            
            $(this).blur();
            $('#invalid').hide();
            
            loadMentee(email, code, function() {
                //mentee is null might be a shitty sentinel
                if (mentee === null) $('#invalid').fadeIn();
                
                else {                            
                    $('#suggested input').removeAttr('disabled');
                    $('#suggest-text').html('Show my suggested mentors.');

                    $('.profile .modal-title').html(mentee.name);
                    $('.profile .level').html(mentee.level);
                    $('.profile .school').html(mentee.school);
                
                    loadMentors(email, code, function() {
                        $('.user-bar-text').html('Signed in as ' + mentee.name + '.');
                                    
                        //in or out of callback?
                        $('.login').modal('hide');
                        $(sThis).removeAttr('disabled');
                        
                        // init(); // start up masonry
                        refresh(); // apply filters
                    });
                }
            });
        });
        
        $('.logout-button').click(function() {
            $(this).attr('disabled', 'disabled');
            $('.sort').removeAttr('disabled');
            $('input[type="checkbox"]').removeAttr('disabled');
            
            $('#suggested input').prop('checked', false);
            suggestMode = false; // set sentinel for filtering
            $('#suggested input').attr('disabled', 'disabled');
            
            $('#suggest-text').html('Sign in above for suggestions.');
            $('.user-bar-text').html('Sign into your FairED mentee account.');
            
            $('.profile').modal('hide');
            $(this).removeAttr('disabled');
            $(this).blur();
            
            mentee = null;
            auth = false;
            refresh();
        });
    });
});