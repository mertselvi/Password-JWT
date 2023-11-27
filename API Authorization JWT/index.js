const expres = require('express')
const jwt = require('jsonwebtoken')

const app = expres();
const user = {
  id : 1,
  user : "Mert Selvi",
  contact : {
    email : "mert@gmail.com",
    tel : "534576605345"
  }
}


app.post("/verify", verifyToken, (req,res)=> {
  jwt.verify(req.token, 'secretKey', (message,AuthData) => {
    message = req.message;
    res.send({message, AuthData});
  })

})

app.post("/login", (req,res)=> {
  jwt.sign(user,'secretKey', {expiresIn : "10s"}, (message,token) => {
    res.send ({message : "Token created succesfully", token : token})
  });
  console.log(tokenD);
})

function verifyToken (req,res,next) {
  const bearerHeader = req.headers['authorization'];

  if( typeof(bearerHeader) !== 'undefined') {

   
    const bearerArray = bearerHeader.split(" ");
    req.token = bearerArray[1];
    req.message = "Token created succesfully";
    next();
  } else {
    res.status(403).send({message : "Authorization Fail"}) 
  }

}






app.listen(3000, ()=>{
    console.log('Server listen on 3000');
})

