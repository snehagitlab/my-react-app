// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useNavigate as useRouter } from 'react-router-dom'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from '../configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    // console.log('checking')
    // setLoading(true)
    // const user = window.localStorage.getItem('userData')
    // if (user) {
    //   setUser({ ...user.payload.data })
    //   // router.replace('/admin/dashboard')
    //   setLoading(false)
    // } else {
    //   router.replace('/login')
    //   setLoading(false)
    // }
    const initAuth = async (): Promise<void> => {
      setIsInitialized(true)
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  // const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
  const handleLogin = async (params: LoginParams) => {
    // try {
    //   let response = await fetch('https://dev.gogtas.com/support/public/api/v1/account/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Accept: 'application/json'
    //     },
    //     body: JSON.stringify(params)
    //   })
    //   if (response.status === 200) {
    //     let result = await response.json()
    //     const returnUrl = router.query.returnUrl
    //     setUser({ ...result.payload.data })
    //     window.localStorage.setItem('userData', JSON.stringify(result.payload.data))
    //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

    //     router.replace(redirectURL as string)
    //     // router.replace('/admin/dashboard')
    //     setLoading(false)
    //   }
    // } catch (err) {
    //   if (errorCallback) errorCallback(err)
    // }

    axios
      .post(authConfig.loginEndpoint, params)
      .then(async res => {
        window.localStorage.setItem(authConfig.storageTokenKeyName, res.data.accessToken)
      })
      .then(() => {
        axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
            }
          })
          .then(async response => {
            // const returnUrl = router.query.returnUrl

            setUser({ ...response.data.userData })
            console.log('login func response', response)
            window.localStorage.setItem('userData', JSON.stringify(response.data.userData))

            // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

            router('/')
          })
      })

    // .catch(err) => {
    //   if (errorCallback) errorCallback(err)
    // }
  }

  const handleLogout = () => {
    setUser(null)
    setIsInitialized(false)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.registerEndpoint, params)
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
