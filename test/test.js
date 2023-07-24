import chai from "chai";
import chaiHttp from "chai-http";
import app from '../index.js'
import userModel from "../src/models/user.model.js";

chai.use(chaiHttp)
let should = chai.should()

// users test
describe("USERS",()=>{
    before((done)=>{
        userModel.deleteMany({})
                  .then((result)=>{
                    done()
                  })
    })

    describe("/GET Users",()=>{
        it("it should return all users",(done)=>{
            chai
            .request(app)
            .get("/api/users")
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.data.should.be.a("array")
                res.body.should.have.property("status")
                res.body.data.length.should.be.eql(0)
                done()
            })
        })
    })

    describe("/POST user",()=>{
        it("it should create a new user",(done)=>{
            const user={
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "test@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            }

            chai
            .request(app)
            .post("/api/users")
            .send(user)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.data.should.be.a("object")
                res.body.status.should.be.eql("success")
                done()
            })
        })

        it("it should not create user with existing email",(done)=>{
            const user={
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "age": 21,
                "email": "test@gmail.com",
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            }
            chai
            .request(app)
            .post("/api/users")
            .send(user)
            .end((err,res)=>{
                res.should.have.status(400)
                done()
            })

        })

        it("it should not create user without email and using auth type of email_and_password",(done)=>{
            const user={
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            }
            chai
            .request(app)
            .post("/api/users")
            .send(user)
            .end((err,res)=>{
                res.should.have.status(400)
                res.body.should.have.property('err')
                done()
            })

        })

        it("it should not create user without authToken using auth method of (google,facebok,apple)",(done)=>{
            const user={
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "google",
                "image": "http://image.png"
            }
            chai
            .request(app)
            .post("/api/users")
            .send(user)
            .end((err,res)=>{
                res.should.have.status(400)
                res.body.err.should.be.eql("Sorry can't signup with social media with AuthToken")
                done()
            })

        })
    })

    describe("/GET/:id user",()=>{
        it("it should get user with given id",(done)=>{
            const obj={
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "newuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            }

            let userObj = new userModel(obj)
            userObj.save()
            .then((user)=>{
                chai
                .request(app)
                .get("/api/users/"+user._id)
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(200)
                    res.body.data.should.be.a("object")
                    res.body.status.should.be.eql("success")
                    res.body.data.should.have.property("email").eql(obj.email)
                    done()
                })
            })
            .catch(done)

        })
    })

    describe("/PATCH/:id user",()=>{
        it("it should update user informations with given id",(done)=>{
            const user = new userModel({
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "newuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            })

            const updateUser = {
                "firstname": "daniel-update",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "newuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            }

            const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0NTRmYzM5YTFiMWM0ZGEyZDgyOWUwOSIsImZpcnN0bmFtZSI6ImRhbmllbCIsImxhc3RuYW1lIjoibmRhYm9zZSIsInRlbCI6IjY1NTE5NzE0NCIsImFnZSI6MjEsInBhc3N3b3JkIjoiJDJiJDEwJE93RFhDQml2Nkh5bW84NjJMUkpzc094RTczRjJSMWxkTkxVRGltS1MwU203cWJoN2hGVFkyIiwiZ2VuZGVyIjoibWFsZSIsImF1dGgiOiJlbWFpbF9hbmRfcGFzc3dvcmQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiYXV0aFRva2VuIjpudWxsLCJpbWFnZSI6Imh0dHA6Ly9pbWFnZS5wbmciLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTA1VDEyOjUzOjEzLjYwNVoiLCJfX3YiOjB9LCJpYXQiOjE2ODMyOTEyMzAsImV4cCI6MTY4MzMwMjAzMH0.PWe7frHlhJizXknYCGUy8OsNhEfMh7QnxXXqEzbUARE"

            user.save()
                .then((result)=>{
                    chai
                    .request(app)
                    .patch("/api/users/"+user._id)
                    .set("Authorization", "Bearer " + token)
                    .send(updateUser)
                    .end((err,res)=>{
                        res.should.have.status(200)
                        res.body.data.should.have.property("firstname").eql(updateUser.firstname)
                        res.body.data.should.be.a("object")
                        done()
                    })
                }).catch(done)
            
        })

        it("it should not update users info when no token is passed",(done)=>{
            const user = new userModel({
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "newuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            })

            user.save()
            .then((result)=>{
                chai
                .request(app)
                .patch("/api/users/"+user._id)
                .send(user)
                .end((err,res)=>{
                    res.should.have.status(403)
                    done()
                })
            }).catch(done)
        })
    })

    describe("/DELETE/:id user",()=>{
        it("it should delete a user according to given id",(done)=>{
            const user = new userModel({
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "deleteuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            })

            const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY0NTRmYzM5YTFiMWM0ZGEyZDgyOWUwOSIsImZpcnN0bmFtZSI6ImRhbmllbCIsImxhc3RuYW1lIjoibmRhYm9zZSIsInRlbCI6IjY1NTE5NzE0NCIsImFnZSI6MjEsInBhc3N3b3JkIjoiJDJiJDEwJE93RFhDQml2Nkh5bW84NjJMUkpzc094RTczRjJSMWxkTkxVRGltS1MwU203cWJoN2hGVFkyIiwiZ2VuZGVyIjoibWFsZSIsImF1dGgiOiJlbWFpbF9hbmRfcGFzc3dvcmQiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiYXV0aFRva2VuIjpudWxsLCJpbWFnZSI6Imh0dHA6Ly9pbWFnZS5wbmciLCJjcmVhdGVkQXQiOiIyMDIzLTA1LTA1VDEyOjUzOjEzLjYwNVoiLCJfX3YiOjB9LCJpYXQiOjE2ODMyOTEyMzAsImV4cCI6MTY4MzMwMjAzMH0.PWe7frHlhJizXknYCGUy8OsNhEfMh7QnxXXqEzbUARE"


            user.save()
                .then((user)=>{
                    chai
                    .request(app)
                    .delete("/api/users/"+user._id)
                    .set("Authorization", "Bearer " + token)
                    .send(user)
                    .end((err,res)=>{
                        res.should.have.status(200)
                        res.body.status.should.be.eql("success")
                        done()
                    })
                })
        })

        it("it should not delete user without authorization bearer token",(done)=>{
            const user = new userModel({
                "firstname": "daniel",
                "lastname": "ndabose",
                "tel": "655197144",
                "email": "deleteuser@gmail.com",
                "age": 21,
                "password": "Test123@",
                "gender": "male",
                "auth": "email_and_password",
                "image": "http://image.png"
            })

            user.save()
                .then((user)=>{
                    chai
                    .request(app)
                    .delete("/api/users/"+user._id)
                    .send(user)
                    .end((err,res)=>{
                        res.should.have.status(403)
                        done()
                    })
                })
        })
    })    
})


describe("/AUTH",()=>{
    before((done)=>{
        const user = new userModel({
            "firstname": "daniel",
            "lastname": "ndabose",
            "tel": "655197144",
            "email": "daniel@gmail.com",
            "age": 21,
            "password": "Test123@",
            "gender": "male",
            "auth": "email_and_password",
            "image": "http://image.png"
        })
        
        chai
        .request(app)
        .post("/api/users")
        .send(user)
        .end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })

    describe("/Login user",()=>{
        it("it should login user with email and password",(done)=>{
            chai
            .request(app)
            .post("/api/auth/login")
            .send({email: "daniel@gmail.com",password:"Test123@",auth:"email_and_password"})
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.data.should.be.a("object")
                res.body.data.should.have.property("token")
                done()
            })
        })
    })

    after((done)=>{
        userModel.deleteMany({})
                .then((result)=>{
                    done()
                })
    })
})