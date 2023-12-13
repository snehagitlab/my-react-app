import React, { lazy, Suspense } from 'react'
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import BlankLayout from '../src/@core/layouts/BlankLayout'
import NProgress from 'nprogress'


import AddArticle from './pages/admin/dashboard/knowledge/AddArticle'
import AddOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'
import EditOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'
import ViewOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'

//common for all Lazzy Loading
/* const SettingsPage = lazy(() =>import("../src/pages/admin/setting"))
 */const NotificationPage = lazy(() => import("../src/pages/admin/notification"))
const KnowledgeBase = lazy(() => import("./pages/admin/dashboard/knowledge/Knowledgebase"))
const KnowledgeCategory = lazy(() => import("./pages/admin/dashboard/knowledge/KnowledgeCategory"))
const UserKnowledgeArticle = lazy(() => import("./views/apps/chat/KnowledgeUser/UserKnowledgeArticle"))
const UserKnowledgeFaq = lazy(() => import("./views/apps/chat/KnowledgeUser/UserKnowledgeFaq"))
const UserRoleTypePage = lazy(() => import("../src/pages/admin/userrole"))

//const AddArticle = lazy(() =>import("./pages/admin/dashboard/knowledge/AddArticle"))
const ChatContent = lazy(() => import("./views/apps/chat/chatContent"))
const KnowledgeLayout = lazy(() => import("./types/knowledgeLayout/KnowledgeLayout"))
const TemplateDashboard = lazy(() => import("./pages/admin/dashboard/knowledge/templateDashboard"))
const AddTemplatePage = lazy(() => import("./pages/admin/dashboard/knowledge/template/addTemplate"))
const DisplayArticleView = lazy(() => import("./pages/admin/dashboard/knowledge/displayArticleView"))
const MyTemplate = lazy(() => import("./pages/admin/dashboard/knowledge/template/template"))

//Lazzy Loading Component for User Panel
const UserLayouting = lazy(() => import("../src/userLayout/Layout"))
const UserLogin = lazy(() => import("../src/pages/user/auth/userLogin"))
const UserForgotPass = lazy(() => import("../src/pages/user/auth/userForgotPass"))
const Knowledge = lazy(() => import("../src/views/apps/chat/KnowledgeUser/Knowledge"))
const UserKnowledgeCategory = lazy(() => import("./views/apps/chat/KnowledgeUser/UserKnowledgeCategory"))
const OffenceTicketDetail = lazy(() => import("../src/views/apps/chat/ticketDetails/OffenceTicketDetail"))
const SupportTicketDetail = lazy(() => import("../src/views/apps/chat/ticketDetails/SupportTicketDetail"))

//Lazzy Loading Component for Admin Panel
const LoginWith = lazy(() => import("./pages/LoginWith"))

//const SignupPage = lazy(() =>import("./pages/Signup"))
const LoginPage = lazy(() => import("../src/pages/login"))
const UserLayout = lazy(() => import("../src/layouts/UserLayout"))
const DashboardPage = lazy(() => import("../src/pages/admin/dashboard"))
const OrganisationPage = lazy(() => import("../src/pages/admin/dashboard/organisations"))
const OrganizationTypePage = lazy(() => import("../src/pages/admin/dashboard/masters/orgaization_type"))
const UserAgentPage = lazy(() => import("../src/pages/admin/dashboard/user_agents_list"))

/* const AddOrganisationPage = lazy(() =>import("../src/pages/admin/dashboard/organisations/add_organisation"))
const EditOrganisationPage = lazy(() =>import("../src/pages/admin/dashboard/organisations/add_organisation"))
const ViewOrganisationPage = lazy(() =>import("../src/pages/admin/dashboard/organisations/add_organisation")) */

const DataFeedPage = lazy(() => import("../src/pages/admin/dashboard/datafeed"))
const ApidataPage = lazy(() => import("../src/pages/admin/dashboard/datafeed/components/apidata"))
const AccountSettings = lazy(() => import("../src/pages/admin/setting/AccountSettings"))
const ChangePasswordAdmin = lazy(() => import("../src/pages/admin/setting/changePasswordAdmin"))
const Notifications = lazy(() => import("../src/pages/admin/setting/Notifications"))
const SettingsPageHelp = lazy(() => import("../src/pages/admin/setting/SettingsPageHelp"))
const TransferOwnership = lazy(() => import("../src/pages/admin/setting/TransferOwnership"))
const OrgInfoPage = lazy(() => import("../src/pages/admin/setting/OrganizationInformation"))

