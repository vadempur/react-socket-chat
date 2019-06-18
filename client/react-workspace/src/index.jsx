import React from "react";
import ReactDOM from "react-dom";
import SockJS from "sockjs-client";
import { sample } from "lodash";
import { Grid, Form, Message } from "semantic-ui-react";
import "./styles";

const sock = new SockJS("http://localhost:9999/echo");

sock.onopen = function() {
  console.log("open");
};
sock.onclose = function() {
  console.log("close");
};


class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: ["teal", "blue", "violet"],
      username: "",
      message: "",
      messages: [
        {
          username: "user1",
          message: "Hi!"
        }
      ]
    };
  }

  handleUsernameChange = e => {
    this.setState({
      username: e.target.value
    });
  };

  handleMessageChange = e => {
    this.setState({
      message: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.sendMessage();
  };

  sendMessage() {
    let message = this.state.message;
    let username = this.state.username;
    let send = {
      message: message,
      username: username
    };
    sock.send(JSON.stringify(send));
    sock.onmessage = e => {
      let response = JSON.parse(e.data);
      this.setState({
        messages: [
          ...this.state.messages,
          {
            username: response.username,
            message: response.message
          }
        ]
      });
    };
  }

  render() {
    return (
      <div className="chat">
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.chat {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column mobile={16} tablet={10} computer={6}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Input
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.handleUsernameChange}
                />
                <Form.Input
                  placeholder="Enter your message..."
                  value={this.state.message}
                  onChange={this.handleMessageChange}
                />
                <Form.Button content="Send" />
              </Form.Group>
            </Form>
            {this.state.messages.map((item, index) => (
              <Message key={index} color={sample(this.state.color)}>
                <strong>{item.username}:</strong> {item.message}
              </Message>
            ))}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(<ChatApp />, document.getElementById("root"));
