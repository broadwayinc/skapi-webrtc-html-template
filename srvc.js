// replace service id and owner id
const SERVICE_ID = "ap22YyFvVcxK0ShseFEc";
const OWNER_ID = "f8e16604-69e4-451c-9d90-4410f801c006";

let rtcConnection = null;
let receiver = null;

function RealtimeCallback(rt) {
    console.log(rt);

    let log = rt;
    try {
        log = JSON.stringify(log, null, 2);
    }
    catch (err) {
    }

    rtcLog.innerText = rt.type + ':\n' + log + '\n-\n' + rtcLog.innerText;

    if (rt.type === 'rtc:incoming') {
        receiver = rt;
        
        // Show incoming call dialog
        document.getElementById('el_dl_incoming').innerHTML = /*html*/`
                <p>Incoming call</p>
                <button onclick='
                    receiver.connectRTC(document.getElementById("el_form_rtcSettings"), RTCCallback)
                        .then(rtc => {
                            console.log(rtc);
                            rtcConnection = rtc;
                            if(rtc.media) {
                                document.getElementById("local").srcObject = rtc.media;
                            }
                        })
                '>Accept</button>
                <button onclick="receiver.hangup();isConnected(false)">Reject</button>
            `;

        document.getElementById('el_dl_incoming').showModal();
    }

    else if (rt.type === 'rtc:closed') {
        isConnected(false);
    }
}

function RTCCallback(e) {
    let rtcLog = document.getElementById('el_pre_rtcLog'); // RTC Log

    switch (e.type) {
        // RTC Events
        case 'negotiationneeded':
            rtcLog.innerText = `RTC negotiation needed. Sending offer..\n` + rtcLog.innerText;
            break;
            
        case 'track':
            rtcLog.innerText = `Incoming Media Stream...\n` + rtcLog.innerText;
            document.getElementById('remote').srcObject = e.streams[0];
            break;

        case 'connectionstatechange':
            let state = e.state;
            rtcLog.innerText = `RTC Connection:${e.type}:${state}\n` + JSON.stringify(e, null, 2) + '\n-\n' + rtcLog.innerText;
            if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                isConnected(false);
            }
            else if (state === 'connecting') {
                isConnected(true);
            }
            break;

        // Data Channel Events
        case 'close':
            rtcLog.innerText = `Data Channel:${e.target.label}:${e.type}\n` + JSON.stringify(e, null, 2) + '\n-\n' + rtcLog.innerText;
            break;
        case 'message':
            rtcLog.innerText = `Data Channel:${e.target.label}:${e.type}\n` + JSON.stringify(e.data, null, 2) + '\n-\n' + rtcLog.innerText;
            break;
        case 'open':
        case 'bufferedamountlow':
        case 'error':
            rtcLog.innerText = `Data Channel:${e.target.label}:${e.type}\n` + JSON.stringify(e, null, 2) + '\n-\n' + rtcLog.innerText;
            break;
    }
}

function isConnected(state) {

    function disableForm(form, disable) {
        form.querySelectorAll('input').forEach(i => {
            i.disabled = disable;
        });
    }

    document.getElementById('el_dl_calling').close();
    document.getElementById('el_dl_incoming').close();

    if (state) {
        // Callback executed when the user is connected to the server.
        document.getElementById('el_pre_rtcLog').innerText = 'Connected\n' + document.getElementById('el_pre_rtcLog').innerText;
        disableForm(document.getElementById('el_form_sendRTCMessage'), false);
        disableForm(document.getElementById('el_form_rtcSettings'), true);
        document.getElementById('el_bt_disconnect').disable = false;
    }
    else {
        disableForm(document.getElementById('el_form_sendRTCMessage'), true);
        disableForm(document.getElementById('el_form_rtcSettings'), false);
        document.getElementById('el_bt_disconnect').disable = true;
    }
}

const skapi = new Skapi(
    SERVICE_ID,
    OWNER_ID,
    {
        autoLogin: true,
        eventListener: {
            onLogin: (user) => {
                console.log('onLogin', user);

                document.getElementById('el_form_login').hidden = !!user;
                document.getElementById('el_bt_logout').hidden = !user;
                document.getElementById('el_pre_userProfile').innerText = user ? JSON.stringify(user, null, 2) : 'Please Login';

                if (user) {
                    skapi.connectRealtime(RealtimeCallback);
                    skapi.joinRealtime({ group: 'sandbox' });
                }
            }
        }
    }
);