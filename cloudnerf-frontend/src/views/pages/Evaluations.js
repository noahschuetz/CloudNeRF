import React from 'react';
// import TwoScenes from './ThreeScene';
import {Row, Col} from 'antd';
import ThreeScene from './ThreeScene';

function Evaluations() {

    return (
        <div>
            <h1>Evaluations</h1>
            <p>Here is where the evaluations will be displayed</p>

            <Row>
                <ThreeScene />
            </Row>           

        </div>        
    );
}

export default Evaluations;