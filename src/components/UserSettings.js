import React from 'react';
import EmailSchedule from './EmailSchedule';
import ProfileUpdate from './ProfileUpdate';

const UserSetting = ({userId}) => {
    return (
        <div>
            <ProfileUpdate userId={userId}/>
            <EmailSchedule userId={userId}/>
        </div>
    );
};

export default UserSetting;






