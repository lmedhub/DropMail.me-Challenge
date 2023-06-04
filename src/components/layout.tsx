import { Box } from "@mui/material";
import NavBar from "./appbar";

export default function Layout({ children }: any) {
  return (
    <>
      <NavBar />
      <Box sx={{ px: { xs: 1, md: 3 } }}>{children}</Box>
    </>
  );
}
