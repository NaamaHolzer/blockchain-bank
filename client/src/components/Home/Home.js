import './Home.css';
import home from '../../images/home.svg'
import { TextField, InputAdornment, Button, IconButton } from '@material-ui/core';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { useState } from 'react';
import Signup from '../Signup/Signup';

function Home() {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
  return (
    <div className="Home">
        <img src={home} className="Home-img"/>
        <h1 className='Home-header'>Welcome to Lev Bank</h1>
        <TextField label="Username" variant='standard' id='standard-basic' margin='10px' style={{width:'228px'}}/>
        <TextField id="input-with-sx" label="Password" margin='10px' variant="standard"   style={{width:'228px'}} type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" style={{width:"35px"}}
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}>
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>)
          }}/>
        <Button className= "Button" variant="outlined" margin='none'  style={{color:'#07877D', margin:'20px' ,fontFamily: 'Montserrat' ,fontWeight: 'bold' ,letterSpacing:'1px', width:'228px'}}>Login</Button>
        <p className='Home-p' style={{marginBottom:'2px'}}>Don't have an account yet?</p>
        <Signup/>
    </div>
  );
}

export default Home;
