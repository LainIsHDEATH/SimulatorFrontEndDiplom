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

  // Если пользователь (selected user) не выбран (только для администратора)
  // Показать, например, приглашение выбрать пользователя
  // (Если обычный пользователь, user всегда задан после логина)
  // Здесь это можно обработать, но Sidebar/Layout уже перенаправляет если не залогинен.

  // Обработчик смены вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4">
      {/* Блок выбора пользователя и комнаты */}
      <Card>
        <UserSelect />
        {user ? (
          <>
            <RoomList />
            <RoomForm />
          </>
        ) : (
          <p className="text-gray-600">Выберите пользователя, чтобы просмотреть комнаты.</p>
        )}
      </Card>

      {/* Вкладки PID, Модели, Симуляции (появляются после выбора комнаты) */}
      {room ? (
        <div>
          <Tabs
            tabs={['PID', 'AI-модели', 'Симуляции']}
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
            {activeTab === 'AI-модели' && (
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
            {activeTab === 'Симуляции' && (
              <Card>
                <SimulationList />
              </Card>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Выберите комнату, чтобы просмотреть детали (PID, модели, симуляции).</p>
      )}
    </div>
  );
};

export default Dashboard;
