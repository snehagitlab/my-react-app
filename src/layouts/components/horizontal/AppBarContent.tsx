// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from '../@core/context/settingsContext'

// ** Components

// import ModeToggler from '../@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from '../@core/layouts/components/shared-components/UserDropdown'

// import LanguageDropdown from '../@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from '../@core/layouts/components/shared-components/NotificationDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  setShowBackdrop: (val: boolean) => void
  saveSettings: (values: Settings) => void
}
const AppBarContent = (props: Props) => {
  // ** Props

  // const { settings, saveSettings } = props
  const { settings } = props

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
      {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      <UserDropdown settings={settings} />
      <NotificationDropdown settings={settings} />
    </Box>
  )
}

export default AppBarContent
