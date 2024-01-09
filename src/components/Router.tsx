import HomePage from 'pages/Home';
import Notification from 'pages/notifications';
import PostListPage from 'pages/posts';
import PostDetail from 'pages/posts/PostDetail';
import PostEdit from 'pages/posts/PostEdit';
import PostNew from 'pages/posts/PostNew';
import ProfilePage from 'pages/profile';
import ProfileEdit from 'pages/profile/ProfileEdit';
import Serch from 'pages/serch';
import LoginPage from 'pages/users/LoginPage';
import SignupPage from 'pages/users/SignupPage';
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

function Router() {
  return (
    <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/posts' element={<PostListPage/>}/>
    <Route path='/posts/:id' element={<PostDetail/>}/>
    <Route path='/posts/new' element={<PostNew/>}/>
    <Route path='/posts/edit/:id' element={<PostEdit/>}/>
    <Route path='/profile' element={<ProfilePage/>}/>
    <Route path='/profile/edit' element={<ProfileEdit/>}/>
    <Route path='/notifications' element={<Notification/>}/>
    <Route path='/search' element={<Serch/>}/>
    <Route path='/users/login' element={<LoginPage/>}/>
    <Route path='/users/signup' element={<SignupPage/>}/>
    <Route path='*' element={<Navigate replace to={`/`}/>}/>
   </Routes>
  )
}

export default Router