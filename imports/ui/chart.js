import {Line} from 'react-chartjs-2';
import React from 'react';


export default (props)=>{
        return (
            <div>
                <Line data={props.data} className='unichart' options={props.options}/>
            </div>
        );
};