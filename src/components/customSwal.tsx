import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface SwalProps {
  open: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  text: string;
  onOk: () => void;
}

export default function CustomSwal({
  open,
  onClose,
  icon,
  title,
  text,
  onOk,
}: SwalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {icon}
          {title}
        </Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent dividers><Typography>{text}</Typography></DialogContent>
      <DialogActions>
        <Button onClick={onOk} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
