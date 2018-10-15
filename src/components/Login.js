import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import * as FBdetails from '../const/fb';
import Scheduler from './Scheduler';
import { Navbar} from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedIn: false,
      userId: '',
      access: '',
      email: ''
    };
  }

  responseFacebook = response =>  {
    this.setState({
      loggedIn: true,
      userId: response.id,
      //Dangerous operation, but for prototyping...
      access: response.accessToken,
      email: response.email
    })
    console.log(response);
  } 

  render() {
    let fbContent;

    if(this.state.loggedIn) {
      fbContent = <Scheduler access={this.state.access} userId={this.state.userId} email={this.state.email}/>
    } else  {
      fbContent = (<FacebookLogin
        appId = {FBdetails.appID}
        autoLoad={true}
        fields="name,email,picture"
        scope="manage_pages,publish_pages"
        callback={this.responseFacebook} />)
    }

    return (
      <div>
        <Navbar inverse>
              <Navbar.Header>
                  <Navbar.Brand>
                      <a href="#">FB Scheduler</a>
                  </Navbar.Brand>
              </Navbar.Header>
          </Navbar>
        {fbContent}
      </div>
    );
  }
}

export default Login;