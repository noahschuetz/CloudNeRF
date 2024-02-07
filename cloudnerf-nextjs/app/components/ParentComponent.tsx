import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';
import { Modal, Button } from 'antd';
import { RenderingSettings, CameraSettings } from './types';

const ParentComponent: React.FC = () => {
    const [isSettingsVisible, setIsSettingsVisible] = useState(true);


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

  const handleRenderingSettingsChange = (newSettings: RenderingSettings) => {
    setRenderingSettings(newSettings);
  };

  const handleCameraSettingsChange = (newSettings: CameraSettings) => {
    setCameraSettings(newSettings);
  };

  // The SettingsPanel component is rendered with all its props
  return (
    <div>
        <button onClick={() => setIsSettingsVisible(true)}>Change Settings</button>
        <Modal
            title="Change Settings"
            open={isSettingsVisible}
            onCancel={() => setIsSettingsVisible(false)}
            footer={null}
        >
            <SettingsPanel
                renderingSettings={renderingSettings}
                cameraSettings={cameraSettings}
                onRenderingSettingsChange={handleRenderingSettingsChange}
                onCameraSettingsChange={handleCameraSettingsChange}
            />
        </Modal>
    </div>
);
};

export default ParentComponent;