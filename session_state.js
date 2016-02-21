function sessionState(){

    var session;
    var patients;
    var authorized_user_detected = false;
    var state = "IDLE";
    var authorized_users;
    var last_authorized_user;

    function authorizedUserSignedIn(user_uuid){
        if(!session){
            console.log("error no session");
            return;}
        authorized_user_detected = true;
        authorized_users.push(user_uuid);
        last_authorized_user = user_uuid;

        session.actions_log.push(
            {
                "timestamp": timestamp(),
                "action" : "SIGN_IN",
                "authorized_user" : user_uuid
            });
    }

    function patientSignedIn(user_uuid){
        if(!session){
            console.log("error no session");
            return;}
        patients.push(user_uuid);

        session.actions_log.push(
            {
                "timestamp": timestamp(),
                "action" : "SIGN_IN",
                "patient" : user_uuid
            });
    }

    function sessionDetected(session){
        this.session = session;
    }

    function takeItem(item){
        if(!session){
            console.log("error no session");
            return;}
        if (state == "IDLE"){
            return;
        }

        session.taken.push(item);
        session.actions_log.push(
            {
                "timestamp": timestamp(),
                "action" : "TAKE",
                "authorized_user" : last_authorized_user
            });
    }
    function authorizedUserSignedOut(user_uuid){
        if(!session){
            console.log("error no session");
            return;}
        authorized_user_detected = true;
        authorized_users.push(user_uuid);
        last_authorized_user = user_uuid;

        var authorized_user_index = authorizedUser.indexOf(user_uuid);
        authorizedUser.splice(authorized_user_index, 1);

        session.actions_log.push(
            {
                "timestamp": timestamp(),
                "action" : "SIGN_OUT",
                "authorized_user" : user_uuid
            });
    }

    function patientSignedOut(user_uuid){
        if(!session){
            console.log("error no session");
            return;
        }

        var patient_index = patients.indexOf(user_uuid);
        patients.splice(patient_index, 1);

        session.actions_log.push(
            {
                "timestamp": timestamp(),
                "action" : "SIGN_OUT",
                "patient" : user_uuid
            });
    }
    if (authorized_user_detected && session){
        state = "SESSION_TAKE";
    }

    var everyone_signed_in = true;

    for each (user in session) {
        if (!$.in(user.user_uuid, authorized_users) {
            everyone_signed_in = false;
        }
    }

    for each (patient in session) {
        if (!$.in(patient.user_uuid, authorized_users) {
            everyone_signed_in = false;
        }
    }

    if (everyone_signed_in){
        state = "SESSION_LIVE";
    }
}