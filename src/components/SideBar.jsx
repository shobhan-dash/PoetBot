import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';

import { signOut } from 'firebase/auth';
import { auth } from './auth/firebase-config';

export default function SideBar({ setUserSignIn }) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				setUserSignIn(false);
			})
			.catch((error) => {
				console.error("Error during sign out: ", error);
			});
	};

	const items = [...new Array(20)].map((_, index) => `Item ${index + 1}`);

	const filteredItems = items.filter((item) =>
		item.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<React.Fragment>
			<IconButton variant="outlined" color="neutral" onClick={() => setOpen(true)}>
				<Menu />
			</IconButton>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				sx={{
					width: 240, // Set width of the drawer to be small
					'& .MuiDrawer-paper': {
						width: 240, // Ensuring the drawer paper also has this width
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
						ml: 'auto',
						mt: 1,
						mr: 2,
					}}
				>
					<Typography
						component="label"
						htmlFor="close-icon"
						fontSize="sm"
						fontWeight="lg"
						sx={{ cursor: 'pointer' }}
					>
						Close
					</Typography>
					<ModalClose id="close-icon" sx={{ position: 'initial' }} />
				</Box>

				<Input
					size="sm"
					placeholder="Search"
					variant="plain"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					endDecorator={<Search />}
					slotProps={{
						input: {
							'aria-label': 'Search anything',
						},
					}}
					sx={{
						m: 3,
						borderRadius: 0,
						borderBottom: '2px solid',
						borderColor: 'neutral.outlinedBorder',
						'&:hover': {
							borderColor: 'neutral.outlinedHoverBorder',
						},
						'&::before': {
							border: '1px solid var(--Input-focusedHighlight)',
							transform: 'scaleX(0)',
							left: 0,
							right: 0,
							bottom: '-2px',
							top: 'unset',
							transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
							borderRadius: 0,
						},
						'&:focus-within::before': {
							transform: 'scaleX(1)',
						},
					}}
				/>

				<List
					size="lg"
					component="nav"
					sx={{
						flex: 'none',
						fontSize: 'xl',
						textAlign: 'left', // Ensure text is left-aligned
						'& > div': { justifyContent: 'flex-start' },
					}}
				>
					{filteredItems.map((item, index) => (
						<ListItem key={index}>
							<ListItemButton onClick={() => setOpen(false)}>
								{item}
							</ListItemButton>
						</ListItem>
					))}
				</List>

				<Box
					sx={{
						display: 'flex',
						gap: 1,
						p: 1.5,
						pb: 2,
						borderTop: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Avatar size="lg" />
					<div>
						<Typography level="title-md">Username</Typography>
						<Typography level="body-sm">
							<button
								onClick={handleLogout}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
							>
								Log Out
							</button>
						</Typography>
					</div>
				</Box>
			</Drawer>
		</React.Fragment>
	);
}
