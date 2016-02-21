function SessionState(session, authorized_users, patients, taken, state) {

    this.session = session;
    this.authorized_users = authorized_users;
    this.patient_users = patients;
    this.taken = taken;
    this.state = state;
    //this.last_authorized_user = last_authorized_user;

    this.SESSION_IDLE = 'SESSION_IDLE';
    this.SESSION_TAKE = 'SESSION_TAKE';
    this.SESSION_LIVE =  'SESSION_LIVE';
}

SessionState.prototype.authorizedUserAction = function(user_uuid, callback){
    if(!this.session){
        console.log("error no session");
        return;}

    var actionType;

    for (var i = 0; i < this.authorized_users.length; i++) {
        if (this.authorized_users[i] == user_uuid) {
            this.authorized_users.splice(i, 1);
            actionType = "out";
            callback(actionType);
        }
    }

    if (!actionType) {
        this.authorized_users.push(user_uuid);
        if (this.state == "SESSION_IDLE") {
            this.state = "SESSION_TAKE";
        }
        actionType = "in";
        callback(actionType);
    }

    this._checkState();

    //this.last_authorized_user = user_uuid;


    //Also push to session_table.session.action_log
    //session.actions_log.push(
    //    {
    //        "timestamp": Date.now(),
    //        "action" : "SIGN_IN",
    //        "authorized_user" : user_uuid
    //    });
};

SessionState.prototype.patientUserAction = function(user_uuid, callback){
    if(!this.session){
        console.log("error no session");
        return;}

    var actionType;

    for (var i = 0; i < this.patient_users.length; i++) {
        if (this.patient_users[i] == user_uuid) {
            this.patient_users.splice(i, 1);
            actionType = "out";
            callback(actionType);
        }
    }

    if (!actionType) {
        this.patient_users.push(user_uuid);
        if (this.state == "SESSION_IDLE") {
            this.state = "SESSION_TAKE";
        }
        actionType = "in";
        callback(actionType);
    }

    this._checkState();
};

SessionState.prototype.itemAction = function(item_uuid, callback){
    if(!this.session){
        console.log("error no session");
        return;}
    if (this.state == "SESSION_IDLE"){
        return;
    }

    var actionType;

    for (var i = 0; i < this.taken.length; i++) {
        if (this.taken[i] == item_uuid) {
            this.taken.splice(i, 1);
            actionType = "out";
            callback(actionType);
        }
    }

    if (!actionType) {
        this.taken.push(item_uuid);
        if (this.state == "SESSION_IDLE") {
            this.state = "SESSION_TAKE";
        }
        actionType = "in";
        callback(actionType);
    }

    //session.actions_log.push(
    //    {
    //        "timestamp": Date.now(),
    //        "action" : "TAKE",
    //        "authorized_user" : last_authorized_user
    //    });
};

//SessionState.prototype.authorizedUserSignedOut = function(user_uuid){
//    if(!session){
//        console.log("error no session");
//        return;}
//    authorized_user_detected = true;
//    authorized_users.push(user_uuid);
//    last_authorized_user = user_uuid;
//
//    var authorized_user_index = authorizedUser.indexOf(user_uuid);
//    authorizedUser.splice(authorized_user_index, 1);
//
//    //Also push to session_table.session.action_log
//    session.actions_log.push(
//        {
//            "timestamp": Date.now(),
//            "action" : "SIGN_OUT",
//            "authorized_user" : user_uuid
//        });
//};
//
//SessionState.prototype.patientSignedOut = function(user_uuid){
//    if(!session){
//        console.log("error no session");
//        return;
//    }
//
//    var patient_index = patients.indexOf(user_uuid);
//    patients.splice(patient_index, 1);
//
//    //Also push to session_table.session.action_log
//    session.actions_log.push(
//        {
//            "timestamp": Date.now(),
//            "action" : "SIGN_OUT",
//            "patient_user" : user_uuid
//        });
//};
//
//SessionState.prototype.updateState = function(){
//
//    return this.state;
    //if (authorized_user_detected && session){
    //    this.state = SESSION_TAKE;
    //}
    //
    //var everyone_signed_in = true;

    //for each (user in session) {
    //    if (!$.in(user.user_uuid, authorized_users) {
    //        everyone_signed_in = false;
    //    }
    //}
    //
    //for each (patient in session) {
    //    if (!$.in(patient.user_uuid, authorized_users) {
    //        everyone_signed_in = false;
    //    }
    //}
    //if (everyone_signed_in){
    //    state = "SESSION_LIVE";
    //}
//};

SessionState.prototype._checkState = function() {
    console.log("Pre-check state: " + this.state);
    if (this.state == this.SESSION_LIVE) {
        if ((this.authorized_users.length == 0) && (this.patient_users.length == 0)) {
            this.state = this.SESSION_IDLE;
        }
    }
    //Must be IDLE or TAKE
    else {
        if ((this.authorized_users.length == 0) && (this.patient_users.length == 0)) {
            this.state = this.SESSION_IDLE;
        }
        else {
            if (this.authorized_users.length == this.session.authorized_users.length) {
                if (this.patient_users.length == this.session.patient_users.length) {
                    this.state = this.SESSION_LIVE;
                }
                else {
                    this.state = this.SESSION_TAKE;
                }
            }
        }
    }

    console.log("After checking state, the state is: " + this.state);
};

module.exports = SessionState;