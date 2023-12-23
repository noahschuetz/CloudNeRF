import React from 'react';
import  {Layout} from 'antd';

import HeaderComponent from './components/HeaderComponent';
import ContentComponent from './components/ContentComponent';


const App = () => {

  return (
    <Layout>
      <HeaderComponent />  
      <ContentComponent />  
      
    </Layout>
  );


}

export default App;
