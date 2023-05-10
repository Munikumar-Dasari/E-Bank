import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {userId: '', userPin: '', showErrorMsg: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showErrorMsg: true,
      errorMsg,
    })
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state
    const userDetails = {user_id: userId, pin: userPin}
    const loginUrl = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  userInputId = event => {
    this.setState({userId: event.target.value})
  }

  userInputPassword = event => {
    this.setState({userPin: event.target.value})
  }

  render() {
    const {userId, userPassword, errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="login-container">
          <div className="logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="website-logo"
            />
          </div>
          <form className="form-container" onSubmit={this.onSubmitLogin}>
            <h1 className="form-heading">Welcome Back!</h1>
            <label htmlFor="userId" className="label">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              className="inputs"
              onChange={this.userInputId}
              value={userId}
            />
            <label htmlFor="pin" className="label">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              className="inputs"
              onChange={this.userInputPassword}
              value={userPassword}
            />
            <button type="submit" className="button">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
