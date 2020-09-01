import React, { Component } from 'react';
import style from "./modal.module.scss";

class Modal extends Component {
    ref1 = React.createRef();
    constructor(props) {
        super(props);
        this.contentRef = React.createRef();
        this.state = {
            dummyState: false,
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        const { closeModal } = this.props;
        //@ts-ignore
        if (this.contentRef && this.contentRef.current && !this.contentRef.current.contains(event.target)) {
            closeModal();
        }
    }

    render(){
        const { children } = this.props;
        return (
            <div
                className={style.modalContainer}
            >
                <div
                    className={style.modalContent}
                    ref={this.contentRef}
                >
                    {children}
                </div>
            </div>
        )
    }
}

export default Modal;
