/* /var/log/nginx # cat /etc/nginx/js/oauth.js */


function introspectAccessToken(r) {
        var auth_head = r.headersIn['Authorization'];
        var token = auth_head.split(" ")[1]
        var auth_head = "token="+token+"&scope=api"

        ngx.fetch('http://172.105.55.15:4445/admin/oauth2/introspect', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: auth_head
        }).then(response => {
                        return response.text();
        }).then(result=>{return JSON.parse(result);
        }).then(body => {

                if(body.active){
                   r.error("info","Token is valid. TOKEN = "+token);
                   r.return(204,body);
                }
                else{
                  r.error("token is not valid")
                  r.return(401,body);
                }
        }).catch(err => {
                r.error('Fetch error: ' + err);
                r.return(500, 'Internal Server Error');
        });
}

export default { introspectAccessToken }

