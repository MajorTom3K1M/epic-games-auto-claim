const { v4: uuid } = require('uuid');
const querystring = require('querystring');
const EventEmitter = require('events');
const nodemailer = require('nodemailer');

const EpicArkosePublicKey = {
    LOGIN: '37D033EB-6489-3763-2AE1-A228C04103F5',
    CREATE: 'E8AD0E2A-2E72-0F06-2C52-706D88BECA75',
    PURCHASE: 'B73BD16E-3C8E-9082-F9C7-FA780FF2E68B',
}

let pendingCaptchas = [];

const captchaEmitter = new EventEmitter();

const emailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "jakkarin.mike@gmail.com",
        pass: "060751903"
    }
});

const sendEmail = async (url, publicKey) => {
    console.log("WORK sendEmail");
    const catpchaReason = {
        [EpicArkosePublicKey.LOGIN]: 'login',
        [EpicArkosePublicKey.CREATE]: 'create an account',
        [EpicArkosePublicKey.PURCHASE]: 'make a purchase'
    };

    await emailTransporter.sendMail({
        from: {
            address: "jakkarin.mike@gmail.com",
            name: "Epic Games Captchas",
        },
        to: "jakkarin.mike@gmail.com",
        subject: 'Epic Games free games needs a Captcha solved',
        html: `<p><b>epicgames-freegames-node</b> needs a captcha solved in order to ${catpchaReason[publicKey]}.</p>
             <p>Open this page and solve the captcha: <a href=${url}>${url}</a></p>`,
    });
}

const solveLocally = async (url) => {
    console.log("WORK solveLocally");
    await open(url);
};

const notifyManualCaptcha = (publicKey) => {
    return new Promise((resolve, reject) => {
        const id = uuid();
        pendingCaptchas.push(id);
        const qs = querystring.stringify({
            id,
            pkey: publicKey
        });
        const url = `${'http://localhost:3000/'}?${qs}`;

        const solveStep = process.env.ENV === 'local' ? solveLocally : sendEmail;

        solveStep(url, publicKey)
            .then(() => {
                captchaEmitter.on('solved', (captcha) => {
                    if (captcha.id === id) resolve(captcha.sessionData);
                });
            })
            .catch(err => {
                reject(err);
            })
    });
}

const manualCaptcha = (publicKey) => {
    const id = uuid();
    pendingCaptchas.push(id);
    return { id, publicKey }
}

const responseManualCaptcha = (captchaSolution) => {
    if (pendingCaptchas.includes(captchaSolution.id)) {
        pendingCaptchas = pendingCaptchas.filter(e => e !== captchaSolution.id);
        captchaEmitter.emit('solved', captchaSolution);
    }
}

module.exports = {
    EpicArkosePublicKey,
    notifyManualCaptcha,
    manualCaptcha
};