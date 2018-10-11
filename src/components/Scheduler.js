import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import FB from 'fb';
import axios from 'axios';

class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      date: new Date(),
      dateInSec: null,
      pages: [],
      currPage: {id: '', name: '', access: ''}
    };
    this.handleText = this.handleText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
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
      //Get time in UTC
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
    if(this.state.text === '' || this.state.currPage === null)  {
      console.log("Please complete the form")
    }

    const body = {
      fbid: this.props.userId,
      access: this.props.access,
      email: this.props.email,
      pageat: this.state.currPage.access,
      pageid: this.state.currPage.id,
      text: this.state.text,
      time: this.state.dateInSec
    }

    console.log(body)

    axios.post('https://m38pxc2and.execute-api.us-east-1.amazonaws.com/dev/FBRequestPost', body, {
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        }
    })
    .then(res => {
      console.log(res);
      console.log(res.body);
    })
    .catch((error) => {
      console.log(error.response);
      console.log(error)
    })

  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Message:
            <textarea 
              type="text" 
              value={this.state.value} 
              onChange={this.handleText}
              rows="4" />
          </label>
          <select
            value={this.state.currPage.id}
            onChange={this.handlePageSelect}>
            <option value={''}>Select Page</option>
            {this.state.pages.map(page => {
                return (
                    <option
                        value={page.id}
                        key={page.id}>
                        {page.name}
                    </option>
                );
            })} 
          </select>
          <DateTimePicker onChange={this.handleDate} value={this.state.date}/>
          <input type="submit" value="Submit" />
        </form>  
      </div>
    );
  }
}

export default Scheduler;