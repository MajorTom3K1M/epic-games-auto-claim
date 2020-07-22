import * as Yup from 'yup';

// const emailRegex = /^([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required(),
        // .min(5)
        // .matches(emailRegex),
    password: Yup.string()
        .required()
        // .min(5)
}); 