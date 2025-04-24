// src/components/ApartmentCard.jsx
import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

/**
 * A reusable card component for displaying apartment information
 * @param {Object} props Component props
 * @param {Object} props.apartment The apartment data to display
 * @param {Function} props.onEdit Function to call when edit button is clicked
 * @param {Function} props.onDelete Function to call when delete button is clicked
 * @param {Boolean} props.hideActions Whether to hide the action buttons (optional)
 */
const ApartmentCard = ({
  apartment,
  onEdit,
  onDelete,
  hideActions = false,
}) => {
  const theme = useTheme();

  if (!apartment) return null;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: theme.palette.background.alt,
        color: theme.palette.neutral[0],
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {apartment.toanha} - Căn hộ {apartment.socanho}
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {!hideActions && (
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(apartment)}
              sx={{ color: theme.palette.neutral[0] }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => onDelete(apartment.id)}
              sx={{ color: theme.palette.secondary.main }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default React.memo(ApartmentCard);
