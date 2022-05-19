import './Signup.css';
import {Button,Box,Modal,Typography} from '@material-ui/core';
import * as React from 'react';
import {TextField,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import signup from '../../images/signup.svg'


 function Signup() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => { setOpen(true); };
  const handleClose = () => {setOpen(false);};
  return (
    <div className='Signup'>
        <Button  onClick={handleClickOpen} style={{color: '#07877D',fontFamily:'Montserrat'}}>Sign up here</Button>
        <Dialog open={open} onClose={handleClose} style={{alignSelf:"center"}}>
        <img src={signup} className='Signup-img'/>
        <h1 className="Signup-header" style={{ fontFamily: 'Montserrat,sans-serif' ,alignSelf:'center', marginBottom:'1px',}}>Join us!</h1>
        <DialogContent style={{alignSelf:"center"}}>
          <TextField  id="firstName"label="First Name"type="text"variant="standard"/>
          <br></br>
          <TextField id="lastName"label="Last Name"type="text"variant="standard"/>
          <br></br>
          <TextField  id="username"label="Username"type="text"variant="standard"/>
          <br></br>
          <TextField id="email"label="Email"type="email"variant="standard"/>
          <br></br>
          <TextField id="password"label="Password"type="password"variant="standard"/>
          <br></br>
        </DialogContent>
        <DialogActions style={{alignSelf:'center'}}>
          <Button onClick={handleClose} style={{marginTop:'10px', fontFamily:'Montserrat'}}>Cancel</Button>
          <Button onClick={handleClose} style={{marginTop:'10px',fontFamily:'Montserrat'}}>Signup</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default Signup;