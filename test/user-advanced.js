require('dotenv').config();
import request from "../config/common";
import { expect } from "chai";
import { faker } from '@faker-js/faker';

const TOKEN = process.env.USER_TOKEN;

describe('Users', ()=>{
    let userId;
    describe('POST', ()=>{
        it('/users', ()=>{
            const data = {
                name:faker.name.fullName(),
                gender:'male',
                email:faker.internet.email(),
                status:'active'
            }
    
            return request
                .post('/users')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then(res=>{
                    expect(res.body).to.contains(data);
                    expect(res.status).to.eq(201);
                    userId = res.body.id;
                })
        })
    })

    describe('GET', ()=>{
        it('/users', ()=>{
            return request
                .get(`/users?access-token=${TOKEN}`)
                .then(res=>{
                    expect(res.body).to.not.be.empty;
                });
        });
    
        it('/users/:id', ()=>{
            return request
                .get(`/users/${userId}?access-token=${TOKEN}`)
                .then(res=>{
                    expect(res.body.id).to.be.eq(userId);
                });
        })
    
        it('/users with query params', ()=>{
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
        })
    })

    describe('PUT', ()=>{
        it('/users/:id', ()=>{
            const data = {
                name:faker.name.fullName()
            }
    
            return request
                .put(`/users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data)
                .then(res =>{
                    expect(res.status).to.eq(200);
                    expect(res.body).to.deep.include(data);
                })
        })
    })

    describe('DELETE', ()=>{
        it('/users/:id', ()=>{
            return request
                .del(`/users/${userId}`)
                .set("Authorization", `Bearer ${TOKEN}`)
                .then(res=>{
                    expect(res.status).to.eq(204);
                })
        })
    })
})