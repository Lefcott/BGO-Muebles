import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getClientModels } from '../../../../../../services/api/user';
import { setAdminSection } from '../../../../../../shared/actions/adminSection';
import { setClientModels } from '../../../../../../shared/actions/clientModels';
import { setSelectedClientModel } from '../../../../../../shared/actions/selectedClientModel';

import ClientDocumentEditor from './components/ClientDocumentEditor';
import ConfigurationEditor from './components/ConfigurationEditor';
import FormEditor from './components/FormEditor';
import ChatbotEditor from './components/ChatbotEditor';
import FormResponseViewer from './components/FormResponseViewer';

const Container = () => {
  const dispatch = useDispatch();
  const project = useSelector(store => store.project);
  const selectedClientModel = useSelector(store => store.selectedClientModel);
  const selectedFormSection = useSelector(store => store.selectedFormSection);
  const adminSection = useSelector(store => store.adminSection);
  const adminSectionRef = useRef();

  adminSectionRef.current = adminSection;

  useEffect(() => {
    if (adminSectionRef.current !== 'tables') return;
    getClientModels(project).then(({ data: clientModels }) => {
      if (!clientModels.length) {
        dispatch(setAdminSection('configuration'));
        return dispatch(setClientModels(clientModels));
      }

      dispatch(setSelectedClientModel(clientModels[0]));
    });
  }, [project, adminSection]);

  return (
    <div className="container">
      {adminSection === 'configuration' && <ConfigurationEditor />}
      {adminSection === 'tables' && selectedClientModel && (
        <ClientDocumentEditor clientModel={selectedClientModel} />
      )}
      {adminSection === 'forms' && selectedFormSection === 'edit' && <FormEditor />}
      {adminSection === 'forms' && selectedFormSection === 'show' && <FormResponseViewer />}
      {adminSection === 'chatbots' && <ChatbotEditor />}
      <style jsx>
        {`
          .container {
            background-color: #ffffff;
            box-shadow: 0 0 2px 2px #ffffff;
            width: 60%;
            height: 90vh;
            border-radius: 5px;
            transition: 0.8s;
            animation: arrive 1s linear;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .container:hover {
            background-color: #fffffff3;
          }

          @keyframes arrive {
            0% {
              opacity: 0;
              -ms-transform: translate(100%);
              -moz-transform: translate(100%);
              -webkit-transform: translate(100%);
              -o-transform: translate(100%);
              transform: translate(100%);
              background-color: rgb(42, 42, 209);
              height: 0;
            }
            100% {
              opacity: 1;
              margin-right: 0;
              -ms-transform: translate(0);
              -moz-transform: translate(0);
              -webkit-transform: translate(0);
              -o-transform: translate(0);
              transform: translate(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Container;
