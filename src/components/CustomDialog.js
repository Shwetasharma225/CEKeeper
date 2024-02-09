import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SentimentVeryDissatisfied } from '@mui/icons-material';
import AddLicence from './AddLicence';

const CustomDialog = ({ noLicenseFound, setNoLicenseFound, userId }) => {
  return (
    <Dialog open={noLicenseFound} onClose={() => setNoLicenseFound(false)}>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          No License Found
          <Button onClick={() => setNoLicenseFound(false)}>
            <CloseIcon />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SentimentVeryDissatisfied style={{ fontSize: 48, color: 'red' }} />
          <Typography variant="body1">Please add the license from the License Section.</Typography>
        </div>
        <AddLicence userId={userId}  />
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
