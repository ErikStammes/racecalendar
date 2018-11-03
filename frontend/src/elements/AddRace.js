import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../state/actions/calendar'
import { Button, Modal, Form, Input, DatePicker, Checkbox } from 'antd';
const FormItem = Form.Item;

const mapState = (store) => {
    return ({
        loading: store.calendar.loading,
    })
}

const mapActions = dispatch => ({
    addRace: (race) => {
        dispatch(actions.addRace(race))
    },
    fetchRaces: () => {
        dispatch(actions.fetchRaces())
    }
})

const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Wedstrijd toevoegen"
        okText="Toevoegen"
        cancelText="Annuleren"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Naam">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Voer een naam in' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Datum">
            {getFieldDecorator('date', {
                rules: [{ required: true, message: 'Voer een datum in'}]
            })(
                <DatePicker placeholder="Selecteer datum"/>
            )}
          </FormItem>
          <FormItem label="Tot (indien van toepassing)">
            {getFieldDecorator('endDate')(
                <DatePicker placeholder="Selecteer datum"/>
            )}
          </FormItem>
          <FormItem label="Locatie">
            {getFieldDecorator('location', {
              rules: [{ required: true, message: 'Voer een locatie in' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="Tijdstip">
            {getFieldDecorator('time')(
              <Input />
            )}
          </FormItem>
          <FormItem label="Inschrijflink">
            {getFieldDecorator('register')(
              <Input />
            )}
          </FormItem>
          <FormItem label="Inschrijving is mogelijk bij dit type wedstrijd">
            {getFieldDecorator('canRegister')(
              <Checkbox defaultChecked={true}/>
            )}
          </FormItem>
          <FormItem label="Beschrijving">
            {getFieldDecorator('description')(
              <Input />
            )}
          </FormItem>          
        </Form>
      </Modal>
    );
  }
);


class AddRace extends Component {
    state = {
        visible: false,
      };
      showModal = () => {
        this.setState({ visible: true });
      }
      handleCancel = () => {
        this.setState({ visible: false });
      }
      handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          this.props.addRace(values)
          // on completed:
          //form.resetFields();
          //this.setState({ visible: false });
        });
      }
      saveFormRef = (form) => {
        this.form = form;
      }
      render() {
        return (
          <div>
            <Button type="primary" onClick={this.showModal}>Wedstrijd toevoegen</Button>
            <CollectionCreateForm
              ref={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
            />
          </div>
        );
      }
}

export default connect(mapState, mapActions)(AddRace)
