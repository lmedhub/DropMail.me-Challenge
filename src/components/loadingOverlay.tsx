import React from "react";
import { CircularProgress, Box } from "@mui/material";

interface LoadingOverlayProps {
  isLoading: boolean;
}

function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: isLoading ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 9999,
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}

export default LoadingOverlay;
