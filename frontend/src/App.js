import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import * as actions from './state/actions/login'
import RaceCalendar from './RaceCalendar'
import Login from './Login'
import { Layout, Button } from 'antd';
const { Header, Content } = Layout;

const mapState = (store) => {
  return ({
      currentUser: store.login.user,
      error: store.login.error,
      session: store.login.session
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
  	 loadUserFromToken: () => {
  	 	let token = sessionStorage.getItem('jwt')
  	 	if(!token || token === '') {//if there is no token, dont bother
  	 		return;
  	 	}
       dispatch(actions.fetchMe())
     },
     logout: () => {
       dispatch(actions.logout())
     }
  }
}


class App extends Component {
  componentWillMount() {
    this.props.loadUserFromToken()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser === null && nextProps.session === false) {
      window.location.href = '/#/login'
    }
  }

  state = {
    collapsed: true,
  };
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  render() {
    const { currentUser, error, logout } = this.props
    if (error) { 
      sessionStorage.clear()
      //Redirect with hashrouter?
    }
    if (!currentUser) return (<div>Loading</div>)
    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1">
              <Icon type="schedule" />
              <span>Wedstrijdkalender</span>
            </Menu.Item>
          </Menu>
        </Sider> */}
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Button 
              type="danger" 
              style={{float:'right', marginTop: '14px', marginRight: '30px'}}
              onClick={logout}>
                Logout
            </Button>
          </Header>
          <Content style={{ margin: '16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              {sessionStorage.jwt ? <RaceCalendar /> : <Login/>}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}


export default connect(mapState, mapDispatchToProps)(App)