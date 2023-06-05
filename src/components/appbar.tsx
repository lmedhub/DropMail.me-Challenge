import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import CustomSwal from "./customSwal";

function NavBar() {
  const [notificationPermission, setNotificationPermission] =
    useState("unsupported");
  const [swalStatus, setSwalStatus] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setNotificationPermission(getInitialPermission());
    setIsReady(true);
  }, []);

  function getInitialPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  }

  function handleNotificationRequest() {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (notificationPermission === "granted") {
        return;
      } else if (notificationPermission === "denied") {
        handleOpenSwal();
      } else {
        Notification.requestPermission().then((permission) => {
          setNotificationPermission(permission);
        });
      }
    }
  }

  function handleOpenSwal() {
    setSwalStatus(true);
  }

  function handleCloseSwal() {
    setSwalStatus(false);
  }

  return (
    <>
      <CustomSwal
        open={swalStatus}
        onClose={handleCloseSwal}
        onOk={handleCloseSwal}
        title="Atenção!"
        text="Você bloqueou nossas notificações em seu navegador. Ative-as e reinicie e página para usar esta funcionalidade."
      />
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                Coodesh Mail
              </Typography>
            </Box>
            {isReady && notificationPermission !== "granted" && (
              <Box>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNotificationRequest}
                >
                  Ativar notificações
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default NavBar;
