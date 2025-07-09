import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import UserSelect from './UserSelect';
import RoomList from './RoomList';
import RoomForm from './RoomForm';
import Card from '../ui/Card';
import Tabs from '../ui/Tabs';
import PIDList from '../pid/PIDList';
import PIDForm from '../pid/PIDForm';
import ModelList from '../models/ModelList';
import LstmModelForm from '../models/LstmModelForm';
import RlModelForm from '../models/RlModelForm';
import SimulationList from '../simulations/SimulationList';
import SimulationForm from '../simulations/SimulationForm';

const Dashboard = () => {
  const { user, room } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('PID');  // по умолчанию первая вкладка

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4">
      {}
      <Card>
        <UserSelect />
        {user ? (
          <>
            <RoomList />
            <RoomForm />
          </>
        ) : (
          <p className="text-gray-600">Оберіть користувача, щоб продивитись кімнати.</p>
        )}
      </Card>

      {}
      {room ? (
        <div>
          <Tabs
            tabs={['PID', 'AI-моделі', 'Симуляції']}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
          <div className="mt-4">
            {activeTab === 'PID' && (
              <div className="space-y-4">
                <Card>
                  <PIDList />
                </Card>
                <Card>
                  <PIDForm />
                </Card>
              </div>
            )}
            {activeTab === 'AI-моделі' && (
              <div className="space-y-4">
                <Card>
                  <ModelList />
                </Card>
                <Card>
                  <LstmModelForm />
                </Card>
                <Card>
                  <RlModelForm />
                </Card>
              </div>
            )}
            {activeTab === 'Симуляції' && (
              <Card>
                <SimulationList />
              </Card>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Оберіть кімнату, щоб продивитись деталі (PID, моделі, симуляції).</p>
      )}
    </div>
  );
};

export default Dashboard;
