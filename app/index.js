const express = require('express')
const app = express()
const port = process.env.NODE_PORT;

const buffer = require('buffer/').Buffer;

console.log("NODE SERVER CLIENT_ID : "+process.env.CLIENT_ID);

app.get('/',  (req, res) => {

    const id = process.env.CLIENT_ID;
    const secret = process.env.CLIENT_SECRET;
    const user = buffer.from(id+":"+secret).toString('base64')
    const token_url = process.env.TOKEN_URL;

    const tcHeaders = new Headers();
    tcHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    tcHeaders.append("Authorization", "Basic " + user);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("scope", "api");

    const requestOptions = {
        method: "POST",
        headers: tcHeaders,
        body: urlencoded,
        redirect: "follow"
      };

      console.log("INFO "+Date.now().toString()+" Getting Token From : "+token_url);

      fetch(token_url, requestOptions)
      .then((response) => 
            {
            if(response.status==200)
                return response.text()
            else {
                let text = response.text(); 
                throw "HTTP 401 Client Validate Failed"; 
            }
        })
      .then((result) => {return JSON.parse(result);})
      .then((data)=>{
        token = data.access_token;
        console.log("INFO "+Date.now().toString()+" Token has been fetched successfully. Token- "+token);

        const server_url = process.env.RESOURCE_SERVER_URL; 

        const resHeader = new Headers();
        resHeader.append("Authorization","Bearer "+token)

        console.log(resHeader)

        const resrequestOptions = {
            method: "GET",
            headers: resHeader,
            redirect: "follow"
        };
        
        fetch(server_url, resrequestOptions)
        .then((response) => {
            if(response.status==200)
                return response.text();
            else
                return res.status(401).send("<h1>401 Unauthorized</h1>")
        }).then((data)=>{
            res.status(200).send(data);
        }).catch(err=>{
            console.log("error");
            res.status(401).json({status:"FAILURE", Text:err})
        });


      })
      .catch((error) => {
        console.log("ERROR "+Date.now().toString()+" FAILURE "+error);    
        res.status(401).json({status:"FAILURE", Text:error})
    });   
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


