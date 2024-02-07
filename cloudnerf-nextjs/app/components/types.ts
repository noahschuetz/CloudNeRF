  export interface RenderingSettings {
    
    renderTime: number;
    dynamicResolution: boolean;
    maxspp: number;
    renderMode: string;
    colorSpace: string;
    tonemapCurve: string;
    exposure: number;
    cropSize: number;
  }
  
  export interface CameraSettings {
    dof: number; // Depth of Field
    fov: number; // Field of View
    zoom: number;
    fpsCam: boolean;
    camSmoothing: boolean;
    autofocus: boolean;

  }
  