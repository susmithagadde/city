import React, { Component } from 'react';
import './City.css';


class Tabs extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected:props.selected || 0,
        }
    }

    handleChange = (index) => {
        this.setState({selected:index})
      }


    render() {
        const { selected } = this.state;
        return(
            <div className="tabs-details">
            <ul className="inline">
              {this.props.children.map((elem,index)=>{
                let style = index === selected ? 'selected': '';
               return <li className={style} key={index} onClick={this.handleChange.bind(this,index)}>{elem.props.title}</li>
              })}
            </ul>
            <div className="tab">{this.props.children[selected]}</div>
            </div> 
        )
    }
}

export default Tabs;