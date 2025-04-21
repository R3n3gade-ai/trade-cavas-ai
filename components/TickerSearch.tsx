import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Box, CircularProgress, SxProps, Theme } from '@mui/material';
import { PolygonService } from '../services/polygonService';
import { POLYGON_CONFIG } from '../config/polygonConfig';

interface TickerOption {
  symbol: string;
  name: string;
}

interface TickerSearchProps {
  value?: string;
  onChange: (symbol: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
}

const TickerSearch: React.FC<TickerSearchProps> = ({
  value = '',
  onChange,
  label = 'Search Ticker',
  placeholder = 'Enter ticker symbol or company name',
  className,
  style,
  sx
}) => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [options, setOptions] = useState<TickerOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TickerOption | null>(null);

  const polygonService = new PolygonService(POLYGON_CONFIG.API_KEY);

  const fetchTickerOptions = useCallback(async (search: string) => {
    if (search.length < 2) {
      setOptions([]);
      return;
    }

    setIsLoadingOptions(true);
    try {
      const response = await polygonService.searchTickers(search);
      const tickerOptions = response.map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name
      }));
      setOptions(tickerOptions);
    } catch (err) {
      console.error('Failed to fetch ticker options:', err);
      setOptions([]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTickerOptions(searchSymbol);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchSymbol, fetchTickerOptions]);

  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.symbol === value) || null;
      setSelectedOption(option);
    }
  }, [value, options]);

  const handleSymbolChange = (event: React.SyntheticEvent, value: TickerOption | string | null) => {
    event.preventDefault();
    if (value) {
      const symbol = typeof value === 'string' ? value : value.symbol;
      onChange(symbol.toUpperCase());
    }
  };

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    event.preventDefault();
    setSearchSymbol(newInputValue);
  };

  return (
    <Box 
      className={className} 
      style={style} 
      sx={sx}
      component="form"
      onSubmit={(e) => e.preventDefault()}
    >
      <Autocomplete
        value={selectedOption}
        onChange={handleSymbolChange}
        inputValue={searchSymbol}
        onInputChange={handleInputChange}
        options={options}
        getOptionLabel={(option) => typeof option === 'string' ? option : `${option.symbol} - ${option.name}`}
        isOptionEqualToValue={(option, value) => 
          typeof option === 'string' ? option === value : option.symbol === value.symbol
        }
        freeSolo
        loading={isLoadingOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoadingOptions ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            {typeof option === 'string' ? option : `${option.symbol} - ${option.name}`}
          </li>
        )}
      />
    </Box>
  );
};

export default TickerSearch; 