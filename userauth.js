//Prompt For Name
let username;
let usernameexist = false;
let usernamearray;

function userprompt(){
    username = prompt("Please enter your participant id: ");
}
userprompt();

//Authentication Setup
if(username == null || username == ""){
    window.location.href = "nullusername.html";
}else{
    usernamearray = username.split("");
    for(var s = 0; s < usernamearray.length; s++){
        if(usernamearray[s] != " "){
            usernameexist = true;
        }        
    }
}
if(usernameexist == false){
    window.location.href = "nullusername.html";
}