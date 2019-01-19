import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from './state/actions/login'
import { Form, Input, Button, Layout, Row, Col } from 'antd';
import './App.css';
const FormItem = Form.Item;
const { Content, Footer } = Layout;


const mapState = (store) => {
  return ({
    registered: store.login.registered, 
    error: store.login.error
    })
}

const mapActions = dispatch => ({
  register: (name, emailaddress, password, token) => {
    dispatch(actions.register(name, emailaddress, password, token))
  }
})

class Register extends Component {
  state = {
    confirmDirty: false
  };
  componentWillMount() {
    sessionStorage.clear()
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.register(values.name, values.email, values.password, values.token)
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('De wachtwoorden komen niet overeen!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { registered, error } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
<div>
    {registered 
    ? <Redirect to={'/login'}/> 
    :
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{margin: '16px'}}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}>
                    {error && <h3 style={{color: 'red'}}>{error.response.data.message}</h3>}
                        <div style={{padding: 24, background: '#fff', borderRadius: '8px'}}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem {...formItemLayout} label="Voornaam">
                                    {getFieldDecorator('name',
                                        {rules: [{required: true, message: 'Vul een naam in'}]})(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Email">
                                    {getFieldDecorator('email', 
                                        { rules: [{ type: 'email', message: 'Dit is geen correct email adres!'}, { required: true, message: 'Vul een email adres in'}]})(
                                        <Input />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Wachtwoord">
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Vul een wachtwoord in' }, { validator: this.checkConfirm }]})(
                                        <Input type="password" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Herhaal wachtwoord">
                                    {getFieldDecorator('confirm', {
                                        rules: [{ required: true, message: 'Herhaal je wachtwoord'}, { validator: this.checkPassword, }]})(
                                        <Input type="password" onBlur={this.handleConfirmBlur} />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="Token">
                                    {getFieldDecorator('token', 
                                      { rules: [{ required: true, message: 'Vul een token in'}]})(
                                        <Input/>
                                    )}
                                </FormItem>
                                <FormItem {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">Registreren</Button>
                                </FormItem>
                        </Form>
                    </div>
                </Col>
                <Col span={6}></Col>
            </Row>
        </Content>
</Layout>
        }
        </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(Register);


export default connect(mapState, mapActions)(WrappedRegistrationForm)
