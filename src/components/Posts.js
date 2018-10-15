import React, { Component } from 'react';
import axios from 'axios';
import {Panel, Grid, Col, Button} from 'react-bootstrap';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const body = {
      fbid: this.props.id
    }

    axios.post('https://m38pxc2and.execute-api.us-east-1.amazonaws.com/dev/FBRecievePost', body, {
      headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
      }
    })
    .then(res => {
      this.setState({posts: res.data.Items})

    })
    .catch((error) => {
      console.log(error.response);
      console.log(error)
    })
  }

  handleDelete(e) {
    const body = {
      id: e.target.value
    }
    axios.post('https://m38pxc2and.execute-api.us-east-1.amazonaws.com/dev/FBDeletePost', body, {
      headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
      }
    })
    .then(res => {
      console.log(res)
      alert("Item deleted.");
      window.location.reload();

    })
    .catch((error) => {
      console.log(error.response);
      console.log(error)
    })
  }

  render() {
    return (
      <div >
        <Grid>
        {this.state.posts.map(post => {
        return (
          <Col key={post.id} xs={12} md={8} xsOffset={2}>
              <div style={{paddingBottom:25}}>
                <Panel>
                  <Panel.Heading>Scheduled Post:</Panel.Heading>
                  <Panel.Body>PageID: {post.pageid}</Panel.Body>
                  <Panel.Body>Message: {post.text}</Panel.Body>
                  <Panel.Body>Time: {post.time}</Panel.Body>
                  <Panel.Body>Photo URL: {post.url}</Panel.Body>
                  <Panel.Footer><Button bsStyle="danger" 
                  onClick={this.handleDelete} value={post.id}>Delete</Button></Panel.Footer>
                </Panel>     
              </div>
          </Col>
            );
        })} 
        </Grid>
      </div>
    );
  }
}

export default Posts;