import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Collapse,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onFilter?: (filters: FilterOptions) => void;
  placeholder?: string;
  showFilters?: boolean;
}

export interface FilterOptions {
  dateFrom?: Date | null;
  dateTo?: Date | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  status?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilter,
  placeholder = 'חיפוש...',
  showFilters = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: null,
    dateTo: null,
    minAmount: null,
    maxAmount: null,
    status: null,
    sortBy: 'date',
    sortDirection: 'desc',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    handleFilterChange(name as keyof FilterOptions, value);
  };

  const handleApplyFilters = () => {
    if (onFilter) {
      onFilter(filters);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      dateFrom: null,
      dateTo: null,
      minAmount: null,
      maxAmount: null,
      status: null,
      sortBy: 'date',
      sortDirection: 'desc',
    });
    if (onFilter) {
      onFilter({
        dateFrom: null,
        dateTo: null,
        minAmount: null,
        maxAmount: null,
        status: null,
        sortBy: 'date',
        sortDirection: 'desc',
      });
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center">
        <TextField
          fullWidth
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: showFilters ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                  edge="end"
                >
                  {showFilterOptions ? <CloseIcon /> : <FilterListIcon />}
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {showFilters && (
        <Collapse in={showFilterOptions}>
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="מתאריך"
                  value={filters.dateFrom}
                  onChange={(date) => handleFilterChange('dateFrom', date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="עד תאריך"
                  value={filters.dateTo}
                  onChange={(date) => handleFilterChange('dateTo', date)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="סכום מינימלי"
                  type="number"
                  size="small"
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : null)}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="סכום מקסימלי"
                  type="number"
                  size="small"
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value ? Number(e.target.value) : null)}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select-label">סטטוס</InputLabel>
                  <Select
                    labelId="status-select-label"
                    name="status"
                    value={filters.status || ''}
                    label="סטטוס"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">
                      <em>הכל</em>
                    </MenuItem>
                    <MenuItem value="paid">שולם</MenuItem>
                    <MenuItem value="pending">ממתין</MenuItem>
                    <MenuItem value="overdue">באיחור</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-by-select-label">מיון לפי</InputLabel>
                  <Select
                    labelId="sort-by-select-label"
                    name="sortBy"
                    value={filters.sortBy || 'date'}
                    label="מיון לפי"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="date">תאריך</MenuItem>
                    <MenuItem value="amount">סכום</MenuItem>
                    <MenuItem value="client">לקוח</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-direction-select-label">סדר מיון</InputLabel>
                  <Select
                    labelId="sort-direction-select-label"
                    name="sortDirection"
                    value={filters.sortDirection || 'desc'}
                    label="סדר מיון"
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="asc">עולה</MenuItem>
                    <MenuItem value="desc">יורד</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleResetFilters} sx={{ mr: 1 }}>
                איפוס
              </Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                החל סינון
              </Button>
            </Box>
          </Box>
        </Collapse>
      )}
    </Paper>
  );
};

export default SearchBar;
