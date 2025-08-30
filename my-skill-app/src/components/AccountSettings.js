// src/components/AccountSettings.js

import React from 'react';
import RegistrationForm from './RegistrationForm';
import UpdateProfileForm from './UpdateProfileForm';

const AccountSettings = ({ currentUser, onRegister, onUpdate, onBack }) => {
  // RENDER THIS IF USER IS NOT LOGGED IN
  if (!currentUser) {
    return <RegistrationForm onRegister={onRegister} onBack={onBack} />;
  }

  // RENDER THIS IF USER IS LOGGED IN
  return (
    <UpdateProfileForm
      currentUser={currentUser}
      onUpdate={onUpdate}
      onBack={onBack}
    />
  );
};

export default AccountSettings;