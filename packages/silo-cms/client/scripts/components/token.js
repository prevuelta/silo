'use strict';

import React from 'react';
import Modal from './modal';
import Loader from '../util/loader';
import Req from '../util/request';
import Notify from '../util/notify';

const { Fragment } = React;

class TokenGenerator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsVisible: false,
            token: null,
            id: props.user || props.consumer,
        };
    }

    _showModal() {
        this.setState({ modalIsVisible: true });
    }

    _hideModal() {
        this.setState({ modalIsVisible: false });
    }

    _requestToken() {
        Loader.show();
        Req('/admin/manage/token', 'POST', {
            id: this.state.id,
            type: this.props.user ? 'user' : 'consumer',
        })
            .then(res => res.json())
            .then(json => {
                Loader.hide();
                this.setState({
                    token: json.token,
                    modalIsVisible: true,
                });
            })
            .catch(err => {
                Notify.alert('Token request failed');
                Loader.hide();
            });
    }

    componentWillUnmount() {
        this.setState({ token: null });
    }

    render() {
        return (
            <Fragment>
                <button
                    className="icon text"
                    onClick={this._requestToken.bind(this)}>
                    Token
                </button>
                <Modal
                    isVisible={this.state.modalIsVisible}
                    close={this._hideModal.bind(this)}>
                    <h2>Generate READ-ONLY api token</h2>
                    {this.state.token && (
                        <textarea readOnly value={this.state.token} />
                    )}
                </Modal>
            </Fragment>
        );
    }
}

export default TokenGenerator;
