import React, {useState} from 'react';

function Login(props) {
    const [credentials, setCredentials] = useState({username: "", password: ""})

    const handleChange = (e) => {
        const {name, value} = e.target
        setCredentials({
            ...credentials,
            [name]: value
        })
    }

    const postLogin = async () => {
        const response = await fetch('http://127.0.0.1:8000/login/', {
            method: "POST",
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        return response.json()
    }

    return (
        <div>
            <input name={"username"} value={credentials.username} onChange={handleChange}/>
            <input name={"password"} value={credentials.password} onChange={handleChange}/>
            <button onClick={() => {
                postLogin().then(r => console.log(r))
            }}>
                Login
            </button>
        </div>
    );
}

export default Login;