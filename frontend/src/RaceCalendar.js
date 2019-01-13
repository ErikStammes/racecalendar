import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Card, Icon, Tag, Spin, Button, Tooltip }  from 'antd';
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
                let actions = []
                if (race.canRegister) {
                    let registered = race.registered_participants.some(r => r === user.name)
                    if (registered) {
                        actions.push(<Tooltip title="Ik heb me uitgeschreven"><Icon type="close" style={{color: 'red'}} onClick={() => removeParticipant(race._id, true)}/> </Tooltip>)
                    } else {
                        actions.push(<Tooltip title="Ik heb me ingeschreven"><Icon type="check" style={{color: 'green'}} onClick={() => addParticipant(race._id, true)}/> </Tooltip>)
                    }
                }
                let added = race.participants.some(p => p === user.name)
                if (added) {
                    actions.push(<Tooltip title="Ik wil niet meer doen"><Icon type="minus" style={{color: 'red'}} onClick={() => removeParticipant(race._id, false)} /></Tooltip>)
                } else {
                    actions.push(<Tooltip title="Ik wil mee doen"><Icon type="plus" style={{color: 'green'}} onClick={() => addParticipant(race._id, false)} /></Tooltip>)
                }
                return (  
                    <Card title={race.name}  style={styles.card} key={race.name + race.location} actions={actions}>
                        <div><strong>Naam: </strong>{race.name}</div>
                        <div><strong>Datum: </strong>
                            {this.parseDate(race.date)}
                            {race.endDate ? ' tot ' + this.parseDate(race.endDate) : ''}
                        </div>
                        <div><strong>Tijd: </strong>{race.time}</div>
                        <div><strong>Locatie:</strong> {race.location}</div>
                        {race.register ? <div><strong>Inschrijven: </strong><a href={race.register}>klik hier</a></div> : ''}
                        {race.description ? <div><strong>Bijzonderheden: </strong>{race.description}</div> : '' }
                        <div><strong>Deelnemers:</strong> 
                            {race.participants.map(p => {
                                if (race.canRegister) {
                                    return (<Tooltip title="Heeft zich nog niet ingeschreven" key={p}><Tag color="blue" style={{margin:3}}>{p}</Tag></Tooltip>)
                                } else {
                                    return (<Tag color="blue" style={{margin:3}} key={p}>{p}</Tag>)
                                }
                            })}
                            {race.registered_participants.map(p => {
                                return (<Tooltip title="Heeft zich ingeschreven" key={p}><Tag color="blue" style={{margin:3}}>{p}<Icon type="check" /></Tag></Tooltip>)
                            })}
                        </div>
                    </Card>
                )})}
                {(user.role !== "racer") && <AddRace />}
            </div>
        )
    }
}

export default connect(mapState, mapActions)(RaceCalendar)
