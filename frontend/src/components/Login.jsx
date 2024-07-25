import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import useAuthStateHook from '../customHooks/AuthStateHook';
import { userLogin } from '../store/authSlice';

const Login = () => {
    const dispatch=useDispatch();
    const {state,setState}=useAuthStateHook({email:'',password:''},'');
    
    const inputHandle=(e)=>{
        setState({
            ...state, [e.target.name]:e.target.value
        })
    }

    const login=(e)=>{
        e.preventDefault();
        const {email,password}=state;
        dispatch(userLogin({email,password}));
    }
    return (
        <div className='login'>
            <div className='card'>
                <div className='card-header'>
                    <h3>Login</h3>
                </div>
                <div className='card-body'>
                    <form onSubmit={login}>
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input type="email" className='form-control' placeholder='Email' name="email" id="email" onChange={inputHandle} value={state.email}/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input type="password" className='form-control' placeholder='Password' id="password" name="password" onChange={inputHandle} value={state.password}/>
                        </div>
                        <div className='form-group'>
                            <input type="submit" value="Login" className='btn'/>
                        </div>
    
                        <div className='form-group'>
                            <span><Link to="/register">Don't Have An Account</Link></span>
                        </div>
                    </form>
                </div>  
            </div>
        </div>
      )
}

export default Login;