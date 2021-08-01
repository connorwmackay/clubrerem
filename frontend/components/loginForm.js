const React = require("react");
import styles from './form.module.css';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: "", password: "", status: ""};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value, password: this.state.password, status: this.state.status});
    }

    handlePasswordChange(event) {
        this.setState({username: this.state.username, password: event.target.value, status: this.state.status});
    }

    handleSubmit(event) {
        let data = {
            username: this.state.username,
            password: this.state.password
        };

        fetch('http://localhost:3001/user/validate', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.isValidLogin) {
                this.setState({username: this.state.username, password: this.state.password, status: data.status});
            } else {
                this.setState({username: this.state.username, password: this.state.password, status: data.status});
            }

            console.log("Success: ", data);
        }).catch((err) => {
            console.error("Error: ", err);
        });

        event.preventDefault();
    }

    render() {
        return (
            <form method="POST" onSubmit={this.handleSubmit} className={styles.compForm} autoComplete="off">
                <label htmlFor="username" className={styles.formLabel}>Username</label>
                <input type="text" name="username" id="username" value={this.state.username} className={styles.formInput} onChange={this.handleUsernameChange} required/>
    
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <input type="password" name="password" id="password" value={this.state.password} className={styles.formInput} onChange={this.handlePasswordChange} required />
    
                <button type="submit" className={styles.formButton}>Log In</button>

                <p>{this.state.status}</p>
            </form>
        );
    }
}

module.exports = LoginForm;