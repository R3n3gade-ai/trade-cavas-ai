
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";



const App = lazy(() => import("./pages/App.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const Canvas = lazy(() => import("./pages/Canvas.tsx"));
const Charts = lazy(() => import("./pages/Charts.tsx"));
const ChatSocial = lazy(() => import("./pages/ChatSocial.tsx"));
const Courses = lazy(() => import("./pages/Courses.tsx"));
const DarkPool = lazy(() => import("./pages/DarkPool.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const SimpleDashboard = lazy(() => import("./pages/SimpleDashboard.tsx"));
const BasicDashboard = lazy(() => import("./pages/BasicDashboard.tsx"));
const FTClassic = lazy(() => import("./pages/FTClassic.tsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Options = lazy(() => import("./pages/Options.tsx"));
// Temporarily commented out due to dependency issues
// const OptionsGamma = lazy(() => import("./pages/OptionsGamma.tsx"));
const PersonalEducation = lazy(() => import("./pages/PersonalEducation.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const Screeners = lazy(() => import("./pages/Screeners.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Social = lazy(() => import("./pages/Social.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));

const TedAI = lazy(() => import("./pages/TedAI.tsx"));

export const userRoutes: RouteObject[] = [


	// Root path is handled in router.tsx
	// { path: "/", element: <App />},
	{ path: "/blog", element: <Blog />},
	{ path: "/canvas", element: <Canvas />},
	{ path: "/charts", element: <Charts />},
	{ path: "/chat-social", element: <ChatSocial />},
	{ path: "/chatsocial", element: <ChatSocial />},
	{ path: "/courses", element: <Courses />},
	{ path: "/dark-pool", element: <DarkPool />},
	{ path: "/darkpool", element: <DarkPool />},
	{ path: "/dashboard", element: <BasicDashboard />},
	{ path: "/ft-classic", element: <FTClassic />},
	{ path: "/ftclassic", element: <FTClassic />},
	{ path: "/leaderboard", element: <Leaderboard />},
	{ path: "/login", element: <Login />},
	{ path: "/options", element: <Options />},
	// Temporarily commented out due to dependency issues
	// { path: "/options-gamma", element: <OptionsGamma />},
	// { path: "/optionsgamma", element: <OptionsGamma />},
	{ path: "/personal-education", element: <PersonalEducation />},
	{ path: "/personaleducation", element: <PersonalEducation />},
	{ path: "/profile", element: <Profile />},
	{ path: "/screeners", element: <Screeners />},
	{ path: "/signup", element: <Signup />},
	{ path: "/social", element: <Social />},
	{ path: "/settings", element: <Settings />},

	{ path: "/ted-ai", element: <TedAI />},
	{ path: "/tedai", element: <TedAI />},

];
