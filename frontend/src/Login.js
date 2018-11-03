import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
import * as actions from './state/actions/login'
import { Form, Icon, Input, Button, Layout, Row, Col } from 'antd';
import './App.css';
const FormItem = Form.Item;
const { Content, Footer } = Layout;

const mapState = (store) => {
  return ({
    session: store.login.session, 
    error: store.login.error, 
    loading: store.login.loading})
}

const mapActions = dispatch => ({
  login: (username, password) => {
    dispatch(actions.login(username, password))
  }
})

function hasErrors(fieldsError) {
  return Object
    .keys(fieldsError)
    .some(field => fieldsError[field]);
}

class Login extends Component {
  componentWillMount() {
    sessionStorage.clear()
  }
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.login(values.userName, values.password)
      }
    });
  }
  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form
    const {session, error} = this.props
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <div>
        {session
          ? <Redirect to={'/'}/>
          : <Layout style={{ minHeight: '100vh' }}>
              <Content style={{margin: '16px'}}>
              <Row>
                <Col span={6}></Col>
                <Col span={12}>
                <div style={{padding: 24, background: '#fff', borderRadius: '8px', textAlign: 'center'}}>
                {error && <h3>{error.response.data.message}</h3>}
                  <Form layout="inline" onSubmit={this.handleSubmit}>
                    <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
                      {getFieldDecorator('userName', { rules: [{ required: true, message: 'Vul je mailadres in'}]})(
                        <Input prefix={< Icon type = "user" style = {{ color: 'rgba(0,0,0,.25)' }}/>} placeholder="Email"/>
                      )}
                    </FormItem>
                    <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
                      {getFieldDecorator('password', { rules: [{ required: true, message: 'Vul je wachtwoord in' }]})(
                        <Input prefix={< Icon type = "lock" style = {{ color: 'rgba(0,0,0,.25)' }}/>} type="password" placeholder="Wachtwoord"/>
                      )}
                    </FormItem>
                    <FormItem>
                      <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                        Log in
                      </Button>
                    </FormItem>
                  </Form>
                  
                </div>
                </Col>
                <Col span={6}></Col>
              </Row>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                © TeamSKITS
              </Footer>
          </Layout>
        }
      </div>
    )
  }
}

const WrappedHorizontalLoginForm = Form.create()(Login);

export default connect(mapState, mapActions)(WrappedHorizontalLoginForm)
