import React, { Component } from "react";
import Layout from "../../../components/layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from '../../../routes';


class RequestNew extends Component {

    state = {
        value: '',
        description: '',
        reciptient: '',
        loading: false,
        errorMessage: ''
    }

    static async getInitialProps(props){
        const {address} = props.query;
        return { address };
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const {description, value, reciptient} = this.state;
        console.log(this.state)
        this.setState({loading: true, errorMessage: ''})
        
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), reciptient).send({
                from: accounts[0]
            })
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        } catch (error) {
            this.setState({errorMessage: error.message})
        }
        this.setState({loading: false})

    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                <a> Back</a>
                </Link>

                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label> Description</label>
                        <Input value={this.state.description} onChange={event => {this.setState({description: event.target.value})}} />
                    </Form.Field>
                    <Form.Field>
                        <label> Value in Ether</label>
                        <Input value={this.state.value} onChange={event => {this.setState({value: event.target.value})}} />
                    </Form.Field>
                    <Form.Field>
                        <label> Reciptient</label>
                        <Input value={this.state.reciptient} onChange={event => {this.setState({reciptient: event.target.value})}} />
                    </Form.Field>
                    <Message error header='Oops' content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>
           </Layout>

        )
    }
}

export default RequestNew;