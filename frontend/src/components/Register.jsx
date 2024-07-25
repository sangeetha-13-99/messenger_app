import { Link } from 'react-router-dom';
import {useDispatch} from 'react-redux';

import useAuthStateHook from '../customHooks/AuthStateHook';
import { userRegister } from '../store/authSlice';
import useImageHandlerHook from '../customHooks/ImageHandlerHook';

const Register = () => {
    const dispatch=useDispatch();

    const {state,setState}=useAuthStateHook({
        userName:'',
        email:'',
        password:'',
        confirmPassword:'',
        image:''
    },"login")

    const [loadImage,fileHandle]=useImageHandlerHook(state,setState);
   
    const inputHandle=(e)=>{
        setState({
            ...state, [e.target.name]:e.target.value
        })
    }

    const register=(e)=>{
        const {userName,email,password,confirmPassword,image}=state;
        e.preventDefault();
        const formData=new FormData();
        formData.append('userName',userName);
        formData.append('email',email);
        formData.append('password',password);
        formData.append('confirmPassword',confirmPassword);
        formData.append('image',image);
        dispatch(userRegister(formData));
    }

  return (
    <div className='register'>
        <div className='card'>
            <div className='card-header'>
                <h3>Register</h3>
            </div>
            <div className='card-body'>
                <form onSubmit={register}>
                    <div className='form-group'>
                        <label htmlFor='username'>User Name</label>
                        <input type="text" className='form-control' placeholder='User Name' 
                        name="userName" value={state.userName} id="username" onChange={inputHandle
                        }/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type="email" className='form-control' placeholder='Email' name="email" onChange={inputHandle} value={state.email} id="email"/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type="password" className='form-control' placeholder='Password'
                         name="password" onChange={inputHandle} value={state.password} id="password"/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='confirmPassword'>Confirm Password</label>
                        <input type="password" className='form-control' placeholder='Confirm Password' 
                         name="confirmPassword" onChange={inputHandle} value={state.confirmPassword}id="confirmPassword"/>
                    </div>

                    <div className='form-group'>
                        <div className='file-image'>
                            <div className='image'>
                                {loadImage ? <img src={loadImage}/>:''}
                            </div>
                            <div className='file'>
                                <label htmlFor='image'>Select Image</label>
                                <input type="file" className='form-control'
                                 name="image" onChange={fileHandle} id="image"/>
                            </div>
                        </div>
                    </div>

                    <div className='form-group'>
                        <input type="submit" value="Register" className='btn'/>
                    </div>

                    <div className='form-group'>
<span><Link to="/login">Login To Your Account</Link></span>
                    </div>

                </form>
            </div>  
        </div>
    </div>
  )
}

export default Register;