import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import * as FBdetails from '../const/fb';
import Scheduler from './Scheduler';

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      loggedIn: false,
      userId: '',
      name: '',
      access: ''
    };
  }

  responseFacebook = response =>  {
    //Probably save info into DynamoDB here
    this.setState({
      loggedIn: true,
      userId: response.id,
      name: response.name,
      //Dangerous operation, but for prototyping...
      access: response.accessToken
    })
    console.log(response);
  } 

  render() {
    let fbContent;

    if(this.state.loggedIn) {
      fbContent = <Scheduler access={this.state.access}/>
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
        {fbContent}
      </div>
    );
  }
}

export default Login;