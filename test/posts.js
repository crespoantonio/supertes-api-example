require('dotenv').config();
import request from "../config/common";
import { expect } from "chai";
import { createRandomUser } from "../helper/user_helper";
import { faker } from '@faker-js/faker';

const TOKEN = process.env.USER_TOKEN;


describe('User Posts', ()=>{
    let postId, userId;

    before(async()=>{
        let user = await createRandomUser();
        userId = user.body.id;
    })

    it('/posts', async () =>{
        const data = {
            user_id: userId,
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs(1)
        }

        const res = await request
            .post('/posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);
        
        expect(res.body).to.deep.include(data);
        postId = res.body.id;
    });

    it('/posts/:id', async ()=>{
        const res = await request
            .get(`/posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`);
        expect(res.body.id).to.eq(postId);
    })

    describe('Negative Test', ()=>{
        it('401 Auth fail',async ()=>{
            const data = {
                user_id: userId,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(1)
            }
    
            const res = await request
                .post('/posts')
                .send(data);
        
            expect(res.body.message).to.eq('Authentication failed');
            expect(res.status).to.eq(401);
        });

        it('422 Validation fail',async ()=>{
            const data = {
                user_id: userId,
                title: faker.lorem.sentence()
            }
    
            const res = await request
                .post('/posts')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data);
        
            expect(res.body[0].field).to.eq('body');
            expect(res.body[0].message).to.eq("can't be blank");
            expect(res.status).to.eq(422);
        });
        
    });
})