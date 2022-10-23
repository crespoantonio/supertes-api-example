require('dotenv').config();
import { faker } from "@faker-js/faker";
import request from "../config/common";

const TOKEN = process.env.USER_TOKEN;

export const createRandomUser = async () => {
    const userData = {
        name:faker.name.fullName(),
        gender:'male',
        email:faker.internet.email(),
        status:'active'
    }

    const res = await request
        .post('/users')
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(userData);
        
    return res;
}