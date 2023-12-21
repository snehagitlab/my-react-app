import React, { lazy, Suspense } from 'react'
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import NProgress from 'nprogress'


const ChatContent = lazy(() => import("./views/apps/chat/chatContent"))
const UserLayouting = lazy(() => import("./userLayout/Layout"))
const UserLogin = lazy(() => import("./pages/user/auth/userLogin"))
const UserForgotPass = lazy(() => import("./pages/user/auth/userForgotPass"))


function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return <></>;
}


const AppRoutes = () => {

  return (
    <Suspense fallback={<SuspenseLoader />} >
      <Routes>
        <Route path='/' element={<UserLogin />} />
        <Route path='/userForgotPassword' element={<UserForgotPass />} />
        <Route path='/user' element={<UserLayouting />}>
          <Route path='/user/dashboard' element={<ChatContent />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
export default AppRoutes
