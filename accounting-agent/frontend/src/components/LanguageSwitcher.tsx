import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// רשימת השפות הנתמכות
const languages = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // פתיחת התפריט
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // סגירת התפריט
  const handleClose = () => {
    setAnchorEl(null);
  };

  // החלפת שפה
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  // מציאת השפה הנוכחית
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      <Tooltip title="החלף שפה">
        <Button
          color="inherit"
          onClick={handleClick}
          startIcon={<LanguageIcon />}
          sx={{ minWidth: 'auto', padding: { xs: '8px', md: '8px 16px' } }}
        >
          <span style={{ display: { xs: 'none', sm: 'inline' } }}>{currentLanguage.flag}</span>
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            selected={i18n.language === language.code}
          >
            <ListItemIcon sx={{ minWidth: '30px' }}>
              {language.flag}
            </ListItemIcon>
            <ListItemText>{language.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
