function SessionState(session, patients, authorized_user_detected, state, authorized_users, last_authorized_user) {

    this.session = session;
    this.patient = patients;
    this.authorized_user_detected = authorized_user_detected;
    this.state = state;
    this.authorized_users = authorized_users;
    this.last_authorized_user = last_authorized_user;
}

SessionState.prototype.authorizedUserSignedIn = function(user_uuid){
    if(!session){
        console.log("error no session");
        return;}
    authorized_user_detected = true;
    authorized_users.push(user_uuid);
    last_authorized_user = user_uuid;

    //Also push to session_table.session.action_log
    session.actions_log.push(
        {
            "timestamp": Date.now(),
            "action" : "SIGN_IN",
            "authorized_user" : user_uuid
        });
};

SessionState.prototype.patientSignedIn = function(user_uuid){
    if(!session){
        console.log("error no session");
        return;}
    patients.push(user_uuid);

    //Also push to session_table.session.action_log
    session.actions_log.push(
        {
            "timestamp": Date.now(),
            "action" : "SIGN_IN",
            "patient" : user_uuid
        });
};

SessionState.prototype.sessionDetected = function(session){
    this.session = session;
};

SessionState.prototype.takeItem = function(item){
    if(!session){
        console.log("error no session");
        return;}
    if (state == "IDLE"){
        return;
    }

    //Also push to session_table.session.action_log
    session.taken.push(item);
    session.actions_log.push(
        {
            "timestamp": Date.now(),
            "action" : "TAKE",
            "authorized_user" : last_authorized_user
        });
};

SessionState.prototype.authorizedUserSignedOut = function(user_uuid){
    if(!session){
        console.log("error no session");
        return;}
    authorized_user_detected = true;
    authorized_users.push(user_uuid);
    last_authorized_user = user_uuid;

    var authorized_user_index = authorizedUser.indexOf(user_uuid);
    authorizedUser.splice(authorized_user_index, 1);

    //Also push to session_table.session.action_log
    session.actions_log.push(
        {
            "timestamp": Date.now(),
            "action" : "SIGN_OUT",
            "authorized_user" : user_uuid
        });
};

SessionState.prototype.patientSignedOut = function(user_uuid){
    if(!session){
        console.log("error no session");
        return;
    }

    var patient_index = patients.indexOf(user_uuid);
    patients.splice(patient_index, 1);

    //Also push to session_table.session.action_log
    session.actions_log.push(
        {
            "timestamp": Date.now(),
            "action" : "SIGN_OUT",
            "patient" : user_uuid
        });
};

SessionState.prototype.updateState = function(){

    return this.state;
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
};

module.exports = SessionState;