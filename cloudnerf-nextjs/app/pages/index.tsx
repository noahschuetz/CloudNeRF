// pages/index.tsx

import React from 'react';
import 'antd/dist/antd.css';
import ContentComponent from '../components/ContentComponent';
import ParentComponent from '../components/ParentComponent';

export default function Home() {
  return (
    <div>
      <ContentComponent />
      <ParentComponent />
    </div>
  );
}
