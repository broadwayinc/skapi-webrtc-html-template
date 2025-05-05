/*
    This service.js code will be loaded on almost every page of your website.
    Each page will have access to the skapi object.
*/

/*
    Below, is the initializing code for Skapi.
    Make sure you replace the SERVICE_ID, and the OWNER_ID: "ap22gWhRD5uQeL7VeFEc", "f8e16604-69e4-451c-9d90-4410f801c006" to your own service ID and owner ID.
    You can retrieve the service ID and the owner ID from www.skapi.com.
    For more information, checkout the Getting Started: https://docs.skapi.com/introduction/getting-started.html
*/

const SERVICE_ID = "ap22gWhRD5uQeL7VeFEc";
const OWNER_ID = "f8e16604-69e4-451c-9d90-4410f801c006";

/*
    Below, the options object is passed to the Skapi constructor.
    The options object can have the following properties:
    - autoLogin: <boolean>, when set to true, the user will be automatically logged in.
    - eventListener: <object>, contains event listeners for the Skapi object.
        - onLogin: <function>, called when the user is logged in, or when updates the user's session, or the user's is logged out.
*/

let options = {
    autoLogin: true,
    eventListener: {
        onLogin: user => {
            if (!user) {
                // user is not logged in.
                // If url is welcome.html redirect to index.html
                if (window.location.pathname === "/welcome.html") {
                    window.location.href = "index.html";
                }
            }
        },
    }
}

const skapi = new Skapi(SERVICE_ID, OWNER_ID, options);