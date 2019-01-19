import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Card, Icon, Tag, Spin, Tooltip, Popconfirm }  from 'antd';
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
                width: 350,
                maxWidth: '100%', 
                display: 'inline-block'
            },
            actionButton: {
                fontSize: '12px'
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
                        actions.push(
                            <div onClick={() => removeParticipant(race._id, true)}>
                                <Icon type="close" style={{color: 'red'}}/>
                                <p style={styles.actionButton}>Ik heb me uitgeschreven</p>
                            </div>
                        )
                    } else {
                        actions.push(
                            <div onClick={() => addParticipant(race._id, true)}>
                                <Icon type="check" style={{color: 'green'}}/>
                                <p style={styles.actionButton}>Ik heb me ingeschreven</p>
                            </div>
                        )
                    }
                }
                let added = race.participants.some(p => p === user.name)
                if (added) {
                    actions.push(
                        <div onClick={() => removeParticipant(race._id, false)}>
                            <Icon type="minus" style={{color: 'red'}}/>
                            <p style={styles.actionButton}>Ik wil niet meer mee doen</p>
                        </div>
                    )
                } else {
                    actions.push(
                        <div onClick={() => addParticipant(race._id, false)}>
                            <Icon type="plus" style={{color: 'green'}}/>
                            <p style={styles.actionButton}>Ik wil meedoen</p>
                        </div>
                    )
                }
                let goToMK = (url) => {
                    window.open(url)
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
                        {race.register ? 
                            race.register.includes('mijnknwu.knwu.nl') ?
                                <div><strong>Inschrijven: </strong>
                                    <Popconfirm title={<p>Deze link verwijst naar MijnKNWU en werkt dus<br/> alleen als je bent ingelogd op MijnKNWU</p>}
                                                onConfirm={() => goToMK(race.register)}
                                                okText="Naar MijnKNWU"
                                                cancelText="Annuleren">
                                        <a href={race.register}>klik hier</a>
                                    </Popconfirm>
                                </div>
                                :
                                <div><strong>Inschrijven: </strong><a href={race.register} target="_blank" rel="noopener noreferrer">klik hier</a></div> 
                            : ''
                        }
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
                {(user.role !== "racer") && <div style={{marginTop: '30px'}}><AddRace /></div>}
            </div>
        )
    }
}

export default connect(mapState, mapActions)(RaceCalendar)
