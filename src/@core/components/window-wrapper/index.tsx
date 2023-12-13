// ** React Imports
import { useState, useEffect, ReactNode } from 'react'

// ** Next Import
import { useNavigate } from 'react-router-dom'
import Spinner from 'src/@core/components/spinner'

interface Props {
  children: ReactNode
}

const WindowWrapper = ({ children }: Props) => {
  // ** State
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false)

  const router = useNavigate()

  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        setWindowReadyFlag(true)
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  )

  if (windowReadyFlag) {
    return <>{children}</>
  } else {
    return <Spinner />
  }
}

export default WindowWrapper
