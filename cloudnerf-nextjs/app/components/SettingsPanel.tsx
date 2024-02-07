import React from 'react';
import {RenderingSettings, CameraSettings } from '../components/types'; // Adjust the import path as necessary

interface SettingsPanelProps {
  renderingSettings: RenderingSettings;
  cameraSettings: CameraSettings;
  onRenderingSettingsChange: (settings: RenderingSettings) => void;
  onCameraSettingsChange: (settings: CameraSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  renderingSettings,
  cameraSettings,
  onRenderingSettingsChange,
  onCameraSettingsChange
}) => {


  const handleRenderingChange_input = (event: React.ChangeEvent<HTMLInputElement>, setting: keyof RenderingSettings) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value);
    onRenderingSettingsChange({ ...renderingSettings, [setting]: value });
  };

  const handleRenderingChange_select = (event: React.ChangeEvent<HTMLSelectElement>, setting: keyof RenderingSettings) => {
    const value = event.target.value;
    onRenderingSettingsChange({ ...renderingSettings, [setting]: value });
};

  const handleCameraChange = (event: React.ChangeEvent<HTMLInputElement>, setting: keyof CameraSettings) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value);
    onCameraSettingsChange({ ...cameraSettings, [setting]: value });
  };

  return (<>
    <div className='settingpanelcontainer' style={{padding: '20px'}}>
        {/* Rendering Settings UI */}
        <div style={{ marginBottom: '20px' }}>
        <h3 style={{fontSize: '18px', color: 'red'}}>Rendering Settings</h3>
         {/* Render Time */}
        <div><label>Render Time (ms): <input type="number" value={renderingSettings.renderTime} onChange={(e) => handleRenderingChange_input(e, 'renderTime')} /></label></div>
        {/* Dynamic Resolution */}
        <div><label>Dynamic Resolution: <input type="checkbox" checked={renderingSettings.dynamicResolution} onChange={(e) => handleRenderingChange_input(e, 'dynamicResolution')} /></label></div>
        {/* Max SPP */}
        <div><label>Max SPP: <input type="number" value={renderingSettings.maxspp} onChange={(e) => handleRenderingChange_input(e, 'maxspp')} /></label></div>
        {/* Render Mode */}
        <div><label>Render Mode: <select value={renderingSettings.renderMode} onChange={(e) => handleRenderingChange_select(e, 'renderMode')}>
          <option value="Mode1">Mode1</option>
          <option value="Mode2">Mode2</option>
          {/* Add more render modes as needed */}
        </select></label></div>
        {/* Color Space */}
        <div><label>Color Space: <select value={renderingSettings.colorSpace} onChange={(e) => handleRenderingChange_select(e, 'colorSpace')}>
          <option value="ColorSpace1">ColorSpace1</option>
          <option value="ColorSpace2">ColorSpace2</option>
          {/* Add more color spaces as needed */}
        </select></label></div>
        {/* Tonemap Curve */}
        <div><label>Tonemap Curve: <select value={renderingSettings.tonemapCurve} onChange={(e) => handleRenderingChange_select(e, 'tonemapCurve')}>
          <option value="TonemapCurve1">TonemapCurve1</option>
          <option value="TonemapCurve2">TonemapCurve2</option>
          {/* Add more tonemap curves as needed */}
        </select></label></div>
        {/* Exposure */}
        <div><label>Exposure: <input type="number" value={renderingSettings.exposure} onChange={(e) => handleRenderingChange_input(e, 'exposure')} /></label></div>
        {/* Crop Size */}
        <div><label>Crop Size: <input type="number" value={renderingSettings.cropSize} onChange={(e) => handleRenderingChange_input(e, 'cropSize')} /></label></div>
        </div>
            {/* Camera Settings UI */}
        <div style={{ marginBottom: '20px' }}>
        <h3 style={{fontSize: '18px', color: 'red'}}>Camera Settings</h3>
        {/* Depth of Field (DOF) */}
        <div><label>Depth of Field (DOF): <input type="number" value={cameraSettings.dof} onChange={(e) => handleCameraChange(e, 'dof')} /></label></div>
        {/* Field of View (FOV) */}
        <div><label>Field of View (FOV): <input type="number" value={cameraSettings.fov} onChange={(e) => handleCameraChange(e, 'fov')} /></label></div>
        {/* Zoom */}
        <div><label>Zoom: <input type="number" value={cameraSettings.zoom} onChange={(e) => handleCameraChange(e, 'zoom')} /></label></div>
        {/* FPS Camera */}
        <div><label>FPS Camera: <input type="checkbox" checked={cameraSettings.fpsCam} onChange={(e) => handleCameraChange(e, 'fpsCam')} /></label></div>
        {/* Camera Smoothing */}
        <div><label>Camera Smoothing: <input type="checkbox" checked={cameraSettings.camSmoothing} onChange={(e) => handleCameraChange(e, 'camSmoothing')} /></label></div>
        {/* Autofocus */}
        <div><label>Autofocus: <input type="checkbox" checked={cameraSettings.autofocus} onChange={(e) => handleCameraChange(e, 'autofocus')} /></label></div>

        </div>
        </div>
    
        </>);
};

export default SettingsPanel;
