var DBModel=require('../models/userModels');
var User=DBModel.User;

//session
var session = require('express-session');
var sess; 

var passport = require('passport');
var passportHttp = require('passport-http');
var logout = require('express-passport-logout');

var bcrypt = require('bcryptjs');
var saltRounds=10;

//Insert User data in the database
var registerToApp=function(obj,res){
    
    //Initializing DB Model Schema and assigning values to that schema 
    var user = new User();
    
    //check for user Exsistence
    User.find({email:obj.email},function(err,data){
        if(data.length>0){
            console.log('user already exists');
            res.json('user already exists');
        }
        else{
            user.name=obj.name;
            user.email=obj.email;
            user.mobile=obj.mobile;
            user.college=obj.college;
            user.password=obj.password;

            // Insert the Data 
            user.save(user,function(error,userdata) {
            if (error){
            console.log('Error in Registering user data: '+err);  
            throw err;  
            res.json('failed');
            }
            console.log('User Registration successfull');    
            res.json('User Registration successfull');
            });
        }
    });  
 }
 
//resetPassword
var resetPassword = function(obj,res){
    User.find({email:obj.email},function(err,data){
        if(data.length>0){
            User.update({email:obj.email},{$set:{password:obj.password}},function(err,data){
                if(err)
                    throw err;
                res.json("Password updated")
            })
        }
        else{
            res.json("email not found")
        }
    })
    
}

//LoginToApp
var loginToApp=function(obj,res){
    var email=obj.email;
    var password=obj.password;
    console.log(email);
    console.log(password);
    User.find({"email":email},function(err,data){
        if(err){
            console.log('invalid credentials'+err);
            throw err;
            res.json('invalid credentials');
        }
        else{
            if(data.length>0)
            {
                bcrypt.compare(password,data[0].password,function(err,decrypt){
                    if(decrypt==true){
                        //creating session
                        session.email = obj.email;
                        console.log('user loggedin');
                        res.json("Login Successful...");
                    }
                    else{
                        console.log('user logging in failed');
                        res.json("Invalid credentials");
                    }
                });
            }
            else
                res.json("User Not Found...");
        }
    });
    
}

//update user registered events in the database
var registerEvent=function(obj,res){
    if(session.email==null){
        res.json('Please login first');
    }
    else{
    //here email is obtained from session
    var email=session.email;
    var events=obj.events;
    var branch=obj.branch;

    //check for already registered events
    User.find({email:email,"events.branch":branch,"events.events":events},function(error,edata){
        if(edata.length>0){
            console.log('Already registered for current event');
            res.json('Already registered for current event');
        }
        else{
            //check to update or add
            User.find({"email":email,"events.branch":branch},function(er,d){
                // Add the events into array of existing schema in DB
                if(d.length>0){
                    User.update({"email":email,"events.branch":branch},{$push:{"events.$.events":events}},function(err,data) {
                        if (err){
                            console.log('Error in Registering user data: '+err);  
                            throw err;  
                            res.json('failed');
                        }
                        console.log('Event Registration successfull');    
                        res.json('Event Registration successfull');
                        });        
                }
                else{
                    //save as new events array for new branch
                    User.update({email:email},{$push:{events:[{branch:branch,events:[events]}]}},function(errr,dd){
                        if (errr){
                            console.log('Error in Registering user data: '+err);  
                            throw err;  
                            res.json('failed');
                        }
                        console.log('Event Registration successfull');    
                        res.json('Event Registration successfull');
                    })
                }
        })
        }
    })
    }
}

//TeamRegister
var teamRegister = function(obj,res){
    if(session.email==null){
        res.json('Please login first');
    }
    else{
        var email = session.email;
        var teamname = obj.teamname;
        var teamevent = obj.teamevent;
        var teameventbranch = obj.teameventbranch;
        //teammembers(only 4 per team)
        var teammember1name = obj.teammember1name;
        var teammember1email = obj.teammember1email;
        var teammember1mobile = obj.teammember1mobile;
        var teammember1college = obj.teammember1college;
        var teammember2name = obj.teammember2name;
        var teammember2email = obj.teammember2email;
        var teammember2mobile = obj.teammember2mobile;
        var teammember2college = obj.teammember2college;
        var teammember3name = obj.teammember3name;
        var teammember3email = obj.teammember3email;
        var teammember3mobile = obj.teammember3mobile;
        var teammember3college = obj.teammember3college;
        
        User.find({email:email,"team.teamevent":teamevent},function(error,tdata){
            if(tdata.length>0){
                console.log('User already registered for current event with a team');
                res.json('Already registered for current event with a team');
            }
            else{
                User.update({email:email},{$push:{team:{teamname:teamname,teamevent:teamevent,teameventbranch:teameventbranch,teammembers:[{
                                                                                                            name:teammember1name,
                                                                                                            email:teammember1email,
                                                                                                            mobile:teammember1mobile,
                                                                                                            college:teammember1college
                                                                                                        },
                                                                                                        {
                                                                                                            name:teammember2name,
                                                                                                            email:teammember2email,
                                                                                                            mobile:teammember2mobile,
                                                                                                            college:teammember2college
                                                                                                        },
                                                                                                        {
                                                                                                            name:teammember3name,
                                                                                                            email:teammember3email,
                                                                                                            mobile:teammember3mobile,
                                                                                                            college:teammember3college
                                                                                                        }
                                                                                                    ]
                }}},function(err,data){
                    if(err){
                        throw err;
                        console.log(err);
                        res.json(err);
                    }
                    
                    console.log('Team Registration successful');
                    res.json('Team Registration successful');
                })
            }
        });
    }
}

//retrieveuserData
var retrieveUserData = function(req,res){
    var email = session.email;
    User.find({email:email},function(err,data){
        if(err)
            throw err;
        res.json(data);
    })
}

//updateProfile
var updateProfile = function(obj,res){
    var email = session.email;
    var mobile = obj.mobile;
    User.update({email:email},{$set:{mobile:mobile}},function(err,data){
        if(err)
            throw err;
        res.json('Mobile number Updated');
    })
}
//logoutFromApp
var logoutFromApp = function(req,res){
    session.email=null;
    req.session.destroy(function(err) {
        if(err) {
          console.log(err);
        } else {
          res.json('Logged out successfully');
        }
        
    }
    
    )}

module.exports.registerToApp = registerToApp;
module.exports.resetPassword = resetPassword;
module.exports.loginToApp = loginToApp;
module.exports.registerEvent = registerEvent;
module.exports.teamRegister = teamRegister;
module.exports.logoutFromApp = logoutFromApp;
module.exports.retrieveUserData = retrieveUserData;
module.exports.updateProfile = updateProfile;