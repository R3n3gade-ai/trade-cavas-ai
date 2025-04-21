import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { AppWrapper } from './AppWrapper.tsx'
import './index.css'
import { Button, Container, Typography, Box } from '@mui/material'


const TestApp = () => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Material-UI Example
        </Typography>
        <Button variant="contained" color="primary">
          Click me
        </Button>
      </Box>
    </Container>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
)
