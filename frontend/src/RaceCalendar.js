import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Card, Icon, Tag, Row, Col, Table, Spin, Button, Tooltip }  from 'antd';
// import Responsive from 'react-responsive';
import * as actions from './state/actions/calendar'
import AddRace from './elements/AddRace'

const mapState = (store) => {
    return ({
        user: store.login.user,
        races: store.calendar.races,
        loading: store.calendar.loading,
        error: store.calendar.error,
        raceAdded: store.calendar.raceAdded
    })
}

const mapActions = dispatch => ({
    fetchRaces: () => {
        dispatch(actions.fetchRaces())
    },
    addParticipant: (raceId, registered) => {
        dispatch(actions.addParticipant(raceId, registered))
    },
    removeParticipant: (raceId, registered) => {
        dispatch(actions.removeParticipant(raceId, registered))
    }
})

class RaceCalendar extends Component {
    componentWillMount() {
        this.props.fetchRaces()
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.raceAdded) {
            this.props.fetchRaces()
        }
    }

    parseDate(fullDate) {
        if (fullDate) {
            let date = new Date(fullDate)
            let options = {weekday:'long', month:'long', day:'numeric'}
            let dateString = date.toLocaleDateString('nl-NL', options)
            return dateString[0].toUpperCase() + dateString.slice(1)
        }
    }



    render() {
        const { races, loading, error, addParticipant, removeParticipant, user } = this.props
        if (error) {
            console.log(error)
            return (
                <div>
                <div>Oeps, er ging iets mis!</div>
                <div>{error.message}</div>
                </div>
            )
        }
        if (loading || !races) {
            return (
                <Spin style={{ width: '100%', height: '100%' }}>
                  <div />
                </Spin>
            )
        }
        const columns = [{
            title: 'Wedstrijd',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 250,
          }, {
            title: 'Datum',
            dataIndex: 'date',
            key: 'date',
            width: 170,
            render: (text, record) => {
                return (<span>{this.parseDate(record.date)}</span>)
            }
          }, {
            title: 'Tot',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 170,
            render: (text, record) => {
                return (<span>{this.parseDate(record.endDate)}</span>)
            }
          }, {
            title: 'Locatie',
            dataIndex: 'location',
            key: 'location',
          }, {
            title: 'Tijdstip',
            dataIndex: 'time',
            key: 'time'
          }, {
            title: 'Inschrijven',
            dataIndex: 'register',
            key: 'register',
            render: (text, record) => {
                if (record.register) { 
                    return (<Button type="dashed" href={record.register} target="_blank">Inschrijven</Button>)
                } else {
                    return (<span/>)
                }
            }
          }, {
            title: 'Ingeschreven',
            dataIndex: 'registered_participants',
            key: 'registered_participants',
            render: (text, record) => {
                return (<span>{record.registered_participants.join(', ')}</span>)
            }
          }, {
            title: 'Wil meedoen',
            dataIndex: 'participants',
            key: 'participants',
            render: (text, record) => {
                return (<span>{record.participants.join(', ')}</span>)
            }
          }, {
        //     title: 'Vervoer',
        //     dataIndex: 'cars',
        //     key: 'cars'
        //   }, {
            title: 'Bijzonderheden',
            dataIndex: 'description',
            key: 'description'
          }, {
            title: 'Acties',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (text, record) => {
                let added = record.participants.some(p => p === user.name)
                let registered = record.registered_participants.some(r => r === user.name)
                return (
                <span>
                    { record.canRegister ? (registered ?
                        <Tooltip title="Ik heb me uitgeschreven">
                            <Button onClick={() => removeParticipant(record._id, true)} type="danger" icon="close" style={{marginLeft:'5px'}}/>
                        </Tooltip>                    
                    :
                        <Tooltip title="Ik heb me ingeschreven">
                            <Button onClick={() => addParticipant(record._id, true)} type="primary" icon="check" style={{marginLeft:'5px'}}/>
                        </Tooltip>
                    ): ''}
                    { added ? 
                        <Tooltip title="Ik wil niet meer mee doen">
                            <Button onClick={() => removeParticipant(record._id, false)} type="danger" icon="minus" style={{marginLeft:'5px'}}/>
                        </Tooltip>
                        :
                        <Tooltip title="Ik wil mee doen">
                            <Button onClick={() => addParticipant(record._id, false)} type="primary" icon="plus" style={{marginLeft:'5px'}}/>
                        </Tooltip>
                    }
                </span>
                )}
        
          }];
        races.forEach(race => {
            race.participants = race.participants.map(pcps => {
                return pcps.name ? pcps.name : pcps
            })
            race.registered_participants = race.registered_participants.map(pcp => {
                return pcp.name ? pcp.name : pcp
            })
        });
        let styles = {
            card: {
                marginTop: 20, 
                marginRight: 20, 
                width: 300,
                maxWidth: '100%', 
                display: 'inline-block'
            }
        }

        return (
            <div>
                {races.map(race => 
                {
                return (  
                    <Card title={race.name}  style={styles.card} key={race.name + race.location} actions={[<Icon type="setting" />, <Icon type="edit" />]}>
                        <div><strong>Datum:</strong> {this.parseDate(race.date)}</div>
                        <div><strong>Locatie:</strong> {race.location}</div>
                        <div><strong>Deelnemers:</strong> 
                            {race.participants.map(p => {return (<Tag color="blue" style={{margin:3}} key={p}>{p}</Tag>)})}
                            {race.registered_participants.map(p => {return (<Tag color="blue" style={{margin:3}} key={p}>{p}</Tag>)})}
                        </div>
                    </Card>
                )})}
                {/* <Table dataSource={data} columns={columns} rowKey={record => record.name + record.location} scroll={{ x: 1200 }}/> */}
                {(user.role !== "racer") && <AddRace />}
            </div>
        )
    }
}

export default connect(mapState, mapActions)(RaceCalendar)
