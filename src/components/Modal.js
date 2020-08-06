import React, { Component } from 'react';
import './City.css';


class Modal extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: props.isModalOpen,
            closeModal: props.closeModal
        }
        this.outerStyle = {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
            zIndex: 3,
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
		};

		// default style
		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: "border-box",
				backgroundColor: "#fff",
				margin: "auto",
				borderRadius: 3,
				zIndex: 2,
				textAlign: "left",
				boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
				...this.props.style.modal
			},
			overlay: {
				position: "fixed",
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				...this.props.style.overlay
            }
        }
    }

    render() {
        const { closeModal, children, isModalOpen } = this.props;
        const {overlay, modal } = this.style;
        return (
            <div
				style={{
					...this.outerStyle,
					display: isModalOpen ? "flex" : "none"
				}}
			>
				<div style={overlay} onClick={closeModal} />
				<div onClick={closeModal} />
				<div style={modal}>{children}</div>
			</div>
        )
    }
}

export default Modal;