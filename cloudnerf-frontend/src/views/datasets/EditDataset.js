import React, { useEffect, useState } from 'react';
import {Row, Col, Button, Input, message, Upload, List, Divider} from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';

import { useParams , Link } from "react-router-dom";
import { useGetDatasetQuery, useGetDatasetImagesQuery } from '../../redux/api';

const { Dragger } = Upload;




function Datasets() {

    const { id } = useParams();
    const [inputvalue, setInputValue] = useState('') 

    const { data, error, isLoading } = useGetDatasetQuery(id);
    const { data: images, error: imagesError, isLoading: imagesIsLoading } = useGetDatasetImagesQuery(id);

    const props = {
        name: 'file',
        multiple: true,
        // on localhost the backend is running on port 5000
        action: 'http://localhost:5000/datasets',
        data: { id: id },
        onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
        },
        onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
        },
    };

    useEffect(() => {
        console.log('dataset id', id);
    }, [id]);

    return (
        <>
            <Row>
                <Col span={24}>
                    <h1>Edit Dataset: {id}</h1>                    
                </Col>                
            </Row>

            <Row>
                <h3>Images</h3>
                <div
                    id="scrollableDiv"
                    style={{
                        height: 400,
                        overflow: 'auto',
                        padding: '0 16px',
                        border: '1px solid rgba(140, 140, 140, 0.35)',
                        borderRadius: '4px',
                        width: '100%'
                    
                    }}
                >
                    <List
                        itemLayout="horizontal"
                        size='small'
                        dataSource={images}
                        renderItem={(item) => <List.Item>{item.name}</List.Item>}
                    /> 
                </div> 
            </Row>
                    
        </>
    );
}

export default Datasets;