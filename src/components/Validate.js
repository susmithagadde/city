import React, { Component } from 'react';
import  { Redirect } from 'react-router-dom';
import './City.css';


class Validate extends Component {
    constructor(props){
        super(props);
        this.state = {
         password:'',
         responseData:[],
         authSuccess: '',
         status:'',
        }
    }

    handleTextChange = (e) => {
        this.setState({password: e.target.value})
    }

    onValidate = () => {
        const { password } = this.state;
        const data = {
            token: password
        }
        let requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify(data)   
      }
        
        fetch('https://api.traderight.co/validateEmailCampaign', requestOptions)
        .then(res => res.json())
        .then(response => {
            
            if(response.status === 'success'){
                this.setState({ responseData: response.message, authSuccess: true, status: true})
            }
            else{
                document.getElementById('password').style.border='1px solid red';
                this.setState({ status: false })
            }
            
        }).catch(error => {
            console.log(error);
        })
    }


    render() {
        const { authSuccess, password, status } = this.state;
        if(authSuccess){
            return <Redirect to={{
                pathname: '/email',
                authSuccess: authSuccess
            }} />
        }
       
        return(
            <section className="validate-container">
               <input type="text" id="password" name="password" placeholder="Enter token" autoComplete="off" onChange={(e) => this.handleTextChange(e)}/>
               {status === false && <p className="error">Incorrect password</p>}
               <button className="btn save" disabled={!password}  onClick={this.onValidate}>Log In</button> 
            </section>
            
        )
    }
}

export default Validate;