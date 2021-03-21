import {User as Manager} from '../../shared/entities/User';
import {getRepository} from 'typeorm';
import ValidationRules from "../objects/ValidationRules";
import {Company} from "../../shared/entities/Company";
const Validator = require('validatorjs');

const rules = new ValidationRules({
    username: ['string', 'max:50', 'username_available'],
    password: ['required', 'string', 'max:100'],
    firstName: ['required', 'string', 'max:50'],
    lastName: ['string', 'max:50'],
    email: ['required', 'email', 'email_available'],
    mobileNumber: ['max:20'],
    picture: ['string', 'url', 'max:255'],
    company: ['required', 'integer', 'company_exist']
})

export const managerCreateValidation = (data: any) => {
    if (!data.username) {
        rules.fields.removeRuleFromUsernameField('username_available')
    }
    return new Validator(data, rules.fields);
};

export const managerUpdateValidation = (data: any, manager: Manager) => {
    rules.removeField('username');
    rules.removeField('integer');
    rules.fields
        .removeRuleFromPasswordField('required')
        .removeRuleFromFirstNameField('required')
        .removeRuleFromEmailField('required');

    if (data.email && data.email === manager.email) {
        // only validate email if it is not the same with old email
        rules.fields.removeRuleFromEmailField('email_available');
    }

    return new Validator(data, rules.fields);
};

Validator.registerAsync('username_available', async (username: string, attribute: any, req: any, passes: any) => {
    const managerRepository = getRepository(Manager);
    const manager: Manager | undefined = await managerRepository.findOne({where: {username}});

    if (!manager) {
        passes();
    } else {
        passes(false, 'Username has already been taken');
    }
});

Validator.registerAsync('email_available', async (email: string, attribute: any, req: any, passes: any) => {
    const adminRepository = getRepository(Manager);
    const admin: Manager | undefined = await adminRepository.findOne({where: {email}});

    if (!admin) {
        passes();
    } else {
        passes(false, 'Email is already in use');
    }
});

Validator.registerAsync('company_exist', async (companyId: number, attribute: any, req: any, passes: any) => {
    const companyRepository = getRepository(Company);
    const company: Company | undefined = await companyRepository.findOne({where: {id: companyId}});

    if (!company) {
        passes(false, 'Company does not exist');
    } else {
        passes();
    }
});
