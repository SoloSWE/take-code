import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { Profile } from "./pages/Profile";
import { CreateSnippet } from "./pages/CreateSnippet";
import { PublicProfile } from "./pages/PublicProfile";
import { ExploreHub } from "./pages/ExploreHub";
import { Snippet } from "./pages/Snippet";

import { MainLayout } from "./components/layout/MainLayout";
import { EditSnippet } from "./pages/EditSnippet";

export const App = () => {
	return (
		<Routes>
			<Route path='/auth' element={<Auth />} />

			<Route element={<MainLayout />}>
				<Route path='/' element={<Home />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/exploreHub' element={<ExploreHub />} />
				<Route path='/snippet/:id' element={<Snippet />} />
				<Route path='/user/:id' element={<PublicProfile />} />
				<Route path='/createSnippet' element={<CreateSnippet />} />
				<Route path='/editSnippet/:id' element={<EditSnippet />} />
			</Route>
		</Routes>
	);
};