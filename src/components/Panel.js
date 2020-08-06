import React, { Component } from 'react';
import './City.css';


class Panel extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render() {
        const { children } = this.props;
        return <div>{children}</div>
    }
}

export default Panel;