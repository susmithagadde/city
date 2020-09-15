export const chatJson = {
    welcomeMsg:{
        user: "bot",
        message: "Hi there! How can I help?",
        options: [
            { text: "I want to open an account", id: "openAccount", optionId: 'option-open-account' },
            { text: "Test", id: "emailVerification", optionId: 'option-test' },
        ],
        componentId: "welcomeMsg"
    },
    openAccount: {
        user: "bot",
        message: "",
        // message: "Perfect, this should only take 5 minutes and we'll need your phone number, email, ID confirmation and a cancelled cheque. Ready to start?",
        options: [
            // { text: "Yes, let's start", id: "phoneVerification" },
            // { text: "No, I changed my mind", id: "welcomeMsg" }
        ],
        componentId: 'openAccount'
    },
    phoneVerification: {
        user: "bot",
        options: [
            // { text: "Cancel", id: "welcomeMsg" }
        ],
        componentId: 'phoneVerification',
        html: {
            id: 'phone-verification-form',
            successId: 'phoneVerify',
            failureId: 'phoneOtpSendFailure'
        },
    },
    phoneVerify: {
        user: "bot",
        options: [],
        html: {
            id: 'phone-otp-verification-form',
            successId: 'emailVerification',
            failureId: 'otpError'
        },
        componentId: 'phoneVerify'
    },
    phoneOtpSendFailure: {
        user: "bot",
        message: "We couldn't send OTP to the provided number, please review your phone number.",
        options: [
            { text: "Review", id: "phoneVerify" },
            { text: "No, Thanks", id: "welcomeMsg" }
        ],
        componentId: 'phoneOtpSendFailure'
    },
    emailVerification: {
        user: "bot",
        message: "",
        options: [],
        html: {
            id: 'email-verification-form',
            successId: 'emailVerificationSent',
            failureId: 'emailVerificationFailure'
        },
        componentId: 'emailVerification'
    },
    otpError: {
        user: "bot",
        message: "OTP does not match, please validate your phone number or OTP.",
        options: [
            { text: "Update phone number", id: "phoneVerification" },
            { text: "Update otp", id: "phoneVerify" }
        ],
        componentId: 'otpError'
    },
    emailVerificationSent: {
        user: "bot",
        message: "We have sent you a verification email. You can verify it later. Please upload your Pan to proceed",
        options: [
            {
                text: "Upload PAN",
                id: "upload-pan",
                optionHtml: {
                    id: 'upload-pan',
                    nextId: 'panOcrReceived'
                },
                optionId: 'option-uploadPan'
            },
        ],
        componentId: 'emailVerificationSent'
    },
    emailVerificationFailure: {
        user: "bot",
        message: "Something went wrong. We couldn't send you a verification email.",
        options: [{ text: "Review email id", id: "emailVerification" }],
        componentId: 'emailVerificationFailure'
    },
    panOcrReceived: {
        user: "bot",
        message: "Hello world. This is pan ocr received",
        // options: [{ text: "Confirm", id: "uploadCheque" }],
        // html: <PanOcrData />,
        componentId: 'panOcrReceived'
    },
    fallback: {
        user: "bot",
        message: "Thanks!!",
        options: [{ text: "Home", id: "welcomeMsg" }],
        componentId: 'fallback'
    },
    errorFallback: {
        user: "bot",
        message: "Sorry, something went wrong!!",
        options: [{ text: "Home", id: "welcomeMsg" }],
        componentId: 'errorFallback'
    },
};

export const nodes = Object.keys(chatJson);

export const htmlComponents = [
    'email-verification-form',
    'phone-verification-form',
    'phone-otp-verification-form',
    'upload-pan'
]