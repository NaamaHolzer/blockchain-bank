import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './components/Home/Home'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Montserrat, sans-serif'
  },
  palette: {
    primary: {
      main: '#07877D'
    },
    secondary: {
      main: '#07877D'
    }
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <MuiThemeProvider theme={theme}>
      <React.StrictMode>
        <Home />
      </React.StrictMode>
    </MuiThemeProvider>
  
  );
  