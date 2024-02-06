import {Button, Col, Row, Modal} from 'antd';
import React, { useState } from 'react';
import SettingsPanel from '../SettingsPanel';
import { TrainingSettings, RenderingSettings, CameraSettings } from '../types';


const InstantNGP = () => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    // State hooks for each settings category
  const [trainingSettings, setTrainingSettings] = useState<TrainingSettings>({
    trainEncoding: false,
    trainNetwork: false,
    randomLevels: false,
    trainEnvmap: false,
    trainExtrinsics: false,
    trainExposure: false,
    trainDistortion: false,
    raysPerBatch: 0,
    batchSize: 0,
    steps: 0,
    loss: 0,
  });

  const [renderingSettings, setRenderingSettings] = useState<RenderingSettings>({
    renderTime: 0,
    dynamicResolution: false,
    maxspp: 0,
    renderMode: 'Mode1', // The initial value should match one of the options in the dropdown
    colorSpace: 'ColorSpace1', // Replace with actual initial value
    tonemapCurve: 'TonemapCurve1', // Replace with actual initial value
    exposure: 1,
    cropSize: 0,
  });

  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    dof: 0,
    fov: 0,
    zoom: 0,
    fpsCam: false,
    camSmoothing: false,
    autofocus: false,
  });

  // Handlers for settings changes that update the respective states
  const handleTrainingSettingsChange = (newSettings: TrainingSettings) => {
    setTrainingSettings(newSettings);
  };

  const handleRenderingSettingsChange = (newSettings: RenderingSettings) => {
    setRenderingSettings(newSettings);
  };

  const handleCameraSettingsChange = (newSettings: CameraSettings) => {
    setCameraSettings(newSettings);
  };


    return (

        <div style={{margin: '12px'}}>
            <Modal
            title="Change Settings"
            open={isSettingsVisible}
            onCancel={() => setIsSettingsVisible(false)}
            footer={null}
        >
            <SettingsPanel
                trainingSettings={trainingSettings}
                renderingSettings={renderingSettings}
                cameraSettings={cameraSettings}
                onTrainingSettingsChange={handleTrainingSettingsChange}
                onRenderingSettingsChange={handleRenderingSettingsChange}
                onCameraSettingsChange={handleCameraSettingsChange}
            />
        </Modal>

            <Row>
                <Col span={12}>
                    <p>Currently using default settings.</p>
                </Col>
                <Col span={12}>
                    <Button onClick={() => setIsSettingsVisible(true)} type="default" block style={{marginTop: '12px'}}>Change Settings</Button>
                </Col>
            </Row>

            <Button type="primary" block style={{marginTop: '12px'}}>Run InstantNGP</Button>         

        </div>
    );
    
}

export default InstantNGP;