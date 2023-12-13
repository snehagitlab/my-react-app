// ** Theme Type Import
import { Theme } from '@mui/material/styles'

const Typography = (theme: Theme) => {
  return {
    h1: {
      fontWeight: 600,
      letterSpacing: '-1.5px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular'
    },
    h2: {
      fontWeight: 600,
      letterSpacing: '-0.5px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular'
    },
    h3: {
      fontWeight: 600,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular'
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.25px',
      fontSize: '26px !important',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: 0,
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular'
    },
    h6: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard-Regular',
      fontWeight: 100
    },
    subtitle1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard',
      fontWeight: 100
    },
    subtitle2: {
      letterSpacing: '0.1px',
      color: theme.palette.secondary.contrastText,
      fontFamily: 'Mazzard-Regular !important',
      fontWeight: 400,
      fontSize: '18px'
    },
    body1: {
      letterSpacing: '0.15px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard',
      fontWeight: 100
    },
    body2: {
      lineHeight: 1.5,
      letterSpacing: '0.15px',
      color: theme.palette.text.secondary,
      fontFamily: 'Mazzard',
      fontWeight: 100
    },
    button: {
      letterSpacing: '0.3px',
      color: theme.palette.text.primary,
      fontFamily: 'Mazzard',
      fontWeight: 100
    },
    caption: {
      fontFamily: 'Mazzard',
      fontSize: '18px',
      fontWeight: 400,
      letterSpacing: '0.15px'
    },
    overline: {
      letterSpacing: '1px',
      color: theme.palette.text.secondary,
      fontFamily: 'Mazzard',
      fontWeight: 100
    }
  }
}

export default Typography
