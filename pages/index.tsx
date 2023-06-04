import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import LoadingOverlay from "@/components/loadingOverlay";
import CustomSwal from "@/components/customSwal";
import useSessionExpiration from "@/useSessionExpiration";

interface Mail {
  rawSize: string;
  fromAddr: string;
  text: string;
  headerSubject: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [mails, setMails] = useState<Mail[]>([]);
  const [prevMailCount, setPrevMailCount] = useState(0);
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [sessionSwalStatus, setSessionSwalStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateEmail = async () => {
    try {
      const response = await axios.post(
        "https://dropmail.me/api/graphql/web-test-20230602QuMvA",
        {
          query: `
          mutation {
            introduceSession {
              id,
              expiresAt,
              addresses {
                address
              }
            }
          }
        `,
        }
      );
      const { data } = response.data;
      const { addresses, expiresAt } = data.introduceSession;
      const generatedEmail = addresses[0].address;
      const generatedSessionID = data.introduceSession.id;
      const expiration = new Date(expiresAt).getTime();

      setEmail(generatedEmail);
      setSessionID(generatedSessionID);

      localStorage.setItem("sessionID", generatedSessionID);
      localStorage.setItem("email", generatedEmail);
      localStorage.setItem("expiration", expiration.toString());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchData = async (sessionID: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://dropmail.me/api/graphql/web-test-20230602QuMvA",
        {
          query: `
           query {
             session(id: "${sessionID}") {
               mails {
                 fromAddr
                 text
                 headerSubject
               }
             }
           }
          `,
        }
      );
      if (response.data?.data?.session) {
        setMails(response.data.data.session.mails);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setSessionID("");
    setEmail("");
    setSelectedMail(null);
    localStorage.removeItem("sessionID");
    localStorage.removeItem("email");
    localStorage.removeItem("expiration");
  };

  useEffect(() => {
    if (sessionID) {
      fetchData(sessionID);
      const timer = setInterval(() => fetchData(sessionID), 15000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [sessionID]);

  useEffect(() => {
    if (mails.length > prevMailCount) {
      if ("Notification" in window && Notification.permission === "granted") {
        if (!document.hidden) {
          return;
        }
        new Notification("Coodesh-Mail!", {
          body: "Chegou um novo e-mail!",
        });
      }
    }
    setPrevMailCount(mails.length);
  }, [mails, prevMailCount]);

  useSessionExpiration({ setSessionID, clearSession });

  const handleMailClick = (mail: Mail) => {
    setSelectedMail(mail);
  };

  function handleSwalOk() {
    clearSession();
    handleCloseSwal();
  }

  function handleOpenSwal() {
    setSessionSwalStatus(true);
  }

  function handleCloseSwal() {
    setSessionSwalStatus(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(email);
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <CustomSwal
        open={sessionSwalStatus}
        onClose={handleCloseSwal}
        onOk={handleSwalOk}
        title="Atenção!"
        text="Tem certeza de que deseja encerrar a sessão? Todos os e-mails serão perdidos."
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: "500px",
        }}
      >
        <Box sx={{ mt: "40px" }}>
          {!sessionID && (
            <Button variant="contained" onClick={generateEmail}>
              Gerar novo e-mail temporário!
            </Button>
          )}
          {sessionID && (
            <>
              <TextField
                variant="outlined"
                fullWidth
                value={email}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip
                        sx={{ cursor: "auto" }}
                        title="Alguns domínios do Dropmail.me não estão funcionando. Se o e-mail não chegar após 15 segundos, encerre a sessão e utilize outro e-mail."
                      >
                        <ReportProblemOutlinedIcon />
                      </Tooltip>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <ContentCopyIcon onClick={copyToClipboard} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button onClick={handleOpenSwal}>Encerrar sessão</Button>
            </>
          )}
        </Box>
        {sessionID ? (
          <Box sx={{ my: 5, width: "100%" }}>
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <Grid container sx={{ borderBottom: "1px solid lightgray" }}>
                <Grid
                  item
                  md={3}
                  xs={12}
                  sx={{
                    height: "38.5px",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                    Inbox
                  </Typography>
                </Grid>

                <Grid
                  item
                  md={9}
                  xs={12}
                  sx={{
                    backgroundColor: "#F8F8F8",
                    borderLeft: { xs: "unset", md: "1px solid lightgray" },
                  }}
                >
                  {selectedMail && (
                    <>
                      <Button onClick={() => setSelectedMail(null)}>
                        <ArrowBackIcon />
                        Desselecionar e-mail
                      </Button>

                      <Typography
                        noWrap
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                          borderTop: "1px solid lightgray",
                        }}
                      >
                        {selectedMail?.headerSubject}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>

              <Grid container>
                <Grid
                  item
                  md={3}
                  xs={12}
                  sx={{
                    borderRight: { xs: "unset", md: "1px solid lightgray" },
                    position: selectedMail && {
                      xs: "absolute",
                      md: "relative",
                    },
                  }}
                >
                  <Box sx={{ overflowY: "scroll", height: "500px" }}>
                    {mails.length ? (
                      <List>
                        {mails.map((mail, index) => (
                          <ListItem
                            sx={{
                              borderBottom: "1px solid lightgray",
                            }}
                            key={index}
                            button
                            onClick={() => handleMailClick(mail)}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  noWrap
                                  sx={{
                                    maxWidth: 300,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {mail.headerSubject}
                                </Typography>
                              }
                              secondary={`Origem: ${mail.fromAddr}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography sx={{ mt: 5, textAlign: "center" }}>
                        Nada aqui por enquanto. A caixa de entrada é atualizada
                        a cada 15 segundos.
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid
                  item
                  md={9}
                  xs={12}
                  sx={{
                    overflowY: "scroll",
                    height: "500px",
                    position: "relative",
                    backgroundColor: "white",
                    padding: "5px",
                  }}
                >
                  {selectedMail && (
                    <Box
                      sx={{
                        overflowY: "scroll",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ wordWrap: "break-word" }}
                      >
                        {selectedMail.text}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Card>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </>
  );
}
