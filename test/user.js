require('dotenv').config()
import request from "../config/common";
import { expect } from "chai";
import { createRandomUser } from "../helper/user_helper";
import { faker } from '@faker-js/faker';

const TOKEN = process.env.USER_TOKEN

describe('Users', ()=>{
    let userId;

    describe('POST', ()=>{
        /**
         * Example using Async/Await
         */
        it('/users', async ()=>{
            let user = await createRandomUser();
            expect(user.status).to.eq(201);
            userId = user.body.id;
        });
    });

    describe('GET', ()=>{
        /**
         * Example using callback done function
         */
        it('/users', (done)=>{
            request
                .get(`/users?access-token=${TOKEN}`)
                .end((err,res)=>{
                    expect(res.body).to.not.be.empty;
                    done()
                });
        });
    
        /**
         * Example using return and then function
         */
        it('/users/:id', ()=>{
            return request
                .get(`/users/${userId}?access-token=${TOKEN}`)
                .then(res=>{
                    expect(res.body.id).to.be.eq(userId);
                });
        })
    
        it('GET /users with query params', ()=>{
            const url = `/users?access-token=${TOKEN}&page=5&gender=female&status=active`;
            return request
                .get(url)
                .then(res=>{
                    expect(res.body).to.not.be.empty;
                    res.body.forEach(data => {
                        expect(data.gender).to.eq('female');
                        expect(data.status).to.eq('active');
                    });
                });
        });
    });

    describe('PUT', ()=>{
        it('PUT /users', ()=>{
            const data = {
                status:'active',
                name:faker.name.fullName()
            }
    
            return request
                .put(`/users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then(res =>{
                    expect(res.status).to.eq(200);
                    expect(res.body).to.deep.include(data);
                });
        });
    });

    describe('DELETE', ()=>{
        it('/users/:id', ()=>{
            return request
                .del(`/users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .then(res=>{
                    expect(res.status).to.eq(204);
                });
        });
    });
})