/* import UserLayout from '../src/layouts/UserLayout'
import LoginWith from './pages/LoginWith's
import LoginPage from '../src/pages/login'
import DashboardPage from '../src/pages/admin/dashboard'
import OrganizationTypePage from '../src/pages/admin/dashboard/masters/orgaization_type'
import OrganisationPage from '../src/pages/admin/dashboard/organisations'
import UserAgentPage from '../src/pages/admin/dashboard/user_agents_list'
import AddOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'
import EditOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'
import ViewOrganisationPage from '../src/pages/admin/dashboard/organisations/add_organisation'
import DataFeedPage from '../src/pages/admin/dashboard/datafeed'
import ApidataPage from '../src/pages/admin/dashboard/datafeed/components/apidata'
import AccountSettings from '../src/pages/admin/setting/AccountSettings'
import ChangePasswordAdmin from '../src/pages/admin/setting/changePasswordAdmin'
import Notifications from '../src/pages/admin/setting/Notifications'
import SettingsPageHelp from '../src/pages/admin/setting/SettingsPageHelp'

// User Layout
import UserLayouting from '../src/userLayout/Layout'
import UserLogin from '../src/pages/user/auth/userLogin'
import UserForgotPass from '../src/pages/user/auth/userForgotPass'
import Knowledge from '../src/views/apps/chat/KnowledgeUser/Knowledge'
import UserKnowledgeCategory from './views/apps/chat/KnowledgeUser/UserKnowledgeCategory'
import SupportTicketDetail from '../src/views/apps/chat/ticketDetails/SupportTicketDetail'
import OffenceTicketDetail from '../src/views/apps/chat/ticketDetails/OffenceTicketDetail'

// import UserDashboard from '../src/pages/apps/chat/index'

//common for all
import SettingsPage from '../src/pages/admin/setting'
import NotificationPage from '../src/pages/admin/notification'
import KnowledgeBase from './pages/admin/dashboard/knowledge/Knowledgebase'
import KnowledgeCategory from './pages/admin/dashboard/knowledge/KnowledgeCategory'
import UserKnowledgeArticle from './views/apps/chat/KnowledgeUser/UserKnowledgeArticle'
import UserKnowledgeFaq from './views/apps/chat/KnowledgeUser/UserKnowledgeFaq'
import UserRoleTypePage from '../src/pages/admin/userrole'
import AddArticle from './pages/admin/dashboard/knowledge/AddArticle'
import ChatContent from './views/apps/chat/chatContent'
import KnowledgeLayout from './types/knowledgeLayout/KnowledgeLayout'
import TemplateDashboard from './pages/admin/dashboard/knowledge/templateDashboard'
import AddTemplatePage from './pages/admin/dashboard/knowledge/template/addTemplate'
import DisplayArticleView from './pages/admin/dashboard/knowledge/displayArticleView'
import MyTemplate from './pages/admin/dashboard/knowledge/template/template'
 */

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
  const user = JSON.parse(localStorage.getItem('userData') || '{}')

  return (
    <Suspense fallback={<SuspenseLoader />} >
      <Routes>
        <Route path='/' element={<BlankLayout />}>
          <Route path='/' element={<Navigate to={Object.keys(user).length ? '/dashboard' : '/loginWith'} />} />
          <Route path='/loginWith' element={<LoginWith />} />
          {/*         <Route path='/signup' element={<SignupPage />} />
 */}        <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<UserLayout />}>
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='organizationType' element={<OrganizationTypePage />} />
            <Route path='organization' element={<OrganisationPage />} />
            <Route path='organization/add' element={<AddOrganisationPage />} />
            <Route path='organization/edit' element={<EditOrganisationPage />} />
            <Route path='organization/view' element={<ViewOrganisationPage />} />
            <Route path='user_agent' element={<UserAgentPage />} />
            <Route path='/setting/change_password' element={<ChangePasswordAdmin />} />
            <Route path='setting' element={<Navigate to='/setting/organization_information' />} />
            <Route path='/setting/account_settings' element={<AccountSettings />} />

            <Route path='/setting/notifications' element={<Notifications />} />
            <Route path='/help' element={<SettingsPageHelp />} />
            <Route path='/setting/transfer_ownership' element={<TransferOwnership />} />
            <Route path='/setting/organization_information' element={<OrgInfoPage />} />


            <Route path='notification' element={<NotificationPage />} />
            <Route path='knowledge' element={<KnowledgeBase />} />
            <Route path='/knowledge/category' element={<KnowledgeCategory />} />
            <Route path='knowledge/addArticle' element={<AddArticle />} />
            <Route path='knowledge/template' element={<TemplateDashboard />} />
            <Route path='template/add' element={<AddTemplatePage />} />
            <Route path='template/view' element={<AddTemplatePage />} />
            <Route path='template/edit' element={<AddTemplatePage />} />
            <Route path='knowledge/template' element={<MyTemplate />} />
            <Route path='knowledge/article/preview' element={<DisplayArticleView />} />
            <Route path='usertype' element={<UserRoleTypePage />} />
            <Route path='data_feed' element={<DataFeedPage />} />
            <Route path='apidata' element={<ApidataPage />} />

          </Route>
        </Route>

        {/* UserLayouting */}
        <Route path='/userLogin' element={<UserLogin />} />
        <Route path='/userForgotPassword' element={<UserForgotPass />} />
        <Route path='/user' element={<UserLayouting />}>
          <Route path='/user/dashboard' element={<ChatContent />} />
          <Route path='/user/dashboard/support/:id' element={<SupportTicketDetail />} />
          <Route path='/user/dashboard/offence/:id' element={<OffenceTicketDetail />} />
        </Route>
        <Route path='/user/knowledge' element={<KnowledgeLayout />}>
          <Route path='/user/knowledge' element={<Knowledge />} />
          <Route path='/user/knowledge/faq' element={<UserKnowledgeFaq />} />
          <Route path='/user/knowledge/article/:articleid' element={<UserKnowledgeArticle />} />
          <Route path='/user/knowledge/category/:categoryid' element={<UserKnowledgeCategory />} />
          {/*  <Route path='/user/knowledge/preview/article/:articleid' element={<DisplayArticleView />} /> */}
        </Route>
      </Routes>
    </Suspense>
  )
}
export default AppRoutes
