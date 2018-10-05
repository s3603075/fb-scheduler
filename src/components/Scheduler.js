import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import FB from 'fb';

class Scheduler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      date: new Date(),
      pages: []
    };
    this.handleText = this.handleText.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    FB.setAccessToken(this.props.access);
    FB.api('/me/accounts', (pages) => {
      let data = pages.data.map((page) => {
          return {
              name : page.name,
              id : page.id
          }
      });
    console.log(data);
  });
  }

  handleText(e) {
    this.setState({ text: e.target.value });
  }

  handleDate = date => {
    this.setState({ date })
  }

  handleSubmit(e) {
    //Send to dynamo/s3
    e.preventDefault();
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
          <input type="submit" value="Submit" />
          <DateTimePicker onChange={this.handleDate} value={this.state.date}/>
        </form>  
      </div>
    );
  }
}

export default Scheduler;