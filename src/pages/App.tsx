// ** Store Imports
import { store } from '../store'
import { Provider } from 'react-redux'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import '../configs/i18n'

// ** Third Party Import
import { Toaster } from 'react-hot-toast'

// ** Component Imports
import ThemeComponent from '../@core/theme/ThemeComponent'

import WindowWrapper from '../@core/components/window-wrapper'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from '../@core/context/settingsContext'

// ** Styled Components
import ReactHotToast from '../@core/styles/libs/react-hot-toast'

// ** Utils Imports
import { createEmotionCache } from '../@core/utils/create-emotion-cache'

// ** Prismjs Styles

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Toast Popup css
import 'react-toastify/dist/ReactToastify.css'

//import antd css
import 'antd/dist/antd.css'

import Routes from '../routes'

// ** Global css styles
import '../styles/globals.css'

import TicketState from '../context/TicketContext'
import ChatState from '../context/ChatContext'


const clientSideEmotionCache = createEmotionCache()

// ** Configure JSS & ClassName
const App = () => {


  return (
    <Provider store={store}>
      <TicketState>
        <ChatState>
          <CacheProvider value={clientSideEmotionCache}>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      <WindowWrapper>
                        <Routes />
                      </WindowWrapper>
                      <ReactHotToast>
                        <Toaster
                          position={settings.toastPosition}
                          toastOptions={{ className: 'react-hot-toast' }}
                        />
                      </ReactHotToast>
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </CacheProvider>
        </ChatState>
      </TicketState>
    </Provider>
  )
}

export default App
