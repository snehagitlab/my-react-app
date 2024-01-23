import React, { lazy, Suspense } from 'react'
import SuspenseLoader from './component/atoms/SuspenseLoader';
import { RouteObject } from 'react-router';


const Loader = (Component: any) => (props: any) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

const ChatContent = Loader(lazy(() => import("./views/apps/chat/chatContent")))
const UserLayouting = Loader(lazy(() => import("./userLayout/Layout")))
const UserLogin = Loader(lazy(() => import("./pages/user/auth/userLogin")))
const UserForgotPass = Loader(lazy(() => import("./pages/user/auth/userForgotPass")))
const Status404 = Loader(
  lazy(() => import('./component/status/status404'))
);
const Maintenance = Loader(
  lazy(() => import('./component/status/Maintainence'))
);




// const AppRoutes = () => {

//   return (
//     <Routes>
//       <Route path='/' element={<UserLogin />} />
//       <Route path='/userForgotPassword' element={<UserForgotPass />} />
//       <Route path='/user' element={<UserLayouting />}>
//         <Route path='/user/dashboard' element={<ChatContent />} />
//       </Route>
//     </Routes>
//   )
// // }

// const routes: RouteObject[] = [
//   {
//     path: '/',
//     element: <UserLogin />,
//     children: [
//       {
//         path: '/login',
//         element: <UserLogin />
//       },
//       {
//         path: '/userForgotPassword',
//         element: <UserForgotPass />
//       },
//       {

//         path: '/probizca-chat',
//         element: <ChatContent />

//       },
//       {
//         path: 'status',
//         children: [
//           {
//             path: '404',
//             element: <Status404 />
//           },
//           {
//             path: 'maintenance',
//             element: <Maintenance />
//           },

//         ]
//       },

//     ]
//   }
// ];
const routes = [
  {
    path: '/',
    element: <UserLogin />,
  },
  {
    path: '/userForgotPassword',
    element: <UserForgotPass />,
  },
  {
    path: '/chat',
    element: <UserLayouting />,
    children: [
      {
        path: 'user',
        element: <ChatContent />,
      },
    ],
  },
];




export default routes
