import React from 'react';
import { AppBar as MuiAppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface AppBarProps {
  handleDrawerToggle: () => void;
}

const AppBar: React.FC<AppBarProps> = ({ handleDrawerToggle }) => {
  return (
    <MuiAppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - 240px)` },
        mr: { sm: '240px' },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          מערכת הנהלת חשבונות
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
