import * as React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Drawer,
  Input,
  List,
  ListItem,
  ListItemButton,
  Typography,
  ModalClose,
} from "@mui/joy";
import Menu from "@mui/icons-material/Menu";
import Search from "@mui/icons-material/Search";
import { signOut } from "firebase/auth";
import { auth } from "./auth/firebase-config";
import { UserContext } from "../UserContext"; // Import UserContext

export default function SideBar({ setUserSignIn }) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const { userData } = React.useContext(UserContext); // Access userData from context

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUserSignIn(false);
      })
      .catch((error) => {
        console.error("Error during sign out: ", error);
      });
  };

  const items = [...new Array(10)].map((_, index) => `Item ${index + 1}`);

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <IconButton
        variant="outlined"
        color="white"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </IconButton>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto",
            mt: 1,
            mr: 2,
            mb: 2,
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            fontSize="sm"
            fontWeight="lg"
            sx={{ cursor: "pointer" }}
          >
            Close
          </Typography>
          <ModalClose id="close-icon" sx={{ position: "initial" }} />
        </Box>
        <p className="text-center font-bold text-lg">Chat History</p>
        <p className="text-center">Coming Soon...</p>
        <Input
          size="sm"
          placeholder="Search"
          variant="plain"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          endDecorator={<Search />}
          slotProps={{
            input: {
              "aria-label": "Search anything",
            },
          }}
          sx={{
            m: 3,
            borderRadius: 0,
            borderBottom: "2px solid",
            borderColor: "neutral.outlinedBorder",
            "&:hover": {
              borderColor: "neutral.outlinedHoverBorder",
            },
            "&::before": {
              border: "1px solid var(--Input-focusedHighlight)",
              transform: "scaleX(0)",
              left: 0,
              right: 0,
              bottom: "-2px",
              top: "unset",
              transition: "transform .15s cubic-bezier(0.1,0.9,0.2,1)",
              borderRadius: 0,
            },
            "&:focus-within::before": {
              transform: "scaleX(1)",
            },
          }}
        />

        <List
          size="lg"
          component="nav"
          sx={{
            flex: "1",
            fontSize: "xl",
            textAlign: "left",
            overflowY: "auto",
            "& > div": { justifyContent: "flex-start" },
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

        {userData && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1.5,
              pb: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              mt: "auto",
              alignItems: "center",
            }}
          >
            <Avatar size="lg" src={userData.photoURL} sx={{ flexShrink: 0 }} />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-md" sx={{ mb: 0.5 }}>
                {userData.displayName}
              </Typography>
              <button
                onClick={handleLogout}
                className="px-4 py-[6px] bg-red-600 text-white rounded-lg hover:bg-red-800"
              >
                Log Out
              </button>
            </Box>
          </Box>
        )}
      </Drawer>
    </React.Fragment>
  );
}
