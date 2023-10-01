
import React from 'react'
import { useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Dialog ,Box,Typography,TextField,InputAdornment} from '@mui/material'
const LandmarkModal
 = ({OTDLandmarks,close,handleCost}) => {
   const currentTheme = useTheme();

  return (
<Dialog
sx={{
  "& .MuiPaper-root": {
    width: "100%",
    position: "absolute",
    bottom: "0",
    margin: "0",
    padding: "1em 0",
  },
}}

open={true}
onClose={close}
>
<Box
  sx={{
    display: "flex",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "1rem",
  }}
>
  <Box
    sx={{
      marginBottom: "1rem",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <Typography
      variant="h2"
      sx={{
        fontFamily: "raleWay",
        padding: "0 1em",
        letterSpacing: "0.2em",
        lineHeight: "2em",
        fontWeight: "600",
        textAlign: "left",

        color:
          currentTheme.palette.type === "light"
            ? "#000000"
            : "#EEEEEE",
        fontSize: "18px",
      }}
    >
      Select Landmark
    </Typography>
    <TextField
      label="Search Items"
      sx={{
        "& .MuiInputBase-root": { height: "44px" },
        padding: "0 1em",
      }}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <Box
      sx={{
        display: "flex",
        padding: "0 1em",
        width: "100%",
        flexDirection: "column",
        gap: "0em",
      }}
    >
      {OTDLandmarks?.landmarks?.map((item, i) => {
        return (
          <Typography
            onClick={() =>
              handleCost(item.amount, item.location)
            }
            sx={{ borderBottom: "1px solid #80808029" , paddingTop:"1em",cursor:'pointer', '&:hover': {background:'#80808029'} }}
            key={i}
          >
            {" "}
            {item.location}{" "}
          </Typography>
        );
      })}
    </Box>
  </Box>
</Box>
</Dialog>
  )
}
export default LandmarkModal