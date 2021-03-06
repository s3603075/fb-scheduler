import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import FB from 'fb';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import * as awsDetails from '../const/aws';
import {ControlLabel, FormControl, Button, FormGroup, Grid,
Col } from 'react-bootstrap';
import Posts from '../components/Posts';

class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      date: new Date(),
      dateInSec: null,
      pages: [],
      currPage: {id: '', name: '', access: ''},
      photo: null 
    };
    this.handleText = this.handleText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.setPhoto = this.setPhoto.bind(this);
  }

  componentDidMount() {
    FB.setAccessToken(this.props.access);
    FB.api('/me/accounts', (pages) => {
    console.log(pages); //Debug
      let data = pages.data.map((page) => {
          return {
              name : page.name,
              id : page.id,
              access: page.access_token
          }
      });
      this.setState({ pages: data});
      console.log(data);
    });
  }

  setPhoto(e)  {
    this.setState({ photo: e.target.files[0]})
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  validateDate(date) {
    let selected = (new Date(date).getTime() / 1000) - 10,
        current = new Date().getTime() / 1000;
    return selected > current;
  }
 
  getDateInSeconds(date){
      return Math.floor(new Date(date).getTime() / 1000);
  }

  handleDate = date => {
    if(this.validateDate(date))  {
      var dateInSec = this.getDateInSeconds(date)
      this.setState({ dateInSec: dateInSec })
    }
  }

  handlePageSelect(e) {
    if(e.target.value.length){
      this.setState({
          currPage : this.state.pages.filter(page => {
              return page.id === e.target.value
          })[0]
      })
    }else{
      this.setState({
          currPage : {id : '', name : '', access : ''}
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.state.text === '' 
    || this.state.currPage === {id: '', name: '', access: ''} 
    || this.state.dateInSec === null)  {
      console.log("Please complete the form with valid values")
      return;
    }

    let body = {
      fbid: this.props.userId,
      email: this.props.email,
      pageat: this.state.currPage.access,
      pageid: this.state.currPage.id,
      text: this.state.text,
      time: this.state.dateInSec,
    }

    if(this.state.photo !== null) {
      S3FileUpload.uploadFile(this.state.photo, awsDetails.config)
      .then( (res) => {
          body = Object.assign(body, {
            url: res.location,
            type: "photo"
        }, body);
        this.submitToDB(body)
      })
      .catch( (err) =>  {
        console.log(err);
      })
    } else {
      this.submitToDB(body)
    }
  }

  submitToDB(body)  {
    axios.post('https://m38pxc2and.execute-api.us-east-1.amazonaws.com/dev/FBRequestPost', body, {
      headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
      }
    })
    .then(res => {
      console.log(res);
      alert('Successfully scheduled.')
      window.location.reload();
    })
    .catch((error) => {
      console.log(error.response);
      console.log(error)
    })
  }

  render() {
    return (
      <div>
        <Grid>
            <Col xs={12} md={8} xsOffset={2}>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                <ControlLabel>Please enter post for schedule.</ControlLabel>
                <FormGroup>
                  <FormControl
                    componentClass="textarea"
                    value={this.state.value}
                    placeholder="Enter text"
                    onChange={this.handleText}
                  />
                </FormGroup>
                <FormGroup>
                  <FormControl componentClass="select" placeholder="select page"
                  onChange={this.handlePageSelect}>
                  {this.state.pages.map(page => {
                        return (
                            <option
                                value={page.id}
                                key={page.id}>
                                {page.name}
                            </option>
                        );
                    })} 
                  </FormControl>
                </FormGroup>
                <FormGroup>
                  <DateTimePicker onChange={this.handleDate} value={this.state.date}/>
                </FormGroup>
                <FormGroup>
                  <input type="file" 
                  onChange={this.setPhoto}
                  accept="image/png, image/jpeg" />
                </FormGroup>
                <FormGroup>
                  <Button type="submit">Submit</Button> 
                </FormGroup>
          </FormGroup>
        </form>
            </Col>
         </Grid>
         <Posts id={this.props.userId}/> 
      </div>
    );
  }
}

export default Scheduler;