import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import Navbar from './views/dashboard/Navbar';
import Dashboard from './views/dashboard/Dashboard';
import Datasets from './views/datasets/Datasets';
import Models from './views/models/Models';
import Evaluations from './views/pages/Evaluations';
import NewDataset from './views/datasets/NewDataset';
import EditDataset from './views/datasets/EditDataset';

import {Layout} from 'antd';
import FetchDatasets from './views/datasets/FetchDataset';
import { Helmet } from 'react-helmet';
const {Content} = Layout;

const router = createBrowserRouter([
  {path: '/', element: <Dashboard />},    
  {path: '/datasets', element: <Datasets />},
  {path: '/datasets/new', element: <NewDataset />},
  {path: '/datasets/fetch', element: <FetchDatasets />},
  {path: '/datasets/:id', element: <EditDataset />},
  {path: '/models', element: <Models />},
  {path: '/evaluations', element: <Evaluations />},
]);

function App() {

  return (
    <div className="App">
      <Helmet>
        <title>CloudNeRF</title>
      </Helmet>
      <Layout>
        <Navbar />
        <Content style={{padding: '20px', height: '90vh', overflowY: "auto"}}>
          <RouterProvider router={router} />        
        </Content>
      </Layout>
 
    </div>
  );  
}

export default App;
