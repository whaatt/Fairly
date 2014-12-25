//load express for our REST API
var express = require('express');

//connect to Google Spreadsheets
var sheets = require('tabletop');

//handy tools for functional
var tool = require('underscore');

//express instance
var app = express();

var mentorKey = 'DEADBEEF';
var menteeKey = 'BEEFDEAD';

var mentorAlias = [
    'time',
    'name',
    'college',
    'gradYear',
    'major',
    'email', //auth hide
    'phone', //auth hide
    'address', //hide
    'mentees',
    'hours',
    'levels',
    'skills',
    'STEM',
    'STEMExp',
    'arts',
    'artsExp',
    'scholarships',
    'scholarshipsExp',
    'essays',
    'essaysExp',
    'courses',
    'coursesExp',
    'summers',
    'summersExp',
    'entrepreneur',
    'entrepreneurExp',
    'volunteer',
    'volunteerExp',
    'testPref',
    'other',
    'tests',
    'code', //hide
    'available',
    'approval',
    'duplicate',
    'photo'
];

var menteeAlias = [
    'time',
    'name',
    'school',
    'level',
    'email',
    'phone',
    'need',
    'hours',
    'skills',
    'STEM',
    'arts',
    'scholarships',
    'essays',
    'courses',
    'summers',
    'entrepreneur',
    'volunteer',
    'other',
    'testPref',
    'tests',
    'code',
    'approval',
    'duplicate'
];

//to serve requests fast
var dataCacheMentors = [];
var dataCacheMentees = [];
var cServed = true;

var mentors = function(req, res) {
    var email = '';
    var code = '';
    
    if (req.query.email) email = req.query.email;
    if (req.query.code) code = req.query.code;
    
    var creds = {
        email : email,
        code : code,
        approval : 'Yes',
        duplicate : 'No'
    };
    
    //track valid mentee
    var auth = false;
    
    getData(menteeKey, 'mentee', function(data) {
        if (tool.findWhere(data, creds) != undefined) auth = true;
        getData(mentorKey, 'mentor', function(data) {
            for (var i = 0; i < data.length; i += 1) {
                //codes are a secret
                //addresses are secret
                delete data[i].code;
                delete data[i].address;
                
                //no contact info
                if (auth === false) {
                    delete data[i].email;
                    delete data[i].phone;
                }
            }
            
            //allow only approved mentors
            data = tool.where(data, {
                approval : 'Yes',
                duplicate : 'No'
            });
            
            res.status(200).send({
                auth : auth,
                data : data
            });
        });
    });
};

var mentee = function(req, res) {
    var email = '';
    var code = '';
    
    if (req.query.email) email = req.query.email;
    if (req.query.code) code = req.query.code;
    
    var creds = {
        email : email,
        code : code,
        approval : 'Yes',
        duplicate : 'No'
    };
    
    //track valid mentee
    var auth = false;
    
    getData(menteeKey, 'mentee', function(data) {
        var mentee = tool.findWhere(data, creds);
        if (mentee != undefined) auth = true;
        else mentee = null;
        
        res.status(200).send({
            auth : auth,
            data : mentee
        });    
    });
};

var getData = function(key, type, call) {
    cServed = true;
    var options = {
        key : key,
        simpleSheet : true,
        callback : function(data, top) {
            //get column names by invoking the tabletop model property
            var columns = top.sheets(top.foundSheetNames[0]).column_names;
            
            //change to header aliases
            if (type === 'mentee') {
                for (var i = 0; i < columns.length; i += 1) {
                    for (var j = 0; j < data.length; j += 1) {
                        data[j][menteeAlias[i]] = data[j][columns[i]];
                        delete data[j][columns[i]];
                    }
                }
                
                //cache mentee data
                dataCacheMentees = data;
            }
            
            //change to header aliases
            if (type === 'mentor') {
                for (var i = 0; i < columns.length; i += 1) {
                    for (var j = 0; j < data.length; j += 1) {
                        data[j][mentorAlias[i]] = data[j][columns[i]];
                        delete data[j][columns[i]];
                    }
                }
                
                //cache mentor data
                dataCacheMentors = data;
            }
            
            if (!cServed)
                call(data);
        }
    }
    
    if (type === 'mentor' && dataCacheMentors.length > 0) call(dataCacheMentors);
    else if (type === 'mentee' && dataCacheMentees.length > 0) call(dataCacheMentees);
    else cServed = false;
    sheets.init(options);
};

//create our defined API routes
app.use('/api/mentors', mentors);
app.use('/api/mentee', mentee);

//serve the static files from directory to avoid CORS bullshit
app.use('/', express.static(__dirname + '/public'));

var port = 53135;
app.listen(port);